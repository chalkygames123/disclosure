module.exports = {
	extends: ['eslint-config-prettier'],
	rules: {
		'class-methods-use-this': 'error',
	},
	overrides: [
		{
			files: 'src/**',
			envs: ['browser'],
		},
	],
};
