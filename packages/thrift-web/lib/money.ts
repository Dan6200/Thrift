// Prices in the API are stored as integers in the minor unit (kobo) for NGN.
// Paystack Nigeria also expects amounts in kobo, so this is the canonical unit.

export function koboToNaira(kobo: number | string | null | undefined): number {
  if (kobo == null) return 0
  const value = typeof kobo === 'string' ? parseFloat(kobo) : kobo
  if (Number.isNaN(value)) return 0
  return value / 100
}

export function formatNaira(kobo: number | string | null | undefined): string {
  return koboToNaira(kobo).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  })
}
