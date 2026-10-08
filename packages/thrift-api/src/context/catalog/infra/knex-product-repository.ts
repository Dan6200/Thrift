import { knex } from '#src/db/index.js'
import NotFoundError from '#src/errors/not-found.js'
import { handleSortQuery } from '#src/logic/products/utility.js'
import {
  ProductRepository,
  PersistedProduct,
  PersistedVariant,
} from '../ports/product-repository.js'

export const knexProductRepository: ProductRepository = {
  async create({ product, vendorId, storeId }) {
    const created = await knex.transaction(async (trx) => {
      const [productRow] = await trx('products')
        .insert({
          title: product.title,
          description: product.description,
          category_id: product.categoryId,
          subcategory_id: product.subcategoryId,
          vendor_id: vendorId,
          store_id: storeId,
        })
        .returning('*')

      const createdVariants: PersistedVariant[] = []
      for (const variant of product.variants) {
        const valueIds = new Map<string, number>()
        const createdOptions = []

        for (const option of variant.options) {
          let { option_id } =
            (await trx('product_options')
              .where({
                product_id: productRow.product_id,
                option_name: option.optionName,
              })
              .first('option_id')) || {}

          if (!option_id) {
            ;[{ option_id }] = await trx('product_options')
              .insert({
                product_id: productRow.product_id,
                option_name: option.optionName.toUpperCase(),
              })
              .returning('option_id')
          }

          let { option_value_id } =
            (await trx('product_option_values')
              .where({ option_id, value: option.value })
              .first('option_value_id')) || {}

          if (!option_value_id) {
            ;[{ option_value_id }] = await trx('product_option_values')
              .insert({ option_id, value: option.value.toUpperCase() })
              .returning('option_value_id')
          }

          valueIds.set(option.value, option_value_id)
          createdOptions.push({
            option_id,
            option_value_id,
            option_name: option.optionName,
            value: option.value,
          })
        }

        const [newVariant] = await trx('product_variants')
          .insert({
            product_id: productRow.product_id,
            sku: variant.sku,
            base_price: variant.basePrice,
          })
          .returning([
            'variant_id',
            'sku',
            'base_price',
            'created_at',
            'updated_at',
          ])

        if (variant.quantityAvailable) {
          await trx('inventory').insert({
            variant_id: newVariant.variant_id,
            quantity_change: variant.quantityAvailable,
            reason: 'initial_stock',
          })
        }

        const links = Array.from(valueIds.values()).map((option_value_id) => ({
          variant_id: newVariant.variant_id,
          variant_value_id: option_value_id,
        }))
        await trx('variant_to_option_values').insert(links)

        createdVariants.push({
          ...newVariant,
          options: createdOptions,
          quantity_available: variant.quantityAvailable,
        })
      }

      return { ...productRow, variants: createdVariants }
    })

    return created as PersistedProduct
  },

  async getAll({ vendorId, storeId, sort, limit, offset }) {
    let whereClause = ''
    const namedBindings: Record<string, unknown> = {}

    if (vendorId && storeId) {
      whereClause = 'WHERE p.vendor_id=:vendorId AND p.store_id=:storeId'
      namedBindings.vendorId = vendorId
      namedBindings.storeId = storeId
    } else if (vendorId) {
      whereClause = 'WHERE p.vendor_id=:vendorId'
      namedBindings.vendorId = vendorId
    } else if (storeId) {
      whereClause = 'WHERE p.store_id=:storeId'
      namedBindings.storeId = storeId
    }

    const dbQueryString = `
      WITH product_data AS (
        SELECT
          p.*,
          c.category_name,
          s.subcategory_name,
          (
            SELECT json_agg(media_data)
            FROM (
              SELECT
                m.*,
                pml.is_display_image,
                pml.is_thumbnail_image,
                pml.variant_id
              FROM product_variants pv
              JOIN product_media_links pml ON pv.variant_id = pml.variant_id
              JOIN media m ON pml.media_id = m.media_id
              WHERE pv.product_id = p.product_id
            ) AS media_data
          ) AS media,
          (
            SELECT json_agg(variant_data)
            FROM (
              SELECT
                pv.variant_id,
                pv.sku,
                pv.base_price,
                pv.created_at,
                pv.updated_at,
                pvi.quantity_available::int,
                (
                  SELECT COALESCE(json_agg(option_data), '[]'::json)
                  FROM (
                    SELECT
                      po.option_id,
                      po.option_name,
                      pov.option_value_id,
                      pov.value
                    FROM variant_to_option_values vtov
                    JOIN product_option_values pov ON vtov.variant_value_id = pov.option_value_id
                    JOIN product_options po ON pov.option_id = po.option_id
                    WHERE vtov.variant_id = pv.variant_id
                  ) AS option_data
                ) AS options
              FROM product_variants pv
              LEFT JOIN product_variant_inventory pvi ON pv.variant_id = pvi.variant_id
              WHERE pv.product_id = p.product_id
            ) AS variant_data
          ) AS variants,
          COALESCE(AVG(pr.rating), 0)::numeric(3,2) AS average_rating,
          COALESCE(COUNT(pr.rating), 0)::int AS review_count,
          COALESCE(SUM(oi.quantity), 0)::int AS products_sold
        FROM products p
        JOIN categories c USING (category_id)
        JOIN subcategories s USING (subcategory_id)
        LEFT JOIN product_variants pv ON p.product_id = pv.product_id
        LEFT JOIN order_items oi ON pv.variant_id = oi.variant_id
        LEFT JOIN product_reviews pr ON oi.order_item_id = pr.order_item_id
        ${whereClause}
        GROUP BY p.product_id, c.category_name, s.subcategory_name
        ${sort ? handleSortQuery(sort) : ''}
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}
      )
      SELECT JSON_AGG(product_data) AS products,
        (SELECT COUNT(*) FROM products) AS total_count
      FROM product_data;
    `

    const result = await knex.raw(dbQueryString, namedBindings)
    return result.rows[0]
  },

  async getById({ productId, vendorId, storeId }) {
    let whereClause = ' WHERE p.product_id=:productId '
    if (vendorId && storeId) {
      whereClause += 'AND p.vendor_id=:vendorId AND p.store_id=:storeId'
    } else if (vendorId) {
      whereClause += 'AND p.vendor_id=:vendorId'
    } else if (storeId) {
      whereClause += 'AND p.store_id=:storeId'
    }

    const dbQueryString = `
      SELECT
        p.*,
        c.category_name,
        s.subcategory_name,
        (
          SELECT json_agg(media_data)
          FROM (
            SELECT
              m.*,
              pml.is_display_image,
              pml.is_thumbnail_image,
              pml.variant_id
            FROM product_variants pv
            JOIN product_media_links pml ON pv.variant_id = pml.variant_id
            JOIN media m ON pml.media_id = m.media_id
            WHERE pv.product_id = p.product_id
          ) AS media_data
        ) AS media,
        (
          SELECT json_agg(variant_data)
          FROM (
            SELECT
              pv.variant_id,
              pv.sku,
              pv.base_price,
              pv.created_at,
              pv.updated_at,
              pvi.quantity_available,
              (
                SELECT COALESCE(json_agg(option_data), '[]'::json)
                FROM (
                  SELECT
                    po.option_id,
                    po.option_name,
                    pov.option_value_id,
                    pov.value
                  FROM variant_to_option_values vtov
                  JOIN product_option_values pov ON vtov.variant_value_id = pov.option_value_id
                  JOIN product_options po ON pov.option_id = po.option_id
                  WHERE vtov.variant_id = pv.variant_id
                ) AS option_data
              ) AS options
            FROM product_variants pv
            LEFT JOIN product_variant_inventory pvi ON pv.variant_id = pvi.variant_id
            WHERE pv.product_id = p.product_id
          ) AS variant_data
        ) AS variants,
        COALESCE(AVG(pr.rating), 0)::numeric(3,2) AS average_rating,
        COALESCE(COUNT(pr.rating), 0)::int AS review_count,
        COALESCE(SUM(oi.quantity), 0)::int AS products_sold
      FROM products p
      JOIN categories c USING (category_id)
      JOIN subcategories s USING (subcategory_id)
      LEFT JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN order_items oi ON pv.variant_id = oi.variant_id
      LEFT JOIN product_reviews pr ON oi.order_item_id = pr.order_item_id
      ${whereClause}
      GROUP BY p.product_id, c.category_name, s.subcategory_name
    `

    const result = await knex.raw(dbQueryString, {
      productId,
      storeId,
      vendorId,
    })
    return result.rows[0] ?? null
  },

  async update({ productId, storeId, vendorId, data }) {
    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId
    if (data.subcategoryId !== undefined)
      updateData.subcategory_id = data.subcategoryId
    if (data.description !== undefined)
      updateData.description = data.description

    const [updatedProduct] = await knex('products')
      .where({ product_id: productId, store_id: storeId, vendor_id: vendorId })
      .update(updateData)
      .returning('*')

    return updatedProduct as PersistedProduct
  },

  async remove({ productId, storeId, vendorId }) {
    await knex('products')
      .where({ product_id: productId, store_id: storeId, vendor_id: vendorId })
      .del()
  },

  async createVariant({ productId, storeId, variant }) {
    const product = await knex('products')
      .where({ product_id: productId, store_id: storeId })
      .first('product_id')
    if (!product) {
      throw new NotFoundError('Product not found in this store.')
    }

    const newVariant = await knex.transaction(async (trx) => {
      const valueMap = new Map<
        string,
        { value: string; option_value_id: number }
      >()

      for (const option of variant.options) {
        let optionResult =
          (await trx('product_options')
            .where({ product_id: productId, option_name: option.optionName })
            .first(['option_id', 'option_name'])) || {}

        if (!optionResult.option_id) {
          ;[optionResult] = await trx('product_options')
            .insert({ product_id: productId, option_name: option.optionName })
            .returning(['option_id', 'option_name'])
        }

        let value =
          (await trx('product_option_values')
            .where({ option_id: optionResult.option_id, value: option.value })
            .first(['option_value_id', 'value'])) || {}

        if (!value.option_value_id) {
          ;[value] = await trx('product_option_values')
            .insert({ option_id: optionResult.option_id, value: option.value })
            .returning(['option_value_id', 'value'])
        }
        valueMap.set(option.value, { ...optionResult, ...value })
      }

      const [createdVariant] = await trx('product_variants')
        .insert({
          product_id: productId,
          sku: variant.sku,
          base_price: variant.basePrice,
        })
        .returning('*')

      if (variant.quantityAvailable) {
        await trx('inventory').insert({
          variant_id: createdVariant.variant_id,
          quantity_change: variant.quantityAvailable,
          reason: 'initial_stock',
        })
      }

      const links = variant.options.map((option) => ({
        variant_id: createdVariant.variant_id,
        variant_value_id: valueMap.get(option.value).option_value_id,
      }))
      await trx('variant_to_option_values').insert(links)

      const { quantity_available } = await trx('product_variant_inventory')
        .where({ variant_id: createdVariant.variant_id })
        .first('quantity_available')

      return {
        ...createdVariant,
        options: [...valueMap.values()],
        quantity_available,
      }
    })

    return newVariant as PersistedVariant
  },

  async updateVariant({ productId, variantId, storeId, changes }) {
    const variant = await knex('product_variants as pv')
      .join('products as p', 'pv.product_id', 'p.product_id')
      .where({
        'pv.variant_id': variantId,
        'pv.product_id': productId,
        'p.store_id': storeId,
      })
      .first('pv.variant_id')

    if (!variant) {
      throw new NotFoundError(
        'Variant not found for this product in this store.',
      )
    }

    const variantDataWithoutQA: Record<string, unknown> = {}
    if (changes.sku !== undefined) variantDataWithoutQA.sku = changes.sku
    if (changes.basePrice !== undefined) {
      variantDataWithoutQA.base_price = changes.basePrice
    }

    const trx = await knex.transaction()
    try {
      let updatedVariant
      if (Object.keys(variantDataWithoutQA).length) {
        ;[updatedVariant] = await trx('product_variants')
          .where({ variant_id: variantId })
          .update(variantDataWithoutQA)
          .returning('*')
      } else {
        updatedVariant = await trx('product_variants')
          .where({ variant_id: variantId })
          .first()
      }

      let finalQuantity: number
      if (changes.quantityAvailable !== undefined) {
        const inventoryRecords = await trx('inventory')
          .where({ variant_id: variantId })
          .select('quantity_change')
          .forUpdate()

        const currentQuantity = inventoryRecords.reduce(
          (sum, record) => sum + record.quantity_change,
          0,
        )
        const quantityChange = changes.quantityAvailable - currentQuantity

        if (quantityChange !== 0) {
          await trx('inventory').insert({
            variant_id: variantId,
            quantity_change: quantityChange,
            reason: changes.inventoryChangeReason,
            notes: changes.inventoryChangeNotes,
          })
        }
        finalQuantity = currentQuantity + quantityChange
      } else {
        const { quantity_available } = await trx('product_variant_inventory')
          .where({ variant_id: variantId })
          .first('quantity_available')
        finalQuantity = quantity_available
      }

      const options = await trx('variant_to_option_values as vtov')
        .join(
          'product_option_values as pov',
          'vtov.variant_value_id',
          'pov.option_value_id',
        )
        .join('product_options as po', 'pov.option_id', 'po.option_id')
        .where('vtov.variant_id', updatedVariant?.variant_id ?? variantId)
        .select(
          'po.option_id',
          'po.option_name',
          'pov.option_value_id',
          'pov.value',
        )

      await trx.commit()

      return {
        ...updatedVariant,
        options,
        quantity_available: finalQuantity,
      } as PersistedVariant
    } catch (error) {
      await trx.rollback()
      throw error
    }
  },

  async removeVariant({ productId, variantId, storeId }) {
    const variant = await knex('product_variants as pv')
      .join('products as p', 'pv.product_id', 'p.product_id')
      .where({
        'pv.variant_id': variantId,
        'pv.product_id': productId,
        'p.store_id': storeId,
      })
      .first('pv.variant_id')

    if (!variant) {
      throw new NotFoundError(
        'Variant not found for this product in this store.',
      )
    }

    await knex('product_variants').where({ variant_id: variantId }).del()
  },
}
