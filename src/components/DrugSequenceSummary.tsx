import React from 'react';
import { useTranslation } from 'react-i18next';
import { DrugType, drugColors } from '../data/drugTypes';
import { DrugSymbol } from './DrugSymbol';
import { Clock, AlertCircle, Info } from 'lucide-react';

type DrugSequenceSummaryProps = {
  drugs: (DrugType & {
    posology: string;
    duration: number;
    sequenceNumber: number;
  })[];
};

export function DrugSequenceSummary({ drugs }: DrugSequenceSummaryProps) {
  const { t } = useTranslation();
  
  // Group drugs by time slots to detect overlaps
  const timeSlotGroups = drugs.reduce((acc, drug) => {
    const key = `${drug.posology}-${drug.effect}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(drug);
    return acc;
  }, {} as Record<string, typeof drugs>);

  return (
    <div className="glass-card border-0">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('calendar.sequence.title')}</h2>
        
        {/* General Instructions */}
        <div className="bg-blue-50 p-6 rounded-xl mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t('calendar.sequence.guidelines.title')}
              </h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">1</span>
                  <span>{t('calendar.sequence.guidelines.followSequence')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">2</span>
                  <span>{t('calendar.sequence.guidelines.waitBetween')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">3</span>
                  <span>{t('calendar.sequence.guidelines.consistentTimes')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Sequence Order */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('calendar.sequence.administrationOrder')}</h3>
            <div className="space-y-4">
              {drugs.map((drug) => {
                const colors = drugColors[drug.effect];
                return (
                  <div key={drug.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm font-bold text-gray-900">
                      {drug.sequenceNumber}
                    </div>
                    <div
                      className={`flex-1 p-4 rounded-xl transition-all duration-200 hover:shadow-md`}
                      style={{
                        backgroundColor: colors.bg,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/80`}>
                          <DrugSymbol symbol={drug.symbol} className={`text-xl ${colors.text}`} />
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: colors.text }}>{drug.name}</div>
                          {drug.brandName && (
                            <div className="text-sm text-gray-600">({drug.brandName})</div>
                          )}
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-md text-sm font-medium bg-white/80`} style={{ color: colors.text }}>
                              {drug.concentration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slot Warnings */}
          {Object.entries(timeSlotGroups).map(([key, groupDrugs]) => {
            if (groupDrugs.length > 1) {
              return (
                <div key={key} className="bg-amber-50 rounded-xl border border-amber-100 overflow-hidden">
                  <div className="p-4 bg-amber-100/50 border-b border-amber-100">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <h4 className="font-semibold text-amber-900">
                        {t('calendar.sequence.multipleDrops.title')}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-amber-800 mb-4">
                          {t('calendar.sequence.multipleDrops.description')}
                        </p>
                        <ul className="space-y-3 mb-4">
                          {groupDrugs.map((drug, index) => (
                            <li key={drug.id} className="flex items-center space-x-3">
                              <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                                {index + 1}
                              </span>
                              <span className="font-medium text-amber-900">{drug.name}</span>
                              <span className="text-amber-700">({t('calendar.sequence.drop')} #{drug.sequenceNumber})</span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-white/50 rounded-lg p-4">
                          <h5 className="font-medium text-amber-900 mb-2">{t('calendar.sequence.multipleDrops.instructions.title')}</h5>
                          <ol className="list-decimal list-inside space-y-2 text-amber-800">
                            <li>{t('calendar.sequence.multipleDrops.instructions.followNumbers')}</li>
                            <li>{t('calendar.sequence.multipleDrops.instructions.waitTenMinutes')}</li>
                            <li>{t('calendar.sequence.multipleDrops.instructions.blotExcess')}</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}