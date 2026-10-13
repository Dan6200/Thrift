import chai from 'chai'
import { domainError, domainErrorStatusCode } from '#src/shared/domain-error.js'

chai.should()

export default () => {
  describe('shared/domain-error', () => {
    it('builds a domain error with code and message', () => {
      const e = domainError('INVALID_INPUT', 'bad input')
      e.code.should.equal('INVALID_INPUT')
      e.message.should.equal('bad input')
    })

    describe('domainErrorStatusCode', () => {
      const cases: [Parameters<typeof domainError>[0], number][] = [
        ['INVALID_INPUT', 400],
        ['NOT_FOUND', 404],
        ['UNAUTHORIZED', 403],
        ['UNAUTHENTICATED', 401],
        ['CONFLICT', 409],
        ['INTERNAL', 500],
      ]

      for (const [code, status] of cases) {
        it(`maps ${code} to ${status}`, () => {
          domainErrorStatusCode(domainError(code, 'x')).should.equal(status)
        })
      }
    })
  })
}
