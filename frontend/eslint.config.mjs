import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const SOURCE_FILES = ["**/*.{js,jsx,mjs,cjs}"];

export default [
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "web-build/**",
      "android/**",
      "*.config.js",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
    ],
  },
  {
    files: SOURCE_FILES,
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react/"],
            ["^react-native$", "^react-native/"],
            ["^expo", "^@expo"],
            ["^react-native-paper", "^@callstack/"],
            ["^@/"],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
  eslintConfigPrettier,
];
