module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    project: './tsconfig.json', // Point to your tsconfig
  },
  ignorePatterns: [
    'dist/',
    'node_modules/', // Ignore node_modules
    'prisma/migrations/*', // Ignore Prisma migrations
    'prisma/generated/*', // Ignore Prisma-generated files
  ],
  plugins: [
    '@typescript-eslint', // Use the TypeScript plugin
  ],
  rules: {
    // Additional custom rules for your project can be added here
  },
};
