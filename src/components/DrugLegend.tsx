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
    <div className="glass-card p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 rounded-xl">
      <div className="flex items-center space-x-3 mb-5 sm:mb-6">
        <Info className="h-6 w-6 sm:h-7 sm:w-7 text-blue-400" />
        <span className="text-lg sm:text-xl font-semibold text-white">{t('drugList.categoryLegend')}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {symbols.map(({ symbol, category }) => {
          const colors = drugColors[category as keyof typeof drugColors];
          const isSelected = selectedCategories.includes(category);
          
          return (
            <div 
              key={symbol} 
              className="relative group min-h-[150px] sm:min-h-[160px] md:min-h-[180px]"
              data-category={category}
            >
              <div className={`glass-card p-4 sm:p-5 h-full rounded-lg transition-all duration-200 ${
                isSelected ? `${colors.bg} ${colors.text} shadow-lg` : 'hover:bg-white/10'
              }`}>
                {/* Checkmark Badge */}
                <div className={`absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full transform transition-all duration-200 ${
                  isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}>
                  <div className={`absolute inset-0 ${colors.bg} border-2 border-white/20 rounded-full flex items-center justify-center shadow-lg`}>
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center h-full">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-colors ${
                    isSelected ? 'bg-white/20' : `${colors.bg}`
                  }`}>
                    <DrugSymbol symbol={symbol as any} className={`text-xl sm:text-2xl md:text-3xl ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  <div className="flex-1 flex flex-col min-h-0 px-2 sm:px-3">
                    <div className={`font-medium text-sm sm:text-base md:text-lg mb-2 break-words hyphens-auto ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {t(`categories.${category}`)}
                    </div>
                    <div className={`text-xs sm:text-sm md:text-base break-words hyphens-auto ${
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