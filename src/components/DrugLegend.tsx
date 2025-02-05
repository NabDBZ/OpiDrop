import React from 'react';
import { useTranslation } from 'react-i18next';
import { DrugSymbol } from './DrugSymbol';
import { Info, Check } from 'lucide-react';
import { drugColors } from '../data/drugTypes';

type DrugLegendProps = {
  selectedCategories?: string[];
};

export function DrugLegend({ selectedCategories = [] }: DrugLegendProps) {
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
      <div className="flex items-center space-x-2 mb-4 sm:mb-5">
        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
        <span className="text-base sm:text-lg font-semibold text-white">{t('drugList.categoryLegend')}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {symbols.map(({ symbol, category }) => {
          const colors = drugColors[category as keyof typeof drugColors];
          const isSelected = selectedCategories.includes(category);
          
          return (
            <div 
              key={symbol} 
              className="relative group min-h-[130px] sm:min-h-[140px] md:min-h-[160px]"
              data-category={category}
            >
              <div className={`glass-card p-3 sm:p-4 h-full rounded-lg transition-all duration-200 ${
                isSelected ? `${colors.bg} ${colors.text} shadow-lg` : 'hover:bg-white/10'
              }`}>
                {/* Checkmark Badge */}
                <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full transform transition-all duration-200 ${
                  isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}>
                  <div className={`absolute inset-0 ${colors.bg} border-2 border-white/20 rounded-full flex items-center justify-center shadow-lg`}>
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center h-full">
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2.5 sm:mb-3 transition-colors ${
                    isSelected ? 'bg-white/20' : `${colors.bg}`
                  }`}>
                    <DrugSymbol symbol={symbol as any} className={`text-lg sm:text-xl md:text-2xl ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  <div className="flex-1 flex flex-col min-h-0 px-1 sm:px-2">
                    <div className={`font-medium text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5 break-words hyphens-auto ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {t(`categories.${category}`)}
                    </div>
                    <div className={`text-[11px] sm:text-xs md:text-sm break-words hyphens-auto ${
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