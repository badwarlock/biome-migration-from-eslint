# Миграция с ESLint + Prettier на Biome

Этот репозиторий демонстрирует полную миграцию с ESLint и Prettier на [Biome](https://biomejs.dev/) - быстрый форматировщик и линтер для JavaScript, TypeScript, JSX и TSX.

## 📋 Что включено

- ✅ **biome.json** - полная конфигурация Biome с миграцией всех правил
- ✅ **MIGRATION_GUIDE.md** - подробное руководство по миграции с объяснением каждого правила
- ✅ **package.json** - готовые npm скрипты для работы с Biome

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Использование

```bash
# Проверить код (линтинг + форматирование + импорты)
npm run check

# Проверить и автоматически исправить
npm run check:fix

# Только линтинг
npm run lint

# Только форматирование
npm run format

# Для CI/CD (без изменения файлов)
npm run ci
```

## 📚 Документация

Полное руководство по миграции смотрите в [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## ⚡ Преимущества Biome

- **Скорость**: В 10-20 раз быстрее, чем ESLint + Prettier
- **Простота**: Один инструмент вместо множества плагинов
- **Конфигурация**: Один файл `biome.json` вместо нескольких конфигов
- **Нативная поддержка**: TypeScript, React, JSX из коробки
- **Совместимость**: Покрывает ~90% правил ESLint

## 🔄 Что было мигрировано

### Prettier конфигурация (100%)
- ✅ `arrowParens: "avoid"` → `arrowParentheses: "asNeeded"`
- ✅ `bracketSpacing: true` → `bracketSpacing: true`
- ✅ `bracketSameLine: false` → `bracketSameLine: false`
- ✅ `singleQuote: false` → `quoteStyle: "double"`
- ✅ `trailingComma: "all"` → `trailingCommas: "all"`
- ✅ `printWidth: 100` → `lineWidth: 100`

### ESLint правила (~90%)
- ✅ TypeScript правила (@typescript-eslint)
- ✅ React правила (react, react-hooks)
- ✅ Accessibility правила (jsx-a11y)
- ✅ Правила импортов (import, simple-import-sort)
- ✅ Общие правила качества кода
- ⚠️ Частично: Vitest/Jest/Testing Library (используйте TypeScript strict mode)
- ❌ react/jsx-sort-props (пока не реализовано в Biome)

## 🔧 Настройка IDE

### VSCode

1. Установите расширение [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

2. Создайте `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

### WebStorm / IntelliJ IDEA

Biome поддерживается через плагин. Смотрите [документацию](https://biomejs.dev/guides/integrate-in-editor/).

## 📖 Полезные ссылки

- [Официальная документация Biome](https://biomejs.dev/)
- [Список правил линтера](https://biomejs.dev/linter/rules/)
- [Опции форматирования](https://biomejs.dev/formatter/)
- [Миграция с ESLint](https://biomejs.dev/guides/migrate-eslint-prettier/)

## 🤝 Вклад

Нашли ошибку в миграции или хотите улучшить конфигурацию? Создайте issue или pull request!

## 📄 Лицензия

MIT
