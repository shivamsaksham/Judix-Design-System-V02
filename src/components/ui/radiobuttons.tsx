'use client';
import React, { useState } from 'react';

export type RadioSize = 'small' | 'medium' | 'large';
export type RadioState = 'default' | 'hover' | 'active' | 'disabled';
export type RadioColor = 'primary' | 'neutral';

interface RadioButtonProps {
  size?: RadioSize;
  state?: RadioState;
  color?: RadioColor;
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  name?: string;
  value?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  size = 'medium',
  state = 'default',
  color = 'primary',
  checked = false,
  disabled = false,
  onChange,
  name,
  value,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (disabled || state === 'disabled') return;
    onChange?.();
  };

  const sizeConfig = {
    small: {
      radioButton: { height: '0.875rem', width: '0.875rem' },
      ellipse2: { borderWidth: '0.0625rem' },
      ellipse3: { radius: '0.21875rem' },
    },
    medium: {
      radioButton: { height: '1rem', width: '1rem' },
      ellipse2: { borderWidth: '0.09375rem' },
      ellipse3: { radius: '0.25rem' },
    },
    large: {
      radioButton: { height: '1.25rem', width: '1.25rem' },
      ellipse2: { borderWidth: '0.125rem' },
      ellipse3: { radius: '0.3125rem' },
    },
  };

 const colorConfig = {
  primary: {
    active: { borderColor: 'var(--primitives-color-primary-400)', backgroundColor: 'var(--primitives-color-primary-400)' },
    hover: { borderColor: 'var(--primitives-color-primary-200)', backgroundColor: 'var(--primitives-color-primary-50)' }, // add backgroundColor
    disabled: { borderColor: 'var(--primitives-color-neutral-light-300)', backgroundColor: 'var(--primitives-color-neutral-light-300)' },
    default: { borderColor: 'var(--primitives-color-neutral-light-300)' },
  },
  neutral: {
    active: { borderColor: 'var(--primitives-color-neutral-contrast-700)', backgroundColor: 'var(--primitives-color-neutral-contrast-700)' },
    hover: { borderColor: 'var(--primitives-color-primary-200)', backgroundColor: 'var(--primitives-color-neutral-light-100)' }, // add backgroundColor
    disabled: { borderColor: 'var(--primitives-color-neutral-light-300)', backgroundColor: 'var(--primitives-color-neutral-light-300)' },
    default: { borderColor: 'var(--primitives-color-neutral-light-300)' },
  },
} as const;

  const config = sizeConfig[size];
  const colorScheme = colorConfig[color];

  const getCurrentState = () => {
    if (state === 'disabled' || disabled) return 'disabled';
    if (state === 'active' || checked) return 'active';
    if (state === 'hover' || isHovered) return 'hover';
    return 'default';
  };

  const currentState = getCurrentState();
  const isDisabled = currentState === 'disabled';
  const isSelected = currentState === 'active';
  const isHover = currentState === 'hover';

  const getBorderColor = () => {
    if (isDisabled) return colorScheme.disabled.borderColor;
    if (isSelected) return colorScheme.active.borderColor;
    if (isHover) return colorScheme.hover.borderColor;
    return colorScheme.default.borderColor;
  };

  const getBackgroundColor = () => {
    if (isDisabled && isSelected) return colorScheme.disabled.backgroundColor;
    if (isSelected) return colorScheme.active.backgroundColor;
    if (isHover) return colorScheme.hover.backgroundColor || 'transparent';
    return 'transparent';
  };

  const widthInRem = parseFloat(config.radioButton.width);
  const borderWidthInRem = parseFloat(config.ellipse2.borderWidth);
  const innerRadiusInRem = parseFloat(config.ellipse3.radius);

  const viewBoxSize = 24;
  const outerRadius = viewBoxSize / 2;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        width: config.radioButton.width,
        height: config.radioButton.height,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={outerRadius - (borderWidthInRem / widthInRem) * outerRadius}
          fill="none"
          stroke={getBorderColor()}
          strokeWidth={(borderWidthInRem / widthInRem) * viewBoxSize}
        />
        {isSelected && (
          <circle
            cx={outerRadius}
            cy={outerRadius}
            r={(innerRadiusInRem / widthInRem) * viewBoxSize}
            fill={getBackgroundColor()}
          />
        )}
      </svg>
      {name && (
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => {}}
          style={{ display: 'none' }}
          disabled={isDisabled}
        />
      )}
    </div>
  );
};

export default RadioButton;
