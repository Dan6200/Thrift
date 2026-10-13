import chai from 'chai'
import { ok, err, map, flatMap, mapError, Result } from '#src/shared/result.js'

chai.should()

export default () => {
  describe('shared/result', () => {
    describe('ok / err', () => {
      it('wraps a value as ok', () => {
        const r = ok<number, string>(42)
        r.kind.should.equal('ok')
        if (r.kind === 'ok') r.value.should.equal(42)
      })

      it('wraps an error as err', () => {
        const r = err<number, string>('boom')
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.should.equal('boom')
      })
    })

    describe('map', () => {
      it('transforms an ok value', () => {
        const r = map(ok<number, string>(21), (n) => n * 2)
        r.kind.should.equal('ok')
        if (r.kind === 'ok') r.value.should.equal(42)
      })

      it('leaves an err unchanged', () => {
        const r = map(err<number, string>('boom'), (n) => n * 2)
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.should.equal('boom')
      })
    })

    describe('flatMap', () => {
      it('chains an ok value into another result', () => {
        const r = flatMap(ok<number, string>(1), (n) => ok(n + 1))
        r.kind.should.equal('ok')
        if (r.kind === 'ok') r.value.should.equal(2)
      })

      it('short-circuits an err', () => {
        const r = flatMap(err<number, string>('boom'), (n) => ok(n + 1))
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.should.equal('boom')
      })

      it('propagates an err returned from the inner function', () => {
        const r = flatMap(ok<number, string>(1), () =>
          err<number, string>('inner'),
        )
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.should.equal('inner')
      })
    })

    describe('mapError', () => {
      it('transforms an err', () => {
        const r = mapError(err<number, string>('boom'), (e) => e.toUpperCase())
        r.kind.should.equal('err')
        if (r.kind === 'err') r.error.should.equal('BOOM')
      })

      it('leaves an ok unchanged', () => {
        const r = mapError(ok<number, string>(42), (e: string) =>
          e.toUpperCase(),
        )
        r.kind.should.equal('ok')
        if (r.kind === 'ok') r.value.should.equal(42)
      })
    })
  })
}
