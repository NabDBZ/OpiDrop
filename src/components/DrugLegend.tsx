import React from 'react';
import { useTranslation } from 'react-i18next';
import { DrugSymbol } from './DrugSymbol';
import { Info } from 'lucide-react';

export function DrugLegend() {
  const { t } = useTranslation();

  const symbols = [
    { symbol: 'eye', category: 'parasympathomimetics' },
    { symbol: 'sunglasses', category: 'parasympatholytics' },
    { symbol: 'stop', category: 'sympatholytics' },
    { symbol: 'triangle', category: 'alpha_agonists' },
    { symbol: 'droplet', category: 'carbonic_inhibitors' },
    { symbol: 'wave', category: 'prostaglandins' },
    { symbol: 'petri-dish', category: 'antibiotics' },
    { symbol: 'leaf', category: 'nsaids' },
    { symbol: 'sun', category: 'corticosteroids' },
    { symbol: 'shield', category: 'antihistamines' }
  ] as const;

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Info className="h-5 w-5 text-blue-400" />
        <span className="text-base font-semibold text-white">{t('drugList.categoryLegend')}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {symbols.map(({ symbol, category }) => (
          <div 
            key={symbol} 
            className="relative group h-[140px]"
            data-category={category}
          >
            <div className="glass-card p-4 hover:scale-105 transition-transform h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3">
                  <DrugSymbol symbol={symbol as any} className="text-xl" />
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="font-medium text-white text-sm mb-1 line-clamp-1">{t(`categories.${category}`)}</div>
                  <div className="text-xs text-white/60 line-clamp-3">{t(`drugList.categoryDescriptions.${category}`)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}