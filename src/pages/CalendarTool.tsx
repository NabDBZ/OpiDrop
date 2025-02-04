import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, RefreshCw, Filter, Clock, Calendar as CalendarIcon, AlertCircle, Check } from 'lucide-react';
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

export default function CalendarTool() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugType[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [customSchedules, setCustomSchedules] = useState<Record<string, { frequency: number; interval: number; startTime: string }>>({});
  const [treatmentDurations, setTreatmentDurations] = useState<Record<string, number>>({});
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});

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

  const handleGenerateCalendar = () => {
    if (dateError) {
      return;
    }
    const selectedDate = new Date(selectedStartDate + 'T00:00:00');
    setStartDate(selectedDate);
  };

  const filteredDrugs = useMemo(() => {
    return drugDatabase.filter(drug => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (drug.brandName && drug.brandName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || drug.effect === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleDrugSelect = (drug: DrugType) => {
    setSelectedDrugs(prev => {
      const isSelected = prev.some(d => d.id === drug.id);
      if (isSelected) {
        return prev.filter(d => d.id !== drug.id);
      }
      return [...prev, drug];
    });
  };

  const sequencedDrugsWithNumbers = useMemo(() => {
    const sequencedDrugs = calculateDrugSequence(selectedDrugs);
    return sequencedDrugs.map((drug, index) => ({
      ...drug,
      posology: selectedSchedules[drug.id] || drug.standardPosology,
      duration: treatmentDurations[drug.id] || 14,
      sequenceNumber: index + 1,
      customSchedule: customSchedules[drug.id]
    }));
  }, [selectedDrugs, customSchedules, treatmentDurations, selectedSchedules]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="glass-button inline-flex items-center px-3 py-2 rounded-lg">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="md:inline hidden">{t('common.back')}</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              {t('calendar.title')}
            </h1>
            <div className="w-10 md:hidden"></div> {/* Spacer for mobile layout balance */}
          </div>
          {startDate && (
            <div className="text-base text-center text-white/80">
              {t('calendar.treatmentStart', {
                date: startDate.toLocaleDateString(i18n.language, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              })}
            </div>
          )}
        </div>

        {/* Search and Filter Section - Mobile Optimized */}
        <div className="glass-card mb-6 md:sticky md:top-0 backdrop-blur-sm">
          <div className="p-3 md:p-4 flex flex-col gap-3">
            {/* Mobile Search and Filter */}
            <div className="md:hidden flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  placeholder={t('calendar.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input w-full h-9 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder-white/50 bg-white/5"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="glass-input w-full h-9 pl-10 pr-8 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white bg-white/5"
                >
                  <option value="">{t('calendar.allCategories')}</option>
                  {drugCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="glass-button h-9 rounded-lg flex items-center justify-center bg-white/5"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}
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
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="glass-input pl-10 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white bg-white/5"
                  >
                    <option value="">{t('calendar.allCategories')}</option>
                    {drugCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="glass-button p-2 rounded-lg bg-white/5"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Count */}
            {(searchQuery || selectedCategory) && (
              <div className="text-sm text-white/60 mt-1">
                {filteredDrugs.length === 0 ? (
                  t('drugList.noResults')
                ) : (
                  t('drugList.resultsFound', {
                    count: filteredDrugs.length,
                    medication: filteredDrugs.length === 1 ? t('drugList.medication') : t('drugList.medications')
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <div onClick={(e) => {
            const category = (e.target as HTMLElement).closest('[data-category]')?.getAttribute('data-category');
            if (category) {
              setSelectedCategory(category === selectedCategory ? null : category);
            }
          }}>
            <DrugLegend />
          </div>

          <DrugCategoryList
            drugs={filteredDrugs}
            selectedCategory={selectedCategory}
            onDrugSelect={handleDrugSelect}
            selectedDrugs={selectedDrugs}
          />
        </div>

        <div className="md:hidden">
          {/* Category Icons Grid - Mobile */}
          <div className="glass-card p-3 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {drugCategories.map(category => {
                const colors = drugColors[category.value as keyof typeof drugColors];
                const isSelected = selectedCategory === category.value;
                const categoryDrug = drugDatabase.find(drug => drug.effect === category.value);
                const defaultSymbol = drugDatabase[0]?.symbol || 'A';
                const symbol = categoryDrug?.symbol || defaultSymbol;
                
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(isSelected ? null : category.value)}
                    className={`p-2 rounded-lg transition-all flex flex-col items-center ${
                      isSelected 
                        ? `${colors.bg} ${colors.text} shadow-lg` 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className={`w-10 h-10 mb-2 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20' : colors.bg
                    }`}>
                      <DrugSymbol symbol={symbol} className={`text-lg ${isSelected ? 'text-white' : ''}`} />
                    </div>
                    <div className={`text-xs font-medium text-center leading-tight h-8 flex items-center justify-center px-1 ${
                      isSelected ? 'text-white' : 'text-white/90'
                    }`}>
                      {category.label.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Drugs List */}
          {filteredDrugs.length > 0 && selectedCategory && (
            <div className="glass-card p-4 mb-4">
              <div className="grid grid-cols-1 gap-3">
                {filteredDrugs.map(drug => {
                  const colors = drugColors[drug.effect];
                  const isSelected = selectedDrugs.some(d => d.id === drug.id);
                  
                  return (
                    <button
                      key={drug.id}
                      onClick={() => handleDrugSelect(drug)}
                      className={`flex items-center p-4 rounded-lg transition-all ${
                        isSelected 
                          ? `${colors.bg} ${colors.text} shadow-lg` 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white/20' : colors.bg
                      }`}>
                        <DrugSymbol symbol={drug.symbol} className="text-lg" />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {drug.name}
                        </div>
                        {drug.brandName && (
                          <div className="text-xs text-white/60 truncate">
                            {drug.brandName}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 ml-3 flex-shrink-0" />
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
            <div className="glass-card mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {t('calendar.selectedMedications')}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex flex-col">
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                        <input
                          type="date"
                          value={selectedStartDate}
                          onChange={handleStartDateChange}
                          className={`glass-input pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                            dateError ? 'ring-2 ring-red-500/50' : 'focus:ring-blue-500/50'
                          } text-white`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {dateError && (
                        <div className="absolute -bottom-6 left-0 text-sm text-red-400">
                          {dateError}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateCalendar}
                      className={`glass-button px-6 py-3 rounded-lg ${
                        dateError ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!!dateError}
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {t('calendar.generateCalendar')}
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {selectedDrugs.map(drug => {
                    const colors = drugColors[drug.effect];
                    const hasCustomSchedule = customSchedules[drug.id];
                    const currentSchedule = selectedSchedules[drug.id] || drug.standardPosology;
                    
                    return (
                      <div
                        key={drug.id}
                        className="glass-card p-6"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg}`}>
                            <DrugSymbol symbol={drug.symbol} className="text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-white truncate">
                              {drug.name}
                            </h3>
                            {drug.brandName && (
                              <p className="text-sm text-white/60 truncate">{drug.brandName}</p>
                            )}
                            
                            <div className="mt-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                  Schedule Type
                                </label>
                                <select
                                  value={currentSchedule}
                                  onChange={(e) => handleScheduleChange(drug.id, e.target.value)}
                                  className="glass-input w-full px-3 py-2 rounded-md text-sm"
                                >
                                  {scheduleOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                  Treatment Duration
                                </label>
                                <select
                                  value={treatmentDurations[drug.id] || 14}
                                  onChange={(e) => handleDurationChange(drug.id, Number(e.target.value))}
                                  className="glass-input w-full px-3 py-2 rounded-md text-sm"
                                >
                                  {durationOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {hasCustomSchedule && (
                                <div className="mt-4 space-y-4 glass-card p-4">
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                      Daily Frequency
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="12"
                                      value={customSchedules[drug.id].frequency}
                                      onChange={(e) => handleCustomScheduleChange(drug.id, {
                                        frequency: parseInt(e.target.value)
                                      })}
                                      className="glass-input w-full px-3 py-2 rounded-md text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                      Hours Between Doses
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="24"
                                      value={customSchedules[drug.id].interval}
                                      onChange={(e) => handleCustomScheduleChange(drug.id, {
                                        interval: parseInt(e.target.value)
                                      })}
                                      className="glass-input w-full px-3 py-2 rounded-md text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                      First Dose Time
                                    </label>
                                    <input
                                      type="time"
                                      value={customSchedules[drug.id].startTime}
                                      onChange={(e) => handleCustomScheduleChange(drug.id, {
                                        startTime: e.target.value
                                      })}
                                      className="glass-input w-full px-3 py-2 rounded-md text-sm"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Calendar
                selectedDrugs={sequencedDrugsWithNumbers}
                startDate={startDate}
                onStartDateChange={setStartDate}
              />
              <DrugSequenceSummary drugs={sequencedDrugsWithNumbers} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}