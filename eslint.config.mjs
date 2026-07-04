import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginCypress from 'eslint-plugin-cypress/flat';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/', 'cypress/reports/', 'cypress/downloads/'],
  },
  pluginJs.configs.recommended,
  pluginCypress.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
      'no-console': 'warn',
    },
  },
  {
    files: ['cypress.config.js', '.prettierrc.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
  eslintConfigPrettier,
];
