import { knex } from '#src/db/index.js'
import BadRequestError from '#src/errors/bad-request.js'
import { MediaRepository } from '../ports/media-repository.js'

export const knexMediaRepository: MediaRepository = {
  async createAvatar({ userId, file, description }) {
    const [media] = await knex('media')
      .insert({
        uploader_id: userId,
        filename: file.filename,
        filepath: file.filepath,
        filetype: file.filetype,
        description,
      })
      .returning('*')

    await knex('profile_media')
      .insert({ profile_id: userId, media_id: media.media_id })
      .onConflict('profile_id')
      .merge()

    const { uploader_id, ...mediaResponse } = media
    return { ...mediaResponse, profile_id: uploader_id }
  },

  async getAvatar(userId) {
    return knex('profile_media')
      .join('media', 'profile_media.media_id', 'media.media_id')
      .where({ profile_id: userId })
      .first(
        'profile_media.media_id',
        'filename',
        'filetype',
        'filepath',
        'description',
        'created_at',
        'updated_at',
        'profile_id',
      )
  },

  async updateAvatar({ userId, file, description }) {
    const { media_id } = await knex('profile_media')
      .where({ profile_id: userId })
      .first()

    const updateData: Record<string, unknown> = {}
    if (description !== undefined) updateData.description = description
    if (file?.filename !== undefined) updateData.filename = file.filename
    if (file?.filepath !== undefined) updateData.filepath = file.filepath
    if (file?.filetype !== undefined) updateData.filetype = file.filetype

    const [updatedMedia] = await knex('media')
      .where({ media_id })
      .update(updateData)
      .returning('*')

    const { uploader_id, ...updatedMediaResponse } = updatedMedia
    return { ...updatedMediaResponse, profile_id: uploader_id }
  },

  async deleteAvatar(userId) {
    const { media_id } = await knex('profile_media')
      .where({ profile_id: userId })
      .first()
    await knex('profile_media').where({ profile_id: userId }).del()
    await knex('media').where({ media_id }).del()
  },

  async createProductMedia({
    userId,
    productId,
    files,
    descriptions,
    isDisplayImage,
    isThumbnailImage,
    filetypes,
  }) {
    const variant = await knex('product_variants')
      .select('variant_id')
      .where({ product_id: productId })
      .first()

    if (!variant) {
      throw new BadRequestError(`No variants found for product_id ${productId}`)
    }
    const { variant_id } = variant

    const mediaDBResponse = await Promise.all(
      files.map(async (file) => {
        const originalname = file.originalname!

        const [media] = await knex('media')
          .insert({
            uploader_id: userId,
            filename: file.filename,
            filepath: file.filepath,
            description: descriptions[originalname],
            filetype: filetypes[originalname],
          })
          .returning('*')

        await knex('product_media_links').insert({
          variant_id,
          media_id: media.media_id,
          is_display_image: isDisplayImage[originalname],
          is_thumbnail_image: isThumbnailImage[originalname],
        })

        return { variant_id, ...media }
      }),
    )

    return mediaDBResponse
  },

  async getProductMedia(mediaId) {
    return knex('media as m')
      .join('product_media_links as pml', 'pml.media_id', 'm.media_id')
      .where('m.media_id', mediaId)
      .select()
  },

  async updateProductMedia({ mediaId, file, description, filetype }) {
    const updateData: Record<string, unknown> = {}
    if (description !== undefined) updateData.description = description
    if (file?.filename !== undefined) updateData.filename = file.filename
    if (file?.filepath !== undefined) updateData.filepath = file.filepath
    if (filetype !== undefined) updateData.filetype = filetype

    const [updatedMedia] = await knex('media')
      .where({ media_id: mediaId })
      .update(updateData)
      .returning('*')

    const { variant_id } = await knex('product_media_links')
      .where({ media_id: mediaId })
      .select('variant_id')
      .first()

    return { variant_id, ...updatedMedia }
  },

  async deleteProductMedia(mediaId) {
    await knex('product_media_links').where({ media_id: mediaId }).del()
    await knex('media').where({ media_id: mediaId }).del()
  },
}
