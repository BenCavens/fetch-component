const path = require('path');
const HtmlTemplatePlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			}
		],
	},
	entry: {
		main: path.resolve(__dirname, './src/index.js'),
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].bundle.js',
	},
	plugins: [
		new HtmlTemplatePlugin({
			title: 'Web components',
			template: path.resolve(__dirname, './src/template.html'),
			filename: "index.html",
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'src/modules', to: 'modules' },
			],
		}),
		new CleanWebpackPlugin({})
	],
}
