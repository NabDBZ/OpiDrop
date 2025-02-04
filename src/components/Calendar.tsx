import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfDay, isBefore, isAfter, parse, set } from 'date-fns';
import { Info, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { DrugType, drugColors } from '../data/drugTypes';
import { DrugSymbol } from './DrugSymbol';
import { generatePDF } from '../utils/pdfExport';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from '../utils/localStorage';

type CalendarProps = {
  selectedDrugs: (DrugType & {
    posology: string;
    duration: number;
    sequenceNumber: number;
    customSchedule?: {
      frequency: number;
      interval: number;
      startTime: string;
    };
  })[];
  startDate: Date;
  onStartDateChange: (date: Date) => void;
};

type DoseStatus = {
  drugId: string;
  date: string;
  timeIndex: number;
  completed: boolean;
};

type TimeSlot = {
  hour: number;
  minute: number;
  label: string;
};

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { hour: 8, minute: 0, label: '8:00 AM' },
  { hour: 12, minute: 0, label: '12:00 PM' },
  { hour: 16, minute: 0, label: '4:00 PM' },
  { hour: 20, minute: 0, label: '8:00 PM' }
];

const POSOLOGY_TIME_SLOTS = {
  once: [{ hour: 8, minute: 0, label: '8:00 AM' }],
  twice: [
    { hour: 8, minute: 0, label: '8:00 AM' },
    { hour: 20, minute: 0, label: '8:00 PM' }
  ],
  three: [
    { hour: 8, minute: 0, label: '8:00 AM' },
    { hour: 14, minute: 0, label: '2:00 PM' },
    { hour: 20, minute: 0, label: '8:00 PM' }
  ],
  four: DEFAULT_TIME_SLOTS
};

