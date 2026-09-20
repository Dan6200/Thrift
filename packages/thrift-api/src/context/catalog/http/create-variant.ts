import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import { createVariantUseCase } from '../application/create-variant.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = createVariantUseCase(knexProductRepository)

export const createVariantHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams!
  const body = req.validatedBody!

  const result = await useCase({
    productId: Number(productId),
    storeId: storeId as number,
    variant: {
      sku: body.sku,
      basePrice: body.base_price,
      quantityAvailable: body.quantity_available,
      options: body.options.map((option: any) => ({
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
