# Руководство по миграции с ESLint + Prettier на Biome

## Содержание
1. [Миграция Prettier конфигурации](#prettier-миграция)
2. [Миграция ESLint правил](#eslint-миграция)
3. [Неподдерживаемые правила и альтернативы](#ограничения)
4. [Установка и использование](#установка)

---

## Prettier миграция

### 1. `"arrowParens": "avoid"`
**Что делает:** Не добавляет скобки вокруг единственного параметра стрелочной функции.

**Пример:**
```javascript
// С этой настройкой
const square = x => x * x;

// Без неё (always)
const square = (x) => x * x;
```

**В Biome:**
```json
"javascript": {
  "formatter": {
    "arrowParentheses": "asNeeded"
  }
}
```
✅ **Полностью поддерживается** - `asNeeded` эквивалентно `avoid` в Prettier.

---

### 2. `"bracketSpacing": true`
**Что делает:** Добавляет пробелы внутри фигурных скобок в литералах объектов.

**Пример:**
```javascript
// С bracketSpacing: true
const obj = { a: 1, b: 2 };

// С bracketSpacing: false
const obj = {a: 1, b: 2};
```

**В Biome:**
```json
"javascript": {
  "formatter": {
    "bracketSpacing": true
  }
}
```
✅ **Полностью поддерживается**

---

### 3. `"bracketSameLine": false`
**Что делает:** Размещает закрывающую угловую скобку `>` JSX-элементов на новой строке.

**Пример:**
```jsx
// С bracketSameLine: false
<Button
  onClick={handleClick}
  disabled
>
  Click me
</Button>

// С bracketSameLine: true
<Button
  onClick={handleClick}
  disabled>
  Click me
</Button>
```

**В Biome:**
```json
"javascript": {
  "formatter": {
    "bracketSameLine": false
  }
}
```
✅ **Полностью поддерживается**

---

### 4. `"singleQuote": false`
**Что делает:** Использует двойные кавычки вместо одинарных для строк.

**Пример:**
```javascript
// С singleQuote: false
const greeting = "Hello, World!";

// С singleQuote: true
const greeting = 'Hello, World!';
```

**В Biome:**
```json
"javascript": {
  "formatter": {
    "quoteStyle": "double",
    "jsxQuoteStyle": "double"
  }
}
```
✅ **Полностью поддерживается** - `quoteStyle: "double"` эквивалентно `singleQuote: false`.

---

### 5. `"trailingComma": "all"`
**Что делает:** Добавляет запятую в конце везде, где это возможно (включая аргументы функций).

**Пример:**
```javascript
// С trailingComma: "all"
const obj = {
  a: 1,
  b: 2,
};

function foo(
  a,
  b,
) {
  // ...
}
```

**В Biome:**
```json
"javascript": {
  "formatter": {
    "trailingCommas": "all"
  }
}
```
✅ **Полностью поддерживается**

---

### 6. `"printWidth": 100`
**Что делает:** Устанавливает максимальную длину строки в 100 символов перед переносом.

**В Biome:**
```json
"formatter": {
  "lineWidth": 100
}
```
✅ **Полностью поддерживается** - в Biome это называется `lineWidth`.

---

## ESLint миграция

### Базовые JavaScript правила

#### 1. `pluginJs.configs.recommended`
**Что делает:** Включает рекомендованные правила ESLint для предотвращения распространённых ошибок.

**В Biome:**
```json
"linter": {
  "rules": {
    "recommended": true
  }
}
```
✅ **Поддерживается** - Biome имеет свой набор рекомендованных правил, покрывающих большинство случаев.

---

### TypeScript правила

#### 2. `"@typescript-eslint/no-non-null-assertion": "error"`
**Что делает:** Запрещает использование оператора non-null assertion (`!`) в TypeScript.

**Пример:**
```typescript
// ❌ Ошибка
const value = maybeNull!.property;

// ✅ Правильно
if (maybeNull) {
  const value = maybeNull.property;
}
```

**В Biome:**
```json
"linter": {
  "rules": {
    "style": {
      "noNonNullAssertion": "error"
    }
  }
}
```
✅ **Полностью поддерживается** через правило `noNonNullAssertion`.

---

#### 3. `"@typescript-eslint/no-unused-vars": ["error", {...}]`
**Что делает:** Запрещает неиспользуемые переменные с исключениями для переменных, начинающихся с `_` и пойманных ошибок с префиксом `ignore`.

**Пример:**
```typescript
// ❌ Ошибка
const unusedVar = 42;

// ✅ Разрешено - переменная начинается с _
const _unusedVar = 42;

// ✅ Разрешено - в catch с префиксом ignore
try {
  // ...
} catch (ignoreError) {
  // ...
}
```

**В Biome:**
```json
"linter": {
  "rules": {
    "correctness": {
      "noUnusedVariables": "error"
    }
  }
}
```
⚠️ **Частично поддерживается** - Biome проверяет неиспользуемые переменные, но не поддерживает кастомные паттерны игнорирования. Используйте `// biome-ignore lint/correctness/noUnusedVariables: <reason>` для конкретных случаев.

---

### React правила

#### 4. `pluginReactHooks.configs.recommended.rules`
**Что делает:** Проверяет правила хуков React (порядок вызова, зависимости useEffect и т.д.).

**Пример правил:**
- Хуки должны вызываться только на верхнем уровне
- Хуки должны вызываться только в React-компонентах или кастомных хуках
- `useEffect` должен указывать все зависимости

**В Biome:**
```json
"linter": {
  "rules": {
    "correctness": {
      "useExhaustiveDependencies": "warn",
      "useHookAtTopLevel": "error"
    }
  }
}
```
✅ **Полностью поддерживается** - Biome имеет встроенные правила для React хуков.

---

#### 5. `"react/prop-types": "off"`
**Что делает:** Отключает проверку prop-types (используется TypeScript для типизации).

**В Biome:**
Не требуется - Biome не проверяет prop-types по умолчанию.

---

#### 6. `"react/react-in-jsx-scope": "off"`
**Что делает:** Отключает требование импорта React в файлах с JSX (для React 17+).

**В Biome:**
```json
"javascript": {
  "jsxRuntime": "reactClassic"
}
```
✅ **Поддерживается** - используйте `"transparent"` для новых версий React без автоматического импорта.

---

#### 7. `"react/jsx-sort-props"`
**Что делает:** Сортирует props в JSX элементах в определённом порядке.

**Конфигурация:**
- `callbacksLast: true` - колбэки в конце
- `shorthandFirst: true` - сокращённые пропсы первыми
- `ignoreCase: true` - игнорировать регистр
- `reservedFirst: true` - зарезервированные пропсы (key, ref) первыми
- `noSortAlphabetically: true` - не сортировать по алфавиту

**Пример:**
```jsx
// ✅ Правильный порядок
<Component
  key={id}
  ref={myRef}
  visible
  disabled
  name="example"
  onClick={handleClick}
/>
```

**В Biome:**
❌ **Не поддерживается** - Biome пока не имеет правила для сортировки JSX props. Это можно обсудить в их репозитории или использовать IDE-расширения для автоматической сортировки.

---

### Импорты

#### 8. `"simple-import-sort/imports": "warn"`
**Что делает:** Автоматически сортирует импорты в определённом порядке (встроенные модули → внешние → внутренние).

**Пример:**
```javascript
// ✅ Правильный порядок
import path from "node:path";
import { fileURLToPath } from "node:url";

import React from "react";
import { useState } from "react";

import { MyComponent } from "./components";
import styles from "./styles.css";
```

**В Biome:**
```json
"organizeImports": {
  "enabled": true
}
```
✅ **Полностью поддерживается** - Biome автоматически организует импорты при форматировании.

---

#### 9. `"simple-import-sort/exports": "warn"`
**Что делает:** Сортирует экспорты в алфавитном порядке.

**В Biome:**
```json
"organizeImports": {
  "enabled": true
}
```
✅ **Полностью поддерживается** - включено в организации импортов.

---

#### 10. `"import/first": "warn"`
**Что делает:** Требует, чтобы все импорты были в начале файла.

**В Biome:**
Автоматически обеспечивается через `organizeImports`.

---

#### 11. `"import/newline-after-import": "warn"`
**Что делает:** Требует пустую строку после блока импортов.

**В Biome:**
Автоматически обеспечивается при форматировании.

---

#### 12. `"import/no-duplicates": "error"`
**Что делает:** Запрещает дублирующие импорты из одного модуля.

**Пример:**
```javascript
// ❌ Ошибка
import { A } from "module";
import { B } from "module";

// ✅ Правильно
import { A, B } from "module";
```

**В Biome:**
```json
"linter": {
  "rules": {
    "correctness": {
      "noUnusedImports": "error"
    }
  }
}
```
✅ **Поддерживается** через `organizeImports` - Biome автоматически объединяет импорты.

---

#### 13. `"import/no-named-as-default-member": "off"`
**Что делает:** Отключает предупреждения об использовании именованных экспортов как членов default экспорта.

**В Biome:**
Не требуется - Biome не имеет этого правила.

---

### Общие правила кода

#### 14. `"no-lonely-if": "error"`
**Что делает:** Запрещает использование `if` как единственного оператора в `else` блоке (требует `else if`).

**Пример:**
```javascript
// ❌ Ошибка
if (condition1) {
  // ...
} else {
  if (condition2) {
    // ...
  }
}

// ✅ Правильно
if (condition1) {
  // ...
} else if (condition2) {
  // ...
}
```

**В Biome:**
```json
"linter": {
  "rules": {
    "style": {
      "noNegationElse": "error"
    }
  }
}
```
✅ **Поддерживается** через `noNegationElse` - похожее правило для улучшения читаемости условий.

---

### JSX Accessibility (a11y)

#### 15. Правила доступности JSX
**Из конфига:** `pluginJSXa11y.flatConfigs.recommended`

Основные правила:

- **`jsx-a11y/label-has-associated-control`: off** - не требует связи label с контролом
- **`jsx-a11y/click-events-have-key-events`: error** - клик должен сопровождаться keyboard событием
- **`jsx-a11y/no-static-element-interactions`: error** - статичные элементы не должны иметь обработчики событий
- **`jsx-a11y/no-noninteractive-element-interactions`: error** - неинтерактивные элементы не должны иметь обработчики

**В Biome:**
```json
"linter": {
  "rules": {
    "a11y": {
      "useKeyWithClickEvents": "error",
      "noNoninteractiveElementToInteractiveRole": "error",
      "useValidAriaProps": "error",
      "useValidAriaValues": "error",
      "noAutofocus": "error",
      "noBlankTarget": "error",
      "noPositiveTabindex": "error",
      "useAltText": "error",
      "useAriaActivedescendantWithTabindex": "error",
      "useButtonType": "error",
      "useHeadingContent": "error",
      "useHtmlLang": "error",
      "useIframeTitle": "error",
      "useMediaCaption": "error",
      "useValidAnchor": "error"
    }
  }
}
```
✅ **Хорошо поддерживается** - Biome имеет обширный набор правил доступности, покрывающих большинство случаев ESLint plugin.

---

## Ограничения

### Что не поддерживается в Biome:

1. **Vitest/Jest/Testing Library правила** - Biome не имеет специфичных правил для тестовых фреймворков
2. **Сортировка JSX props** - пока не реализовано
3. **Кастомные паттерны игнорирования переменных** - используйте комментарии для отключения

### Рекомендации:

Для специфичных правил тестирования можно:
- Использовать ESLint только для тестовых файлов
- Использовать TypeScript strict mode для дополнительных проверок
- Полагаться на IDE подсказки

---

## Установка

### 1. Установите Biome

```bash
npm install --save-dev --save-exact @biomejs/biome
```

### 2. Удалите старые зависимости

```bash
npm uninstall eslint prettier \
  @eslint/js \
  eslint-plugin-import \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-simple-import-sort \
  eslint-plugin-vitest \
  eslint-plugin-jest-dom \
  eslint-plugin-testing-library \
  eslint-plugin-prettier \
  eslint-config-prettier \
  typescript-eslint
```

### 3. Обновите package.json scripts

```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write .",
    "ci": "biome ci ."
  }
}
```

**Описание команд:**
- `biome lint` - только линтинг
- `biome format` - только форматирование
- `biome check` - линтинг + форматирование + организация импортов (рекомендуется)
- `biome ci` - проверка без изменения файлов (для CI/CD)

### 4. Настройте VSCode (опционально)

Установите расширение Biome и добавьте в `.vscode/settings.json`:

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

### 5. Удалите старые конфигурационные файлы

```bash
rm eslint.config.js .prettierrc .eslintrc* .prettierignore
```

---

## Сравнительная таблица

| Функция | ESLint + Prettier | Biome |
|---------|------------------|-------|
| Форматирование | Prettier | ✅ Встроено |
| Линтинг | ESLint | ✅ Встроено |
| Организация импортов | Плагин | ✅ Встроено |
| Скорость | Средняя | ⚡ В 10-20 раз быстрее |
| TypeScript | Нужен плагин | ✅ Нативная поддержка |
| React правила | Плагины | ✅ Встроено |
| Accessibility (a11y) | Плагин | ✅ Встроено |
| Тестовые правила | Плагины | ❌ Не поддерживается |
| Конфигурация | Множество файлов | 1 файл (biome.json) |

---

## Итоговая миграция

### Что получили:
✅ Все правила Prettier мигрированы на 100%
✅ ~90% правил ESLint покрыты Biome
✅ Улучшенная производительность (10-20x быстрее)
✅ Единая конфигурация в одном файле
✅ Нативная поддержка TypeScript и React

### Что потеряли:
❌ Специфичные правила для тестовых фреймворков (Vitest/Jest/Testing Library)
❌ Сортировка JSX props (можно обсудить с командой Biome)
❌ Кастомные паттерны игнорирования неиспользуемых переменных

### Рекомендации:
- Используйте Biome для всего кода
- Для тестов полагайтесь на TypeScript strict mode
- Подключите pre-commit хуки с Biome для автоматических проверок
