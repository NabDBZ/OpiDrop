import { DrugType, categoryPriority, effectPriority } from '../data/drugTypes';

type DrugWithStartDate = DrugType & { startDate?: string };

export function calculateDrugSequence(drugs: DrugWithStartDate[]): DrugWithStartDate[] {
  return [...drugs].sort((a, b) => {
    // Level 0: Start Date (if provided)
    if (a.startDate && b.startDate) {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      const dateDiff = dateA.getTime() - dateB.getTime();
      if (dateDiff !== 0) return dateDiff;
    }

    // Level 1: Form-Based Sequence
    const categoryDiff = categoryPriority[a.category] - categoryPriority[b.category];
    if (categoryDiff !== 0) return categoryDiff;

    // Level 2: Effect-Based Sequence
    const effectDiff = effectPriority[a.effect] - effectPriority[b.effect];
    if (effectDiff !== 0) return effectDiff;

    // If same category and effect, sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

export function validateDrugSequence(drugs: DrugWithStartDate[]): boolean {
  const sortedDrugs = calculateDrugSequence(drugs);
  return JSON.stringify(sortedDrugs) === JSON.stringify(drugs);
}

export function getDrugSequenceErrors(drugs: DrugWithStartDate[]): string[] {
  const errors: string[] = [];
  const sortedDrugs = calculateDrugSequence(drugs);

  // Check for sequence violations
  for (let i = 0; i < drugs.length; i++) {
    if (drugs[i].id !== sortedDrugs[i].id) {
      let errorMessage = `${drugs[i].name} should be administered ${
        i > 0 ? 'after' : 'before'
      } ${sortedDrugs[i].name}`;

      // Add start date information if available
      if (drugs[i].startDate && sortedDrugs[i].startDate) {
        errorMessage += ` (based on start dates: ${drugs[i].startDate} vs ${sortedDrugs[i].startDate})`;
      } else {
        errorMessage += ' based on the prioritization rules';
      }

      errors.push(errorMessage);
    }
  }

  return errors;
}