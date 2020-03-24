module.exports = function (api) {
	api.cache(true);

	const presets = [ "@babel/preset-env" ];
	const plugins = [ "@babel/plugin-proposal-export-namespace-from" ];

	return {
		presets,
		plugins
	};
};