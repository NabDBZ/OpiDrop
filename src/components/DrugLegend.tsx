import React from 'react';
import { useTranslation } from 'react-i18next';
import { DrugSymbol } from './DrugSymbol';
import { Info } from 'lucide-react';

export function DrugLegend() {
  const { t } = useTranslation();

  const symbols = [
    { symbol: 'eye', label: 'Parasympathomimetics', description: 'Cholinergic medications', category: 'parasympathomimetics' },
    { symbol: 'sunglasses', label: 'Parasympatholytics', description: 'Pupil dilation drops', category: 'parasympatholytics' },
    { symbol: 'stop', label: 'Beta Blockers', description: 'Pressure-lowering drops', category: 'sympatholytics' },
    { symbol: 'triangle', label: 'Alpha Agonists', description: 'IOP-reducing drops', category: 'alpha_agonists' },
    { symbol: 'droplet', label: 'Carbonic Inhibitors', description: 'Aqueous suppressants', category: 'carbonic_inhibitors' },
    { symbol: 'wave', label: 'Prostaglandins', description: 'Outflow enhancers', category: 'prostaglandins' },
    { symbol: 'petri-dish', label: 'Antibiotics', description: 'Antibacterial medications', category: 'antibiotics' },
    { symbol: 'leaf', label: 'NSAIDs', description: 'Anti-inflammatory drugs', category: 'nsaids' },
    { symbol: 'sun', label: 'Corticosteroids', description: 'Steroid anti-inflammatory', category: 'corticosteroids' },
    { symbol: 'shield', label: 'Antihistamines', description: 'Allergy medications', category: 'antihistamines' }
  ] as const;

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="h-5 w-5 text-blue-400" />
        <span className="text-base font-semibold text-white">Medication Categories</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {symbols.map(({ symbol, label, description, category }) => (
          <div 
            key={symbol} 
            className="relative group"
            data-category={category}
          >
            <div className="glass-card p-4 hover:scale-105 transition-transform">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <DrugSymbol symbol={symbol as any} className="text-xl" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{label}</div>
                  <div className="text-xs text-white/60 mt-1">{description}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}