import React, { useState, useEffect } from 'react';
import { evaluate, format } from 'mathjs';
import { useTheme } from '../contexts/ThemeContext';
import MatrixCalculator from './MatrixCalculator';
import GraphingPanel from './GraphingPanel';

// --- interfaces ---
interface CalculatorHistory {
  expression: string;
  result: string;
  timestamp: Date;
}

export default function CalculatorModule() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<CalculatorHistory[]>([]);
  const [activePanel, setActivePanel] = useState<'advanced' | 'matrix' | 'graphing'>('advanced');
  const { theme } = useTheme();

  // --- Numeric Input ---
  const handleNumber = (num: string) => {
    setExpression(prev => {
      // Start new input if coming from result or error
      if ((display === '0' && prev === '') || display === 'Error') {
        setDisplay(num);
        return num;
      } else {
        setDisplay(prev + num);
        return prev + num;
      }
    });
  };

  // --- Operators ---
  const handleOperator = (op: string) => {
    setExpression(prev => {
      // If just displayed a result, continue from it
      if (display !== prev && prev !== '') {
        setDisplay(display + op);
        return display + op;
      } else if (!prev || /[+\-\*/%^(]$/.test(prev)) {
        // Don't allow repeated operators
        setDisplay(prev);
        return prev;
      } else {
        setDisplay(prev + op);
        return prev + op;
      }
    });
  };

  // --- Function Insert (sin, cos, etc) ---
  const handleFunction = (func: string) => {
    setExpression(prev => {
      setDisplay(prev + `${func}(`);
      return prev + `${func}(`;
    });
  };

  // --- Backspace/Delete ---
  const handleDelete = () => {
    setExpression(prev => {
      if (prev.length > 0) {
        const newExpr = prev.slice(0, -1);
        setDisplay(newExpr || '0');
        return newExpr;
      }
      setDisplay('0');
      return '';
    });
  };

  // --- Clear Everything ---
  const clearAll = () => {
    setDisplay('0');
    setExpression('');
  };

  // --- Calculate/Equals ---
  const calculate = () => {
    try {
      const exprForEval = expression || display;
      if (!exprForEval.trim()) return;

      const result = evaluate(exprForEval.replace(/÷/g, '/').replace(/×/g, '*'));
      const formattedResult = format(result, { precision: 10 }).toString();

      const historyEntry: CalculatorHistory = {
        expression: exprForEval,
        result: formattedResult,
        timestamp: new Date(),
      };

      setHistory(prev => [historyEntry, ...prev.slice(0, 19)]);
      setDisplay(formattedResult);
      setExpression(formattedResult);
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  };

  // --- Panel Change ---
  const handlePanelChange = (panel: 'advanced' | 'matrix' | 'graphing') => {
    setActivePanel(panel);
    clearAll();
  };

  // --- Key Bindings ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if ((key >= '0' && key <= '9') || key === '.') {
        handleNumber(key);
      } else if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(key)) {
        handleOperator(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (key.toLowerCase() === 'c') {
        e.preventDefault();
        handleDelete();
      } else if (key === 'Escape') {
        e.preventDefault();
        clearAll();
      } else if (key === 's') handleFunction('sin');
      else if (key === 'o') handleFunction('cos');
      else if (key === 't') handleFunction('tan');
      else if (key === 'l') handleFunction('log');
      else if (key === 'e') handleFunction('exp');
      else if (key === 'r') handleFunction('sqrt');
      // Add more hotkeys if desired
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression]);

  // --- Panel List ---
  const panels = [
    { id: 'advanced' as const, label: 'Calculator' },
    { id: 'matrix' as const, label: 'Matrix' },
    { id: 'graphing' as const, label: 'Graphing' },
  ];

  return (
    <div className={`flex h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 p-6">
        <div className="mb-4">
          <div className="flex space-x-1">
            {panels.map(panel => (
              <button
                key={panel.id}
                onClick={() => handlePanelChange(panel.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${activePanel === panel.id
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {panel.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONDITIONAL DISPLAY BLOCK */}
        {activePanel === 'advanced' && (
          <div className={`border rounded-lg p-4 mb-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {expression && (
              <div className={`text-right text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {expression}
              </div>
            )}
            <div className={`text-right text-2xl font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {display}
            </div>
          </div>
        )}

        {activePanel === 'advanced' && (
          <AdvancedCalculatorPanel
            onNumber={handleNumber}
            onOperator={handleOperator}
            onFunction={handleFunction}
            onCalculate={calculate}
            onDelete={handleDelete}
            onClearAll={clearAll}
            expression={expression}
            setExpression={setExpression}
          />
        )}
        {activePanel === 'matrix' && <MatrixCalculator />}
        {activePanel === 'graphing' && <GraphingPanel />}
      </div>

      <div className={`w-80 p-4 border-l ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>History</h3>
          <button onClick={() => setHistory([])} className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}>Clear</button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((entry, index) => (
            <div key={index} className={`p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => { setExpression(entry.result); setDisplay(entry.result); }}>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{entry.expression}</div>
              <div className={`font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>= {entry.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// Calc Panel - Note the prop renaming:
// ======================================================================
function AdvancedCalculatorPanel({
  onNumber, onOperator, onFunction, onCalculate,
  onDelete, onClearAll, expression, setExpression,
}: any) {
  const { theme } = useTheme();

  const Button = ({ children, onClick, className = '', variant = 'default' }: any) => {
    const baseClass = `h-12 rounded-lg font-medium transition-colors flex items-center justify-center`;
    const variants: any = {
      default: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      operator: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white',
      equals: theme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white',
      clear: theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white',
      function: theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white',
    };
    return <button onClick={onClick} className={`${baseClass} ${variants[variant]} ${className}`}>{children}</button>;
  };

  const insertFunction = (func: string) => {
    setExpression((prev: string) => prev + `${func}(`);
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      {/* ...Calculator Buttons exactly as before... */}
      <Button onClick={onDelete} variant="clear">⌫</Button>
      <Button onClick={onClearAll} variant="clear">CE</Button>
      <Button onClick={() => onOperator('%')} variant="operator">%</Button>
      <Button onClick={() => onOperator('/')} variant="operator">÷</Button>
      <Button onClick={() => insertFunction('sqrt')} variant="function">√</Button>
      <Button onClick={() => insertFunction('factorial')} variant="function">x!</Button>

      <Button onClick={() => onNumber('7')}>7</Button>
      <Button onClick={() => onNumber('8')}>8</Button>
      <Button onClick={() => onNumber('9')}>9</Button>
      <Button onClick={() => onOperator('*')} variant="operator">×</Button>
      <Button onClick={() => insertFunction('sin')} variant="function">sin</Button>
      <Button onClick={() => insertFunction('cos')} variant="function">cos</Button>

      <Button onClick={() => onNumber('4')}>4</Button>
      <Button onClick={() => onNumber('5')}>5</Button>
      <Button onClick={() => onNumber('6')}>6</Button>
      <Button onClick={() => onOperator('-')} variant="operator">-</Button>
      <Button onClick={() => insertFunction('tan')} variant="function">tan</Button>
      <Button onClick={() => insertFunction('log')} variant="function">log</Button>

      <Button onClick={() => onNumber('1')}>1</Button>
      <Button onClick={() => onNumber('2')}>2</Button>
      <Button onClick={() => onNumber('3')}>3</Button>
      <Button onClick={() => onOperator('+')} variant="operator">+</Button>
      <Button onClick={() => insertFunction('exp')} variant="function">exp</Button>
      <Button onClick={() => insertFunction('log10')} variant="function">log10</Button>

      <Button onClick={() => onNumber('0')} className="col-span-2">0</Button>
      <Button onClick={() => onNumber('.')}>.</Button>
      <Button onClick={onCalculate} variant="equals">=</Button>
      <Button onClick={() => onOperator('^')} variant="operator">x^y</Button>
      <Button onClick={() => onOperator('(')} variant="operator">(</Button>
      <Button onClick={() => onOperator(')')} variant="operator">)</Button>
      {/* Optional: insert constants */}
      <Button onClick={() => onNumber('pi')}>π</Button>
      <Button onClick={() => onNumber('e')}>e</Button>
    </div>
  );
}
