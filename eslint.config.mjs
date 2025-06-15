import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  // Base JavaScript configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ...js.configs.recommended,
  },

  // Global settings
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // TypeScript configuration
  ...tseslint.configs.recommended.map(config => ({
    ...config,
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
    },
  })),

  // React configuration for all React projects
  {
    files: ['**/*.{jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
    },
  },

  // Next.js specific configuration for apps/web
  ...compat.extends('next/core-web-vitals', 'next/typescript').map(config => ({
    ...config,
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    rules: {
      ...config.rules,
      '@next/next/no-html-link-for-pages': ['error', 'apps/web/src/app'],
    },
  })),

  // Server-side specific configuration
  {
    files: ['apps/server/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-useless-escape': 'warn',
    },
  },

  // Dashboard app specific configuration (if it's using a different framework)
  {
    files: ['apps/dashboard/**/*.{jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
    },
  },

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/public/**',
      '**/*.config.js',
      '**/*.config.mjs',
    ],
  },
]
