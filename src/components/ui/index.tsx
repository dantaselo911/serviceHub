import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, style, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-normal cursor-pointer whitespace-nowrap select-none transition-none focus:outline-none active:translate-x-px active:translate-y-px disabled:opacity-50 disabled:pointer-events-none';

    const variants: Record<string, string> = {
      primary: 'win-btn win-btn-primary',
      secondary: 'win-btn',
      outline: 'win-btn',
      ghost: 'win-btn',
      danger: 'win-btn',
    };

    const sizes: Record<string, string> = {
      sm: 'text-xs px-3 py-1',
      md: 'text-xs px-4 py-1.5',
      lg: 'text-sm px-6 py-2',
      icon: 'p-1',
    };

    const dangerStyle =
      variant === 'danger'
        ? {
            background: '#d4000a',
            color: '#fff',
            borderTopColor: '#ff4444',
            borderLeftColor: '#ff4444',
            borderRightColor: '#880008',
            borderBottomColor: '#880008',
          }
        : {};

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ ...dangerStyle, ...style }}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-1 inline-block h-3 w-3 animate-spin border border-current border-t-transparent rounded-none" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export const Card = ({
  className,
  children,
  title,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
  [key: string]: any;
}) => (
  <div
    className={cn('win-panel overflow-hidden', className)}
    {...props}
  >
    {title && (
      <div className="win-titlebar">
        <span className="text-white text-xs font-bold truncate">{title}</span>
        <div className="flex items-center gap-0.5 ml-2">
          <button className="win-btn w-4 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Minimize">_</button>
          <button className="win-btn w-4 h-4 p-0 text-xs leading-none flex items-center justify-center" aria-label="Maximize">□</button>
          <button className="win-btn w-4 h-4 p-0 text-xs leading-none flex items-center justify-center font-bold" aria-label="Close" style={{ background: '#aa0000', color: '#fff' }}>✕</button>
        </div>
      </div>
    )}
    {children}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn('win-input w-full', className)}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Badge = ({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: { background: '#d4d0c8', color: '#000', border: '1px solid #808080' },
    success: { background: '#004000', color: '#00ff00', border: '1px solid #006000' },
    warning: { background: '#804000', color: '#ffcc00', border: '1px solid #aa6600' },
    danger: { background: '#800000', color: '#ff8080', border: '1px solid #aa0000' },
    info: { background: '#000080', color: '#80c0ff', border: '1px solid #0000aa' },
  };

  return (
    <span
      className={cn('inline-flex items-center px-2 py-0 text-xs font-bold', className)}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
};
