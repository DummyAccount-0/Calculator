import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calculator } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ConversionUnit {
  name: string;
  factor: number;
  symbol: string;
}

interface ConversionCategory {
  name: string;
  units: ConversionUnit[];
  baseUnit: string;
}

const conversionCategories: ConversionCategory[] = [
  {
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { name: 'Meter', factor: 1, symbol: 'm' },
      { name: 'Kilometer', factor: 1000, symbol: 'km' },
      { name: 'Centimeter', factor: 0.01, symbol: 'cm' },
      { name: 'Millimeter', factor: 0.001, symbol: 'mm' },
      { name: 'Inch', factor: 0.0254, symbol: 'in' },
      { name: 'Foot', factor: 0.3048, symbol: 'ft' },
      { name: 'Yard', factor: 0.9144, symbol: 'yd' },
      { name: 'Mile', factor: 1609.344, symbol: 'mi' },
    ]
  },
  {
    name: 'Mass',
    baseUnit: 'kilogram',
    units: [
      { name: 'Kilogram', factor: 1, symbol: 'kg' },
      { name: 'Gram', factor: 0.001, symbol: 'g' },
      { name: 'Pound', factor: 0.453592, symbol: 'lb' },
      { name: 'Ounce', factor: 0.0283495, symbol: 'oz' },
      { name: 'Ton', factor: 1000, symbol: 't' },
    ]
  },
  {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { name: 'Celsius', factor: 1, symbol: '°C' },
      { name: 'Fahrenheit', factor: 1, symbol: '°F' },
      { name: 'Kelvin', factor: 1, symbol: 'K' },
    ]
  },
  {
    name: 'Area',
    baseUnit: 'square meter',
    units: [
      { name: 'Square Meter', factor: 1, symbol: 'm²' },
      { name: 'Square Kilometer', factor: 1000000, symbol: 'km²' },
      { name: 'Square Centimeter', factor: 0.0001, symbol: 'cm²' },
      { name: 'Square Inch', factor: 0.00064516, symbol: 'in²' },
      { name: 'Square Foot', factor: 0.092903, symbol: 'ft²' },
    ]
  },
  {
    name: 'Volume',
    baseUnit: 'liter',
    units: [
      { name: 'Liter', factor: 1, symbol: 'L' },
      { name: 'Milliliter', factor: 0.001, symbol: 'mL' },
      { name: 'Gallon (US)', factor: 3.78541, symbol: 'gal' },
      { name: 'Cubic Meter', factor: 1000, symbol: 'm³' },
      { name: 'Cubic Inch', factor: 0.0163871, symbol: 'in³' },
    ]
  },
  {
    name: 'Energy',
    baseUnit: 'joule',
    units: [
      { name: 'Joule', factor: 1, symbol: 'J' },
      { name: 'Kilojoule', factor: 1000, symbol: 'kJ' },
      { name: 'Calorie', factor: 4.184, symbol: 'cal' },
      { name: 'BTU', factor: 1055.06, symbol: 'BTU' },
      { name: 'Kilowatt-hour', factor: 3600000, symbol: 'kWh' },
    ]
  },
  {
    name: 'Pressure',
    baseUnit: 'pascal',
    units: [
      { name: 'Pascal', factor: 1, symbol: 'Pa' },
      { name: 'Kilopascal', factor: 1000, symbol: 'kPa' },
      { name: 'Bar', factor: 100000, symbol: 'bar' },
      { name: 'PSI', factor: 6894.76, symbol: 'psi' },
      { name: 'Atmosphere', factor: 101325, symbol: 'atm' },
    ]
  },
  {
    name: 'Electrical',
    baseUnit: 'base',
    units: [
      { name: 'Voltage (V)', factor: 1, symbol: 'V' },
      { name: 'Current (A)', factor: 1, symbol: 'A' },
      { name: 'Resistance (Ω)', factor: 1, symbol: 'Ω' },
      { name: 'Power (W)', factor: 1, symbol: 'W' },
      { name: 'Capacitance (F)', factor: 1, symbol: 'F' },
    ]
  }
];

export default function ConversionSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Length']);
  const [selectedCategory, setSelectedCategory] = useState<ConversionCategory | null>(conversionCategories[0]);
  const [fromUnit, setFromUnit] = useState<ConversionUnit>(conversionCategories[0].units[0]);
  const [toUnit, setToUnit] = useState<ConversionUnit>(conversionCategories[0].units[1]);
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<string>('');
  const { theme } = useTheme();

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const selectCategory = (category: ConversionCategory) => {
    setSelectedCategory(category);
    setFromUnit(category.units[0]);
    setToUnit(category.units[1] || category.units[0]);
    setResult('');
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    
    // Convert to Celsius first
    let celsius = value;
    if (from === 'Fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'Kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'Fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'Kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  const performConversion = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      setResult('Invalid input');
      return;
    }

    if (selectedCategory?.name === 'Temperature') {
      const converted = convertTemperature(input, fromUnit.name, toUnit.name);
      setResult(converted.toFixed(4));
    } else {
      // Standard unit conversion using factors
      const baseValue = input * fromUnit.factor;
      const converted = baseValue / toUnit.factor;
      setResult(converted.toFixed(6));
    }
  };

  React.useEffect(() => {
    performConversion();
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Unit Conversions
        </h2>
      </div>

      {/* Converter */}
      {selectedCategory && (
        <div className="p-4 border-b border-gray-700">
          <h3 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {selectedCategory.name} Converter
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className={`block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                From:
              </label>
              <select
                value={fromUnit.name}
                onChange={(e) => setFromUnit(selectedCategory.units.find(u => u.name === e.target.value)!)}
                className={`w-full p-2 text-sm border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {selectedCategory.units.map(unit => (
                  <option key={unit.name} value={unit.name}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                To:
              </label>
              <select
                value={toUnit.name}
                onChange={(e) => setToUnit(selectedCategory.units.find(u => u.name === e.target.value)!)}
                className={`w-full p-2 text-sm border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {selectedCategory.units.map(unit => (
                  <option key={unit.name} value={unit.name}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Value:
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={`w-full p-2 text-sm border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                placeholder="Enter value"
              />
            </div>

            <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Result:</div>
              <div className={`font-mono text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {result} {toUnit.symbol}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="flex-1 overflow-y-auto">
        {conversionCategories.map((category) => (
          <div key={category.name} className="border-b border-gray-700">
            <button
              onClick={() => {
                toggleCategory(category.name);
                selectCategory(category);
              }}
              className={`
                w-full p-3 flex items-center justify-between text-left hover:bg-opacity-10 hover:bg-gray-500 transition-colors
                ${selectedCategory?.name === category.name 
                  ? theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }
              `}
            >
              <span className="font-medium">{category.name}</span>
              {expandedCategories.includes(category.name) ? 
                <ChevronDown size={16} /> : <ChevronRight size={16} />
              }
            </button>
            
            {expandedCategories.includes(category.name) && (
              <div className={`pl-4 pb-2 ${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'}`}>
                {category.units.map((unit) => (
                  <div
                    key={unit.name}
                    className={`text-sm py-1 px-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {unit.name} ({unit.symbol})
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}