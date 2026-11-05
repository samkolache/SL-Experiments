// Input-display behaviour copied from VOB product-fees-utils.ts: trims the
// visible value to 2 decimal places as the user types. No validation/saving.

export type FeeInputResult =
  | { type: 'skip' }
  | { type: 'empty' }
  | { type: 'value'; fee: number };

export const MAX_FEE_AMOUNT = 5000;

export function parseFeeInput(input: HTMLInputElement): FeeInputResult {
  const value = input.value;

  if (value === '') {
    return { type: 'empty' };
  }

  if (!/^\d*\.?\d*$/.test(value)) {
    return { type: 'skip' };
  }

  const [whole, dec = ''] = value.split('.');
  const normalized = value.includes('.') ? `${whole}.${dec.slice(0, 2)}` : whole;

  if (normalized !== value) {
    input.value = normalized;
  }

  if (normalized.endsWith('.')) {
    return { type: 'skip' };
  }

  const num = Number(normalized);
  if (!Number.isFinite(num)) {
    return { type: 'skip' };
  }

  return { type: 'value', fee: Math.round((num + Number.EPSILON) * 100) / 100 };
}
