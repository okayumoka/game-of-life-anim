const webpack = require("webpack");

module.exports = {
	entry: {
		'build': './src/game-of-life-anim.js',
		'docs': './src/game-of-life-anim.js'
	},
	output: {
		filename: "./[name]/game-of-life-anim.min.js"
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	],
}

