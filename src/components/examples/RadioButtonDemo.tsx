'use client';
import React, { useState } from 'react';
import RadioButton, { type RadioSize, type RadioColor } from '@/components/ui/radiobuttons';

const RadioButtonDemo: React.FC = () => {
  const [demoSize, setDemoSize] = useState<RadioSize>('medium');
  const [demoColor, setDemoColor] = useState<RadioColor>('primary');
  const [selectedOption, setSelectedOption] = useState<string>('option1');

  const containerStyle : React.CSSProperties = {
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: 'var(--primitives-color-base-100)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  };

  const headingStyle = {
    fontFamily: 'var(--primitives-font-family-poppins)',
    fontSize: 'var(--primitives-font-size-700)',
    fontWeight: 'var(--primitives-font-weight-bold)',
    color: 'var(--primitives-color-neutral-contrast-800)',
    marginBottom: '1rem',
  };

  const sectionStyle = {
    backgroundColor: 'var(--primitives-color-base-000)',
    padding: '1.5rem',
    borderRadius: 'var(--primitives-border-radius-lg)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  };

  const sectionTitleStyle = {
    fontFamily: 'var(--primitives-font-family-poppins)',
    fontSize: 'var(--primitives-font-size-400)',
    fontWeight: 'var(--primitives-font-weight-semibold)',
    color: 'var(--primitives-color-neutral-contrast-800)',
  };

  const labelStyle = {
    fontFamily: 'var(--primitives-font-family-poppins)',
    fontSize: 'var(--primitives-font-size-200)',
    color: 'var(--primitives-color-neutral-contrast-700)',
  };

  const buttonStyle = (active: boolean) => ({
    fontFamily: 'var(--primitives-font-family-poppins)',
    fontSize: 'var(--primitives-font-size-200)',
    padding: '0.375rem 0.75rem',
    borderRadius: 'var(--primitives-border-radius-sm)',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? 'var(--primitives-color-primary-400)' : 'var(--primitives-color-base-200)',
    color: active ? 'var(--primitives-color-base-000)' : 'var(--primitives-color-neutral-contrast-700)',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
  };

  const flexStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>RadioButton Demo</h1>

      {/* States Showcase */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>States</h2>
        <div style={gridStyle}>
          {[
            { label: 'Active / Checked', state: 'active', checked: true },
            { label: 'Hover (Simulated)', state: 'hover', checked: false },
            { label: 'Disabled Unchecked', state: 'disabled', checked: false },
            { label: 'Disabled Checked', state: 'disabled', checked: true },
          ].map(({ label, state, checked }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ ...labelStyle, fontWeight: 'var(--primitives-font-weight-medium)' }}>{label}</span>
              <RadioButton state={state as any} checked={checked} color="primary" />
            </div>
          ))}
        </div>
      </div>

      {/* Sizes Showcase */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Sizes</h2>
        <div style={flexStyle}>
          {['small', 'medium', 'large'].map((size) => (
            <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ ...labelStyle, fontWeight: 'var(--primitives-font-weight-medium)' }}>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
              <RadioButton size={size as RadioSize} checked />
            </div>
          ))}
        </div>
      </div>

      {/* Colors Showcase */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Colors</h2>
        <div style={flexStyle}>
          {['primary', 'neutral'].map((color) => (
            <div key={color} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ ...labelStyle, fontWeight: 'var(--primitives-font-weight-medium)' }}>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
              <RadioButton size="medium" checked color={color as RadioColor} />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demo */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Interactive Demo</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ ...labelStyle, fontWeight: 'var(--primitives-font-weight-medium)' }}>Select an option:</span>
          {['option1', 'option2', 'option3'].map((opt) => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <RadioButton
                size={demoSize}
                color={demoColor}
                checked={selectedOption === opt}
                onChange={() => setSelectedOption(opt)}
                name="interactive"
                value={opt}
              />
              <span style={labelStyle}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'not-allowed', opacity: 0.5 }}>
            <RadioButton size={demoSize} color={demoColor} disabled />
            <span style={labelStyle}>Disabled Option</span>
          </label>
        </div>

        <div style={flexStyle}>
          {/* Size buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ ...labelStyle, fontWeight: 'var(--primitives-font-weight-medium)' }}>Size</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['small', 'medium', 'large'] as RadioSize[]).map((size) => (
                <button key={size} style={buttonStyle(demoSize === size)} onClick={() => setDemoSize(size)}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Color buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ ...labelStyle, fontWeight: 'var(--primitives-font-weight-medium)' }}>Color</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['primary', 'neutral'] as RadioColor[]).map((color) => (
                <button key={color} style={buttonStyle(demoColor === color)} onClick={() => setDemoColor(color)}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <span style={{ ...labelStyle, fontSize: 'var(--primitives-font-size-100)', color: 'var(--primitives-color-neutral-mid-600)' }}>
          Selected: <span style={{ fontWeight: 'var(--primitives-font-weight-medium)' }}>{selectedOption}</span>
        </span>
      </div>
    </div>
  );
};

export default RadioButtonDemo;
