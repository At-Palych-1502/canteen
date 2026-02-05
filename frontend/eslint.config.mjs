import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: globals.browser,
		},
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier,
		},
		settings: {
			react: { version: 'detect' },
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},
	eslintConfigPrettier,
];
