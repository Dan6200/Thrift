export const genSqlUpdateCommands = (fields, offset) => {
    let command = 'set ';
    const last = fields.length - 1;
    for (let i = 0; i < last; i++) {
        command += `${fields[i]} = $${i + offset}, `;
    }
    command += `${fields[last]} = $${last + offset}`;
    return command;
};
