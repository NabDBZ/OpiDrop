import { DrugType, categoryPriority, effectPriority } from '../data/drugTypes';

export function calculateDrugSequence(drugs: DrugType[]): DrugType[] {
  return [...drugs].sort((a, b) => {
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

export function validateDrugSequence(drugs: DrugType[]): boolean {
  const sortedDrugs = calculateDrugSequence(drugs);
  return JSON.stringify(sortedDrugs) === JSON.stringify(drugs);
}

export function getDrugSequenceErrors(drugs: DrugType[]): string[] {
  const errors: string[] = [];
  const sortedDrugs = calculateDrugSequence(drugs);

  // Check for sequence violations
  for (let i = 0; i < drugs.length; i++) {
    if (drugs[i].id !== sortedDrugs[i].id) {
      errors.push(
        `${drugs[i].name} should be administered ${
          i > 0 ? 'after' : 'before'
        } ${sortedDrugs[i].name} based on the prioritization rules`
      );
    }
  }

  return errors;
}