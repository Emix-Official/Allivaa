import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ButtonProps } from '@/schemas';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      onClick,
      variant = 'primary',
      size = 'medium',
      icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      href,
      type = 'button',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      // Primary buttons now use black/white theme
      primary: 'bg-gradient-to-r from-emerald-600 to-cyan-500 text-white hover:from-emerald-700 hover:to-cyan-600 focus:ring-emerald-500',
      secondary: 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    };

    const sizeStyles = {
      small: 'px-3 py-1 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg',
    };

    const buttonClasses = clsx(baseStyles, variantStyles[variant], sizeStyles[size], className);

    const content = (
      <>
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {loading ? 'Loading...' : label}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={buttonClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} onClick={onClick} disabled={disabled || loading} className={buttonClasses} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
