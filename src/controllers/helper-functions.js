const genUpdateCommands = (fields, offset) => {
	let command = ''
	for (let i = 0; i < fields.length; i++) {
		command += `set ${ fields[i] } = $${i + offset},`
	}
	return command
}

module.exports = {
	genUpdateCommands,
}
