// これは `overrides` 内の `extends` がトップレベルのルールを上書きしてしまうため必要
const baseRules = {
	'capitalized-comments': 'off',
	'class-methods-use-this': 'error',
	'unicorn/prevent-abbreviations': 'off',
};

module.exports = {
	root: true,
	extends: ['xo', 'plugin:unicorn/recommended', 'prettier'],
	rules: {
		...baseRules,
	},
	overrides: [
		{
			files: '**/*.cjs',
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			files: 'src/**',
			extends: ['xo/browser', 'plugin:unicorn/recommended', 'prettier'],
			parser: '@babel/eslint-parser',
			plugins: ['@babel'],
			rules: {
				...baseRules,
			},
		},
	],
};
