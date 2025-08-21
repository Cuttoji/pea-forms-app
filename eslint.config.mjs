// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals"; // Import globals for browser, node, etc.
import tseslint from 'typescript-eslint'; // Import typescript-eslint for typed linting

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // Recommended: Specify resolver for consistent module resolution
  // resolvePluginsRelativeTo: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // 1. Global ignores (optional, but good for .next, node_modules, etc.)
  {
    ignores: [
      ".next/",
      "node_modules/",
      "dist/",
      // Add other directories or files to ignore globally
    ],
  },

  // 2. Base configurations from Next.js (using FlatCompat)
  ...compat.extends("next/core-web-vitals"), // Core Next.js rules including React, JSX, accessibility

  // 3. TypeScript specific configurations (using typescript-eslint directly for Flat Config)
  //    This replaces compat.extends("next/typescript") for more direct control in Flat Config
  ...tseslint.configs.recommended, // Start with recommended TypeScript rules
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply only to TypeScript files
    languageOptions: {
      parser: tseslint.parser, // Use the TypeScript parser
      parserOptions: {
        project: true, // Enable type-aware linting, point to your tsconfig.json
        tsconfigRootDir: __dirname, // Or your project root if tsconfig is there
      },
    },
    rules: {
      // Add or override TypeScript-specific rules here
      // Example: '@typescript-eslint/no-unused-vars': 'warn',
      // next/typescript preset usually handles many of these, but you can customize
    },
  },

  // 4. Configuration for JavaScript/TypeScript files (general rules)
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser, // Add browser globals (window, document, etc.)
        ...globals.node,    // Add Node.js globals (process, require, etc. - useful for config files)
        React: "readonly",  // Assume React is globally available or imported
      },
    },
    rules: {
      // Add any general project-wide rules here
      // e.g., 'no-console': 'warn',
    },
  },

  // 5. Override for specific configuration files (like tailwind.config.js)
  //    This is where you allow `require()` for those files.
  {
    files: ["tailwind.config.js", "postcss.config.js", "*.config.js", "*.config.mjs", "*.config.cjs"],
    languageOptions: {
      sourceType: "commonjs", // Indicate these files use CommonJS
      globals: {
        ...globals.node, // Ensure Node.js globals are available
        module: "writable", // Allow module.exports
        require: "readonly", // Allow require
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      // Disable rules that conflict with CommonJS `require` in these config files
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      // If you use import/export in .config.mjs, you might not need to turn these off for .mjs
      // but for .js or .cjs config files, this is often necessary.
      // Add any other rules you need to adjust for these config files
    },
  },

  // Add other specific configurations or overrides as needed
];

module.exports = config;
