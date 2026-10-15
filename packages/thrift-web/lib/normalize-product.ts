// Normalizes product payloads from the pre-refactor API to the current
// contract so the storefront renders against both schemas during the rollout.
//
// Pre-refactor (legacy)            Current (refactored)
//   variant.list_price (numeric)     variant.base_price (bigint, kobo)
//   variant.net_price  (numeric)
//   option.value_id                  option.option_value_id
//
// Legacy prices were stored as `numeric(10,2)` (naira major unit) while the
// current schema uses integer kobo, so legacy values are multiplied by 100.

type AnyRecord = Record<string, unknown>

function toNumber(value: unknown): number | undefined {
  if (value == null) return undefined
  const n = typeof value === 'string' ? parseFloat(value) : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function normalizeVariant(raw: AnyRecord): AnyRecord {
  const basePrice = toNumber(raw.base_price)
  const netPrice = toNumber(raw.net_price)
  const listPrice = toNumber(raw.list_price)

  const base_price =
    basePrice ??
    (netPrice != null
      ? netPrice * 100
      : listPrice != null
        ? listPrice * 100
        : undefined)

  const options = Array.isArray(raw.options)
    ? raw.options.map((option: AnyRecord) => ({
        ...option,
        option_value_id: option.option_value_id ?? option.value_id,
      }))
    : raw.options

  return { ...raw, base_price, options }
}

export function normalizeProduct<T = unknown>(raw: T): T {
  if (!raw || typeof raw !== 'object') return raw
  const product = raw as AnyRecord
  const variants = Array.isArray(product.variants)
    ? product.variants.map((variant) => normalizeVariant(variant as AnyRecord))
    : product.variants
  return { ...product, variants } as T
}
