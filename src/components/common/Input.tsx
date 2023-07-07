import { InputHTMLAttributes, forwardRef } from 'react';
import { cm } from '../../utils';

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...p }, ref) => (
  <input
    {...p}
    ref={ref}
    className={cm(
      'h-6 rounded-md pl-1',
      'border-2 border-controlStroke',
      'disabled:cursor-not-allowed disabled:bg-white disabled:opacity-75',
      className
    )}
  />
));
