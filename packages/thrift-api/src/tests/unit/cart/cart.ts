import chai from 'chai'
import { validateQuantity } from '#src/context/cart/domain/cart.js'

chai.should()

export default () => {
  describe('cart domain validateQuantity', () => {
    it('accepts a positive integer within stock', () => {
      const r = validateQuantity(2, 10)
      r.kind.should.equal('ok')
      if (r.kind === 'ok') r.value.should.equal(2)
    })

    it('accepts a quantity equal to the available stock', () => {
      const r = validateQuantity(10, 10)
      r.kind.should.equal('ok')
    })

    it('rejects zero', () => {
      const r = validateQuantity(0, 10)
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })

    it('rejects a negative quantity', () => {
      const r = validateQuantity(-1, 10)
      r.kind.should.equal('err')
    })

    it('rejects a non-integer quantity', () => {
      const r = validateQuantity(1.5, 10)
      r.kind.should.equal('err')
    })

    it('rejects a quantity above available stock', () => {
      const r = validateQuantity(11, 10)
      r.kind.should.equal('err')
      if (r.kind === 'err') r.error.code.should.equal('INVALID_INPUT')
    })
  })
}
