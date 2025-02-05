import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, RefreshCw, Filter, Clock, Calendar as CalendarIcon, AlertCircle, Check, Eye, EyeOff, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { drugDatabase } from '../data/drugDatabase';
import { DrugType, drugColors } from '../data/drugTypes';
import { Calendar } from '../components/Calendar';
import { DrugCategoryList } from '../components/DrugCategoryList';
import { DrugLegend } from '../components/DrugLegend';
import { calculateDrugSequence } from '../utils/drugSequencing';
import { DrugSequenceSummary } from '../components/DrugSequenceSummary';
import { DrugSymbol } from '../components/DrugSymbol';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../utils/localStorage';
import styles from './CalendarTool.module.css';

export default function CalendarTool() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilteredDrugs, setShowFilteredDrugs] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugType[]>(() => 
    loadFromLocalStorage<DrugType[]>(STORAGE_KEYS.SELECTED_DRUGS, [])
  );
  const [startDate, setStartDate] = useState<Date>(() => {
    const savedDate = loadFromLocalStorage<string | null>(STORAGE_KEYS.START_DATE, null);
    return savedDate ? new Date(savedDate) : new Date();
  });
  const [selectedStartDate, setSelectedStartDate] = useState(startDate.toISOString().split('T')[0]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [drugStartDates, setDrugStartDates] = useState(() => 
    loadFromLocalStorage<Record<string, string>>(STORAGE_KEYS.DRUG_START_DATES, {})
  );
  const [customSchedules, setCustomSchedules] = useState(() => 
    loadFromLocalStorage<Record<string, { frequency: number; interval: number; startTime: string }>>(
      STORAGE_KEYS.CUSTOM_SCHEDULES, 
      {}
    )
  );
  const [treatmentDurations, setTreatmentDurations] = useState(() => 
    loadFromLocalStorage<Record<string, number>>(STORAGE_KEYS.TREATMENT_DURATIONS, {})
  );
  const [selectedSchedules, setSelectedSchedules] = useState(() => 
    loadFromLocalStorage<Record<string, string>>(STORAGE_KEYS.SELECTED_SCHEDULES, {})
  );
  const [isCalendarGenerated, setIsCalendarGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SELECTED_DRUGS, selectedDrugs);
  }, [selectedDrugs]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CUSTOM_SCHEDULES, customSchedules);
  }, [customSchedules]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.TREATMENT_DURATIONS, treatmentDurations);
  }, [treatmentDurations]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SELECTED_SCHEDULES, selectedSchedules);
  }, [selectedSchedules]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.START_DATE, startDate.toISOString());
  }, [startDate]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.DRUG_START_DATES, drugStartDates);
  }, [drugStartDates]);

  const scheduleOptions = [
    { value: 'once', label: t('calendar.schedules.once') },
    { value: 'twice', label: t('calendar.schedules.twice') },
    { value: 'three', label: t('calendar.schedules.three') },
    { value: 'four', label: t('calendar.schedules.four') },
    { value: 'custom', label: t('calendar.schedules.custom') }
  ];

  const durationOptions = [1, 2, 3, 4, 6, 8, 12].map(weeks => ({
    value: weeks * 7,
    label: `${weeks} ${weeks === 1 ? t('calendar.schedules.week') : t('calendar.schedules.weeks')}`
  }));

  const drugCategories = [
    { value: 'parasympathomimetics', label: t('categories.parasympathomimetics') },
    { value: 'parasympatholytics', label: t('categories.parasympatholytics') },
    { value: 'sympatholytics', label: t('categories.sympatholytics') },
    { value: 'alpha_agonists', label: t('categories.alpha_agonists') },
    { value: 'carbonic_inhibitors', label: t('categories.carbonic_inhibitors') },
    { value: 'prostaglandins', label: t('categories.prostaglandins') },
    { value: 'antibiotics', label: t('categories.antibiotics') },
    { value: 'nsaids', label: t('categories.nsaids') },
    { value: 'corticosteroids', label: t('categories.corticosteroids') },
    { value: 'antihistamines', label: t('categories.antihistamines') }
  ];

  const handleDurationChange = (drugId: string, duration: number) => {
    setTreatmentDurations(prev => ({
      ...prev,
      [drugId]: duration
    }));
  };

  const handleScheduleChange = (drugId: string, scheduleType: string) => {
    setSelectedSchedules(prev => ({
      ...prev,
      [drugId]: scheduleType
    }));

    if (scheduleType === 'custom') {
      handleCustomScheduleChange(drugId, {
        frequency: 4,
        interval: 6,
        startTime: '08:00'
      });
    } else {
      setCustomSchedules(prev => {
        const { [drugId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleCustomScheduleChange = (drugId: string, schedule: Partial<{ frequency: number; interval: number; startTime: string }>) => {
    setCustomSchedules(prev => {
      const current = prev[drugId] || { frequency: 4, interval: 6, startTime: '08:00' };
      return {
        ...prev,
        [drugId]: { ...current, ...schedule }
      };
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    setSelectedStartDate(inputDate);
    
    // Validate the date
    const newDate = new Date(inputDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(newDate.getTime())) {
      setDateError(t('calendar.errors.invalidDate'));
      return;
    }

    if (newDate < today) {
      setDateError(t('calendar.errors.pastDate'));
      return;
    }

    setDateError(null);
    setStartDate(newDate);
  };

  const handleDrugStartDateChange = (drugId: string, date: string) => {
    const newDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(newDate.getTime())) {
      setDateError(t('calendar.errors.invalidDate'));
      return;
    }

    if (newDate < today) {
      setDateError(t('calendar.errors.pastDate'));
      return;
    }

    setDateError(null);
    setDrugStartDates(prev => ({
      ...prev,
      [drugId]: date
    }));
  };

  const handleGenerateCalendar = async () => {
    if (dateError) {
      return;
    }
    const selectedDate = new Date(selectedStartDate + 'T00:00:00');
    setStartDate(selectedDate);
    setIsGenerating(true);
    try {
      await generateCalendar();
    } catch (error) {
      console.error('Error generating calendar:', error);
      setDateError(t('calendar.errors.generationError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCalendar = async () => {
    // Implementation of generateCalendar function
    setIsCalendarGenerated(true);
  };

  const handleReset = () => {
    setSelectedDrugs([]);
    setCustomSchedules({});
    setTreatmentDurations({});
    setSelectedSchedules({});
    setDrugStartDates({});
    setIsCalendarGenerated(false);
    saveToLocalStorage(STORAGE_KEYS.SELECTED_DRUGS, []);
    saveToLocalStorage(STORAGE_KEYS.CUSTOM_SCHEDULES, {});
    saveToLocalStorage(STORAGE_KEYS.TREATMENT_DURATIONS, {});
    saveToLocalStorage(STORAGE_KEYS.SELECTED_SCHEDULES, {});
    saveToLocalStorage(STORAGE_KEYS.DRUG_START_DATES, {});
  };

  const filteredDrugs = useMemo(() => {
    return drugDatabase
      .filter(drug => {
        const matchesSearch = searchQuery.toLowerCase() === '' ||
          drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (drug.brandName && drug.brandName.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(drug.effect);
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // First sort by category
        const categoryCompare = a.effect.localeCompare(b.effect);
        if (categoryCompare !== 0) return categoryCompare;
        
        // Then sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
  }, [searchQuery, selectedCategories]);

  const handleDrugSelect = (drug: DrugType) => {
    setSelectedDrugs(prev => {
      const isSelected = prev.some(d => d.id === drug.id);
      if (isSelected) {
        // When removing a drug, also clean up its associated data
        const newDrugs = prev.filter(d => d.id !== drug.id);
        setCustomSchedules(prev => {
          const { [drug.id]: _, ...rest } = prev;
          return rest;
        });
        setTreatmentDurations(prev => {
          const { [drug.id]: _, ...rest } = prev;
          return rest;
        });
        setSelectedSchedules(prev => {
          const { [drug.id]: _, ...rest } = prev;
          return rest;
        });
        return newDrugs;
      }
      return [...prev, drug];
    });
  };

  const sequencedDrugsWithNumbers = useMemo(() => {
    const drugsWithStartDates = selectedDrugs.map(drug => ({
      ...drug,
      startDate: drugStartDates[drug.id] || selectedStartDate
    }));
    const sequencedDrugs = calculateDrugSequence(drugsWithStartDates);
    return sequencedDrugs.map((drug, index) => ({
      ...drug,
      posology: selectedSchedules[drug.id] || drug.standardPosology,
      duration: treatmentDurations[drug.id] || 14,
      sequenceNumber: index + 1,
      customSchedule: customSchedules[drug.id]
    }));
  }, [selectedDrugs, customSchedules, treatmentDurations, selectedSchedules, drugStartDates, selectedStartDate]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="glass-button inline-flex items-center px-2 sm:px-3 py-2 rounded-lg">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
              <span className="md:inline hidden">{t('common.back')}</span>
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
              {t('calendar.title')}
            </h1>
            <div className="w-8 sm:w-10 md:hidden"></div>
          </div>
        </div>

        {/* Search and Filter Section - Mobile Optimized */}
        <div className="glass-card mb-4 sm:mb-6 md:sticky md:top-0 backdrop-blur-sm">
          <div className="p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3">
            {/* Mobile Search and Filter */}
            <div className="md:hidden flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/50" />
                <input
                  type="text"
                  placeholder={t('calendar.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input w-full h-8 sm:h-9 pl-8 sm:pl-10 pr-3 sm:pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder-white/50 bg-white/5 text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/50" />
                <select
                  value=""
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedCategories(prev => 
                        prev.includes(value) 
                          ? prev.filter(cat => cat !== value)
                          : [...prev, value]
                      );
                    }
                  }}
                  className="glass-input w-full h-8 sm:h-9 pl-8 sm:pl-10 pr-6 sm:pr-8 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white bg-white/5 text-sm"
                >
                  <option value="">{selectedCategories.length === 0 ? t('calendar.allCategories') : `${selectedCategories.length} categories selected`}</option>
                  {drugCategories.map(category => {
                    const isSelected = selectedCategories.includes(category.value);
                    return (
                      <option 
                        key={category.value} 
                        value={category.value}
                        className={isSelected ? 'bg-blue-500/20' : ''}
                      >
                        {isSelected ? `✓ ${category.label}` : category.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Desktop Search and Filter */}
            <div className="hidden md:flex md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  placeholder={t('calendar.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder-white/50 bg-white/5"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <select
                    value=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        setSelectedCategories(prev => 
                          prev.includes(value) 
                            ? prev.filter(cat => cat !== value)
                            : [...prev, value]
                        );
                      }
                    }}
                    className="glass-input pl-10 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white bg-white/5"
                  >
                    <option value="">{selectedCategories.length === 0 ? t('calendar.allCategories') : `${selectedCategories.length} categories selected`}</option>
                    {drugCategories.map(category => {
                      const isSelected = selectedCategories.includes(category.value);
                      return (
                        <option 
                          key={category.value} 
                          value={category.value}
                          className={isSelected ? 'bg-blue-500/20' : ''}
                        >
                          {isSelected ? `✓ ${category.label}` : category.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {(searchQuery || selectedCategories.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories([]);
                    }}
                    className="glass-button p-2 rounded-lg bg-white/5"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Count and Controls */}
            {(searchQuery || selectedCategories.length > 0) && (
              <div className="flex items-center justify-between text-xs sm:text-sm text-white/60 mt-1">
                <div>
                  {filteredDrugs.length === 0 ? (
                    t('drugList.noResults')
                  ) : (
                    t('drugList.resultsFound', {
                      count: filteredDrugs.length,
                      medication: filteredDrugs.length === 1 ? t('drugList.medication') : t('drugList.medications')
                    })
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilteredDrugs(!showFilteredDrugs)}
                    className="glass-button px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-white/10"
                  >
                    {showFilteredDrugs ? (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Hide Results</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="hidden sm:inline">Show Results</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories([]);
                    }}
                    className="glass-button px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-white/10 text-red-400"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <div onClick={(e) => {
            const category = (e.target as HTMLElement).closest('[data-category]')?.getAttribute('data-category');
            if (category) {
              setActiveCategoryFilter(prev => prev === category ? null : category);
              if (!selectedCategories.includes(category)) {
                setSelectedCategories(prev => [...prev, category]);
              }
            }
          }}>
            <DrugLegend selectedCategories={selectedCategories} />
          </div>

          {activeCategoryFilter && showFilteredDrugs && (
            <div className="mt-4 glass-card p-4 rounded-lg animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-medium text-white">
                    {selectedCategories.length === 0 
                      ? t('drugList.allCategories')
                      : selectedCategories.map(cat => t(`categories.${cat}`)).join(', ')}
                  </h3>
                  <span className="text-xs text-white/60">
                    {filteredDrugs.filter(drug => selectedCategories.length === 0 || selectedCategories.includes(drug.effect)).length} {t('drugList.medications')}
                  </span>
                </div>
                <button
                  onClick={() => setActiveCategoryFilter(null)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Vertical Scrolling Menu */}
              <div className="relative">
                <div className={`overflow-y-auto max-h-[60vh] pr-2 ${styles.hideScrollbar}`}>
                  <div className="space-y-3">
                    {filteredDrugs
                      .filter(drug => selectedCategories.length === 0 || selectedCategories.includes(drug.effect))
                      .map(drug => {
                        const colors = drugColors[drug.effect];
                        const isSelected = selectedDrugs.some(d => d.id === drug.id);
                        
                        return (
                          <button
                            key={drug.id}
                            onClick={() => handleDrugSelect(drug)}
                            className={`group relative w-full p-3 rounded-lg border transition-gpu backdrop-blur-sm animate-gpu
                              ${isSelected 
                                ? `${colors.bg} border-2 ${colors.text} shadow-lg` 
                                : 'border-white/10 hover:border-white/20 hover:shadow-lg bg-white/5'}`}
                          >
                            <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full transform transition-all duration-200 ${
                              isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                            }`}>
                              <div className={`absolute inset-0 ${colors.bg} border-2 border-white/20 rounded-full flex items-center justify-center shadow-lg`}>
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${isSelected ? 'bg-white/20' : colors.bg}`}>
                                <DrugSymbol symbol={drug.symbol} className={`text-base ${isSelected ? 'text-white' : ''}`} />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <h3 className="text-sm font-medium text-white truncate">{drug.name}</h3>
                                {drug.brandName && (
                                  <p className="text-xs text-white/60 truncate">{drug.brandName}</p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-1">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                                    {drug.concentration}
                                  </span>
                                  <span className="flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/80">
                                    {t(`drugTypes.${drug.type}`)}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                                    {t(`categories.${drug.effect}`)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
                
                {/* Fade edges to indicate scrolling */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <div className="glass-card p-2 sm:p-3 mb-4">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {drugCategories.map(category => {
                const colors = drugColors[category.value as keyof typeof drugColors];
                const isSelected = selectedCategories.includes(category.value);
                const categoryDrug = drugDatabase.find(drug => drug.effect === category.value);
                const defaultSymbol = drugDatabase[0]?.symbol || 'A';
                const symbol = categoryDrug?.symbol || defaultSymbol;
                
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategories(prev => 
                      prev.includes(category.value) 
                        ? prev.filter(cat => cat !== category.value)
                        : [...prev, category.value]
                    )}
                    className={`relative p-1.5 sm:p-2 rounded-lg transition-all flex flex-col items-center ${
                      isSelected 
                        ? `${colors.bg} ${colors.text} shadow-lg` 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {/* Checkmark Badge */}
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full transform transition-all duration-200 ${
                      isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                    }`}>
                      <div className={`absolute inset-0 ${colors.bg} border-2 border-white/20 rounded-full flex items-center justify-center shadow-lg`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mb-1 sm:mb-2 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : colors.bg
                    }`}>
                      <DrugSymbol symbol={symbol} className={`text-base sm:text-lg ${isSelected ? 'text-white' : ''}`} />
                    </div>
                    <div className={`text-[10px] sm:text-xs font-medium text-center leading-tight h-6 sm:h-8 flex items-center justify-center px-0.5 sm:px-1 ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {category.label.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Drugs List - Mobile */}
          {showFilteredDrugs && filteredDrugs.length > 0 && selectedCategories.length > 0 && (
            <div className="glass-card p-2 sm:p-3 mb-4">
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {filteredDrugs.map(drug => {
                  const colors = drugColors[drug.effect];
                  const isSelected = selectedDrugs.some(d => d.id === drug.id);
                  
                  return (
                    <button
                      key={drug.id}
                      onClick={() => handleDrugSelect(drug)}
                      className={`flex items-center p-2 sm:p-3 rounded-lg transition-all ${
                        isSelected 
                          ? `${colors.bg} ${colors.text} shadow-lg` 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white/20' : colors.bg
                      }`}>
                        <DrugSymbol symbol={drug.symbol} className="text-base sm:text-lg" />
                      </div>
                      <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-white truncate">
                          {drug.name}
                        </div>
                        {drug.brandName && (
                          <div className="text-[10px] sm:text-xs text-white/60 truncate">
                            {drug.brandName}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selectedDrugs.length > 0 && (
          <>
            <div className="glass-card mb-4 sm:mb-6">
              <div className="p-2 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                  <h2 className="text-base sm:text-lg font-semibold text-white">
                    {t('calendar.selectedMedications')}
                  </h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <input
                        type="date"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                        className={`glass-input w-full pl-8 pr-2 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                          dateError ? 'ring-2 ring-red-500/50' : 'focus:ring-blue-500/50'
                        } text-white`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {dateError && (
                        <div className="absolute -bottom-5 left-0 text-xs text-red-400">
                          {dateError}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleGenerateCalendar}
                        className={`glass-button flex-1 sm:flex-none px-3 py-1.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          dateError ? 'opacity-50 cursor-not-allowed' : 
                          isCalendarGenerated ? 'bg-green-500/20 hover:bg-green-500/30' :
                          isGenerating ? 'bg-blue-500/20' : 'hover:bg-white/10'
                        } group text-sm`}
                        disabled={!!dateError || isGenerating}
                      >
                        {isGenerating ? (
                          <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
                        ) : isCalendarGenerated ? (
                          <>
                            <Check className="h-4 w-4 mr-1.5 text-green-400 group-hover:hidden" />
                            <RefreshCw className="h-4 w-4 mr-1.5 hidden group-hover:block" />
                          </>
                        ) : (
                          <CalendarIcon className="h-4 w-4 mr-1.5" />
                        )}
                        <span>
                          {isGenerating 
                            ? "Generating..."
                            : isCalendarGenerated 
                              ? "Update Calendar"
                              : "Generate Calendar"
                          }
                        </span>
                      </button>
                      {isCalendarGenerated && (
                        <button
                          onClick={handleReset}
                          className="glass-button px-3 py-1.5 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-500/20 text-sm text-red-400"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {sequencedDrugsWithNumbers.map(drug => {
                    const colors = drugColors[drug.effect];
                    const hasCustomSchedule = customSchedules[drug.id];
                    const currentSchedule = selectedSchedules[drug.id] || drug.standardPosology;
                    
                    return (
                      <div key={drug.id} className="p-3 sm:p-4 rounded-lg bg-white/5">
                        {/* Drug Header - More compact on mobile */}
                        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                            <DrugSymbol symbol={drug.symbol} className="text-base sm:text-lg" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-white text-sm sm:text-base truncate">{drug.name}</h4>
                            {drug.brandName && (
                              <p className="text-xs sm:text-sm text-white/60 truncate">{drug.brandName}</p>
                            )}
                          </div>
                        </div>

                        {/* Main Configuration Grid - Stack on mobile */}
                        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                          {/* Start Date Input */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">
                              {t('calendar.startDate')}
                            </label>
                            <input
                              type="date"
                              value={drugStartDates[drug.id] || selectedStartDate}
                              onChange={(e) => handleDrugStartDateChange(drug.id, e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="glass-input w-full text-sm py-1.5"
                            />
                          </div>

                          {/* Schedule Selection */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">
                              {t('calendar.schedule')}
                            </label>
                            <select
                              value={currentSchedule}
                              onChange={(e) => handleScheduleChange(drug.id, e.target.value)}
                              className="glass-input w-full text-sm py-1.5"
                            >
                              {scheduleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Duration Selection */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">
                              {t('calendar.duration')}
                            </label>
                            <select
                              value={treatmentDurations[drug.id] || 14}
                              onChange={(e) => handleDurationChange(drug.id, parseInt(e.target.value))}
                              className="glass-input w-full text-sm py-1.5"
                            >
                              {durationOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Custom Schedule Options - Stack on mobile */}
                        {hasCustomSchedule && (
                          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">
                                {t('calendar.customSchedule.dailyFrequency')}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="12"
                                value={customSchedules[drug.id].frequency}
                                onChange={(e) => handleCustomScheduleChange(drug.id, {
                                  frequency: parseInt(e.target.value)
                                })}
                                className="glass-input w-full text-sm py-1.5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">
                                {t('calendar.customSchedule.hoursBetweenDoses')}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="24"
                                value={customSchedules[drug.id].interval}
                                onChange={(e) => handleCustomScheduleChange(drug.id, {
                                  interval: parseInt(e.target.value)
                                })}
                                className="glass-input w-full text-sm py-1.5"
                              />
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1">
                                {t('calendar.customSchedule.firstDoseTime')}
                              </label>
                              <input
                                type="time"
                                value={customSchedules[drug.id].startTime}
                                onChange={(e) => handleCustomScheduleChange(drug.id, {
                                  startTime: e.target.value
                                })}
                                className="glass-input w-full text-sm py-1.5"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {isCalendarGenerated && (
                <>
                  <Calendar
                    selectedDrugs={sequencedDrugsWithNumbers}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                  />
                  <DrugSequenceSummary drugs={sequencedDrugsWithNumbers} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}