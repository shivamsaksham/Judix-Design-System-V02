import React, { useState } from 'react';

type RadioSize = 'small' | 'normal' | 'large';
type RadioState = 'default' | 'hover' | 'active' | 'disabled';
type RadioColor = 'primary' | 'neutral';

interface RadioButtonProps {
  size?: RadioSize;
  state?: RadioState;
  color?: RadioColor;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
}

// Design System Colors
const colors = {
  neutral: {
    light300: '#e0e0e0',
    contrast700: '#3d3d3d',
  },
  primary: {
    200: '#66b3b9',
    400: '#00808b',
  }
};

const RadioButton: React.FC<RadioButtonProps> = ({
  size = 'normal',
  state = 'default',
  color = 'primary',
  checked = false,
  disabled = false,
  onChange,
  name,
  value
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled || state === 'disabled') return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  // Size configurations
  const sizeConfig = {
    small: {
      radioButton: { height: 14, width: 14 },
      ellipse2: { height: 14, width: 14, borderWeight: 1 },
      ellipse3: { height: 7, width: 7 }
    },
    normal: {
      radioButton: { height: 16, width: 16 },
      ellipse2: { height: 16, width: 16, borderWeight: 1.5 },
      ellipse3: { height: 8, width: 8 }
    },
    large: {
      radioButton: { height: 20, width: 20 },
      ellipse2: { height: 20, width: 20, borderWeight: 2 },
      ellipse3: { height: 10, width: 10 }
    }
  };

  // Color configurations based on design system
  const colorConfig = {
    primary: {
      active: {
        borderColor: colors.primary[400],
        backgroundColor: colors.primary[400] 
      },
      hover: {
        borderColor: colors.primary[200] 
      },
      disabled: {
        borderColor: colors.neutral.light300, 
        backgroundColor: colors.neutral.light300 
      },
      default: {
        borderColor: colors.neutral.light300 
      }
    },
    neutral: {
      active: {
        borderColor: colors.neutral.contrast700, 
        backgroundColor: colors.neutral.contrast700 
      },
      hover: {
        borderColor: colors.primary[200] 
      },
      disabled: {
        borderColor: colors.neutral.light300, 
        backgroundColor: colors.neutral.light300 
      },
      default: {
        borderColor: colors.neutral.light300 
      }
    }
  };

  const config = sizeConfig[size];
  const colorScheme = colorConfig[color];

  // Determine current state
  const getCurrentState = () => {
    if (state === 'disabled' || disabled) return 'disabled';
    if (state === 'active' || isChecked) return 'active';
    if (state === 'hover' || isHovered) return 'hover';
    return 'default';
  };

  const currentState = getCurrentState();
  const isDisabled = currentState === 'disabled';
  const isSelected = currentState === 'active';
  const isHover = currentState === 'hover';

  // Get colors based on state
  const getBorderColor = () => {
    if (isDisabled) return colorScheme.disabled.borderColor;
    if (isSelected) return colorScheme.active.borderColor;
    if (isHover) return colorScheme.hover.borderColor;
    return colorScheme.default.borderColor;
  };

  const getBackgroundColor = () => {
    if (isDisabled && isSelected) return colorScheme.disabled.backgroundColor;
    if (isSelected) return colorScheme.active.backgroundColor;
    return 'transparent';
  };

  const outerRadius = config.ellipse2.width / 2;
  const innerRadius = config.ellipse3.width / 2;
  const viewBoxSize = config.radioButton.width;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-block',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1
      }}
    >
      <svg
        width={config.radioButton.width}
        height={config.radioButton.height}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={outerRadius - config.ellipse2.borderWeight / 2}
          fill="none"
          stroke={getBorderColor()}
          strokeWidth={config.ellipse2.borderWeight}
        />
        
        {isSelected && (
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={innerRadius}
            fill={getBackgroundColor()}
          />
        )}
      </svg>
      {name && (
        <input
          type="radio"
          name={name}
          value={value}
          checked={isSelected}
          onChange={() => {}}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

// Demo component
const RadioButtonDemo: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('option1');
  const [demoSize, setDemoSize] = useState<RadioSize>('normal');
  const [demoColor, setDemoColor] = useState<RadioColor>('primary');

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Radio Button Component</h1>
      
      {/* States */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">States</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Active */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Active</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RadioButton state="active" checked color="primary" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Ellipse 2</p>
                  <p className="font-mono">#00808b</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RadioButton state="active" checked color="primary" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Ellipse 3</p>
                  <p className="font-mono">#00808b</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hover */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Hover</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RadioButton state="hover" color="primary" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Ellipse 2</p>
                  <p className="font-mono">#66b3b9</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disabled */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Disabled</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RadioButton state="disabled" disabled />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Ellipse 2</p>
                  <p className="font-mono">#e0e0e0</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RadioButton state="disabled" checked disabled />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Ellipse 3</p>
                  <p className="font-mono">#e0e0e0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Default */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Default</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <RadioButton state="default" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium">Ellipse 2</p>
                  <p className="font-mono">#e0e0e0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Sizes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Small */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Small</h3>
            <div className="space-y-3">
              <RadioButton size="small" checked />
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Radio Button:</span> 14×14</p>
                <p><span className="font-medium">Ellipse 2:</span> 14×14, Border: 1</p>
                <p><span className="font-medium">Ellipse 3:</span> 7×7</p>
              </div>
            </div>
          </div>

          {/* Normal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Normal</h3>
            <div className="space-y-3">
              <RadioButton size="normal" checked />
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Radio Button:</span> 16×16</p>
                <p><span className="font-medium">Ellipse 2:</span> 16×16, Border: 1.5</p>
                <p><span className="font-medium">Ellipse 3:</span> 8×8</p>
              </div>
            </div>
          </div>

          {/* Large */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Large</h3>
            <div className="space-y-3">
              <RadioButton size="large" checked />
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Radio Button:</span> 20×20</p>
                <p><span className="font-medium">Ellipse 2:</span> 20×20, Border: 2</p>
                <p><span className="font-medium">Ellipse 3:</span> 10×10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Colors</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Neutral */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Neutral</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <RadioButton color="neutral" checked />
                <div className="text-xs text-gray-600">
                  <p><span className="font-medium">Ellipse 2:</span> <span className="font-mono">#3d3d3d</span></p>
                  <p className="text-gray-500">primitives-color-neutral-contrast-700</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RadioButton color="neutral" checked />
                <div className="text-xs text-gray-600">
                  <p><span className="font-medium">Ellipse 3:</span> <span className="font-mono">#3d3d3d</span></p>
                  <p className="text-gray-500">primitives-color-neutral-contrast-700</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Primary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <RadioButton color="primary" checked />
                <div className="text-xs text-gray-600">
                  <p><span className="font-medium">Ellipse 2:</span> <span className="font-mono">#00808b</span></p>
                  <p className="text-gray-500">primitives-color-primary-400</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RadioButton color="primary" checked />
                <div className="text-xs text-gray-600">
                  <p><span className="font-medium">Ellipse 3:</span> <span className="font-mono">#00808b</span></p>
                  <p className="text-gray-500">primitives-color-primary-400</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design System Color Reference */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Design System Colors Used</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: '#00808b' }}></div>
              <div className="text-xs">
                <p className="font-mono">#00808b</p>
                <p className="text-gray-500">primary-400</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: '#66b3b9' }}></div>
              <div className="text-xs">
                <p className="font-mono">#66b3b9</p>
                <p className="text-gray-500">primary-200</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: '#3d3d3d' }}></div>
              <div className="text-xs">
                <p className="font-mono">#3d3d3d</p>
                <p className="text-gray-500">neutral-contrast-700</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: '#e0e0e0' }}></div>
              <div className="text-xs">
                <p className="font-mono">#e0e0e0</p>
                <p className="text-gray-500">neutral-light-300</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Interactive Demo</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Select an option:</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <RadioButton 
                  size={demoSize}
                  color={demoColor}
                  checked={selectedOption === 'option1'}
                  onChange={() => setSelectedOption('option1')}
                  name="demo"
                  value="option1"
                />
                <span className="text-sm text-gray-700">Option 1</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <RadioButton 
                  size={demoSize}
                  color={demoColor}
                  checked={selectedOption === 'option2'}
                  onChange={() => setSelectedOption('option2')}
                  name="demo"
                  value="option2"
                />
                <span className="text-sm text-gray-700">Option 2</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <RadioButton 
                  size={demoSize}
                  color={demoColor}
                  checked={selectedOption === 'option3'}
                  onChange={() => setSelectedOption('option3')}
                  name="demo"
                  value="option3"
                />
                <span className="text-sm text-gray-700">Option 3</span>
              </label>
              <label className="flex items-center gap-3 cursor-not-allowed opacity-50">
                <RadioButton 
                  size={demoSize}
                  color={demoColor}
                  disabled
                />
                <span className="text-sm text-gray-700">Option 4 (Disabled)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Size:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDemoSize('small')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    demoSize === 'small' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Small
                </button>
                <button
                  onClick={() => setDemoSize('normal')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    demoSize === 'normal' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setDemoSize('large')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    demoSize === 'large' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Large
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Color:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDemoColor('primary')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    demoColor === 'primary' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Primary
                </button>
                <button
                  onClick={() => setDemoColor('neutral')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    demoColor === 'neutral' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Neutral
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Code */}
      <div className="mt-8 bg-gray-900 p-4 rounded-lg">
        <h3 className="text-sm font-semibold mb-2 text-gray-300">Usage:</h3>
        <pre className="text-xs text-green-400 overflow-x-auto">
        </pre>
      </div>
    </div>
  );
};

export default RadioButtonDemo;