import { DrugSymbol } from '../components/DrugSymbol';

export type DrugCategory = 
  | 'artificial_tears'
  | 'solutions'
  | 'suspensions'
  | 'ointments'
  | 'gels'
  | 'emulsions';

export type DrugEffect = 
  | 'artificial_tears'
  | 'nsaids'
  | 'parasympathomimetics'
  | 'sympathomimetics'
  | 'parasympatholytics'
  | 'sympatholytics'
  | 'alpha_agonists'
  | 'beta_blockers'
  | 'carbonic_inhibitors'
  | 'prostaglandins'
  | 'antibiotics'
  | 'mast_cell_stabilizers'
  | 'corticosteroids'
  | 'antihistamines'
  | 'long_acting';

export type DrugType = {
  id: string;
  name: string;
  brandName?: string;
  concentration: string;
  category: DrugCategory;
  effect: DrugEffect;
  standardPosology: string;
  type: 'solution' | 'suspension' | 'ointment' | 'gel' | 'emulsion';
  symbol: DrugSymbol;
  description?: string;
};

export const categoryPriority: Record<DrugCategory, number> = {
  artificial_tears: 1,
  solutions: 2,
  suspensions: 3,
  emulsions: 4,
  ointments: 5,
  gels: 6
};

export const effectPriority: Record<DrugEffect, number> = {
  artificial_tears: 1,
  nsaids: 2,
  parasympathomimetics: 3,
  sympathomimetics: 4,
  parasympatholytics: 5,
  sympatholytics: 6,
  alpha_agonists: 7,
  beta_blockers: 8,
  carbonic_inhibitors: 9,
  prostaglandins: 10,
  antibiotics: 11,
  mast_cell_stabilizers: 12,
  corticosteroids: 13,
  antihistamines: 14,
  long_acting: 15
};

export const drugColors: Record<DrugEffect, { bg: string; text: string }> = {
  artificial_tears: { bg: '#E3F2FD', text: '#1565C0' },
  nsaids: { bg: '#C8E6C9', text: '#2E7D32' },
  parasympathomimetics: { bg: '#F3E5F5', text: '#6A1B9A' },
  parasympatholytics: { bg: '#004D40', text: '#E0F2F1' },
  sympathomimetics: { bg: '#FFE0B2', text: '#E65100' },
  sympatholytics: { bg: '#1A237E', text: '#E8EAF6' },
  alpha_agonists: { bg: '#4A148C', text: '#F3E5F5' },
  beta_blockers: { bg: '#C5CAE9', text: '#283593' },
  carbonic_inhibitors: { bg: '#E0F2F1', text: '#00695C' },
  prostaglandins: { bg: '#004D40', text: '#E0F2F1' }, // Deep teal palette for prostaglandins
  antibiotics: { bg: '#BBDEFB', text: '#1565C0' },
  mast_cell_stabilizers: { bg: '#FFE0B2', text: '#E65100' },
  corticosteroids: { bg: '#FFF9C4', text: '#F57F17' },
  antihistamines: { bg: '#FFE0B2', text: '#E65100' },
  long_acting: { bg: '#FFCDD2', text: '#B71C1C' }
};