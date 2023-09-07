//cspell:ignore originalname
import { StatusCodes } from 'http-status-codes'
import {
  InsertRecord,
  UpdateRecord,
} from '../helpers/generate-sql-commands/index.js'
import BadRequestError from '../../errors/bad-request.js'
import db from '../../db/index.js'

const uploadProductMedia = async (req: any, res: any) => {
  const { productId } = req.query
  let { descriptions, is_display_image, is_landing_image, is_video } = req.body

  if (descriptions) descriptions = JSON.parse(descriptions)
  else throw new BadRequestError('No descriptions provided')

  let files = <any>await Promise.all(
    req.files.map(async (file: any) => {
      const { filename, originalname, path: filepath } = file
      // Returns filename as Id instead of product_id
      return (
        await db.query({
          text: InsertRecord(
            'product_media',
            [
              'product_id',
              'filename',
              'filepath',
              'description',
              'is_display_image',
              'is_landing_image',
              'is_video',
            ],
            'filename'
          ),
          values: [
            productId,
            filename,
            filepath,
            descriptions[originalname],
            !!is_display_image,
            !!is_landing_image,
            !!is_video,
          ],
        })
      ).rows[0]
    })
  )
  res.status(StatusCodes.CREATED).send(files)
}

export { uploadProductMedia }
