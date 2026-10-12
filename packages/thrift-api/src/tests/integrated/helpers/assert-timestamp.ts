import chai from 'chai'

/**
 * Robust timestamp assertion.
 *
 * Replaces the flaky "within 2 seconds of now" checks that occasionally fail
 * on slow CI runs. A timestamp is valid when it is:
 *   1. present and a string,
 *   2. parseable as an ISO timestamp, and
 *   3. within a generous window around "now" (no far-future / far-past values).
 */
const DEFAULT_WINDOW_MS = 60_000 // ±1 minute

export function assertRecentIsoTimestamp(
  value: unknown,
  opts: { windowMs?: number; label?: string } = {},
): void {
  const { windowMs = DEFAULT_WINDOW_MS, label = 'timestamp' } = opts

  chai.expect(value, `${label} should be defined`).to.not.be.undefined
  chai.expect(value, `${label} should be a string`).to.be.a('string')

  const parsed = new Date(value as string)
  chai
    .expect(
      Number.isNaN(parsed.getTime()),
      `${label} ("${value}") should be a parseable ISO timestamp`,
    )
    .to.equal(false)

  const now = Date.now()
  const time = parsed.getTime()
  chai
    .expect(time, `${label} ("${value}") should not be in the future`)
    .to.be.at.most(now + windowMs)
  chai
    .expect(
      time,
      `${label} ("${value}") should be recent (within ${windowMs}ms)`,
    )
    .to.be.at.least(now - windowMs)
}
