module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{html,js,otf,css,json,md,png}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};