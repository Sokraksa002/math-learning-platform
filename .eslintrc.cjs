module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // list every tsconfig that should be used for type-aware linting
    // use per-package tsconfigs for type-aware linting; do not include the root
    // project-only tsconfig (references container) because it does not include
    // source files and causes parser errors.
    project: ['./apps/backend/tsconfig.eslint.json', './apps/frontend/tsconfig.json'],
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
