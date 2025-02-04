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
  // Antibiotics - Light blue theme
  antibiotics: { bg: '#E3F2FD', text: '#1565C0' },
  
  // NSAIDs - Green theme
  nsaids: { bg: '#E8F5E9', text: '#2E7D32' },
  
  // Corticosteroids - Warm yellow theme
  corticosteroids: { bg: '#FFF8E1', text: '#F57F17' },
  
  // Antihistamines - Orange theme
  antihistamines: { bg: '#FFF3E0', text: '#E65100' },
  
  // Parasympathomimetics - Purple theme
  parasympathomimetics: { bg: '#F3E5F5', text: '#6A1B9A' },
  
  // Parasympatholytics - Teal theme
  parasympatholytics: { bg: '#E0F2F1', text: '#00695C' },
  
  // Sympatholytics (Beta Blockers) - Deep blue theme
  sympatholytics: { bg: '#E8EAF6', text: '#283593' },
  
  // Alpha Agonists - Deep purple theme
  alpha_agonists: { bg: '#EDE7F6', text: '#4527A0' },
  
  // Carbonic Inhibitors - Cyan theme
  carbonic_inhibitors: { bg: '#E0F7FA', text: '#006064' },
  
  // Prostaglandins - Deep teal theme
  prostaglandins: { bg: '#E0F2F1', text: '#004D40' },
  
  // Additional categories
  artificial_tears: { bg: '#F1F8FF', text: '#0D47A1' },
  sympathomimetics: { bg: '#FFF3E0', text: '#E65100' },
  beta_blockers: { bg: '#E8EAF6', text: '#1A237E' },
  mast_cell_stabilizers: { bg: '#FFF3E0', text: '#EF6C00' },
  long_acting: { bg: '#FAFAFA', text: '#424242' }
};