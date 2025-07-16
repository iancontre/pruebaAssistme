import React from 'react';
import { LoadingProps } from '../../types';
import './LoadingSpinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  text = 'Cargando...'
}) => {
  return (
    <div 
      className={`loading-spinner loading-spinner--${size} loading-spinner--${color}`}
      role="status"
      aria-label={text}
    >
      <div className="spinner" aria-hidden="true"></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export const LoadingWrapper: React.FC<LoadingProps> = ({ 
  isLoading, 
  children, 
  fallback,
  className = '',
  'data-testid': testId
}) => {
  if (isLoading) {
    return (
      <div className={`loading-wrapper ${className}`} data-testid={testId}>
        {fallback || <LoadingSpinner text="Cargando..." />}
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingSpinner; 