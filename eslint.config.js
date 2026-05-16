import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: [".next", "dist", "node_modules"] },
  ...next,
  configPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },
);
