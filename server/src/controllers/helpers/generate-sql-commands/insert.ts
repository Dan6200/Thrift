export default (table: string, fields: string[]): string => {
  let insertQuery = `insert into ${table} (\n`;
  const last = fields.length - 1;
  insertQuery += fields.slice(0, last).join(",\n");
  insertQuery += `,\n${fields[last]}\n) values (`;
  for (let i = 0; i < last; i++) {
    insertQuery += `$${i + 1}, `;
  }
  insertQuery += `$${last + 1})`;
  return insertQuery;
};
