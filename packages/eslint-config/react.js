import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import {defineConfig, globalIgnores} from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  {
    languageOptions: {globals: {...globals.browser}},
    settings: {react: {version: 'detect'}},
    rules: {'react/prop-types': 'off'}
  },
  globalIgnores(['dist/**'])
])
