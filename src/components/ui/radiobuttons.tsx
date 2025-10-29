'use client';
import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';


const radioContainerVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      size: {
        small: 'h-3.5 w-3.5',
        medium: 'h-4 w-4',
        large: 'h-5 w-5',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      size: 'medium',
      disabled: false,
    },
  },
);

const radioOuterCircleVariants = cva(
  'transition-colors',
  {
    variants: {
      color: {
        primary: '',
        neutral: '',
      },
      state: {
        default: '',
        hover: '',
        active: '', // active maps to selected in css
        disabled: '',
      },
    },
    compoundVariants: [
      {
        color: 'primary',
        state: 'default',
        className: 'stroke-radio_button-color-primary-default',
      },
      {
        color: 'primary',
        state: 'hover',
        className: 'stroke-radio_button-color-primary-hover',
      },
      {
        color: 'primary',
        state: 'active',
        className: 'stroke-radio_button-color-primary-selected',
      },
      {
        color: 'primary',
        state: 'disabled',
        className: 'stroke-radio_button-color-primary-disabled',
      },
      {
        color: 'neutral',
        state: 'default',
        className: 'stroke-radio_button-color-neutral-default',
      },
      {
        color: 'neutral',
        state: 'hover',
        className: 'stroke-radio_button-color-neutral-hover',
      },
      {
        color: 'neutral',
        state: 'active',
        className: 'stroke-radio_button-color-neutral-selected',
      },
      {
        color: 'neutral',
        state: 'disabled',
        className: 'stroke-radio_button-color-neutral-disabled',
      },
    ],
  },
);

const radioInnerCircleVariants = cva(
  // Base styles for the inner dot
  'transition-colors',
  {
    variants: {
      color: {
        primary: '',
        neutral: '',
      },
      state: {
        active: '',
        disabled: '',
      },
    },
    compoundVariants: [
      {
        color: 'primary',
        state: 'active',
        className: 'fill-radio_button-color-primary-selected',
      },
      {
        color: 'primary',
        state: 'disabled',
        className: 'fill-radio_button-color-primary-disabled',
      },
      {
        color: 'neutral',
        state: 'active',
        className: 'fill-radio_button-color-neutral-selected',
      },
      {
        color: 'neutral',
        state: 'disabled',
        className: 'fill-radio_button-color-neutral-disabled',
      },
    ],
  },
);

export interface RadioButtonProps extends VariantProps<typeof radioContainerVariants> {
  color?: 'primary' | 'neutral';
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  name?: string;
  value?: string;
  className?: string; // Allow custom classes
}


export const RadioButton: React.FC<RadioButtonProps> = ({
  size = 'medium',
  color = 'primary',
  checked = false,
  disabled = false,
  onChange,
  name,
  value,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeConfig = {
    small: {
      radioButton: { width: '0.875rem' },
      ellipse2: { borderWidth: '0.0625rem' },
      ellipse3: { radius: '0.21875rem' },
    },
    medium: {
      radioButton: { width: '1rem' },
      ellipse2: { borderWidth: '0.09375rem' },
      ellipse3: { radius: '0.25rem' },
    },
    large: {
      radioButton: { width: '1.25rem' },
      ellipse2: { borderWidth: '0.125rem' },
      ellipse3: { radius: '0.3125rem' },
    },
  };

  const config = sizeConfig[size ?? 'medium'];

  const isDisabled = disabled;
  const currentState = isDisabled ? 'disabled' : checked ? 'active' : isHovered ? 'hover' : 'default';
  const isSelected = checked;

  const widthInRem = parseFloat(config.radioButton.width);
  const borderWidthInRem = parseFloat(config.ellipse2.borderWidth);
  const innerRadiusInRem = parseFloat(config.ellipse3.radius);
  const viewBoxSize = 24;
  const outerRadius = viewBoxSize / 2;

  const handleClick = () => {
    if (isDisabled) return;
    onChange?.();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={radioContainerVariants({ size, disabled, className })}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} xmlns="http://www.w3.org/2000/svg">
        <circle
          cx={outerRadius}
          cy={outerRadius}
          r={outerRadius - (borderWidthInRem / widthInRem) * outerRadius}
          fill="none"
          strokeWidth={(borderWidthInRem / widthInRem) * viewBoxSize}
          className={radioOuterCircleVariants({ color, state: currentState })}
        />
        {isSelected && (
          <circle
            cx={outerRadius}
            cy={outerRadius}
            r={(innerRadiusInRem / widthInRem) * viewBoxSize}
            className={radioInnerCircleVariants({ color, state: isDisabled ? 'disabled' : isSelected ? 'active' : undefined })}
          />
        )}
      </svg>
      {name && (
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => { }}
          style={{ display: 'none' }}
          disabled={isDisabled}
        />
      )}
    </div>
  );
};

export default RadioButton;