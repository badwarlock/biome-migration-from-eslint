# Игнорирование файлов в Biome 2.0

> ⚠️ **Важное исправление:** В Biome 2.0 свойства `files.ignore` и `files.include` **удалены** и заменены на `files.includes`!

## 🔄 Что изменилось в Biome 2.0

### ❌ Устаревший синтаксис (Biome 1.x)

```json
{
  "files": {
    "include": ["src/**"],
    "ignore": ["node_modules/**", "dist/**"]
  }
}
```

### ✅ Новый синтаксис (Biome 2.0)

```json
{
  "files": {
    "includes": [
      "**/*",                // Включить все файлы
      "!node_modules/**",    // Исключить node_modules
      "!dist/**"             // Исключить dist
    ]
  }
}
```

## 📚 Ключевые изменения

### 1. Единое поле `includes`

Вместо двух отдельных полей `include` и `ignore`, теперь есть одно поле `includes`, которое принимает массив glob-паттернов.

**Паттерны с `!` (восклицательным знаком) = исключения**

### 2. Новая семантика `*` и `**/*`

| Паттерн | Biome 1.x | Biome 2.0 |
|---------|-----------|-----------|
| `*` | Рекурсивно все файлы | Только файлы в текущей папке |
| `**/*` | То же что `*` | Рекурсивно все файлы и подпапки |

**Пример разницы:**

```json
// Biome 1.x
{
  "files": {
    "include": ["src/*"]  // Находило src/**/* рекурсивно
  }
}

// Biome 2.0
{
  "files": {
    "includes": [
      "src/*"      // Только файлы в src/ (не рекурсивно)
      "src/**/*"   // Все файлы в src/ рекурсивно
    ]
  }
}
```

### 3. Порядок имеет значение (Chain of patterns)

В Biome 2.0 можно создавать цепочки включения/исключения:

```json
{
  "files": {
    "includes": [
      "**/*",                    // 1. Включить всё
      "!dist/**",                // 2. Исключить dist
      "!**/*.test.ts",           // 3. Исключить тесты
      "src/important.test.ts"    // 4. НО включить этот конкретный тест
    ]
  }
}
```

**Это было невозможно в Biome 1.x**, где `ignore` имел абсолютный приоритет над `include`!

## 🎯 Три способа игнорирования файлов в Biome 2.0

### 1. Через `.gitignore` (Рекомендуется)

Самый простой способ - использовать существующий `.gitignore`:

```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true  // ✅ Автоматически использует .gitignore
  }
}
```

**Преимущества:**
- Один источник правды
- Не нужно дублировать паттерны
- `node_modules/` уже игнорируется автоматически

### 2. Через `files.includes` (Дополнительно)

Для файлов, специфичных для Biome:

```json
{
  "files": {
    "includes": [
      "**/*",                  // Включить все файлы
      "!**/*.d.ts",            // Исключить TypeScript declarations
      "!**/*.generated.ts",    // Исключить сгенерированные файлы
      "!coverage/**",          // Исключить test coverage
      "!__mocks__/**"          // Исключить test mocks
    ]
  }
}
```

**Когда использовать:**
- Файлы должны быть в Git, но не проверяться Biome
- Специфичные для инструмента исключения
- Создание сложных цепочек include/exclude

### 3. Через комментарии в коде

Для игнорирования конкретных правил:

```typescript
// Игнорировать всю линию
// biome-ignore lint/suspicious/noExplicitAny: Legacy code
const data: any = legacyFunction();

// Игнорировать блок
/* biome-ignore lint/complexity/noUselessFragments: Required for React key */
<>
  <Component key={id} />
</>

// Игнорировать весь файл (первая строка)
// biome-ignore-file: Generated code
```

## 📝 Примеры паттернов (Biome 2.0)

### Базовые паттерны

```json
{
  "files": {
    "includes": [
      // ✅ Все файлы рекурсивно
      "**/*",

      // ❌ Исключить папку полностью
      "!dist/**",
      "!build/**",
      "!node_modules/**",

      // ❌ Исключить по расширению
      "!**/*.d.ts",
      "!**/*.map",

      // ❌ Исключить конкретный файл
      "!config.generated.ts",

      // ✅ НО включить обратно конкретный файл
      "src/important.d.ts"
    ]
  }
}
```

### Продвинутые паттерны

```json
{
  "files": {
    "includes": [
      "**/*",

      // Исключить все тесты
      "!**/*.test.{ts,tsx,js,jsx}",
      "!**/*.spec.{ts,tsx,js,jsx}",

      // Исключить все __generated__ папки
      "!**/__generated__/**",

      // Исключить конкретные папки в src
      "!src/vendor/**",
      "!src/legacy/**",

      // НО включить один файл из legacy
      "src/legacy/important.ts"
    ]
  }
}
```

### Работа только с определенными файлами

