'use client';
import React, { useState } from 'react';
import { RadioButton, RadioButtonProps } from '../ui';

type Size = 'small' | 'medium' | 'large';
type Color = 'primary' | 'neutral';

const ControlGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div style={{ marginBottom: '1rem' }}>
    <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
      {title}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {children}
    </div>
  </div>
);

const RadioWithLabel: React.FC<
  RadioButtonProps & { label: string; onClick?: () => void }
> = ({ label, ...props }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
    }}
    // Make the label clickable
    onClick={() => !props.disabled && props.onChange?.()}
  >
    <RadioButton {...props} />
    <label
      style={{
        userSelect: 'none',
        color: props.disabled ? '#aaa' : '#000',
        cursor: 'inherit',
      }}
    >
      {label}
    </label>
  </div>
);

export const RadioButtonDemo: React.FC = () => {
  // --- State for the interactive demo ---
  const [functionalChoice, setFunctionalChoice] = useState('one');
  
  // --- State for the controls ---
  const [size, setSize] = useState<Size>('medium');
  const [color, setColor] = useState<Color>('primary');
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2rem',
        padding: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* --- COLUMN 1: CONTROLS --- */}
      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#fcfcfc',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            borderBottom: '1px solid #eee',
            paddingBottom: '1rem',
          }}
        >
          Controls
        </h2>

        {/* --- Size Control --- */}
        <ControlGroup title="Size">
          <RadioWithLabel
            label="Small"
            name="size-control"
            checked={size === 'small'}
            onChange={() => setSize('small')}
          />
          <RadioWithLabel
            label="Medium"
            name="size-control"
            checked={size === 'medium'}
            onChange={() => setSize('medium')}
          />
          <RadioWithLabel
            label="Large"
            name="size-control"
            checked={size === 'large'}
            onChange={() => setSize('large')}
          />
        </ControlGroup>

        {/* --- Color Control --- */}
        <ControlGroup title="Color">
          <RadioWithLabel
            label="Primary"
            name="color-control"
            checked={color === 'primary'}
            onChange={() => setColor('primary')}
          />
          <RadioWithLabel
            label="Neutral"
            name="color-control"
            checked={color === 'neutral'}
            onChange={() => setColor('neutral')}
          />
        </ControlGroup>

        {/* --- Disabled Control --- */}
        <ControlGroup title="State">
          {/* We use a simple checkbox for this toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
            />
            Disabled
          </label>
        </ControlGroup>
      </div>

      {/* --- COLUMN 2: RESULT --- */}
      <div style={{ padding: '0 1.5rem' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
        >
          Interactive Result
        </h2>
        <p style={{ marginBottom: '2rem', color: '#555' }}>
          This radio group is now controlled by the settings on the left.
          Try hovering, clicking, and changing the controls.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RadioWithLabel
            label="Option One"
            name="functional-group"
            value="one"
            size={size}
            color={color}
            disabled={isDisabled}
            checked={functionalChoice === 'one'}
            onChange={() => setFunctionalChoice('one')}
          />
          <RadioWithLabel
            label="Option Two"
            name="functional-group"
            value="two"
            size={size}
            color={color}
            disabled={isDisabled}
            checked={functionalChoice === 'two'}
            onChange={() => setFunctionalChoice('two')}
          />
          <RadioWithLabel
            label="Option Three"
            name="functional-group"
            value="three"
            size={size}
            color={color}
            disabled={isDisabled}
            checked={functionalChoice === 'three'}
            onChange={() => setFunctionalChoice('three')}
          />
        </div>
        
        <p style={{ marginTop: '2rem', fontFamily: 'monospace', backgroundColor: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
          Current Selection: {functionalChoice}
        </p>
      </div>
    </div>
  );
};

export default RadioButtonDemo;
