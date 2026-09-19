import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import { createProductUseCase } from '../application/create-product.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'
import { Variant } from '../domain/product.js'

const useCase = createProductUseCase(knexProductRepository)

export const createProductHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.validatedQueryParams!
  const body = req.validatedBody!

  const variants: Variant[] = body.variants.map((variant: any) => ({
    sku: variant.sku,
    basePrice: variant.base_price,
    quantityAvailable: variant.quantity_available,
    options: variant.options.map((option: any) => ({
      optionName: option.option_name,
      value: option.value,
    })),
  }))

  const result = await useCase({
    title: body.title,
    categoryId: body.category_id,
    subcategoryId: body.subcategory_id,
    description: body.description ?? [],
    variants,
    vendorId: req.userId!,
    storeId: storeId as number,
  })

  if (result.kind === 'err') {
    throw new BadRequestError(result.error.message)
  }

  req.dbResult = result.value
  next()
}
