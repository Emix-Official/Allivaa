import React from 'react';
import clsx from 'clsx';
import Button from './Button';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  alignment?: 'left' | 'center' | 'right';
  minHeight?: string;
  accessibilityDescription?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  alignment = 'center',
  minHeight = 'min-h-96',
  accessibilityDescription,
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <section
      className={clsx(
        'relative w-full overflow-hidden transition-all duration-300',
        minHeight,
        'flex items-center justify-center'
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(79, 70, 229, 0.6), rgba(20, 184, 166, 0.6)), url('${backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {
              background: 'linear-gradient(135deg, #4f46e5 0%, #14b8a6 100%)',
            }
      }
      aria-label={accessibilityDescription || `${title} - ${subtitle}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={alignmentClasses[alignment]}>
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className={clsx('flex flex-col sm:flex-row gap-4', alignment === 'center' && 'justify-center')}>
              {primaryCTA && (
                <Button label={primaryCTA.label} href={primaryCTA.href} variant="primary" size="large" />
              )}
              {secondaryCTA && (
                <Button label={secondaryCTA.label} href={secondaryCTA.href} variant="secondary" size="large" />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