```json
{
  "files": {
    "includes": [
      // Только TypeScript в src
      "src/**/*.ts",
      "src/**/*.tsx",

      // И конфигурационные файлы в корне
      "*.config.{js,ts}",
      "tsconfig.json"
    ]
  }
}
```

## 🔄 Миграция из Biome 1.x

Если у вас есть старая конфигурация:

```bash
# Автоматическая миграция
npx biome migrate
```

Или вручную:

**Было (Biome 1.x):**
```json
{
  "files": {
    "include": ["src/**/*.ts"],
    "ignore": ["dist/**", "*.test.ts"]
  }
}
```

**Стало (Biome 2.0):**
```json
{
  "files": {
    "includes": [
      "src/**/*.ts",
      "!dist/**",
      "!*.test.ts"
    ]
  }
}
```

## 📋 Полная конфигурация (Biome 2.0)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",

  // 1. Использовать .gitignore (рекомендуется)
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },

  // 2. Дополнительные исключения через includes
  "files": {
    "ignoreUnknown": false,
    "maxSize": 1048576,
    "includes": [
      // Включить все файлы
      "**/*",

      // Исключить build outputs
      "!dist/**",
      "!build/**",
      "!out/**",

      // Исключить generated files
      "!**/*.generated.ts",
      "!**/*.generated.tsx",
      "!**/__generated__/**",

      // Исключить type definitions
      "!**/*.d.ts",

      // Исключить test artifacts
      "!coverage/**",
      "!__mocks__/**",

      // Исключить vendor/external code
      "!public/**",
      "!static/**",
      "!vendor/**"
    ]
  },

  "formatter": {
    "enabled": true,
    "lineWidth": 100
  },

  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## 🆚 Сравнение с ESLint

| ESLint | Biome 1.x | Biome 2.0 |
|--------|-----------|-----------|
| `.eslintignore` файл | `files.ignore` | `files.includes` с `!` |
| `ignorePatterns` | `files.ignore` | `files.includes` с `!` |
| `// eslint-disable` | `// biome-ignore` | `// biome-ignore` |
| Порядок не важен | `ignore` > `include` | Порядок паттернов важен! |

## 💡 Лучшие практики (Biome 2.0)

### ✅ Делайте:

1. **Используйте `vcs.useIgnoreFile: true`** - автоматически подтягивает `.gitignore`
2. **Используйте `includes` для специфичных исключений** - только то, что нужно именно Biome
3. **Помните о порядке паттернов** - создавайте логичные цепочки
4. **Документируйте сложные паттерны** - комментарии в JSON через //

### ❌ Не делайте:

1. **Не дублируйте `.gitignore`** - используйте `vcs.useIgnoreFile`
2. **Не забывайте `!`** - без него паттерн будет включением, а не исключением
3. **Не путайте `*` и `**/*`** - они теперь разные!
4. **Не используйте старый синтаксис** - `files.ignore` больше не работает

## 🐛 Отладка

### Проверить, какие файлы обрабатываются:

```bash
# Verbose режим
npx biome check --verbose . 2>&1 | grep "Processed"

# Summary
npx biome check --reporter=summary .
```

### Проблема: Файл не игнорируется

**Проверьте паттерн:**
```json
// ❌ Неправильно (включает dist)
"includes": ["**/*", "dist/**"]

// ✅ Правильно (исключает dist)
"includes": ["**/*", "!dist/**"]
```

**Проверьте порядок:**
```json
// ❌ Неправильно (последний паттерн исключает всё)
"includes": ["dist/important.js", "!dist/**"]

// ✅ Правильно (сначала исключаем всё, потом включаем нужное)
"includes": ["!dist/**", "dist/important.js"]
```

## 📖 Примеры реальных конфигураций

### Монорепозиторий

```json
{
  "files": {
    "includes": [
      "packages/**/*",
      "!packages/**/dist/**",
      "!packages/**/node_modules/**",
      "!packages/**/*.test.ts"
    ]
  }
}
```

### React приложение

```json
{
  "files": {
    "includes": [
      "src/**/*",
      "!src/**/*.test.{ts,tsx}",
      "!src/**/__mocks__/**",
      "!src/assets/**",
      "public/*.html"
    ]
  }
}
```

### TypeScript библиотека

```json
{
  "files": {
    "includes": [
      "src/**/*.ts",
      "!src/**/*.d.ts",
      "!src/**/*.test.ts",
      "index.ts"
    ]
  }
}
```

## ✅ Итог

**В Biome 2.0 произошли breaking changes:**

1. ❌ `files.include` и `files.ignore` **удалены**
2. ✅ Используйте `files.includes` с паттернами `!` для исключений
3. 📝 Семантика `*` и `**/*` теперь различается
4. 🔄 Порядок паттернов имеет значение
5. 🎯 Можно создавать цепочки include/exclude

**Моя первоначальная конфигурация была неправильной!** Я использовал устаревший синтаксис Biome 1.x. Спасибо, что указали на ошибку! 🙏

Теперь конфигурация исправлена и использует правильный синтаксис Biome 2.0. ✨
