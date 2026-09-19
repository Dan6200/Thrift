export type Result<T, E> = { kind: 'ok'; value: T } | { kind: 'err'; error: E }

export const ok = <T, E>(value: T): Result<T, E> => ({ kind: 'ok', value })
export const err = <T, E>(error: E): Result<T, E> => ({ kind: 'err', error })

export const map = <T, U, E>(
  r: Result<T, E>,
  f: (value: T) => U,
): Result<U, E> => (r.kind === 'ok' ? ok(f(r.value)) : r)

export const flatMap = <T, U, E>(
  r: Result<T, E>,
  f: (value: T) => Result<U, E>,
): Result<U, E> => (r.kind === 'ok' ? f(r.value) : r)

export const mapError = <T, E, F>(
  r: Result<T, E>,
  f: (error: E) => F,
): Result<T, F> => (r.kind === 'err' ? err(f(r.error)) : r)
