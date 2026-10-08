import { pg } from '#src/db/index.js'
import BadRequestError from '#src/errors/bad-request.js'
import { AnalyticsRepository } from '../ports/analytics-repository.js'
import {
  validateAnalyticsQueryParams,
  getDateRangeClause,
  getIntervalTruncation,
  getPaginationAndSortClauses,
} from './query-utils.js'

export const knexAnalyticsRepository: AnalyticsRepository = {
  async getKPIs(storeId, query) {
    const { parsedStartDate, parsedEndDate } =
      validateAnalyticsQueryParams(query)

    const sqlParams: (string | Date | number)[] = [storeId]
    let paramIndex = 2

    const { clause: orderDateClause, nextParamIndex: orderDateParamIndex } =
      getDateRangeClause(
        parsedStartDate,
        parsedEndDate,
        'o.order_date',
        sqlParams,
        paramIndex,
      )
    paramIndex = orderDateParamIndex

    const {
      clause: profileCreatedAtClause,
      nextParamIndex: profileCreatedAtParamIndex,
    } = getDateRangeClause(
      parsedStartDate,
      parsedEndDate,
      'p_customer.created_at',
      sqlParams,
      paramIndex,
    )
    paramIndex = profileCreatedAtParamIndex

    const dbQueryString = `
      SELECT
        COALESCE(SUM(o.total_amount), 0.00) AS "totalRevenue",
        COUNT(DISTINCT o.order_id) AS "totalOrders",
        COALESCE(AVG(o.total_amount), 0.00) AS "averageOrderValue",
        COUNT(DISTINCT CASE WHEN p_customer.created_at ${
          profileCreatedAtClause
            ? profileCreatedAtClause.replace('AND p_customer.created_at', '')
            : ''
        } THEN p_customer.id ELSE NULL END) AS "newCustomers",
        COUNT(DISTINCT CASE WHEN p_customer.created_at NOT ${
          profileCreatedAtClause
            ? profileCreatedAtClause.replace('AND p_customer.created_at', '')
            : ''
        } AND o.customer_id IS NOT NULL THEN p_customer.id ELSE NULL END) AS "returningCustomers"
      FROM orders o
      LEFT JOIN profiles p_customer ON o.customer_id = p_customer.id
      WHERE o.store_id = $1
      ${orderDateClause}
    ;`

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getRevenueTrends(storeId, query) {
    const { parsedStartDate, parsedEndDate, interval } =
      validateAnalyticsQueryParams(query)

    if (!parsedStartDate || !parsedEndDate) {
      throw new BadRequestError(
        'Start date and end date are required for revenue trends.',
      )
    }
    const allowedIntervals = ['day', 'week', 'month', 'year']
    if (interval && !allowedIntervals.includes(interval)) {
      throw new BadRequestError(
        'Invalid interval. Must be day, week, month, or year.',
      )
    }

    const sqlParams: (string | Date | number)[] = [storeId]
    let paramIndex = 2

    const { clause: orderDateClause, nextParamIndex } = getDateRangeClause(
      parsedStartDate,
      parsedEndDate,
      'order_date',
      sqlParams,
      paramIndex,
    )
    paramIndex = nextParamIndex

    const dateTruncationFunction = getIntervalTruncation(interval || 'day')

    const dbQueryString = `
      SELECT
        ${dateTruncationFunction}::date AS date,
        COALESCE(SUM(total_amount), 0.00) AS revenue
      FROM orders
      WHERE store_id = $1
      ${orderDateClause}
      GROUP BY date
      ORDER BY date ASC;`

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getSalesAnalytics(storeId, query) {
    const {
      parsedStartDate,
      parsedEndDate,
      type,
      parsedLimit,
      parsedOffset,
      sortBy,
      sortOrder,
      status,
    } = validateAnalyticsQueryParams(query)

    if (!type) {
      throw new BadRequestError(
        'Sales report type (by-product, by-category, recent-orders) is required.',
      )
    }

    const sqlParams: (string | Date | number)[] = [storeId]
    let paramIndex = 2
    let dbQueryString = ''

    const { clause: orderDateClause, nextParamIndex } = getDateRangeClause(
      parsedStartDate,
      parsedEndDate,
      'o.order_date',
      sqlParams,
      paramIndex,
    )
    paramIndex = nextParamIndex

    switch (type) {
      case 'by-product':
        if (sortBy && !['unitsSold', 'totalRevenue'].includes(sortBy)) {
          throw new BadRequestError(
            'Invalid sortBy for by-product. Must be unitsSold or totalRevenue.',
          )
        }
        const sortColumnProduct =
          sortBy === 'totalRevenue' ? '"totalRevenue"' : '"unitsSold"'
        const paginationSortClauseProduct = getPaginationAndSortClauses(
          sortColumnProduct,
          sortOrder || 'desc',
          parsedLimit,
          parsedOffset,
        )
        dbQueryString = `
          SELECT
            p.product_id AS "productId",
            p.title AS "productTitle",
            COALESCE(SUM(oi.quantity), 0) AS "unitsSold",
            COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0.00) AS "totalRevenue"
          FROM products p
          JOIN product_variants pv ON p.product_id = pv.product_id
          JOIN order_items oi ON pv.variant_id = oi.variant_id
          JOIN orders o ON oi.order_id = o.order_id
          WHERE p.store_id = $1 ${orderDateClause}
          GROUP BY p.product_id, p.title
          ${paginationSortClauseProduct};
        `
        break

      case 'by-category':
        dbQueryString = `
          SELECT
            c.category_id AS "categoryId",
            c.category_name AS "categoryName",
            COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0.00) AS "totalRevenue"
          FROM categories c
          JOIN products p ON c.category_id = p.category_id
          JOIN product_variants pv ON p.product_id = pv.product_id
          JOIN order_items oi ON pv.variant_id = oi.variant_id
          JOIN orders o ON oi.order_id = o.order_id
          WHERE p.store_id = $1 ${orderDateClause}
          GROUP BY c.category_id, c.category_name
          ORDER BY "totalRevenue" DESC;
        `
        break

      case 'recent-orders':
        let statusClause = ''
        if (status) {
          statusClause = `AND o.status = $${paramIndex}`
          sqlParams.push(status as string)
          paramIndex++
        }
        const paginationSortClauseOrder = getPaginationAndSortClauses(
          'o.order_date',
          'desc',
          parsedLimit || 10,
          parsedOffset,
        )
        dbQueryString = `
          SELECT
            o.order_id AS "orderId",
            COALESCE(p_customer.first_name || ' ' || p_customer.last_name, 'Guest Customer') AS "customerName",
            o.total_amount AS "totalAmount",
            o.status AS status,
            o.order_date AS "orderDate"
          FROM orders o
          LEFT JOIN profiles p_customer ON o.customer_id = p_customer.id
          WHERE o.store_id = $1 ${orderDateClause} ${statusClause}
          ${paginationSortClauseOrder};
        `
        break

      default:
        throw new BadRequestError('Invalid sales report type.')
    }

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getCustomerAcquisitionTrends(storeId, query) {
    const { parsedStartDate, parsedEndDate, interval } =
      validateAnalyticsQueryParams(query)

    if (!parsedStartDate || !parsedEndDate) {
      throw new BadRequestError(
        'Start date and end date are required for customer acquisition trends.',
      )
    }
    const allowedIntervals = ['day', 'week', 'month', 'year']
    if (interval && !allowedIntervals.includes(interval)) {
      throw new BadRequestError(
        'Invalid interval. Must be day, week, month, or year.',
      )
    }

    const sqlParams: (string | Date | number)[] = [storeId]
    let paramIndex = 2

    const { clause: profileCreatedAtClause, nextParamIndex } =
      getDateRangeClause(
        parsedStartDate,
        parsedEndDate,
        'p.created_at',
        sqlParams,
        paramIndex,
      )
    paramIndex = nextParamIndex

    const dateTruncationFunction = getIntervalTruncation(
      interval || 'month',
    ).replace('order_date', 'p.created_at')

    const dbQueryString = `
      SELECT
        ${dateTruncationFunction}::date AS date,
        COUNT(DISTINCT p.id) AS "newCustomers"
      FROM profiles p
      WHERE p.id IN (
          SELECT customer_id FROM orders WHERE store_id = $1
      )
      ${profileCreatedAtClause}
      GROUP BY date
      ORDER BY date ASC;
    `

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getCustomersByLocation(storeId, query) {
    const { locationType } = validateAnalyticsQueryParams(query)

    const allowedLocationTypes = ['country', 'city']
    if (locationType && !allowedLocationTypes.includes(locationType)) {
      throw new BadRequestError(
        'Invalid locationType. Must be country or city.',
      )
    }

    const groupByColumn = locationType === 'city' ? 'a.city' : 'a.country'
    const sqlParams: (string | number)[] = [storeId]

    const dbQueryString = `
      SELECT
        ${groupByColumn} AS "location",
        COUNT(DISTINCT p.id) AS "customerCount"
      FROM profiles p
      JOIN delivery_info di ON p.id = di.customer_id
      JOIN address a ON di.address_id = a.address_id
      WHERE p.id IN (SELECT customer_id FROM orders WHERE store_id = $1)
      GROUP BY "location"
      ORDER BY "customerCount" DESC;
    `

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getCustomerLifetimeValue(storeId, query) {
    const { parsedLimit, parsedOffset, sortBy, sortOrder } =
      validateAnalyticsQueryParams(query)

    if (sortBy && !['clv', 'customerName'].includes(sortBy)) {
      throw new BadRequestError(
        'Invalid sortBy for CLV. Must be clv or customerName.',
      )
    }
    const sortColumn = sortBy === 'customerName' ? 'customer_name' : 'clv'
    const paginationSortClause = getPaginationAndSortClauses(
      sortColumn,
      sortOrder || 'desc',
      parsedLimit,
      parsedOffset,
    )

    const sqlParams: (string | number)[] = [storeId]

    const dbQueryString = `
      SELECT
        p.id AS "customerId",
        COALESCE(p.first_name || ' ' || p.last_name, 'Guest Customer') AS "customerName",
        COALESCE(SUM(o.total_amount), 0.00) AS clv
      FROM profiles p
      JOIN orders o ON p.id = o.customer_id
      WHERE o.store_id = $1
      GROUP BY p.id, "customerName"
      ${paginationSortClause};
    `

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getTopSellingProducts(storeId, query) {
    const { parsedStartDate, parsedEndDate, sortBy, parsedLimit } =
      validateAnalyticsQueryParams(query)

    if (sortBy && !['units', 'revenue'].includes(sortBy)) {
      throw new BadRequestError('Invalid sortBy. Must be units or revenue.')
    }
    const sortColumn = sortBy === 'revenue' ? '"totalRevenue"' : '"unitsSold"'
    const paginationSortClause = getPaginationAndSortClauses(
      sortColumn,
      'desc',
      parsedLimit || 10,
      null,
    )

    const sqlParams: (string | Date | number)[] = [storeId]
    let paramIndex = 2

    const { clause: orderDateClause, nextParamIndex } = getDateRangeClause(
      parsedStartDate,
      parsedEndDate,
      'o.order_date',
      sqlParams,
      paramIndex,
    )
    paramIndex = nextParamIndex

    const dbQueryString = `
      SELECT
        p.product_id AS "productId",
        p.title AS "productTitle",
        COALESCE(SUM(oi.quantity), 0) AS "unitsSold",
        COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0.00) AS "totalRevenue"
      FROM products p
      JOIN product_variants pv ON p.product_id = pv.product_id
      JOIN order_items oi ON pv.variant_id = oi.variant_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE p.store_id = $1 ${orderDateClause}
      GROUP BY p.product_id, p.title
      ${paginationSortClause};
    `

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getLowStockProducts(storeId, query) {
    const { parsedLimit, parsedOffset, threshold } =
      validateAnalyticsQueryParams(query)

    const stockThreshold = threshold !== null ? threshold : 20
    if (stockThreshold < 0) {
      throw new BadRequestError('Threshold cannot be negative.')
    }

    const paginationSortClause = getPaginationAndSortClauses(
      '"quantityAvailable"',
      'asc',
      parsedLimit,
      parsedOffset,
    )

    const sqlParams: (string | number)[] = [storeId, stockThreshold]

    const dbQueryString = `
      SELECT
        p.product_id AS "productId",
        p.title AS "productTitle",
        COALESCE(SUM(pvi.total_quantity_available), 0)::int AS "quantityAvailable"
      FROM products p
      JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN (
          SELECT
              variant_id,
              SUM(quantity_available) AS total_quantity_available
          FROM product_variant_inventory
          GROUP BY variant_id
      ) AS pvi ON pv.variant_id = pvi.variant_id
      WHERE p.store_id = $1
      GROUP BY p.product_id, p.title
      HAVING COALESCE(SUM(pvi.total_quantity_available), 0) <= $2
      ${paginationSortClause};
    `

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },

  async getProductPerformance(storeId, query) {
    const { parsedStartDate, parsedEndDate, parsedLimit, parsedOffset } =
      validateAnalyticsQueryParams(query)

    const paginationSortClause = getPaginationAndSortClauses(
      'purchases',
      'desc',
      parsedLimit,
      parsedOffset,
    )

    const sqlParams: (string | Date | number)[] = [storeId]
    let paramIndex = 2

    const { clause: orderDateClause, nextParamIndex } = getDateRangeClause(
      parsedStartDate,
      parsedEndDate,
      'o.order_date',
      sqlParams,
      paramIndex,
    )
    paramIndex = nextParamIndex

    const dbQueryString = `
      SELECT
        p.product_id AS "productId",
        p.title AS "productTitle",
        COALESCE(SUM(oi.quantity), 0) AS purchases,
        NULL AS views
      FROM products p
      JOIN product_variants pv ON p.product_id = pv.product_id
      JOIN order_items oi ON pv.variant_id = oi.variant_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE p.store_id = $1 ${orderDateClause}
      GROUP BY p.product_id, p.title
      ${paginationSortClause};
    `

    const result = await pg.query(dbQueryString, sqlParams)
    return result.rows
  },
}
