import chai from 'chai'
import { isNonNegativeMoney } from '#src/shared/money.js'

chai.should()

export default () => {
  describe('shared/money', () => {
    describe('isNonNegativeMoney', () => {
      it('accepts zero', () => {
        isNonNegativeMoney(0).should.equal(true)
      })

      it('accepts a positive integer', () => {
        isNonNegativeMoney(100000).should.equal(true)
      })

      it('accepts Number.MAX_SAFE_INTEGER', () => {
        isNonNegativeMoney(Number.MAX_SAFE_INTEGER).should.equal(true)
      })

      it('rejects a negative integer', () => {
        isNonNegativeMoney(-1).should.equal(false)
      })

      it('rejects a non-integer float', () => {
        isNonNegativeMoney(100.5).should.equal(false)
      })

      it('rejects NaN', () => {
        isNonNegativeMoney(Number.NaN).should.equal(false)
      })

      it('rejects Infinity', () => {
        isNonNegativeMoney(Number.POSITIVE_INFINITY).should.equal(false)
      })

      it('rejects a numeric string', () => {
        isNonNegativeMoney('100').should.equal(false)
      })

      it('rejects null and undefined', () => {
        isNonNegativeMoney(null).should.equal(false)
        isNonNegativeMoney(undefined).should.equal(false)
      })

      it('rejects a boolean', () => {
        isNonNegativeMoney(true).should.equal(false)
      })
    })
  })
}
