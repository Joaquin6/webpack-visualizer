const path = require('path')
const webpack = require('webpack')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const JsConfigWebpackPlugin = require('js-config-webpack-plugin')

const siteMainEntry = './src/site/main.jsx'
const pluginEntry = './src/plugin/plugin.js'
const pluginMainEntry = './src/plugin/main.jsx'
const buildPath = path.resolve(__dirname)

exports = module.exports = (env = {}) => {
	console.log('\nWebpack Config Environment:\n')
	console.log('\t', env, '\n')

	const isHotServer = env.type && env.type === 'hot'
	const { ifProduction, ifNotProduction } = getIfUtils(process.env.NODE_ENV || env)
	const config = {
		cache: ifProduction(),
		mode: ifProduction('production', 'development'),
		context: path.resolve(__dirname),
		output: {
			path: buildPath,
			pathinfo: ifNotProduction(),
		},
		resolve: {
			extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
			fallback: {
				path: require.resolve('path-browserify'),
			},
		},
		stats: ifProduction('errors-only', 'verbose'),
		target: 'node-webkit',
		plugins: [
			new webpack.ProgressPlugin(),
			new webpack.EnvironmentPlugin(Object.keys(process.env)),
			new webpack.SourceMapDevToolPlugin({}),
			new JsConfigWebpackPlugin({ babelConfigFile: path.join(buildPath, '.babelrc') }),
			ifProduction(
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: JSON.stringify('production'),
					},
				}),
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: JSON.stringify('development'),
					},
				})
			),
		],
	}

	config.entry = isHotServer
		? siteMainEntry
		: {
				pluginmain: { import: pluginMainEntry, filename: './lib/[name].js' },
				plugin: {
					import: pluginEntry,
					filename: './lib/[name].js',
					dependOn: 'pluginmain',
				},
				build: { import: siteMainEntry, filename: './dist-site/[name].js' },
		  }

	if (isHotServer) {
		config.output.filename = '[name].js'
		config.output.path = path.join(buildPath, 'dist-site')
		config.devServer = {
			open: true,
			openPage: '/dist-site',
			port: env.port || 3000,
		}
	}

	return removeEmpty(config)
}
