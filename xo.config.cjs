module.exports = {
	extends: ['eslint-config-prettier'],
	rules: {
		'class-methods-use-this': 'error',
		'unicorn/prevent-abbreviations': 'off',
	},
	overrides: [
		{
			files: 'src/**',
			envs: ['browser'],
		},
	],
};
