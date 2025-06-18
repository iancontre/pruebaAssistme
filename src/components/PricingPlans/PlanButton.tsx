import React from 'react';
import './PlanButton.css';

interface PlanButtonProps {
  text: string;
  variant: 'dark' | 'warning';
  onClick?: () => void;
}

const PlanButton: React.FC<PlanButtonProps> = ({ text, variant, onClick }) => {
  return (
    <button 
      className={`btn btn-${variant} btn-small mt-3`}
      onClick={onClick}
    >
      {text}
    </button> 
  );
};

export default PlanButton; 