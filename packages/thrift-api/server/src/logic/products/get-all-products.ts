import { knex } from '#src/db/index.js'
import { Request, Response, NextFunction } from 'express'
import { handleSortQuery } from './utility.js'

export const getAllProductsLogic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { storeId, limit, sort, offset } = req.validatedQueryParams!
  let whereClause = ''
  const namedBindings: { [key: string]: any } = {}

  if (req.userId && storeId) {
    whereClause = `WHERE p.vendor_id=:vendorId AND p.store_id=:storeId`
    namedBindings.vendorId = req.userId
    namedBindings.storeId = storeId
  } else if (req.userId) {
    whereClause = `WHERE p.vendor_id=:vendorId`
    namedBindings.vendorId = req.userId
  } else if (storeId) {
    whereClause = `WHERE p.store_id=:storeId`
    namedBindings.storeId = storeId
  }

  /**
   * ARCHITECTURAL NOTE:
   * We use JSON_AGG here to move the O(n) reduction logic from the
   * Node.js Event Loop to the Postgres Engine.
   * Result: significant reduction in payload size and faster response times.
   */
  let dbQueryString = `
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
                    pv.list_price,
                    pv.net_price,
										pv.created_at,
										pv.updated_at,
                    pvi.quantity_available::int,
                    (
                        SELECT COALESCE(json_agg(option_data), '[]'::json)
                        FROM (
                            SELECT
                                po.option_id,
                                po.option_name,
                                pov.value_id,
                                pov.value
                            FROM variant_to_option_values vtov
                            JOIN product_option_values pov ON vtov.value_id = pov.value_id
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
			GROUP BY
				p.product_id, c.category_name, s.subcategory_name
			${sort ? `${handleSortQuery(sort)}` : ''}
			${limit ? `LIMIT ${limit}` : ''}
			${offset ? `OFFSET ${offset}` : ''})

SELECT JSON_AGG(product_data) AS products,
	(SELECT COUNT(*) FROM products) AS total_count FROM product_data;`

  const result = await knex.raw(dbQueryString, namedBindings)
  req.dbResult = result.rows[0]
  next()
}
