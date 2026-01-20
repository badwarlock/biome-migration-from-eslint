# Biome Шпаргалка

## 🚀 Основные команды

### Проверка и исправление

```bash
# Проверить весь проект (линтинг + форматирование + импорты)
npm run check

# Проверить и автоматически исправить
npm run check:fix

# Или напрямую через biome
npx biome check --write .
```

### Только линтинг

```bash
# Проверить код на ошибки
npm run lint

# Исправить автоматически исправимые ошибки
npm run lint:fix

# Или напрямую
npx biome lint .
npx biome lint --write .
```

### Только форматирование

```bash
# Проверить форматирование
npm run format

# Отформатировать файлы
npm run format:fix

# Или напрямую
npx biome format .
npx biome format --write .
```

### CI/CD

```bash
# Проверка без изменения файлов (для CI/CD)
npm run ci

# Или напрямую
npx biome ci .
```

## 📁 Работа с файлами

```bash
# Проверить конкретный файл
npx biome check src/App.tsx

# Проверить конкретную папку
npx biome check src/

# Проверить множество файлов
npx biome check src/**/*.tsx
```

## 🔧 Конфигурация

### Инициализация конфига

```bash
# Создать новый biome.json
npx biome init
```

### Миграция с ESLint/Prettier

```bash
# Biome может помочь с миграцией
npx @biomejs/biome migrate eslint --write
npx @biomejs/biome migrate prettier --write
```

## 🎯 Игнорирование правил

### В коде

```typescript
// Игнорировать следующую строку
// biome-ignore lint/suspicious/noExplicitAny: Legacy code
const data: any = getData();

// Игнорировать блок кода
/* biome-ignore lint/complexity/noUselessFragments: Needed for key */
<>
  <Component key={id} />
</>
```

### В конфиге (biome.json)

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  }
}
```

## 📊 Полезные флаги

```bash
# Показать максимум информации
npx biome check --verbose .

# Показать только ошибки (без предупреждений)
npx biome lint --error-on-warnings .

# Использовать конкретный конфиг
npx biome check --config-path ./custom-biome.json .

# Показать время выполнения
npx biome check --max-diagnostics=200 .
```

## 🎨 Форматирование

### Специфичные опции

```bash
# Использовать отступы табами
npx biome format --indent-style=tab .

# Изменить ширину строки
npx biome format --line-width=120 .

# Изменить стиль кавычек
npx biome format --quote-style=single .
```

## 🔍 Отладка

### Показать, что будет изменено

```bash
# Показать diff без изменения файлов
npx biome check --write --verbose .
```

### Проверить конфигурацию

```bash
# Показать текущую конфигурацию
npx biome explain .

# Проверить конкретное правило
npx biome explain noUnusedVariables
```

## 🎭 Pre-commit хуки

### С Husky

```bash
# Установка
npm install --save-dev husky lint-staged

# Инициализация
npx husky init

# .husky/pre-commit
npx lint-staged
```

### lint-staged конфигурация (package.json)

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json}": ["biome check --write --no-errors-on-unmatched"]
  }
}
```

## 📝 Примеры использования в разных сценариях

### Проверить только измененные файлы (Git)

```bash
# Проверить файлы в staging
npx biome check --staged

# Проверить измененные файлы
git diff --name-only --diff-filter=ACMR | xargs npx biome check --write
```

### Интеграция в CI/CD

```yaml
# GitHub Actions
- name: Run Biome
  run: npm run ci

# GitLab CI
script:
  - npm run ci
```

### Запуск в watch режиме (через nodemon)

```bash
# Установка
npm install --save-dev nodemon

# package.json
{
  "scripts": {
    "watch": "nodemon --watch src --ext ts,tsx,js,jsx --exec 'npm run check:fix'"
  }
}
```

## 💡 Советы

1. **Используйте `check --write`** для одновременного линтинга, форматирования и организации импортов
2. **Добавьте pre-commit хук** для автоматической проверки перед коммитом
3. **Настройте IDE** для автоматического форматирования при сохранении
4. **В CI используйте `ci`** команду для быстрой проверки без изменений
5. **Для больших проектов** используйте `--max-diagnostics` для ограничения вывода

## 🔗 Полезные ссылки

- [Официальная документация](https://biomejs.dev/)
- [CLI документация](https://biomejs.dev/reference/cli/)
- [Список всех правил](https://biomejs.dev/linter/rules/)
- [Конфигурация](https://biomejs.dev/reference/configuration/)
