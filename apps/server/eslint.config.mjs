import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  // Base JavaScript configuration
  {
    files: ['**/*.{js,ts}'],
    ...js.configs.recommended,
  },

  // Global settings for Node.js
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // TypeScript configuration
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...config.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'no-useless-escape': 'warn',
    },
  })),

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.config.js',
      '**/*.config.mjs',
    ],
  },
]
