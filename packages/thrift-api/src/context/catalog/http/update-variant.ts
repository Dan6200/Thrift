import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import { updateVariantUseCase } from '../application/update-variant.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = updateVariantUseCase(knexProductRepository)

export const updateVariantHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId, variantId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams!
  const body = req.validatedBody!

  const result = await useCase({
    productId: Number(productId),
    variantId: Number(variantId),
    storeId: storeId as number,
    changes: {
      sku: body.sku,
      basePrice: body.base_price,
      quantityAvailable: body.quantity_available,
      inventoryChangeReason: body.inventory_change_reason,
      inventoryChangeNotes: body.inventory_change_notes,
      options: body.options?.map((option: any) => ({
        optionName: option.option_name,
        value: option.value,
      })),
    },
  })

  if (result.kind === 'err') {
    throw new BadRequestError(result.error.message)
  }

  req.dbResult = result.value
  next()
}
