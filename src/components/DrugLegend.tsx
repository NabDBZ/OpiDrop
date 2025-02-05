import React from 'react';
import { useTranslation } from 'react-i18next';
import { DrugSymbol } from './DrugSymbol';
import { Info, Check } from 'lucide-react';
import { drugColors } from '../data/drugTypes';

type DrugLegendProps = {
  selectedCategories: string[];
};

export function DrugLegend({ selectedCategories }: DrugLegendProps) {
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
    <div className="glass-card p-3 sm:p-4 md:p-6 mb-6 sm:mb-8 rounded-xl">
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
        <span className="text-sm sm:text-base font-semibold text-white">{t('drugList.categoryLegend')}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {symbols.map(({ symbol, category }) => {
          const colors = drugColors[category as keyof typeof drugColors];
          const isSelected = selectedCategories.includes(category);
          
          return (
            <div 
              key={symbol} 
              className="relative group min-h-[100px] sm:min-h-[120px] md:min-h-[140px]"
              data-category={category}
            >
              <div className={`glass-card p-2 sm:p-3 md:p-4 h-full rounded-lg transition-all duration-200 ${
                isSelected ? `${colors.bg} ${colors.text} shadow-lg` : 'hover:bg-white/10'
              }`}>
                {/* Checkmark Badge */}
                <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full transform transition-all duration-200 ${
                  isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}>
                  <div className={`absolute inset-0 ${colors.bg} border-2 border-white/20 rounded-full flex items-center justify-center shadow-lg`}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center h-full">
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 sm:mb-2 transition-colors ${
                    isSelected ? 'bg-white/20' : `${colors.bg}`
                  }`}>
                    <DrugSymbol symbol={symbol as any} className={`text-sm sm:text-base md:text-xl ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className={`font-medium text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 break-words hyphens-auto ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {t(`categories.${category}`)}
                    </div>
                    <div className={`text-[8px] sm:text-[10px] md:text-xs break-words hyphens-auto ${
                      isSelected ? 'text-white/80' : 'text-white/60'
                    }`}>
                      {t(`drugList.categoryDescriptions.${category}`)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}