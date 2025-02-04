import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrugType, drugColors } from '../data/drugTypes';
import { DrugSymbol } from './DrugSymbol';
import { Check, Plus, ChevronDown, ChevronUp, List, FlaskRound as Flask } from 'lucide-react';
import { useVirtualizedList } from '../utils/renderOptimizations';
import { performanceOptimizations } from '../utils/performanceOptimizations';

type DrugCategoryListProps = {
  drugs: DrugType[];
  selectedCategory: string | null;
  onDrugSelect: (drug: DrugType) => void;
  selectedDrugs: DrugType[];
};

export function DrugCategoryList({ drugs, selectedCategory, onDrugSelect, selectedDrugs }: DrugCategoryListProps) {
  const { t } = useTranslation();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAllDrugs, setShowAllDrugs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize grouped drugs
  const groupedDrugs = React.useMemo(() => {
    return drugs.reduce((acc, drug) => {
      if (!acc[drug.effect]) {
        acc[drug.effect] = [];
      }
      acc[drug.effect].push(drug);
      return acc;
    }, {} as Record<string, DrugType[]>);
  }, [drugs]);

  // Memoize sorted categories
  const categories = React.useMemo(() => {
    return Object.keys(groupedDrugs).sort((a, b) => 
      t(`categories.${a}`).localeCompare(t(`categories.${b}`))
    );
  }, [groupedDrugs, t]);

  // Optimized category toggle
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // Optimized drug selection
  const handleDrugSelect = useCallback((drug: DrugType) => {
    performanceOptimizations.debounceWithRAF(() => onDrugSelect(drug))();
  }, [onDrugSelect]);

  // Virtual list configuration for all drugs view
  const { 
    containerStyle, 
    contentStyle, 
    visibleItems 
  } = useVirtualizedList({
    items: drugs,
    itemHeight: 100,
    containerHeight: 600,
    overscan: 2
  });

  // Render drug card with memoization
  const DrugCard = React.memo(({ drug }: { drug: DrugType }) => {
    const colors = drugColors[drug.effect];
    const isSelected = selectedDrugs.some(d => d.id === drug.id);
    
    return (
      <button
        onClick={() => handleDrugSelect(drug)}
        className={`group relative w-full p-4 rounded-lg border transition-gpu text-left backdrop-blur-sm animate-gpu
          ${isSelected 
            ? `${colors.bg} border-2 ${colors.text} shadow-lg` 
            : 'border-white/10 hover:border-white/20 hover:shadow-lg bg-white/5'}`}
      >
        <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-lg transform transition-gpu duration-200 ${
          isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}>
          <div className={`absolute inset-0 ${colors.bg} rounded-lg flex items-center justify-center`}>
            <Check className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
            <DrugSymbol symbol={drug.symbol} className="text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-white truncate">{drug.name}</h3>
            {drug.brandName && (
              <p className="text-sm text-white/60 truncate">{drug.brandName}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                {drug.concentration}
              </span>
              <span className="flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/80">
                <Flask className="w-3 h-3 mr-1" />
                {t(`drugTypes.${drug.type}`)}
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  });

  return (
    <div className="glass-card border-0 p-6" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{t('drugList.title')}</h2>
        <button
          onClick={() => setShowAllDrugs(!showAllDrugs)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <List className="w-5 h-5" />
          <span>{showAllDrugs ? t('drugList.showCategories') : t('drugList.showAllDrugs')}</span>
        </button>
      </div>

      {showAllDrugs ? (
        <div style={containerStyle}>
          <div style={contentStyle}>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map(({ item: drug, style }) => (
                <div key={drug.id} style={style}>
                  <DrugCard drug={drug} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(category => {
            const categoryDrugs = groupedDrugs[category];
            const colors = drugColors[category as keyof typeof drugColors];
            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="glass-card">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg}`}>
                      <DrugSymbol symbol={categoryDrugs[0].symbol} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {t(`categories.${category}`)}
                      </h3>
                      <p className="text-sm text-white/60">
                        {categoryDrugs.length} medications
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-white/10">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      {categoryDrugs.map(drug => (
                        <DrugCard key={drug.id} drug={drug} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}