import React, { useState } from 'react';
import { Plus, Minus, X, Trash2 } from 'lucide-react';
import { matrix, multiply, add, subtract, transpose, det, inv } from 'mathjs';
import { useTheme } from '../contexts/ThemeContext';

function getAlphaLabel(idx) {
  return String.fromCharCode('A'.charCodeAt(0) + idx);
}

export default function MatrixCalculator() {
  // Start with two 2x2 matrices
  const [matrices, setMatrices] = useState([
    [[1, 2], [3, 4]], // Matrix A
    [[5, 6], [7, 8]], // Matrix B
  ]);
  const [matrixIdxA, setMatrixIdxA] = useState(0);
  const [matrixIdxB, setMatrixIdxB] = useState(1);

  // Result logic and operation label
  const [result, setResult] = useState({ value: [[0]], label: 'Result' }); // always 2D array for grid rendering
  const { theme } = useTheme();

  // --- MATRIX EDITING ---
  const updateMatrixCell = (matrixIndex, row, col, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    setMatrices(prev => {
      const newMatrices = [...prev];
      const matrixCopy = newMatrices[matrixIndex].map(r => [...r]);
      matrixCopy[row][col] = numValue === '' ? 0 : numValue;
      newMatrices[matrixIndex] = matrixCopy;
      return newMatrices;
    });
  };

  const addRow = matrixIndex => {
    setMatrices(prev => {
      const next = [...prev];
      const cols = next[matrixIndex][0].length;
      const newRow = new Array(cols).fill(0);
      next[matrixIndex] = [...next[matrixIndex], newRow];
      return next;
    });
  };
  const removeRow = (matrixIndex, rowIndex) => {
    setMatrices(prev => {
      const next = [...prev];
      if (next[matrixIndex].length <= 1) return next;
      next[matrixIndex] = next[matrixIndex].filter((_, i) => i !== rowIndex);
      return next;
    });
  };
  const addCol = matrixIndex => {
    setMatrices(prev => {
      const next = [...prev];
      next[matrixIndex] = next[matrixIndex].map(row => [...row, 0]);
      return next;
    });
  };
  const removeCol = (matrixIndex, colIndex) => {
    setMatrices(prev => {
      const next = [...prev];
      if (next[matrixIndex][0].length <= 1) return next;
      next[matrixIndex] = next[matrixIndex].map(row => row.filter((_, i) => i !== colIndex));
      return next;
    });
  };
  const addMatrix = () => {
    setMatrices(prev => [...prev, [[0, 0], [0, 0]]]);
  };
  const removeMatrix = matrixIndex => {
    if (matrices.length <= 2) return;
    setMatrices(prev => prev.filter((_, idx) => idx !== matrixIndex));
    setMatrixIdxA(0);
    setMatrixIdxB(1);
  };

  // --- MATRIX OPERATIONS ---
  const performOperation = op => {
    try {
      let resultMatrix, label;
      const mA = matrix(matrices[matrixIdxA]);
      const mB = matrix(matrices[matrixIdxB]);
      switch (op) {
        case 'add':
          resultMatrix = add(mA, mB).toArray();
          label = `${getAlphaLabel(matrixIdxA)} + ${getAlphaLabel(matrixIdxB)}`;
          break;
        case 'subtract':
          resultMatrix = subtract(mA, mB).toArray();
          label = `${getAlphaLabel(matrixIdxA)} - ${getAlphaLabel(matrixIdxB)}`;
          break;
        case 'multiply':
          resultMatrix = multiply(mA, mB).toArray();
          label = `${getAlphaLabel(matrixIdxA)} × ${getAlphaLabel(matrixIdxB)}`;
          break;
        case 'transpose_a':
          resultMatrix = transpose(mA).toArray();
          label = `${getAlphaLabel(matrixIdxA)}^T`;
          break;
        case 'transpose_b':
          resultMatrix = transpose(mB).toArray();
          label = `${getAlphaLabel(matrixIdxB)}^T`;
          break;
        case 'det_a':
          resultMatrix = [[det(mA)]];
          label = `det(${getAlphaLabel(matrixIdxA)})`;
          break;
        case 'det_b':
          resultMatrix = [[det(mB)]];
          label = `det(${getAlphaLabel(matrixIdxB)})`;
          break;
        case 'inv_a':
          resultMatrix = inv(mA).toArray();
          label = `${getAlphaLabel(matrixIdxA)}^(-1)`;
          break;
        case 'inv_b':
          resultMatrix = inv(mB).toArray();
          label = `${getAlphaLabel(matrixIdxB)}^(-1)`;
          break;
        default:
          return;
      }
      setResult({ value: resultMatrix, label });
    } catch (error) {
      setResult({ value: [[0]], label: 'Error' });
    }
  };

  // --- STORE RESULT AS NEW MATRIX ---
  const storeResultAsMatrix = () => {
    if (result.label === 'Error' || !result.value.length) return;
    setMatrices(prev => [...prev, result.value.map(row => [...row])]);
  };

  // --- MATRIX INPUT COMPONENT ---
  const MatrixInput = ({
    matrixData, label, matrixIndex, onUpdate, onRemoveMatrix
  }) => (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Matrix {label}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => addRow(matrixIndex)}
            className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            title="Add Row"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => addCol(matrixIndex)}
            className={`p-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            title="Add Column"
          >
            <Plus size={16} />
          </button>
          {matrices.length > 2 && (
            <button
              onClick={() => onRemoveMatrix(matrixIndex)}
              className={`p-1 rounded ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
              title="Delete Matrix"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      {/* Remove Row/Col Buttons */}
      <div className="space-y-1 mb-2">
        {matrixData.length > 1 &&
          matrixData.map((_, rowIdx) => (
            <button
              key={'row-' + rowIdx}
              onClick={() => removeRow(matrixIndex, rowIdx)}
              className={`mr-2 text-xs px-1 py-0 rounded ${theme === 'dark' ? 'bg-gray-700 text-red-400' : 'bg-gray-200 text-red-500'}`}
              disabled={matrixData.length <= 1}
              style={{ marginBottom: 2 }}
            >
              Remove row {rowIdx + 1}
            </button>
          ))}
        {matrixData[0]?.length > 1 &&
          matrixData[0].map((_, colIdx) => (
            <button
              key={'col-' + colIdx}
              onClick={() => removeCol(matrixIndex, colIdx)}
              className={`mr-2 text-xs px-1 py-0 rounded ${theme === 'dark' ? 'bg-gray-700 text-red-400' : 'bg-gray-200 text-red-500'}`}
              disabled={matrixData[0].length <= 1}
              style={{ marginBottom: 2 }}
            >
              Remove col {colIdx + 1}
            </button>
          ))}
      </div>
      {/* Matrix Input Grid */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixData[0].length}, minmax(0, 1fr))` }}>
        {matrixData.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={cell}
              onChange={e => onUpdate(matrixIndex, rowIndex, colIndex, e.target.value)}
              className={`
                w-full p-2 text-center border rounded text-sm
                ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
              inputMode="decimal"
              step="any"
              autoComplete="off"
              onKeyDown={e => e.stopPropagation()} // Fixes keylogger/numpad issue
            />
          ))
        )}
      </div>
    </div>
  );

  // --- OPERAND SELECT DROPDOWNS ---
  const matrixOptions = matrices.map((_, idx) => (
    <option key={idx} value={idx}>{getAlphaLabel(idx)}</option>
  ));

  // --- RESULT BAR (with store button, no copy) ---
  const ResultBar = () => (
    <div className={`py-3 px-4 rounded-lg text-lg flex items-center justify-between
      ${theme === 'dark' ? 'bg-gray-900 text-green-300' : 'bg-gray-100 text-green-700'}
      border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}
      mb-4`}>
      <div>
        <span className="font-bold mr-5">Result:</span>
        {result.value.length === 1 && result.value[0].length === 1 ? (
          <span>{result.label} = {typeof result.value[0][0] === 'number' ? result.value[0][0].toFixed(4) : result.value[0][0]}</span>
        ) : (
          <span>
            {result.label}
            <span className="ml-2">
              <span style={{ display: 'inline-block', border: '1px solid #888', borderRadius: 4, padding: 2, marginLeft: 6 }}>
                <table className="align-middle" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {result.value.map((row, i) =>
                      <tr key={i}>
                        {row.map((cell, j) =>
                          <td key={j} style={{ border: 0, padding: '0 6px' }}>
                            {typeof cell === 'number' ? cell.toFixed(2) : cell}
                          </td>
                        )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </span>
            </span>
          </span>
        )}
      </div>
      <button
        title="Store result as new matrix"
        onClick={storeResultAsMatrix}
        className={`ml-4 flex items-center px-2 py-1 border rounded ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'}`}
        disabled={result.label === 'Error'}
      >
        Store as Matrix
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-6">
      {/* Result Bar at the very top */}
      <ResultBar />
      {/* Header and Add Matrix */}
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Matrix Calculator
        </h2>
        <button
          onClick={addMatrix}
          className={`flex items-center px-3 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          <Plus size={18} className="mr-1" /> Add Matrix
        </button>
      </div>
      {/* Scrollable main content */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2">
        {/* Input Matrices */}
        <div className="grid md:grid-cols-2 gap-6">
          {matrices.map((mat, i) =>
            <MatrixInput
              key={i}
              matrixData={mat}
              label={getAlphaLabel(i)}
              matrixIndex={i}
              onUpdate={updateMatrixCell}
              onRemoveMatrix={removeMatrix}
            />
          )}
        </div>
        {/* Matrix selection and operations */}
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 mb-2`}>
          <div className="flex items-center justify-start space-x-4 mb-2">
            <label>Select 1st Matrix:</label>
            <select
              className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              value={matrixIdxA}
              onChange={e => setMatrixIdxA(Number(e.target.value))}
            >
              {matrixOptions}
            </select>
            <label>Select 2nd Matrix:</label>
            <select
              className={`p-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              value={matrixIdxB}
              onChange={e => setMatrixIdxB(Number(e.target.value))}
            >
              {matrixOptions}
            </select>
          </div>
          <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Operations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => performOperation('add')}
              className={`p-2 rounded flex items-center justify-center space-x-2 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Plus size={16} />
              <span>{getAlphaLabel(matrixIdxA)} + {getAlphaLabel(matrixIdxB)}</span>
            </button>
            <button
              onClick={() => performOperation('subtract')}
              className={`p-2 rounded flex items-center justify-center space-x-2 ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
            >
              <Minus size={16} />
              <span>{getAlphaLabel(matrixIdxA)} - {getAlphaLabel(matrixIdxB)}</span>
            </button>
            <button
              onClick={() => performOperation('multiply')}
              className={`p-2 rounded flex items-center justify-center space-x-2 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
            >
              <X size={16} />
              <span>{getAlphaLabel(matrixIdxA)} × {getAlphaLabel(matrixIdxB)}</span>
            </button>
            <button
              onClick={() => performOperation('transpose_a')}
              className={`p-2 rounded text-sm ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
            >
              {getAlphaLabel(matrixIdxA)}<sup>T</sup>
            </button>
            <button
              onClick={() => performOperation('transpose_b')}
              className={`p-2 rounded text-sm ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
            >
              {getAlphaLabel(matrixIdxB)}<sup>T</sup>
            </button>
            <button
              onClick={() => performOperation('det_a')}
              className={`p-2 rounded text-sm ${theme === 'dark' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              det({getAlphaLabel(matrixIdxA)})
            </button>
            <button
              onClick={() => performOperation('det_b')}
              className={`p-2 rounded text-sm ${theme === 'dark' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              det({getAlphaLabel(matrixIdxB)})
            </button>
            <button
              onClick={() => performOperation('inv_a')}
              className={`p-2 rounded text-sm ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
            >
              {getAlphaLabel(matrixIdxA)}
              <sup>-1</sup>
            </button>
            <button
              onClick={() => performOperation('inv_b')}
              className={`p-2 rounded text-sm ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
            >
              {getAlphaLabel(matrixIdxB)}
              <sup>-1</sup>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
