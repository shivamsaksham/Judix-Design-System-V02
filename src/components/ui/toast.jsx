'use client';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { AlertTriangle, CheckCircle, Info, AlertCircle, Loader2 } from 'lucide-react';

// Animation for the loading spinner icon
const animationStyle = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

/**
 * CustomToast Component
 * A responsive toast notification component.
 * It adapts its width to the screen size: nearly full-width on mobile for readability, 
 * and content-width on larger screens.
 */
const CustomToast = ({ type, message }) => {
  // Configuration for different toast types (icon and color)
  const config = {
    loading: {
      icon: Loader2,
      iconColor: 'var(--primitives-color-neutral-mid-600)',
    },
    alert: {
      icon: AlertTriangle,
      iconColor: 'var(--primitives-color-semantic-red-400)',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'var(--primitives-color-semantic-green-400)',
    },
    notice: {
      icon: AlertCircle,
      iconColor: 'var(--primitives-color-semantic-orange-400)',
    },
    info: {
      icon: Info,
      iconColor: 'var(--primitives-color-semantic-blue-400)',
    },
  };

  const { icon: Icon, iconColor } = config[type];

  return (
    <div
      className="flex items-center gap-3 w-[90vw] max-w-sm p-4 sm:w-auto"
      style={{
        minHeight: '42px',
        backgroundColor: 'var(--primitives-color-base-000)',
        border: `var(--primitives-border-weight-sm) solid var(--primitives-color-neutral-light-300)`,
        borderRadius: 'var(--primitives-border-radius-sm)',
        boxShadow: '0 4px 12px -1px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        fontFamily: 'var(--primitives-font-family-satoshi)',
      }}
    >
      <Icon
        size={20}
        color={iconColor}
        style={type === 'loading' ? { animation: 'spin 1s linear infinite' } : {}}
      />
      <span
        className="text-sm font-medium"
        style={{
          color: 'var(--primitives-color-neutral-contrast-800)',
          lineHeight: 'var(--primitives-font-height-300)',
        }}
      >
        {message}
      </span>
    </div>
  );
};

export const showToast = {
  alert: (message) => toast.custom((t) => <CustomToast type="alert" message={message} />, { duration: 4000 }),
  success: (message) => toast.custom((t) => <CustomToast type="success" message={message} />, { duration: 4000 }),
  notice: (message) => toast.custom((t) => <CustomToast type="notice" message={message} />, { duration: 4000 }),
  info: (message) => toast.custom((t) => <CustomToast type="info" message={message} />, { duration: 4000 }),
  promise: (promise, messages) => {
    toast.promise(promise, messages);
  },
};

export const ToastContainer = ({ position = 'top-center' }) => {
  return (
    <Toaster
      position={position}
      toastOptions={{
        style: {
          background: 'var(--primitives-color-base-000)',
          border: 'var(--primitives-border-weight-sm) solid var(--primitives-color-neutral-light-300)',
          borderRadius: 'var(--primitives-border-radius-sm)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '8px 16px',
          fontFamily: 'var(--primitives-font-family-satoshi)',
          color: 'var(--primitives-color-neutral-contrast-800)',
          fontSize: 'var(--primitives-font-size-100)',
          fontWeight: 400,
        },
        success: {
          iconTheme: {
            primary: 'var(--primitives-color-semantic-green-400)',
            secondary: 'var(--primitives-color-base-000)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--primitives-color-semantic-red-400)',
            secondary: 'var(--primitives-color-base-000)',
          },
        },
      }}
    />
  );
};