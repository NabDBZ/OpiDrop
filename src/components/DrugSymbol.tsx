import React from 'react';

export type DrugSymbol = 
  | 'petri-dish'
  | 'leaf'
  | 'sun'
  | 'drop'
  | 'shield'
  | 'tube'
  | 'eye'
  | 'sunglasses'
  | 'stop'
  | 'triangle'
  | 'droplet'
  | 'wave';

type DrugSymbolProps = {
  symbol: DrugSymbol;
  className?: string;
};

export function DrugSymbol({ symbol, className = '' }: DrugSymbolProps) {
  const getSymbol = () => {
    switch (symbol) {
      case 'petri-dish': return '🧫';
      case 'leaf': return '🌿';
      case 'sun': return '☀️';
      case 'drop': return '💧';
      case 'shield': return '🛡️';
      case 'tube': return '🧴';
      case 'eye': return '👁️';
      case 'sunglasses': return '🕶️';
      case 'stop': return '🛑';
      case 'triangle': return '🔺';
      case 'droplet': return '💧';
      case 'wave': return '🌊';
      default: return '💊';
    }
  };

  return (
    <span className={`inline-block ${className}`} role="img" aria-label={symbol}>
      {getSymbol()}
    </span>
  );
}