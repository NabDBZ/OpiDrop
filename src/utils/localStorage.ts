import { DrugType } from '../data/drugTypes';

const STORAGE_KEYS = {
  SELECTED_DRUGS: 'mdose_selected_drugs',
  CUSTOM_SCHEDULES: 'mdose_custom_schedules',
  TREATMENT_DURATIONS: 'mdose_treatment_durations',
  SELECTED_SCHEDULES: 'mdose_selected_schedules',
  COMPLETED_DOSES: 'mdose_completed_doses',
  START_DATE: 'mdose_start_date'
} as const;

export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const clearLocalStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export { STORAGE_KEYS }; 