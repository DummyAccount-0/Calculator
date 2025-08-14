import React, { useState, useMemo } from 'react';
import { Search, Copy, Star, BookOpen, Calculator, Zap, Cpu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Formula {
  id: string;
  name: string;
  formula: string;
  description: string;
  category: string;
  subcategory: string;
  variables?: { [key: string]: string };
  tags: string[];
}

const formulaDatabase: Formula[] = [
  // Mathematics - Algebra
  {
    id: 'quad_formula',
    name: 'Quadratic Formula',
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    description: 'Solves quadratic equations of the form ax² + bx + c = 0',
    category: 'Mathematics',
    subcategory: 'Algebra',
    variables: { a: 'coefficient of x²', b: 'coefficient of x', c: 'constant term' },
    tags: ['quadratic', 'roots', 'polynomial']
  },
  {
    id: 'distance_formula',
    name: 'Distance Formula',
    formula: 'd = √((x₂-x₁)² + (y₂-y₁)²)',
    description: 'Calculates distance between two points in 2D space',
    category: 'Mathematics',
    subcategory: 'Geometry',
    variables: { 'x₁,y₁': 'first point coordinates', 'x₂,y₂': 'second point coordinates' },
    tags: ['distance', 'coordinate', 'geometry']
  },
  
  // Mathematics - Trigonometry
  {
    id: 'pythagorean',
    name: 'Pythagorean Theorem',
    formula: 'a² + b² = c²',
    description: 'Relationship between sides of a right triangle',
    category: 'Mathematics',
    subcategory: 'Trigonometry',
    variables: { a: 'first leg', b: 'second leg', c: 'hypotenuse' },
    tags: ['triangle', 'right angle', 'geometry']
  },
  {
    id: 'law_of_cosines',
    name: 'Law of Cosines',
    formula: 'c² = a² + b² - 2ab cos(C)',
    description: 'Generalizes Pythagorean theorem for any triangle',
    category: 'Mathematics',
    subcategory: 'Trigonometry',
    variables: { a: 'side length', b: 'side length', c: 'side opposite angle C', C: 'angle in radians' },
    tags: ['triangle', 'cosine', 'general']
  },

  // Mathematics - Calculus
  {
    id: 'power_rule',
    name: 'Power Rule',
    formula: 'd/dx(xⁿ) = nxⁿ⁻¹',
    description: 'Derivative of power functions',
    category: 'Mathematics',
    subcategory: 'Calculus',
    variables: { n: 'power/exponent', x: 'variable' },
    tags: ['derivative', 'differentiation', 'power']
  },
  {
    id: 'integration_by_parts',
    name: 'Integration by Parts',
    formula: '∫u dv = uv - ∫v du',
    description: 'Integration technique for products of functions',
    category: 'Mathematics',
    subcategory: 'Calculus',
    variables: { u: 'first function', v: 'second function', du: 'differential of u', dv: 'differential of v' },
    tags: ['integration', 'product', 'technique']
  },

  // Physics - Mechanics
  {
    id: 'newtons_second',
    name: "Newton's Second Law",
    formula: 'F = ma',
    description: 'Force equals mass times acceleration',
    category: 'Physics',
    subcategory: 'Mechanics',
    variables: { F: 'force (N)', m: 'mass (kg)', a: 'acceleration (m/s²)' },
    tags: ['force', 'motion', 'acceleration', 'newton']
  },
  {
    id: 'kinematic_eq1',
    name: 'Kinematic Equation 1',
    formula: 'v = v₀ + at',
    description: 'Velocity as function of time with constant acceleration',
    category: 'Physics',
    subcategory: 'Mechanics',
    variables: { v: 'final velocity', 'v₀': 'initial velocity', a: 'acceleration', t: 'time' },
    tags: ['kinematics', 'velocity', 'acceleration', 'motion']
  },
  {
    id: 'kinematic_eq2',
    name: 'Kinematic Equation 2',
    formula: 's = v₀t + ½at²',
    description: 'Position as function of time with constant acceleration',
    category: 'Physics',
    subcategory: 'Mechanics',
    variables: { s: 'displacement', 'v₀': 'initial velocity', a: 'acceleration', t: 'time' },
    tags: ['kinematics', 'position', 'displacement', 'motion']
  },

  // Physics - Thermodynamics
  {
    id: 'ideal_gas_law',
    name: 'Ideal Gas Law',
    formula: 'PV = nRT',
    description: 'Relationship between pressure, volume, and temperature of ideal gas',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    variables: { P: 'pressure', V: 'volume', n: 'amount of substance', R: 'gas constant', T: 'temperature' },
    tags: ['gas', 'pressure', 'volume', 'temperature']
  },
  {
    id: 'first_law_thermo',
    name: 'First Law of Thermodynamics',
    formula: 'ΔU = Q - W',
    description: 'Conservation of energy in thermodynamic systems',
    category: 'Physics',
    subcategory: 'Thermodynamics',
    variables: { 'ΔU': 'change in internal energy', Q: 'heat added to system', W: 'work done by system' },
    tags: ['energy', 'conservation', 'heat', 'work']
  },

  // Physics - Electromagnetism
  {
    id: 'ohms_law',
    name: "Ohm's Law",
    formula: 'V = IR',
    description: 'Relationship between voltage, current, and resistance',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    variables: { V: 'voltage (V)', I: 'current (A)', R: 'resistance (Ω)' },
    tags: ['electricity', 'voltage', 'current', 'resistance']
  },
  {
    id: 'electric_power',
    name: 'Electric Power',
    formula: 'P = VI = I²R = V²/R',
    description: 'Power dissipated in electrical circuits',
    category: 'Physics',
    subcategory: 'Electromagnetism',
    variables: { P: 'power (W)', V: 'voltage (V)', I: 'current (A)', R: 'resistance (Ω)' },
    tags: ['power', 'electricity', 'energy', 'circuit']
  },

  // Computer Science - Machine Learning
  {
    id: 'mse_loss',
    name: 'Mean Squared Error',
    formula: 'MSE = (1/n) Σ(yᵢ - ŷᵢ)²',
    description: 'Loss function for regression problems',
    category: 'Computer Science',
    subcategory: 'Machine Learning',
    variables: { n: 'number of samples', 'yᵢ': 'actual value', 'ŷᵢ': 'predicted value' },
    tags: ['loss', 'regression', 'error', 'optimization']
  },
  {
    id: 'gradient_descent',
    name: 'Gradient Descent Update',
    formula: 'θ = θ - α∇J(θ)',
    description: 'Parameter update rule for gradient descent optimization',
    category: 'Computer Science',
    subcategory: 'Machine Learning',
    variables: { θ: 'parameters', α: 'learning rate', '∇J(θ)': 'gradient of cost function' },
    tags: ['optimization', 'gradient', 'learning', 'parameters']
  },
  {
    id: 'sigmoid',
    name: 'Sigmoid Function',
    formula: 'σ(x) = 1 / (1 + e⁻ˣ)',
    description: 'Activation function that maps any real value to (0,1)',
    category: 'Computer Science',
    subcategory: 'Machine Learning',
    variables: { x: 'input value', e: 'Euler\'s number (≈2.718)' },
    tags: ['activation', 'function', 'sigmoid', 'neural network']
  },

  // Computer Science - Algorithms
  {
    id: 'big_o_log',
    name: 'Binary Search Complexity',
    formula: 'T(n) = O(log n)',
    description: 'Time complexity of binary search algorithm',
    category: 'Computer Science',
    subcategory: 'Algorithms',
    variables: { n: 'size of sorted array', T: 'time complexity' },
    tags: ['complexity', 'search', 'logarithmic', 'binary']
  },

  // Engineering - Mechanical
  {
    id: 'stress_formula',
    name: 'Stress Formula',
    formula: 'σ = F/A',
    description: 'Stress in materials under applied force',
    category: 'Engineering',
    subcategory: 'Mechanical',
    variables: { σ: 'stress (Pa)', F: 'applied force (N)', A: 'cross-sectional area (m²)' },
    tags: ['stress', 'force', 'area', 'materials']
  },
  {
    id: 'moment_of_inertia',
    name: 'Moment of Inertia (Point Mass)',
    formula: 'I = mr²',
    description: 'Rotational inertia of a point mass',
    category: 'Engineering',
    subcategory: 'Mechanical',
    variables: { I: 'moment of inertia', m: 'mass', r: 'distance from axis' },
    tags: ['inertia', 'rotation', 'mass', 'radius']
  },

  // Engineering - Electrical
  {
    id: 'capacitor_energy',
    name: 'Capacitor Energy',
    formula: 'E = ½CV²',
    description: 'Energy stored in a capacitor',
    category: 'Engineering',
    subcategory: 'Electrical',
    variables: { E: 'energy (J)', C: 'capacitance (F)', V: 'voltage (V)' },
    tags: ['capacitor', 'energy', 'storage', 'electrical']
  },
  {
    id: 'rc_time_constant',
    name: 'RC Time Constant',
    formula: 'τ = RC',
    description: 'Time constant for RC circuits',
    category: 'Engineering',
    subcategory: 'Electrical',
    variables: { τ: 'time constant (s)', R: 'resistance (Ω)', C: 'capacitance (F)' },
    tags: ['time constant', 'RC circuit', 'exponential', 'decay']
  }
];

export default function FormulaLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { theme } = useTheme();

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(formulaDatabase.map(f => f.category))];
    return cats;
  }, []);

  const subcategories = useMemo(() => {
    if (selectedCategory === 'All') {
      return ['All'];
    }
    const subcats = ['All', ...new Set(formulaDatabase
      .filter(f => f.category === selectedCategory)
      .map(f => f.subcategory))];
    return subcats;
  }, [selectedCategory]);

  const filteredFormulas = useMemo(() => {
    return formulaDatabase.filter(formula => {
      const matchesSearch = searchTerm === '' || 
        formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || formula.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'All' || formula.subcategory === selectedSubcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [searchTerm, selectedCategory, selectedSubcategory]);

  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    // You could add a toast notification here
  };

  const toggleFavorite = (formulaId: string) => {
    setFavorites(prev => 
      prev.includes(formulaId) 
        ? prev.filter(id => id !== formulaId)
        : [...prev, formulaId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mathematics': return <Calculator size={16} />;
      case 'Physics': return <Zap size={16} />;
      case 'Computer Science': return <Cpu size={16} />;
      case 'Engineering': return <BookOpen size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Formula Library
        </h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
          <input
            type="text"
            placeholder="Search formulas, descriptions, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full pl-10 pr-4 py-3 border rounded-lg text-lg
              ${theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }
            `}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('All');
              }}
              className={`
                p-2 border rounded
                ${theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Subcategory
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className={`
                p-2 border rounded
                ${theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
              `}
            >
              {subcategories.map(subcat => (
                <option key={subcat} value={subcat}>{subcat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {filteredFormulas.length} formulas found
      </div>

      {/* Formula Cards */}
      <div className="grid gap-4 auto-rows-max">
        {filteredFormulas.map((formula) => (
          <div
            key={formula.id}
            className={`
              ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
              border rounded-lg p-6 hover:shadow-lg transition-shadow
            `}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(formula.category)}
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formula.name}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleFavorite(formula.id)}
                  className={`p-2 rounded transition-colors ${
                    favorites.includes(formula.id)
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  <Star size={20} fill={favorites.includes(formula.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => copyFormula(formula.formula)}
                  className={`p-2 rounded transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
                  title="Copy formula"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mb-3">
              <span className={`
                inline-block px-2 py-1 text-xs font-medium rounded
                ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}
              `}>
                {formula.category} › {formula.subcategory}
              </span>
            </div>

            {/* Formula */}
            <div className={`
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} 
              p-4 rounded-lg mb-3 font-mono text-lg text-center overflow-x-auto
            `}>
              <div className={theme === 'dark' ? 'text-green-400' : 'text-green-700'}>
                {formula.formula}
              </div>
            </div>

            {/* Description */}
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              {formula.description}
            </p>

            {/* Variables */}
            {formula.variables && (
              <div className="mb-3">
                <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Variables:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(formula.variables).map(([variable, description]) => (
                    <div key={variable} className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-mono font-semibold">{variable}:</span> {description}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {formula.tags.map((tag) => (
                <span
                  key={tag}
                  className={`
                    px-2 py-1 text-xs rounded
                    ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredFormulas.length === 0 && (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No formulas found matching your search criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}