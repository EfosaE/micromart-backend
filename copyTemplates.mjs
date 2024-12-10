import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const source = path.join(__dirname, 'src/common/mail/templates');
const destination = path.join(__dirname, 'dist/common/mail/templates');

// Create destination directory if not exists
fs.mkdirSync(destination, { recursive: true });

// Copy files from source to destination
fs.readdirSync(source).forEach((file) => {
  fs.copyFileSync(path.join(source, file), path.join(destination, file));
});


// "scripts": {
//     "build": "nest build && node copyTemplates.js",
//     "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
//     "start": "nest start",
//     "start:dev": "nest start --watch",
//     "start:debug": "nest start --debug --watch",
//     "start:prod": "node dist/main",
//     "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
//     "test": "jest",
//     "test:watch": "jest --watch",
//     "test:cov": "jest --coverage",
//     "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
//     "test:e2e": "jest --config ./test/jest-e2e.json"
//   },

// I am using nest but the nest build builds the dist folder shey and after the build i say copy the template but it still gives dist/common/mail/templates... not found error when i sonpm run s