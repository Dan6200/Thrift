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
  let { descriptions, is_display_image } = req.body

  if (!is_display_image)
    throw new BadRequestError('Must specify if image is display image')

  const isDisplayImage = JSON.parse(is_display_image)

  if (descriptions) descriptions = JSON.parse(descriptions)
  else throw new BadRequestError('No descriptions provided')

  let files = <any>await Promise.all(
    req.files.map(async (file: any) => {
      const { filename, originalname, path: filepath } = file
      // Returns filename as Id instead of product_id
      const res = (
        await db.query({
          text: InsertRecord(
            'product_media',
            ['product_id', 'filename', 'filepath', 'description'],
            'filename'
          ),
          values: [productId, filename, filepath, descriptions[originalname]],
        })
      ).rows[0]

      // Add or update the display image table
      if (isDisplayImage[originalname]) {
        const exists = (
          await db.query({
            text: `SELECT true FROM product_display_image WHERE filename=$1`,
            values: [filename],
          })
        ).rows[0]
        if (exists == null) {
          await db.query({
            text: InsertRecord(
              'product_display_image',
              ['filename'],
              'filename'
            ),
            values: [filename],
          })
        } else {
          await db.query({
            text: UpdateRecord('product_display_image', 'filename', [
              'filename',
            ]),
            values: [filename],
          })
        }
      }
      return res
    })
  )
  res.status(StatusCodes.CREATED).send(files)
}

export { uploadProductMedia }
