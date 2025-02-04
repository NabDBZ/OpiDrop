import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, RefreshCw, Filter, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<DrugType[]>([]);
  const [startDate, setStartDate] = useState(new Date());
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

  const handleGenerateCalendar = () => {
    setStartDate(new Date());
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="glass-button inline-flex items-center px-4 py-2 rounded-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('common.back')}
          </Link>
          <h1 className="text-3xl font-bold text-white">{t('calendar.title')}</h1>
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder={t('calendar.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-white/60"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="glass-input pl-10 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
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
                  className="glass-button p-2 rounded-lg"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

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

        {selectedDrugs.length > 0 && (
          <>
            <div className="glass-card mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Selected Medications
                  </h2>
                  <button
                    onClick={handleGenerateCalendar}
                    className="glass-button px-6 py-3 rounded-lg"
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Generate Calendar
                  </button>
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