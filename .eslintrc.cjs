module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Use the TypeScript parser
  parserOptions: {
    project: './tsconfig.json', // Path to your TypeScript config file
    sourceType: 'module',
  },
  env: {
    node: true, // Indicates that the environment is Node.js, enabling Node.js global variables (e.g., `process`, `require`).
    jest: true, // Enables Jest globals for linting tests, such as `describe`, `it`, `expect`.
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        // Put your TypeScript-specific rules here
      },
    },
  ],
};
