import { knex } from '#src/db/index.js'
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
}
