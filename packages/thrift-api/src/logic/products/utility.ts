export function handleSortQuery(queryString: string): string {
  const allowedColumns = [
    'product_id',
    'title',
    'base_price',
    'created_at',
    'updated_at',
    'average_rating',
    'review_count',
    'products_sold',
  ] // Define your allowed sortable columns

  let sortCriteria: string[] = queryString.split(',')
  let dbQueryString = 'ORDER BY '
  const validSorts: string[] = []

  for (const str of sortCriteria) {
    let column = str.trim()
    let order = 'ASC'

    if (column.startsWith('-')) {
      order = 'DESC'
      column = column.slice(1)
    }

    if (allowedColumns.includes(column)) {
      validSorts.push(`${column} ${order}`)
    } else {
      console.warn(`Invalid sort column: ${column}. Ignoring.`)
    }
  }

  if (validSorts.length === 0) {
    return '' // Return empty string if no valid sort criteria
  }

  return dbQueryString + validSorts.join(', ')
}
