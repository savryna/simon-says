import globals from 'globals';
import js from '@eslint/js';
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */

export default [
  js.configs.recommended,

  importPlugin.flatConfigs.recommended,

  { languageOptions: { globals: globals.browser } },

  pluginJs.configs.recommended,

  {
    ignores: ['dist', 'node_modules'],
  },

  eslintConfigPrettier,

  {
    rules: {
      semi: 'error',

      'import/no-cycle': [2, { maxDepth: 1 }],

      curly: 'error',
    },
  },
];
