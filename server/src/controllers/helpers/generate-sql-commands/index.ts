/** @param {string} table
 * @param {string[]} fields
 * @param {string} retValue
 * @returns {string}
 * @description Generates a sql insert command
 * */
export function InsertRecord(
  table: string,
  fields: string[],
  retValue: string // Change to array
): string {
  let insertQuery = `insert into ${table} (\n`
  const last = fields.length - 1
  insertQuery += fields.join(',\n')
  insertQuery += `\n) values (`
  for (let i = 0; i < last; i++) {
    insertQuery += `$${i + 1}, `
  }
  insertQuery += `$${last + 1}) returning ${retValue}`
  return insertQuery
}

/** @param {string} table
 * @param {string} idName
 * @param {string[]} fields
 * @param {number} startsFrom
 * @param {string} condition
 * @returns {string}
 * @description Generates a sql update command
 * */
export function UpdateRecord(
  table: string,
  idName: string,
  fields: string[],
  startsFrom: number = 1,
  condition?: string
): string {
  let setFieldsToNewValues = 'set '
  const last = fields.length - 1
  for (let i = 0; i < last; i++) {
    setFieldsToNewValues += `${fields[i]} = $${i + startsFrom},\n`
  }
  setFieldsToNewValues += `${fields[last]} = $${last + startsFrom}`
  let output = `update ${table}\n${setFieldsToNewValues}\nwhere ${condition} returning ${idName}`
  return output
}

/**
 * @description Generates A sql delete command interpolated with the table name, id name and condition
 * @param {string} table
 * @param {string[]} returnFields
 * @param {string} condition
 * @returns {string}
 * */
export function DeleteRecord(
  table: string,
  returnFields: string[],
  condition: string
): string {
  return `delete from ${table} where ${condition} returning ${returnFields.join(
    ', '
  )}`
}

/** @param {string} table
 * @param {string[]} fields
 * @param {string} condition
 * @returns {string}
 * @description Generates a sql select command
 * */
export function SelectRecord(
  table: string,
  fields: string[],
  condition: string
): string {
  return `select ${fields.join(',\n')} from ${table}${
    condition ? ` where ${condition}` : ``
  }`
}
