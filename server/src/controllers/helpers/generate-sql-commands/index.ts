export function Insert(table: string, fields: string[]): string {
  let insertQuery = `insert into ${table} (\n`;
  const last = fields.length - 1;
  insertQuery += fields.slice(0, last).join(",\n");
  insertQuery += `,\n${fields[last]}\n) values (`;
  for (let i = 0; i < last; i++) {
    insertQuery += `$${i + 1}, `;
  }
  insertQuery += `$${last + 1})`;
  return insertQuery;
}

export function Update(
  table: string,
  idName: string,
  fields: string[]
): string {
  let setFieldsToNewValues = "set ";
  const last = fields.length - 1;
  // db query param list starts from 2
  const OFFSET = 2;
  for (let i = 0; i < last; i++) {
    setFieldsToNewValues += `${fields[i]} = $${i + OFFSET},\n`;
  }
  setFieldsToNewValues += `${fields[last]} = $${last + OFFSET}`;
  let output = `update ${table}\n${setFieldsToNewValues}\nwhere ${idName} = $1`;
  return output;
}