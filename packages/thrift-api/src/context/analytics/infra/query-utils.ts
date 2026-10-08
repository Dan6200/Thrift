import BadRequestError from '#src/errors/bad-request.js'

export function validateAnalyticsQueryParams(query: Record<string, any>) {
  const {
    startDate,
    endDate,
    limit,
    offset,
    sortBy,
    sortOrder,
    interval,
    locationType,
    type,
    status,
    threshold,
  } = query

  const parsedStartDate = startDate ? new Date(startDate as string) : null
  const parsedEndDate = endDate ? new Date(endDate as string) : null

  if (
    (startDate && isNaN(parsedStartDate.getTime())) ||
    (endDate && isNaN(parsedEndDate.getTime()))
  ) {
    throw new BadRequestError('Invalid date format. Use ISO 8601 (YYYY-MM-DD).')
  }
  if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
    throw new BadRequestError('Start date cannot be after end date.')
  }

  const parsedLimit = limit ? parseInt(limit as string) : null
  const parsedOffset = offset ? parseInt(offset as string) : null

  if (limit && (isNaN(parsedLimit) || parsedLimit <= 0)) {
    throw new BadRequestError('Limit must be a positive integer.')
  }
  if (offset && (isNaN(parsedOffset) || parsedOffset < 0)) {
    throw new BadRequestError('Offset must be a non-negative integer.')
  }

  return {
    parsedStartDate,
    parsedEndDate,
    parsedLimit,
    parsedOffset,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    interval: interval as 'day' | 'week' | 'month' | 'year',
    locationType: locationType as 'country' | 'city',
    type: type as 'by-product' | 'by-category' | 'recent-orders',
    status: status as string,
    threshold: threshold ? parseInt(threshold as string) : null,
  }
}

export function getDateRangeClause(
  startDate: Date | null,
  endDate: Date | null,
  column: string,
  params: (string | Date | number)[],
  paramIndex: number,
): { clause: string; nextParamIndex: number } {
  let clause = ''
  if (startDate && endDate) {
    clause = `AND ${column} BETWEEN $${paramIndex} AND $${paramIndex + 1}`
    params.push(startDate, endDate)
    paramIndex += 2
  } else if (startDate) {
    clause = `AND ${column} >= $${paramIndex}`
    params.push(startDate)
    paramIndex += 1
  } else if (endDate) {
    clause = `AND ${column} <= $${paramIndex}`
    params.push(endDate)
    paramIndex += 1
  }
  return { clause, nextParamIndex: paramIndex }
}

export function getIntervalTruncation(
  interval: 'day' | 'week' | 'month' | 'year',
): string {
  switch (interval) {
    case 'day':
      return "DATE_TRUNC('day', order_date)"
    case 'week':
      return "DATE_TRUNC('week', order_date)"
    case 'month':
      return "DATE_TRUNC('month', order_date)"
    case 'year':
      return "DATE_TRUNC('year', order_date)"
    default:
      return "DATE_TRUNC('day', order_date)"
  }
}

export function getPaginationAndSortClauses(
  sortBy: string | null,
  sortOrder: 'asc' | 'desc' | null,
  limit: number | null,
  offset: number | null,
): string {
  let clauses = ''
  if (sortBy) {
    clauses += ` ORDER BY ${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`
  }
  if (limit !== null) {
    clauses += ` LIMIT ${limit}`
  }
  if (offset !== null) {
    clauses += ` OFFSET ${offset}`
  }
  return clauses
}
