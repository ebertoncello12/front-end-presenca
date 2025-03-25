import React from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';
type SkeletonSize = 'sm' | 'md' | 'lg';

interface SkeletonProps {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const getVariantClasses = (variant: SkeletonVariant, size: SkeletonSize) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8'
  };

  switch (variant) {
    case 'circular':
      return `${baseClasses} rounded-full ${sizeClasses[size]}`;
    case 'rectangular':
      return `${baseClasses} rounded`;
    case 'card':
      return `${baseClasses} rounded-lg p-4`;
    case 'table-row':
      return `${baseClasses} rounded h-12`;
    case 'text':
    default:
      return `${baseClasses} rounded ${sizeClasses[size]}`;
  }
};

const SkeletonLoader: React.FC<SkeletonProps> = ({
  variant = 'text',
  size = 'md',
  width,
  height,
  className = '',
  count = 1
}) => {
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height,
  };

  const variantClasses = getVariantClasses(variant, size);
  const finalClasses = `${variantClasses} ${className}`;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={finalClasses}
          style={style}
          role="status"
          aria-label="loading"
        />
      ))}
    </>
  );
};

export default SkeletonLoader;