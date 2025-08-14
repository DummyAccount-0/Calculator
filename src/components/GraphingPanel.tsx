// GraphingPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { evaluate } from 'mathjs';
import { useTheme } from '../contexts/ThemeContext';
import { Download, RefreshCw } from 'lucide-react';

export default function GraphingPanel() {
  const [equation, setEquation] = useState('sin(x)');
  const [equation2, setEquation2] = useState('cos(x)');
  const [showEquation2, setShowEquation2] = useState(false);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [plotType, setPlotType] = useState<'2d' | '3d'>('2d');
  const plotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // ***** Reset Button Handler *****
  const resetFields = () => {
    setEquation('sin(x)');
    setEquation2('cos(x)');
    setShowEquation2(false);
    setXMin(-10);
    setXMax(10);
    setPlotType('2d');
  };

  const generateData = (eq: string, range: [number, number]) => {
    const [min, max] = range;
    const step = (max - min) / 500;
    const x: number[] = [];
    const y: number[] = [];
    for (let i = min; i <= max; i += step) {
      try {
        const result = evaluate(eq.replace(/x/g, `(${i})`));
        if (typeof result === 'number' && isFinite(result)) {
          x.push(i);
          y.push(result);
        }
      } catch {}
    }
    return { x, y };
  };

  const plotGraph = () => {
    if (!plotRef.current) return;
    Plotly.purge(plotRef.current); // Cleanup old plot

    const bg = theme === 'dark' ? '#1f2937' : '#ffffff';
    const textColor = theme === 'dark' ? '#f9fafb' : '#111827';
    const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

    if (plotType === '2d') {
      const traces: any[] = [];
      const data1 = generateData(equation, [xMin, xMax]);
      traces.push({
        x: data1.x,
        y: data1.y,
        type: 'scatter',
        mode: 'lines',
        name: equation,
        line: { color: '#3b82f6', width: 2 },
      });
      if (showEquation2) {
        const data2 = generateData(equation2, [xMin, xMax]);
        traces.push({
          x: data2.x,
          y: data2.y,
          type: 'scatter',
          mode: 'lines',
          name: equation2,
          line: { color: '#ef4444', width: 2 },
        });
      }
      const layout = {
        title: { text: '2D Function Plot', font: { color: textColor } },
        xaxis: { title: 'x', gridcolor: gridColor, color: textColor },
        yaxis: { title: 'f(x)', gridcolor: gridColor, color: textColor },
        paper_bgcolor: bg,
        plot_bgcolor: bg,
        font: { color: textColor },
      };
      Plotly.newPlot(plotRef.current, traces, layout, { responsive: true });
    } else {
      // 3D placeholder with a single equation z = f(x,y)
      const x = [],
        y = [],
        z = [];
      const step = 0.2;
      const range = [-5, 5];
      for (let i = range[0]; i <= range[1]; i += step) {
        for (let j = range[0]; j <= range[1]; j += step) {
          try {
            const value = evaluate(
              equation.replace(/x/g, `(${i})`).replace(/y/g, `(${j})`)
            );
            if (typeof value === 'number' && isFinite(value)) {
              x.push(i);
              y.push(j);
              z.push(value);
            }
          } catch {}
        }
      }
      const trace = {
        x,
        y,
        z,
        type: 'scatter3d',
        mode: 'markers',
        marker: { size: 2, color: z, colorscale: 'Viridis' },
        name: equation,
      };
      const layout = {
        title: { text: '3D Function Plot', font: { color: textColor } },
        scene: {
          xaxis: { title: 'x', color: textColor },
          yaxis: { title: 'y', color: textColor },
          zaxis: { title: 'f(x,y)', color: textColor },
          bgcolor: bg,
        },
        paper_bgcolor: bg,
        font: { color: textColor },
      };
      Plotly.newPlot(plotRef.current, [trace], layout, { responsive: true });
    }
  };

  useEffect(() => {
    plotGraph();
    // eslint-disable-next-line
  }, [equation, equation2, showEquation2, xMin, xMax, plotType, theme]);

  const downloadPlot = () => {
    if (!plotRef.current) return;
    Plotly.toImage(plotRef.current, { format: 'png', width: 1200, height: 800 }).then((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plot.png';
      link.click();
    });
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Function Graphing
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={downloadPlot}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Download Plot"
          >
            <Download size={20} />
          </button>
          <button
            onClick={plotGraph}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            title="Refresh Plot"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={resetFields}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Reset All"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Controls */}
      <div
        className={`border rounded-lg p-4 mb-4 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Plot Type
            </label>
            <select
              value={plotType}
              onChange={(e) => setPlotType(e.target.value as '2d' | '3d')}
              className={`w-full p-2 border rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="2d">2D Plot</option>
              <option value="3d">3D Plot</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Function 1
            </label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder={plotType === '2d' ? 'e.g., sin(x)' : 'e.g., x^2+y^2'}
              className={`w-full p-2 border rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          {plotType === '2d' && (
            <>
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  X Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={xMin}
                    onChange={(e) => setXMin(parseFloat(e.target.value))}
                    className={`w-full p-2 border rounded ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={xMax}
                    onChange={(e) => setXMax(parseFloat(e.target.value))}
                    className={`w-full p-2 border rounded ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showEquation2}
                    onChange={(e) => setShowEquation2(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Second Function
                  </span>
                </label>
                {showEquation2 && (
                  <input
                    type="text"
                    value={equation2}
                    onChange={(e) => setEquation2(e.target.value)}
                    placeholder="e.g., cos(x)"
                    className={`w-full p-2 border rounded mt-2 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Plot Area */}
      <div className="flex-1">
        <div
          ref={plotRef}
          className={`w-full h-full rounded-lg border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        />
      </div>
    </div>
  );
}