// Add new component for mobile day card
const MobileDayCard = ({ 
  day, 
  timeSlots, 
  drugsByTime,
  isDrugActiveOnDate,
  isDoseCompleted,
  handleDoseComplete,
  setHoveredCell
}: {
  day: Date;
  timeSlots: TimeSlot[];
  drugsByTime: (DrugType & {
    posology: string;
    duration: number;
    sequenceNumber: number;
    customSchedule?: {
      frequency: number;
      interval: number;
      startTime: string;
    };
  })[][];
  isDrugActiveOnDate: (drug: DrugType & { duration: number }, date: Date) => boolean;
  isDoseCompleted: (drugId: string, date: string, timeIndex: number) => boolean;
  handleDoseComplete: (drugId: string, date: string, timeIndex: number) => void;
  setHoveredCell: (cell: { drugId: string; date: string; timeIndex: number } | null) => void;
}) => {
  const dateStr = format(day, 'yyyy-MM-dd');
  
  return (
    <div className={`bg-white rounded-xl shadow-sm mb-4 overflow-hidden
      ${isSameDay(day, new Date()) ? 'ring-2 ring-blue-100' : ''}`}
    >
      {/* Day Header */}
      <div className={`p-4 text-center border-b ${
        isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-gray-50'
      }`}>
        <div className="text-lg font-bold text-gray-900">
          {format(day, 'EEEE')}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {format(day, 'd')}
        </div>
        <div className="text-sm text-gray-600">
          {format(day, 'MMMM yyyy')}
        </div>
      </div>

      {/* Time Slots */}
      <div className="divide-y divide-gray-100">
        {timeSlots.map((timeSlot, timeIndex) => {
          const drugsAtTime = drugsByTime[timeIndex];
          const activeDrugs = drugsAtTime.filter(drug => isDrugActiveOnDate(drug, day));

          if (activeDrugs.length === 0) return null;

          return (
            <div key={timeIndex} className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {timeSlot.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeDrugs.map(drug => {
                  const colors = drugColors[drug.effect];
                  const isCompleted = isDoseCompleted(drug.id, dateStr, timeIndex);

                  return (
                    <button
                      key={drug.id}
                      onClick={() => handleDoseComplete(drug.id, dateStr, timeIndex)}
                      onMouseEnter={() => setHoveredCell({ drugId: drug.id, date: dateStr, timeIndex })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                        ${isCompleted 
                          ? 'ring-2 ring-green-500 shadow-lg' 
                          : 'hover:ring-2 hover:ring-blue-300 hover:shadow-md'}`}
                      style={{ 
                        backgroundColor: isCompleted ? colors.text : colors.bg,
                        color: isCompleted ? colors.bg : colors.text
                      }}
                    >
                      <div className="flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <DrugSymbol symbol={drug.symbol} className="text-base" />
                        )}
                        <span className="absolute -top-1 -right-1 text-xs font-bold bg-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-gray-200">
                          {drug.sequenceNumber}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function Calendar({ selectedDrugs, startDate, onStartDateChange }: CalendarProps) {
  const { t } = useTranslation();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [completedDoses, setCompletedDoses] = useState<DoseStatus[]>(() =>
    loadFromLocalStorage<DoseStatus[]>(STORAGE_KEYS.COMPLETED_DOSES, [])
  );
  const [hoveredCell, setHoveredCell] = useState<{ drugId: string; date: string; timeIndex: number } | null>(null);

  // Save completed doses to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.COMPLETED_DOSES, completedDoses);
  }, [completedDoses]);

  const timeSlots = useMemo(() => {
    const allSlots = new Set<number>();

    selectedDrugs.forEach(drug => {
      if (drug.customSchedule) {
        const { frequency, interval, startTime } = drug.customSchedule;
        const [startHour] = startTime.split(':').map(Number);
        
        for (let i = 0; i < frequency; i++) {
          const hour = (startHour + (i * interval)) % 24;
          allSlots.add(hour);
        }
      } else {
        const slots = POSOLOGY_TIME_SLOTS[drug.posology as keyof typeof POSOLOGY_TIME_SLOTS] || [];
        slots.forEach(slot => allSlots.add(slot.hour));
      }
    });

    const sortedHours = Array.from(allSlots).sort((a, b) => a - b);
    
    return sortedHours.map(hour => ({
      hour,
      minute: 0,
      label: format(set(new Date(), { hours: hour, minutes: 0 }), 'h:mm a')
    }));
  }, [selectedDrugs]);

  const drugsByTime = useMemo(() => {
    return timeSlots.map(timeSlot => {
      return selectedDrugs.filter(drug => {
        if (drug.customSchedule) {
          const { frequency, interval, startTime } = drug.customSchedule;
          const [startHour] = startTime.split(':').map(Number);
          const hours = Array.from({ length: frequency }, (_, i) => 
            (startHour + (i * interval)) % 24
          );
          return hours.includes(timeSlot.hour);
        }

        const slots = POSOLOGY_TIME_SLOTS[drug.posology as keyof typeof POSOLOGY_TIME_SLOTS] || [];
        return slots.some(slot => slot.hour === timeSlot.hour);
      }).sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    });
  }, [selectedDrugs, timeSlots]);

  useEffect(() => {
    if (!selectionStart) {
      setSelectionStart(startOfDay(new Date()));
    }
  }, []);

  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handleDoseComplete = useCallback((drugId: string, date: string, timeIndex: number) => {
    setCompletedDoses(prev => {
      const existingIndex = prev.findIndex(
        dose => dose.drugId === drugId && dose.date === date && dose.timeIndex === timeIndex
      );

      if (existingIndex >= 0) {
        const newDoses = [...prev];
        newDoses[existingIndex].completed = !newDoses[existingIndex].completed;
        return newDoses;
      }

      return [...prev, { drugId, date, timeIndex, completed: true }];
    });
  }, []);

  const isDoseCompleted = useCallback((drugId: string, date: string, timeIndex: number) => {
    return completedDoses.some(
      dose => dose.drugId === drugId && 
              dose.date === date && 
              dose.timeIndex === timeIndex &&
              dose.completed
    );
  }, [completedDoses]);

  const isDrugActiveOnDate = useCallback((drug: DrugType & { duration: number }, date: Date) => {
    if (!selectionStart) return false;
    const endDate = addDays(selectionStart, drug.duration - 1);
    return !isBefore(date, selectionStart) && !isAfter(date, endDate);
  }, [selectionStart]);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? addDays(startDate, -7) 
      : addDays(startDate, 7);
    onStartDateChange(newDate);
  }, [startDate, onStartDateChange]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading(t('export.downloading'));
    
    try {
      const calendarData = {
        selectedDrugs: selectedDrugs.map((drug, index) => ({
          ...drug,
          sequenceNumber: index + 1
        })),
        startDate: selectionStart || startDate,
        timeSlots: [
          { hour: 8, minute: 0, label: '8:00' },
          { hour: 12, minute: 0, label: '12:00' },
          { hour: 14, minute: 0, label: '14:00' },
          { hour: 16, minute: 0, label: '16:00' },
          { hour: 20, minute: 0, label: '20:00' }
        ]
      };

      await generatePDF(calendarData, `calendar-${format(selectionStart || startDate, 'yyyy-MM-dd')}.pdf`);
      toast.success(t('export.success'), { id: toastId });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(t('export.error'), { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="glass-card border-0" ref={calendarRef} data-calendar-container>
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-8 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 sm:p-3 hover:bg-white/50 rounded-xl transition-all duration-200 group print:hidden"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </h2>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 print:hidden">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`p-2 sm:p-3 hover:bg-white/50 rounded-xl transition-all duration-200 group ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={t('calendar.export.button')}
            >
              <Download className={`h-5 w-5 text-gray-600 group-hover:text-gray-900 ${
                isExporting ? 'animate-bounce' : ''
              }`} />
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 sm:p-3 hover:bg-white/50 rounded-xl transition-all duration-200 group"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Calendar Grid */}
      <div className="hidden md:block overflow-x-auto print:overflow-visible">
        <div className="inline-block min-w-full align-middle">
          <div className="grid grid-cols-[auto_repeat(7,_minmax(160px,_1fr))] print:grid-cols-[auto_repeat(7,_1fr)]">
            {/* Time Column Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">{t('calendar.time')}</span>
            </div>

            {/* Day Headers */}
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`p-6 text-center border-b border-gray-200 transition-colors duration-200
                  ${isSameDay(day, new Date()) 
                    ? 'bg-blue-50 border-blue-100' 
                    : 'bg-gray-50 hover:bg-gray-100'} print:bg-white print:hover:bg-white`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-gray-900">
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 mt-1">
                    {format(day, 'd')}
                  </span>
                </div>
              </div>
            ))}

            {/* Time Slots and Drug Grid */}
            {timeSlots.map((timeSlot, timeIndex) => (
              <React.Fragment key={timeIndex}>
                {/* Time Column */}
                <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {timeSlot.label}
                    </span>
                  </div>
                </div>

                {/* Drug Cells */}
                {days.map((day, dayIndex) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const drugsAtTime = drugsByTime[timeIndex];

                  return (
                    <div
                      key={`${dateStr}-${timeIndex}`}
                      className={`p-6 border-b border-gray-100 transition-colors duration-200
                        ${dayIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                        hover:bg-blue-50/30`}
                    >
                      <div className="flex flex-wrap gap-3">
                        {drugsAtTime.map(drug => {
                          if (!isDrugActiveOnDate(drug, day)) return null;

                          const colors = drugColors[drug.effect];
                          const isCompleted = isDoseCompleted(drug.id, dateStr, timeIndex);
                          const isHovered = hoveredCell?.drugId === drug.id && 
                                         hoveredCell?.date === dateStr && 
                                         hoveredCell?.timeIndex === timeIndex;

                          return (
                            <button
                              key={drug.id}
                              onClick={() => handleDoseComplete(drug.id, dateStr, timeIndex)}
                              onMouseEnter={() => setHoveredCell({ drugId: drug.id, date: dateStr, timeIndex })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                                ${isCompleted 
                                  ? 'ring-2 ring-green-500 shadow-lg' 
                                  : 'hover:ring-2 hover:ring-blue-300 hover:shadow-md'}
                                ${isHovered ? 'scale-110 z-10' : ''}`}
                              style={{ 
                                backgroundColor: isCompleted ? colors.text : colors.bg,
                                color: isCompleted ? colors.bg : colors.text
                              }}
                            >
                              <div className="flex items-center justify-center">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <DrugSymbol symbol={drug.symbol} className="text-lg" />
                                )}
                                <span className="absolute -top-1 -right-1 text-xs font-bold bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-gray-200">
                                  {drug.sequenceNumber}
                                </span>
                              </div>
                              
                              {isHovered && (
                                <div className="absolute z-20 w-64 p-4 bg-white rounded-xl shadow-xl -top-24 left-1/2 transform -translate-x-1/2 border border-gray-100">
                                  <div className="text-sm">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
                                        <DrugSymbol symbol={drug.symbol} className="text-lg" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-gray-900">
                                          Drop #{drug.sequenceNumber}
                                        </div>
                                        <div className="text-gray-600 text-xs">
                                          {format(day, 'MMM d')} at {timeSlot.label}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="font-medium text-gray-900">{drug.name}</div>
                                    {drug.brandName && (
                                      <div className="text-gray-600 text-xs mt-1">{drug.brandName}</div>
                                    )}
                                    <div className="mt-2 flex items-center space-x-2">
                                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
                                        {drug.concentration}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {isCompleted ? '✓ Completed' : '○ Pending'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Calendar View */}
      <div className="md:hidden p-4">
        {days.map((day, index) => (
          <MobileDayCard
            key={index}
            day={day}
            timeSlots={timeSlots}
            drugsByTime={drugsByTime}
            isDrugActiveOnDate={isDrugActiveOnDate}
            isDoseCompleted={isDoseCompleted}
            handleDoseComplete={handleDoseComplete}
            setHoveredCell={setHoveredCell}
          />
        ))}
      </div>

      {/* Progress Section */}
      <div className="border-t border-gray-200 p-8 bg-gradient-to-b from-gray-50 to-white print:bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{t('calendar.progress.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4">
          {selectedDrugs.map((drug) => {
            const drugTimeSlots = drug.customSchedule
              ? drug.customSchedule.frequency
              : (POSOLOGY_TIME_SLOTS[drug.posology as keyof typeof POSOLOGY_TIME_SLOTS] || []).length;
            
            const totalDoses = drugTimeSlots * drug.duration;
            const completedCount = completedDoses.filter(
              dose => dose.drugId === drug.id && dose.completed
            ).length;
            const progress = totalDoses > 0 ? (completedCount / totalDoses) * 100 : 0;
            const colors = drugColors[drug.effect];

            return (
              <div key={drug.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                      <DrugSymbol symbol={drug.symbol} className="text-lg" />
                    </div>
                    <span className="absolute -top-1 -right-1 text-xs font-bold bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-gray-200">
                      {drug.sequenceNumber}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Drop #{drug.sequenceNumber}</div>
                    <div className="text-sm text-gray-600">{drug.name}</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: colors.text
                    }}
                  />
                </div>
                <div className="mt-3 flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">{Math.round(progress)}% complete</span>
                  <span className="font-bold text-gray-900">{completedCount}/{totalDoses}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}