export type Money = number

export const isNonNegativeMoney = (value: unknown): value is Money =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0
