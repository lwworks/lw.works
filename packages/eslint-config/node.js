import {defineConfig, globalIgnores} from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  ...tseslint.configs.recommended,
  {languageOptions: {globals: {...globals.node}}},
  globalIgnores(['dist/**', '.vercel/**'])
])
