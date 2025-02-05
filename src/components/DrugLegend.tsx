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
    <div className="glass-card p-3 sm:p-5 md:p-6 mb-4 sm:mb-6 rounded-xl">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-400" />
        <span className="text-sm sm:text-base md:text-lg font-semibold text-white">{t('drugList.categoryLegend')}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-3 md:gap-4">
        {symbols.map(({ symbol, category }) => {
          const colors = drugColors[category as keyof typeof drugColors];
          const isSelected = selectedCategories.includes(category);
          
          return (
            <div 
              key={symbol} 
              className="relative group min-h-[90px] sm:min-h-[140px] md:min-h-[160px]"
              data-category={category}
            >
              <div className={`glass-card p-2 sm:p-4 h-full rounded-lg transition-all duration-200 ${
                isSelected ? `${colors.bg} ${colors.text} shadow-lg` : 'hover:bg-white/10'
              }`}>
                {/* Checkmark Badge */}
                <div className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full transform transition-all duration-200 ${
                  isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}>
                  <div className={`absolute inset-0 ${colors.bg} border-2 border-white/20 rounded-full flex items-center justify-center shadow-lg`}>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center h-full">
                  <div className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-1.5 sm:mb-3 transition-colors ${
                    isSelected ? 'bg-white/20' : `${colors.bg}`
                  }`}>
                    <DrugSymbol symbol={symbol as any} className={`text-base sm:text-xl md:text-2xl ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  <div className="flex-1 flex flex-col justify-start min-h-0 max-h-full overflow-hidden">
                    <div className={`font-medium text-2xs sm:text-xs md:text-sm mb-0.5 sm:mb-1 line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {t(`categories.${category}`)}
                    </div>
                    <div className={`text-[8px] sm:text-2xs md:text-xs line-clamp-3 ${
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