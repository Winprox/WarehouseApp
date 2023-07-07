import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cm } from '../../utils';

export type TButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'text';
};

export const Button = forwardRef<HTMLButtonElement, TButton>(
  ({ className, variant = 'default', ...p }, ref) => (
    <button
      {...p}
      ref={ref}
      className={cm(
        'select-none transition-all disabled:cursor-not-allowed',
        'disabled:opacity-60 disabled:hover:opacity-60',
        variant === 'text' && 'hover:opacity-75',
        variant === 'default' && [
          'rounded-md px-2 shadow-md',
          'bg-primary text-white hover:opacity-80',
        ],
        className
      )}
    />
  )
);
