import chai from 'chai'
import { createReviewUseCase } from '#src/context/reviews/application/create-review.js'
import { updateReviewUseCase } from '#src/context/reviews/application/update-review.js'
import { deleteReviewUseCase } from '#src/context/reviews/application/delete-review.js'

chai.should()

type Review = {
  order_item_id: number
  customer_id: string
  rating: number
  customer_remark?: string
}

const ownerId = 'owner-1'
const otherId = 'other-2'

const existingReview: Review = {
  order_item_id: 1,
  customer_id: ownerId,
  rating: 4,
  customer_remark: 'ok',
}

const makeRepo = (overrides: Record<string, any> = {}) => ({
  async getOrderItemOwner(): Promise<string | null> {
    return ownerId
  },
  async getById(): Promise<Review | null> {
    return null
  },
  async create(): Promise<any> {
    return undefined
  },
  async update(): Promise<any> {
    return undefined
  },
  async remove(): Promise<any> {
    return undefined
  },
  ...overrides,
})

const anyRepo = (repo: ReturnType<typeof makeRepo>) => repo as any

export default () => {
  describe('createReviewUseCase', () => {
    const command = {
      orderItemId: 1,
      customerId: ownerId,
      rating: 5,
      customerRemark: 'great',
    }

    it('rejects a review for a non-existent order item with NOT_FOUND', async () => {
      let createCalled = false
      const repo = makeRepo({
        getOrderItemOwner: async () => null,
        create: async () => {
          createCalled = true
        },
      })
      const result = await createReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      createCalled.should.equal(false)
    })

    it('rejects a review by a non-owner with UNAUTHORIZED', async () => {
      let createCalled = false
      const repo = makeRepo({
        create: async () => {
          createCalled = true
        },
      })
      const result = await createReviewUseCase(anyRepo(repo))({
        ...command,
        customerId: otherId,
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('UNAUTHORIZED')
      createCalled.should.equal(false)
    })

    it('rejects a duplicate review with CONFLICT', async () => {
      let createCalled = false
      const repo = makeRepo({
        getById: async () => existingReview,
        create: async () => {
          createCalled = true
        },
      })
      const result = await createReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('CONFLICT')
      createCalled.should.equal(false)
    })

    it('persists a valid first review', async () => {
      let createCalled = false
      const repo = makeRepo({
        create: async () => {
          createCalled = true
        },
      })
      const result = await createReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('ok')
      createCalled.should.equal(true)
    })
  })

  describe('updateReviewUseCase', () => {
    const command = {
      orderItemId: 1,
      customerId: ownerId,
      rating: 2,
      customerRemark: 'changed my mind',
    }

    it('rejects updating a non-existent review with NOT_FOUND', async () => {
      let updateCalled = false
      const repo = makeRepo({
        getById: async () => null,
        update: async () => {
          updateCalled = true
        },
      })
      const result = await updateReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      updateCalled.should.equal(false)
    })

    it('rejects updating another owner review with UNAUTHORIZED', async () => {
      let updateCalled = false
      const repo = makeRepo({
        getById: async () => ({ ...existingReview, customer_id: otherId }),
        update: async () => {
          updateCalled = true
        },
      })
      const result = await updateReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('UNAUTHORIZED')
      updateCalled.should.equal(false)
    })

    it('updates the owner review', async () => {
      let updateCalled = false
      const repo = makeRepo({
        getById: async () => existingReview,
        update: async () => {
          updateCalled = true
        },
      })
      const result = await updateReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('ok')
      updateCalled.should.equal(true)
    })
  })

  describe('deleteReviewUseCase', () => {
    const command = { orderItemId: 1, customerId: ownerId }

    it('rejects deleting a non-existent review with NOT_FOUND', async () => {
      let removeCalled = false
      const repo = makeRepo({
        getById: async () => null,
        remove: async () => {
          removeCalled = true
        },
      })
      const result = await deleteReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      removeCalled.should.equal(false)
    })

    it('rejects deleting another owner review with UNAUTHORIZED', async () => {
      let removeCalled = false
      const repo = makeRepo({
        getById: async () => ({ ...existingReview, customer_id: otherId }),
        remove: async () => {
          removeCalled = true
        },
      })
      const result = await deleteReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('UNAUTHORIZED')
      removeCalled.should.equal(false)
    })

    it('deletes the owner review', async () => {
      let removeCalled = false
      const repo = makeRepo({
        getById: async () => existingReview,
        remove: async () => {
          removeCalled = true
        },
      })
      const result = await deleteReviewUseCase(anyRepo(repo))(command)
      result.kind.should.equal('ok')
      removeCalled.should.equal(true)
    })
  })
}
