import { NextFunction, Request, Response } from 'express'
import { updateProductUseCase } from '../application/update-product.js'
import { knexProductRepository } from '../infra/knex-product-repository.js'

const useCase = updateProductUseCase(knexProductRepository)

export const updateProductHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { productId } = req.validatedParams!
  const { storeId } = req.validatedQueryParams!
  const body = req.validatedBody!

  req.dbResult = await useCase({
    productId: Number(productId),
    storeId: storeId as number,
    vendorId: req.userId!,
    data: {
      title: body.title,
      categoryId: body.category_id,
      subcategoryId: body.subcategory_id,
      description: body.description,
    },
  })
  next()
}
