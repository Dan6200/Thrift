import { NextFunction, Request, Response } from 'express'
import BadRequestError from '#src/errors/bad-request.js'
import { createProductMediaUseCase } from '../application/create-product-media.js'
import { knexMediaRepository } from '../infra/knex-media-repository.js'

const useCase = createProductMediaUseCase(knexMediaRepository)

const parseJsonField = (value: any): any => {
  if (value && typeof value === 'string') {
    return JSON.parse(value)
  }
  return value
}

export const createProductMediaHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId, body, files } = req
  const {
    product_id,
    descriptions,
    is_display_image,
    is_thumbnail_image,
    filetypes,
  } = body

  if (!product_id) {
    throw new BadRequestError('product_id is required')
  }
  if (!userId) {
    throw new BadRequestError('User not found')
  }

  const parsedDescriptions = parseJsonField(descriptions)
  const parsedIsDisplayImage = parseJsonField(is_display_image)
  const parsedIsThumbnailImage = parseJsonField(is_thumbnail_image)
  const parsedFiletypes = parseJsonField(filetypes)

  const filesArray = Array.isArray(files) ? files : [files]
  if (!filesArray || filesArray.length === 0 || !filesArray[0]) {
    throw new BadRequestError('No files uploaded')
  }

  req.dbResult = await useCase({
    userId,
    productId: Number(product_id),
    files: filesArray.map((file: any) => ({
      filename: file.filename,
      filepath: file.path,
      filetype: file.mimetype,
      originalname: file.originalname,
    })),
    descriptions: parsedDescriptions,
    isDisplayImage: parsedIsDisplayImage,
    isThumbnailImage: parsedIsThumbnailImage,
    filetypes: parsedFiletypes,
  })
  next()
}
