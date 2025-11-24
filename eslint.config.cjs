const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');

module.exports = [
  // какие файлы вообще не трогаем
  { ignores: ['**/*.cjs'] },

  // базовые правила для обычного JS
  js.configs.recommended,

  // базовые правила для TypeScript
  ...tseslint.configs.recommended,

  // отключаем конфликты с Prettier
  prettier,

  // наши настройки именно для .ts файлов
  {
    files: ['**/*.ts'],
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
      // пока только предупреждение за any (потом сделаем error)
      '@typescript-eslint/no-explicit-any': 'warn',
      // предупреждение за неиспользуемые переменные
      'no-unused-vars': 'warn',
    },
  },
];
