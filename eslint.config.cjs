const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');

module.exports = [
  // какие файлы ESLint вообще не трогает
  {
    ignores: [
      '**/*.cjs', // конфиги
      'dist/**', // собранные файлы (JS, d.ts)
      'node_modules/**',
    ],
  },

  // базовые правила для обычного JS
  js.configs.recommended,

  // базовые правила для TypeScript
  ...tseslint.configs.recommended,

  // убираем конфликты с Prettier
  prettier,

  // наши настройки именно для исходников TS
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // как договаривались: any запрещён (или поставь 'warn', если хочешь мягче)
      '@typescript-eslint/no-explicit-any': 'error',

      // базовый eslint-овский no-unused-vars отключаем...
      'no-unused-vars': 'off',
      // ...а вместо него используем typescript-версию
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
