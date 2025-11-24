# Workshop 2 – Simple TypeScript Project (Lab2_Solution)

Невелика бібліотека утиліт на TypeScript з повною інфраструктурою для розробки:
- TypeScript
- ESLint + Prettier
- Husky (pre-commit hooks)
- commitlint
- Zod + dotenv для роботи з конфігурацією
- Складання за допомогою tsup

Проєкт зроблений як навчальне завдання: кожний крок додає нову можливість або покращує типізацію, після чого підвищується версія пакету за допомогою `npm version`.

---

## 1. Технології

- **TypeScript**
- **Node.js / npm**
- **ESLint** + **typescript-eslint** + **@eslint/js**
- **Prettier**
- **Husky** (pre-commit, commit-msg)
- **commitlint** (`@commitlint/config-conventional`)
- **Zod**
- **dotenv**
- **tsup**
- **tsx** (для запуску демо-скриптів)

---

## 2. Структура проєкту

    Lab2_Solution/
    ├─ src/
    │  ├─ index.ts        # основне API бібліотеки (утиліти, Logger, типи)
    │  ├─ config.ts       # валідація змінних середовища через zod
    │  └─ demo.ts         # демо-скрипт для ручного запуску
    ├─ .husky/
    │  ├─ pre-commit      # запускає lint, format:check, typecheck
    │  └─ commit-msg      # перевірка формату коміта через commitlint
    ├─ dist/              # зібраний код (CJS, ESM, d.ts) – з’являється після build
    ├─ node_modules/
    ├─ .gitignore
    ├─ .env               # APP_PRECISION, LOG_LEVEL (не відслідковується git)
    ├─ eslint.config.cjs
    ├─ .prettierrc.cjs
    ├─ commitlint.config.cjs
    ├─ tsconfig.json
    ├─ package.json
    └─ README.md

---

## 3. Встановлення та запуск

### 3.1. Встановлення залежностей

    npm install

(Якщо проєкт клоновано з GitHub, цього достатньо: всі залежності вже описані в `package.json`.)

### 3.2. Основні npm-скрипти

    "scripts": {
      "build": "tsup src/index.ts --format cjs,esm --dts",
      "lint": "eslint . --ext .ts",
      "lint:fix": "eslint . --ext .ts --fix",
      "format": "prettier --write .",
      "format:check": "prettier --check .",
      "typecheck": "tsc --noEmit",
      "demo": "tsx src/demo.ts"
    }

Запуск:

- **Перевірка типів**  

      npm run typecheck

- **Лінтинг**  

      npm run lint

- **Перевірка форматування**  

      npm run format:check

- **Автоформатування коду**  

      npm run format

- **Збірка бібліотеки**  

      npm run build

- **Запуск демо**  

      npm run demo

---

## 4. Конфігурація через `.env`

Файл `.env` знаходиться в корені проєкту (не додається в git) і містить, наприклад:

    APP_PRECISION=3
    LOG_LEVEL=debug

- `APP_PRECISION` – кількість знаків після коми для `formatNumber`, якщо `precision` не передано в параметрах.
- `LOG_LEVEL` – рівень логування для `Logger` (`silent | info | debug`).

Значення `.env` валідуються через `zod` у файлі `src/config.ts`.

---

## 5. Основні можливості бібліотеки

### 5.1. Модуль `src/index.ts`

Бібліотека експортує:

- `add(values: number[]): number` – складає всі значення масиву.
- `capitalize(s: string): string` – робить перший символ рядка великим.
- `formatNumber(value: number, options?: NumberFormatOptions): string` – форматує число з урахуванням `precision` (або значення `APP_PRECISION` з `.env`).
- `type NumberFormatOptions = { precision?: number; locale?: string }`
- `interface User { id: number; name: string }`
- `groupBy<T>(arr: T[], key: keyof T): Record<string, T[]>` – групує масив об’єктів за обраним ключем.
- `type LogLevel = 'silent' | 'info' | 'debug'`
- `class Logger` – простий логгер:
  - `info(msg: string)` – при рівні `info` та `debug`;
  - `debug(msg: string)` – тільки при рівні `debug`.

### 5.2. Модуль `src/config.ts`

- Імпортує `dotenv` і завантажує `.env`.
- Через `zod` перевіряє/приводить змінні середовища.
- Експортує:
  - `config` – об’єкт із валідованими змінними.
  - `type Config` – тип конфігурації.

---

## 6. Хуки та контроль якості коду

### 6.1. Husky

**pre-commit**:

    npm run lint && npm run format:check && npm run typecheck

Якщо є помилки lint/format/typecheck – коміт не буде створено.

**commit-msg**:

    npx --no-install commitlint --edit $1

Перевіряє, що повідомлення коміта відповідає conventional commits  
(наприклад, `feat: ...`, `chore: ...`, `fix: ...`).

### 6.2. ESLint + Prettier

- ESLint налаштований через `eslint.config.cjs`.
- Ігноруються:
  - `dist/**`
  - `node_modules/**`
  - `**/*.cjs` (конфігураційні файли)
- Для TypeScript використовується `typescript-eslint`.
- Заборонений `any` (`@typescript-eslint/no-explicit-any: 'error'`).
- Перевіряються не використані змінні через `@typescript-eslint/no-unused-vars`.
- Prettier відповідає за єдиний стиль форматування.

---

## 7. Історія версій (логіка завдання)

Проєкт розвивався ітеративно. На кожному кроці:

1. Додавалась нова функція / типізація / конфігурація.
2. Виконувались перевірки:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run format:check`
3. Виконувався коміт.
4. Підвищувалась версія за допомогою `npm version minor` або `npm version major`.

Основні логічні етапи:

1. **Ініціалізація проєкту**  
   `npm init`, базові конфіги, Husky, commitlint, ESLint, Prettier, `tsconfig`, npm-скрипти.

2. **Базові утиліти з any**  
   - `add(a: any, b: any)`
   - `capitalize(s: any)`
   - Демонстрація помилок lint (подвійні лапки, не використана змінна), їх виправлення.

3. **Додавання строгих типів**  
   - `add(a: number, b: number): number`
   - `capitalize(s: string): string`
   - Демонстрація помилок типізації, їх виправлення.

4. **Складний тип `NumberFormatOptions` і `formatNumber`**  
   - Додавання типу та функції.
   - Помилки типізації при некоректних аргументах → виправлення.

5. **Generic та інтерфейс `User`**  
   - Введення `interface User`.
   - Реалізація `groupBy<T>`.
   - Демонстрація помилки при використанні неіснуючого ключа (`'age'`), виправлення на `'name'`.

6. **Конфігурація через `.env` та `Logger`**  
   - `config.ts` на базі `zod`.
   - Логгер з літеральним типом рівня логування.
   - Робота з `.env`.

7. **Стабільне публічне API**  
   - Заборона `any`.
   - Налаштування `main/module/types/exports` у `package.json`.
   - Збірка в `dist/`.

8. **Ламаюча зміна (`breaking change`) для `add`**  
   - Замість двох аргументів `add` починає приймати `number[]`.
   - Спочатку виклик `add(2, 3)` викликає помилку типів у `demo.ts`, потім виправлено на `add([2, 3, 4])`.

У репозиторії є теги версій, створені через `npm version`, які відображають ці кроки.

---

## 8. Скриншоти (для звіту)

Для зручності всі скріни  в окремій папці:
/screenshots/
