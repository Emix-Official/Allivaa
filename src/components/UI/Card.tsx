import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { CardProps } from '@/schemas';

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      description,
      icon,
      image,
      link,
      onClick,
      variant = 'default',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'rounded-lg border transition-all duration-200 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

    const variantStyles = {
      default: 'border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 hover:shadow-lg',
      highlight:
        'border-indigo-500 bg-white dark:bg-slate-800 dark:border-indigo-600 hover:shadow-xl hover:border-indigo-400',
      minimal: 'border-transparent bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    };

    const cardClasses = clsx(baseStyles, variantStyles[variant], disabled && 'opacity-50', className);

    const innerContent = (
      <div className="p-6 h-full flex flex-col">
        {/* Icon or Image */}
        {icon && (
          <div className="text-4xl mb-4">
            {typeof icon === 'string' ? icon : React.createElement(icon, { className: 'w-8 h-8' })}
          </div>
        )}
        {image && (
          <div className="w-full h-40 mb-4 bg-indigo-100 dark:bg-slate-700 rounded flex items-center justify-center overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{title}</h3>

  {description && <p className="text-black/70 dark:text-white/70 text-sm flex-grow">{description}</p>}
      </div>
    );

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            onClick();
          }
        }}
        {...props}
      >
        {link ? (
          <Link href={link} className="block h-full">
            {innerContent}
          </Link>
        ) : innerContent}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
