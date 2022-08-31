const path = require('path');
module.exports = {
	mode: 'development',
	watch: true,
	devtool: false,
	watchOptions: {
		ignored: /node_modules/,
	},
	entry: './src/',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
