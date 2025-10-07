/* eslint-disable no-restricted-syntax */
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs" },
  },
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended
);
