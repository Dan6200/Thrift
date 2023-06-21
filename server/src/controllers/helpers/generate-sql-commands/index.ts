// Generates A sql insert command.
export function Insert(
	table: string,
	fields: string[],
	idName: string
): string {
	let insertQuery = `insert into ${table} (\n`
	const last = fields.length - 1
	insertQuery += fields.slice(0, last).join(',\n')
	insertQuery += `,\n${fields[last]}\n) values (`
	for (let i = 0; i < last; i++) {
		insertQuery += `$${i + 1}, `
	}
	insertQuery += `$${last + 1}) returning ${idName}`
	return insertQuery
}

// Generates A sql update command.
export function Update(
	table: string,
	idName: string,
	fields: string[],
	whereClause: string
): string {
	let setFieldsToNewValues = 'set '
	const last = fields.length - 1
	// db query parameter list starts from 2, table_id is always first in that list
	for (let i = 0; i < last; i++) {
		setFieldsToNewValues += `${fields[i]} = $${i},\n`
	}
	setFieldsToNewValues += `${fields[last]} = $${last}`
	let output = `update ${table}\n${setFieldsToNewValues}\n${whereClause} returning ${idName}`
	return output
}

// Avoid writing raw delete sql commands forgetting the where clause is dangerous!
export function Delete(
	table: string,
	idName: string,
	whereClause: string
): string {
	return `delete from ${table} where ${whereClause} returning ${idName}`
}

export function Select(
	table: string,
	fields: '*' | string[],
	whereClause?: string
): string {
	let queryString: string
	if (fields !== '*') {
		const fieldList = fields.join(',\n')
		queryString = `select ${fieldList}`
	} else queryString = `select *`
	return (
		queryString + ` from ${table}${whereClause ? `where ${whereClause}` : ``}`
	)
}
