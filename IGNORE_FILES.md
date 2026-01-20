# Игнорирование файлов в Biome

## ✅ Свойство `files.ignore` существует!

Вопреки возможным сомнениям, в Biome **есть** свойство `ignore` в секции `files`. Это официальная и правильная конфигурация.

## 📚 Официальная документация

Согласно [официальной документации Biome](https://biomejs.dev/reference/configuration/#filesignore):

```json
{
  "files": {
    "ignore": ["dist/**", "node_modules/**", "*.generated.ts"]
  }
}
```

## 🎯 Три способа игнорирования файлов в Biome

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
- Один источник правды для игнорирования
- Не нужно дублировать паттерны
- Работает автоматически

### 2. Через `files.ignore` (Дополнительно)

Для файлов, специфичных для Biome (не Git):

```json
{
  "files": {
    "ignore": [
      "*.d.ts",           // TypeScript declarations
      "**/*.generated.ts", // Generated files
      "coverage/",         // Test coverage
      "__mocks__/"         // Test mocks
    ]
  }
}
```

**Когда использовать:**
- Файлы, которые должны быть в Git, но не проверяться Biome
- Специфичные для инструмента исключения
- Временные файлы сборки

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

## 🔍 Проверка: какие файлы будут обработаны?

Чтобы увидеть, какие файлы Biome обрабатывает:

```bash
# Список файлов, которые будут проверены
npx biome check --verbose . 2>&1 | grep "Processed"

# Или используйте --reporter=summary
npx biome check --reporter=summary .
```

## 📋 Полная конфигурация игнорирования

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",

  // 1. Использовать .gitignore (рекомендуется)
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },

  // 2. Дополнительные исключения
  "files": {
    "ignore": [
      // Build outputs (если их нет в .gitignore)
      "dist/",
      "build/",
      "out/",

      // Generated files
      "*.generated.ts",
      "*.generated.tsx",
      "**/__generated__/**",

      // Type definitions
      "*.d.ts",

      // Test artifacts
      "coverage/",
      "__mocks__/",

      // Vendor/external code
      "public/",
      "static/",
      "vendor/"
    ],

    // Опционально: включить только определенные файлы
    // "include": ["src/**/*.ts", "src/**/*.tsx"],

    // Игнорировать файлы неизвестных типов
    "ignoreUnknown": false,

    // Максимальный размер файла (в байтах)
    "maxSize": 1048576  // 1 MB
  }
}
```

## 🆚 Разница с ESLint

| ESLint | Biome |
|--------|-------|
| `.eslintignore` файл | `files.ignore` в конфиге |
| `ignorePatterns` в конфиге | `files.ignore` |
| `// eslint-disable` | `// biome-ignore` |
| Не использует `.gitignore` автоматически | Использует `.gitignore` через `vcs.useIgnoreFile` |

## 💡 Лучшие практики

### ✅ Делайте:

1. Используйте `vcs.useIgnoreFile: true` для автоматического использования `.gitignore`
2. Добавляйте в `files.ignore` только специфичные для Biome исключения
3. Используйте `// biome-ignore` для редких исключений в коде
4. Документируйте причину игнорирования

### ❌ Не делайте:

1. Не дублируйте паттерны из `.gitignore` в `files.ignore`
2. Не игнорируйте слишком много - это скрывает проблемы
3. Не используйте `// biome-ignore` без комментария-объяснения
4. Не игнорируйте весь каталог, если можно игнорировать конкретные файлы

## 🐛 Отладка игнорирования

Если файл не игнорируется:

1. **Проверьте паттерн:**
   ```json
   // ❌ Неправильно
   "ignore": ["dist"]

   // ✅ Правильно (для папки)
   "ignore": ["dist/**"]

   // ✅ Или так
   "ignore": ["dist/"]
   ```

2. **Проверьте порядок:**
   - Сначала применяется `vcs.useIgnoreFile`
   - Затем `files.ignore`
   - Затем `files.include` (если указан)

3. **Используйте verbose режим:**
   ```bash
   npx biome check --verbose . 2>&1 | grep "Ignored"
   ```

## 📖 Примеры глоб-паттернов

```json
{
  "files": {
    "ignore": [
      // Конкретный файл
      "config.ts",

      // Все файлы с расширением
      "*.generated.ts",

      // Папка и всё внутри
      "dist/**",
      "node_modules/**",

      // Файлы во всех подпапках
      "**/*.test.ts",
      "**/test-utils.ts",

      // Комбинации
      "src/**/*.generated.{ts,tsx,js,jsx}",

      // Исключение из исключения (не работает напрямую, используйте include)
      // "!src/important.generated.ts"  // ❌ Не поддерживается
    ]
  }
}
```

## ✅ Итог

**Да, `files.ignore` существует и работает!**

Это официальное и правильное свойство конфигурации Biome для игнорирования файлов. Моя конфигурация в `biome.json` использует правильный синтаксис.

Если у вас возникли сомнения, это могло быть из-за:
- Старой версии документации
- Путаницы с другими инструментами
- Неполной документации в некоторых источниках

Текущая конфигурация полностью валидна! ✨
