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
	fields: string[]
): string {
	let setFieldsToNewValues = 'set '
	const last = fields.length - 1
	// db query parameter list starts from 2, table_id is always first in that list
	const OFFSET = 2
	for (let i = 0; i < last; i++) {
		setFieldsToNewValues += `${fields[i]} = $${i + OFFSET},\n`
	}
	setFieldsToNewValues += `${fields[last]} = $${last + OFFSET}`
	let output = `update ${table}\n${setFieldsToNewValues}\nwhere ${idName} = $1 returning ${idName}`
	return output
}

// Avoid writing raw delete sql commands forgetting the where clause is dangerous!
export function Delete(
	table: string,
	idName: string,
	whereClause: string
): string {
	return `delete from ${table} where ${whereClause}=$1 returning ${idName}`
}
