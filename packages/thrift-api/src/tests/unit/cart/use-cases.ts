import chai from 'chai'
import { addItemUseCase } from '#src/context/cart/application/add-item.js'
import { updateItemUseCase } from '#src/context/cart/application/update-item.js'
import { removeItemUseCase } from '#src/context/cart/application/remove-item.js'
import { CartRepository } from '#src/context/cart/ports/cart-repository.js'

chai.should()

const makeRepo = (overrides: Partial<CartRepository> = {}): CartRepository => ({
  async getCart(): Promise<unknown> {
    return null
  },
  async getStock(): Promise<number> {
    return 10
  },
  async getCartId(): Promise<number | null> {
    return 1
  },
  async getCartItem(): Promise<{ variant_id: number } | null> {
    return { variant_id: 1 }
  },
  async addItem(): Promise<unknown> {
    return {}
  },
  async updateItem(): Promise<unknown> {
    return {}
  },
  async removeItem(): Promise<number> {
    return 1
  },
  ...overrides,
})

export default () => {
  describe('addItemUseCase', () => {
    it('rejects a zero quantity without touching the repository', async () => {
      let addCalled = false
      const repo = makeRepo({
        addItem: async () => {
          addCalled = true
        },
      })
      const result = await addItemUseCase(repo)({
        customerId: 'c1',
        variantId: 1,
        quantity: 0,
      })
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('INVALID_INPUT')
      addCalled.should.equal(false)
    })

    it('rejects a quantity above available stock', async () => {
      let addCalled = false
      const repo = makeRepo({
        getStock: async () => 5,
        addItem: async () => {
          addCalled = true
        },
      })
      const result = await addItemUseCase(repo)({
        customerId: 'c1',
        variantId: 1,
        quantity: 6,
      })
      result.kind.should.equal('err')
      addCalled.should.equal(false)
    })

    it('adds an item when the quantity is within stock', async () => {
      let addCalled = false
      const repo = makeRepo({
        addItem: async () => {
          addCalled = true
        },
      })
      const result = await addItemUseCase(repo)({
        customerId: 'c1',
        variantId: 1,
        quantity: 2,
      })
      result.kind.should.equal('ok')
      addCalled.should.equal(true)
    })
  })

  describe('updateItemUseCase', () => {
    const command = { customerId: 'c1', itemId: 1, quantity: 3 }

    it('rejects when the customer has no cart with NOT_FOUND', async () => {
      let updateCalled = false
      const repo = makeRepo({
        getCartId: async () => null,
        updateItem: async () => {
          updateCalled = true
        },
      })
      const result = await updateItemUseCase(repo)(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      updateCalled.should.equal(false)
    })

    it('rejects a non-existent cart item with NOT_FOUND', async () => {
      let updateCalled = false
      const repo = makeRepo({
        getCartItem: async () => null,
        updateItem: async () => {
          updateCalled = true
        },
      })
      const result = await updateItemUseCase(repo)(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      updateCalled.should.equal(false)
    })

    it('rejects a quantity above available stock', async () => {
      let updateCalled = false
      const repo = makeRepo({
        getStock: async () => 2,
        updateItem: async () => {
          updateCalled = true
        },
      })
      const result = await updateItemUseCase(repo)(command)
      result.kind.should.equal('err')
      updateCalled.should.equal(false)
    })

    it('updates the item when valid', async () => {
      let updateCalled = false
      const repo = makeRepo({
        updateItem: async () => {
          updateCalled = true
        },
      })
      const result = await updateItemUseCase(repo)(command)
      result.kind.should.equal('ok')
      updateCalled.should.equal(true)
    })
  })

  describe('removeItemUseCase', () => {
    const command = { customerId: 'c1', itemId: 1 }

    it('rejects when the customer has no cart with NOT_FOUND', async () => {
      let removeCalled = false
      const repo = makeRepo({
        getCartId: async () => null,
        removeItem: async () => {
          removeCalled = true
          return 0
        },
      })
      const result = await removeItemUseCase(repo)(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
      removeCalled.should.equal(false)
    })

    it('rejects when no row was removed with NOT_FOUND', async () => {
      const repo = makeRepo({
        removeItem: async () => 0,
      })
      const result = await removeItemUseCase(repo)(command)
      result.kind.should.equal('err')
      if (result.kind === 'err') result.error.code.should.equal('NOT_FOUND')
    })

    it('removes the item when it exists', async () => {
      let removeCalled = false
      const repo = makeRepo({
        removeItem: async () => {
          removeCalled = true
          return 1
        },
      })
      const result = await removeItemUseCase(repo)(command)
      result.kind.should.equal('ok')
      removeCalled.should.equal(true)
    })
  })
}
