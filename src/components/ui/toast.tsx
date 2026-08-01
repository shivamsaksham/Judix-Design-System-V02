'use client';
import React from 'react';
import toast, { Toaster, resolveValue } from 'react-hot-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Danger, Icon } from '@judix/icon';

const toastVariants = cva(
  "group pointer-events-auto flex w-full max-w-sm items-start gap-4 rounded-toast-border-radius-default border p-4 shadow-lg",
  {
    variants: {
      type: {
        loading: "bg-toast-color-error-bg border-toast-color-error-stroke",
        alert: "bg-toast-color-error-bg border-toast-color-error-stroke",
        success: "bg-toast-color-success-bg border-toast-color-success-stroke",
        notice: "bg-toast-color-warning-bg border-toast-color-warning-stroke",
        info: "bg-toast-color-info-bg border-toast-color-info-stroke",
      },
    },
    defaultVariants: {
      type: "info",
    }
  }
);

const toastIconVariants = cva(
  "h-6 w-6 shrink-0",
  {
    variants: {
      type: {
        loading: "text-gray-500 animate-spin",
        alert: "text-toast-color-error-icon",
        success: "text-toast-color-success-icon",
        notice: "text-toast-color-warning-icon",
        info: "",
      },
    },
    defaultVariants: {
      type: "info",
    }
  }
);

const toastTextVariants = cva(
  "text-toast-font-default font-size-body-default",
  {
    variants: {
      type: {
        loading: "text-toast-color-error-text",
        alert: "text-toast-color-error-text",
        success: "text-toast-color-success-text",
        notice: "text-toast-color-warning-text",
        info: "text-toast-color-info-text",
      }
    },
    defaultVariants: {
      type: "info",
    }
  }
);

const iconMap = {
  loading: Loader2,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alert: (props: React.SVGProps<SVGSVGElement>) => <Icon name="danger" {...props as any} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  success: (props: React.SVGProps<SVGSVGElement>) => <Icon name="tick-circle" {...props as any} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notice: (props: React.SVGProps<SVGSVGElement>) => <Icon name="danger" {...props as any} />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (props: React.SVGProps<SVGSVGElement>) => <Icon name="info-circle" {...props as any} />,
};

interface CustomToastProps extends VariantProps<typeof toastVariants> {
  title?: string;
  message: string;
  toastId: string;
  visible?: boolean;
}

const CustomToast: React.FC<CustomToastProps> = ({ type, title, message, visible }) => {
  const Icon = iconMap[type || 'info'];

  return (
    <div className={cn(
      toastVariants({ type }),
      "transition-all duration-500 ease-in-out transform",
      visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      <Icon className={cn(toastIconVariants({ type }))} />
      <div className="flex-1">
        {title && <p className={cn(toastTextVariants({ type }), "line-clamp-1 break-all")}>{title}</p>}
        <p className={cn(toastTextVariants({ type }), title && "mt-1", "line-clamp-2 break-all")}>{message}</p>
      </div>
    </div>
  );
};

export const showToast = {
  alert: (message: string, title?: string, duration: number = 4000) =>
    toast.custom((t) => <CustomToast toastId={t.id} type="alert" title={title} message={message} visible={t.visible} />, { duration }),
  success: (message: string, title?: string, duration: number = 4000) =>
    toast.custom((t) => <CustomToast toastId={t.id} type="success" title={title} message={message} visible={t.visible} />, { duration }),
  notice: (message: string, title?: string, duration: number = 4000) =>
    toast.custom((t) => <CustomToast toastId={t.id} type="notice" title={title} message={message} visible={t.visible} />, { duration }),
  info: (message: string, title?: string, duration: number = 4000) =>
    toast.custom((t) => <CustomToast toastId={t.id} type="info" title={title} message={message} visible={t.visible} />, { duration }),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: React.ReactElement | string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }
  ) => toast.promise(promise, messages),
};

export const ToastContainer = ({ position = 'top-center' }: { position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" }) => {
  return (
    <Toaster
      position={position}
      gutter={8}
      containerClassName="z-[9999]"
      toastOptions={{
        className: "",
        success: { className: "" },
        error: { className: "" },
        loading: { className: "" },
        blank: { className: "" },
      }}
    >
      {(t) => {
        if (t.type === 'custom') {
          return (
            <div className={cn(
              "transition-all duration-500 ease-in-out transform",
              t.visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            )}>
              {resolveValue(t.message, t)}
            </div>
          );
        }

        const getIcon = () => {
          if (t.type === 'loading') return <Loader2 className="h-6 w-6 shrink-0 text-gray-500 animate-spin" />;
          if (t.type === 'success') return <Icon name='tick-circle' className="h-6 w-6 shrink-0 text-toast-color-success-icon" />;
          if (t.type === 'error') return <Danger className="h-6 w-6 shrink-0 text-toast-color-warning-icon" />;
          return <AlertCircle className="h-6 w-6 shrink-0" />;
        };

        return (
          <div className={cn(
            "group flex w-full max-w-sm items-start gap-4 rounded-toast-border-radius-default border p-4 shadow-lg",
            "transition-all duration-500 ease-in-out transform",
            t.visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
            t.type === 'success' && "bg-toast-color-success-bg border-toast-color-success-stroke",
            t.type === 'error' && "bg-toast-color-alert-bg border-toast-color-error-stroke",
            t.type === 'loading' && "bg-toast-color-error-bg border-toast-color-error-stroke",
            t.type === 'blank' && "bg-toast-color-info-bg border-toast-color-info-stroke"
          )}>
            {getIcon()}
            <div className="flex-1">
              <p className={cn(
                "text-toast-font-default font-size-body-default line-clamp-2 break-all",
                t.type === 'success' && "text-toast-color-success-text",
                t.type === 'error' && "text-toast-color-error-text",
                t.type === 'loading' && "text-toast-color-error-text",
                t.type === 'blank' && "text-toast-color-info-text"
              )}>{t.message as React.ReactNode}</p>
            </div>
          </div>
        );
      }}
    </Toaster>
  );
};
