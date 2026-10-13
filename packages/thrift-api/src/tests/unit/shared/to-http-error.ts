import chai from 'chai'
import { toHttpError } from '#src/shared/to-http-error.js'
import { domainError, DomainErrorCode } from '#src/shared/domain-error.js'

chai.should()

const ALL_CODES: DomainErrorCode[] = [
  'INVALID_INPUT',
  'NOT_FOUND',
  'UNAUTHORIZED',
  'UNAUTHENTICATED',
  'CONFLICT',
  'INTERNAL',
]

export default () => {
  describe('shared/to-http-error', () => {
    it('returns an Error with the message preserved', () => {
      const e = toHttpError(domainError('CONFLICT', 'already exists'))
      e.should.be.instanceOf(Error)
      e.message.should.equal('already exists')
    })

    it('produces a distinct error class for each domain code', () => {
      const names = new Set(
        ALL_CODES.map(
          (code) => toHttpError(domainError(code, 'x')).constructor.name,
        ),
      )
      names.size.should.equal(ALL_CODES.length)
    })

    it('names each error class after its domain meaning', () => {
      const byCode: Record<DomainErrorCode, string> = {
        INVALID_INPUT: 'BadRequestError',
        NOT_FOUND: 'NotFoundError',
        UNAUTHORIZED: 'UnauthorizedError',
        UNAUTHENTICATED: 'UnauthenticatedError',
        CONFLICT: 'ConflictError',
        INTERNAL: 'InternalServerError',
      }
      for (const [code, expectedName] of Object.entries(byCode)) {
        toHttpError(
          domainError(code as DomainErrorCode, 'x'),
        ).constructor.name.should.equal(expectedName)
      }
    })
  })
}
