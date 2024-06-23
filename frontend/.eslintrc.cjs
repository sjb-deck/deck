module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true, // Updated to es2021 to match the old configuration
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'google',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Added JSX feature
    },
  },
  settings: {
    react: {
      version: '18.2', // Updated to match the current React version
    },
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  plugins: ['react-refresh', 'import'], // Added import plugin
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Added from old configuration
    'no-unused-vars': 'error', // Added from old configuration
    'require-jsdoc': 'off', // Added from old configuration
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ], // Added from old configuration
  },
};
