# Реализация интернационализации (i18n) в Stoplight Elements

## Обзор

В этом документе описана интеграция системы интернационализации (i18n) в проект Stoplight Elements для поддержки многоязычного интерфейса web-components. Система интегрирована с MikoPBX i18n.

## Архитектура решения

### 1. Модуль i18n

**Файл:** `/packages/elements-core/src/utils/i18n.ts`

Создан TypeScript модуль, который предоставляет функцию-обёртку для доступа к глобальной функции i18n из MikoPBX:

```typescript
declare global {
  function i18n(key: string, params?: Record<string, any>): string;
}

export function t(key: string, params?: Record<string, any>): string {
  if (typeof i18n === 'function') {
    return i18n(key, params);
  }
  return key; // Fallback, если i18n не доступен
}
```

**Особенности:**
- Проверяет доступность глобальной функции `i18n()` во время выполнения
- Возвращает ключ перевода, если функция i18n недоступна (fallback)
- Поддерживает параметры для динамической подстановки значений
- Типизирована для TypeScript

### 2. Экспорт модуля в package.json

**Файл:** `/packages/elements-core/package.json`

Добавлен экспорт модуля i18n для использования в других пакетах:

```json
"exports": {
  ".": {
    "require": "./dist/index.js",
    "import": "./dist/index.mjs"
  },
  "./utils/i18n": {
    "require": "./dist/utils/i18n.js",
    "import": "./dist/utils/i18n.mjs"
  }
}
```

Это позволяет импортировать функцию в других пакетах:
```typescript
import { t } from '@stoplight/elements-core/utils/i18n';
```

## Обработанные компоненты

### Всего обработано: 24 файла

#### Пакет `elements` (1 файл):
1. **API.tsx** - Основной компонент API
   - Сообщения об ошибках загрузки документа
   - Сообщения об ошибках парсинга OpenAPI

#### Пакет `elements-core` (23 файла):

**HttpOperation компоненты:**
1. **Request.tsx** - Компонент запроса
2. **Responses.tsx** - Компонент ответов
3. **Callbacks.tsx** - Обратные вызовы
4. **Body.tsx** - Тело запроса

**TryIt компоненты:**
5. **TryIt.tsx** - Основной компонент "Попробовать API"
6. **BasicAuth.tsx** - Базовая аутентификация
7. **DigestAuth.tsx** - Digest аутентификация
8. **Auth.tsx** - Общий компонент аутентификации
9. **FileUploadParameterEditors.tsx** - Загрузка файлов
10. **OperationParameters.tsx** - Параметры операций
11. **RequestBody.tsx** - Тело запроса
12. **Response.tsx** - Компонент ответа
13. **ServersDropdown.tsx** - Выбор сервера

**Docs компоненты:**
14. **ExportButton.tsx** - Кнопка экспорта
15. **ServerInfo.tsx** - Информация о сервере
16. **SecuritySchemes.tsx** - Схемы безопасности
17. **AdditionalInfo.tsx** - Дополнительная информация
18. **Model.tsx** - Модель данных

**Другие компоненты:**
19. **RequestSamples.tsx** - Примеры запросов
20. **ResponseExamples.tsx** - Примеры ответов
21. **LoadMore.tsx** - Загрузка примеров
22. **MockingButton.tsx** - Кнопка моков

**Утилиты:**
23. **securitySchemes.ts** - Утилита для схем безопасности

## Ключи переводов

Все ключи переводов имеют префикс `sl_` (Stoplight) для избежания конфликтов.

### Категории ключей:

#### Ошибки и состояния:
- `sl_DocumentLoadError` - "Не удалось загрузить документ"
- `sl_DocumentLoadErrorDesc` - Описание ошибки загрузки
- `sl_ParseError` - "Не удалось разобрать файл OpenAPI"
- `sl_ParseErrorDesc` - Описание ошибки парсинга
- `sl_Loading` - "Загрузка..."
- `sl_Error` - "Ошибка"
- `sl_NetworkError` - "Произошла сетевая ошибка."

#### Компоненты запроса:
- `sl_Request` - "Запрос"
- `sl_Response` - "Ответ"
- `sl_Parameters` - "Параметры"
- `sl_PathParameters` - "Параметры пути"
- `sl_QueryParameters` - "Параметры запроса"
- `sl_Headers` - "Заголовки"
- `sl_Cookies` - "Куки"
- `sl_Body` - "Тело"

#### Аутентификация:
- `sl_Auth` - "Аутентификация"
- `sl_Username` - "Имя пользователя"
- `sl_Password` - "Пароль"
- `sl_Authorization` - "Авторизация"
- `sl_SecuritySchemes` - "Схемы безопасности"
- `sl_Security` - "Безопасность"
- `sl_NoAuthSelected` - "Аутентификация не выбрана"

#### Примеры и образцы:
- `sl_Example` - "Пример"
- `sl_Examples` - "Примеры"
- `sl_RequestSample` - "Пример запроса: %languageName%"
- `sl_ResponseExample` - "Пример ответа"
- `sl_UnableToGenerateCode` - "Не удалось сгенерировать пример кода"

#### Действия:
- `sl_SendAPIRequest` - "Отправить API запрос"
- `sl_Export` - "Экспорт"
- `sl_Upload` - "Загрузить"
- `sl_Close` - "Закрыть"
- `sl_LoadExamples` - "Загрузить примеры"

#### Серверы и URL:
- `sl_Server` - "Сервер"
- `sl_Servers` - "Серверы"
- `sl_APIBaseURL` - "Базовый URL API"
- `sl_CopyServerURL` - "Скопировать URL сервера"
- `sl_Endpoints` - "Конечные точки"

#### Прочее:
- `sl_AdditionalInformation` - "Дополнительная информация"
- `sl_Callbacks` - "Обратные вызовы"
- `sl_MockSettings` - "Настройки имитации"

**Всего ключей:** 60+

## Примеры использования

### Простая строка:
```typescript
import { t } from '@stoplight/elements-core/utils/i18n';

<Panel.Titlebar>{t('sl_Request')}</Panel.Titlebar>
```

### Строка с параметрами:
```typescript
import { t } from '@stoplight/elements-core/utils/i18n';

<Button>{t('sl_RequestSample', { languageName: 'JavaScript' })}</Button>
// Результат: "Пример запроса: JavaScript"
```

### В атрибутах:
```typescript
<Button aria-label={t('sl_SendAPIRequest')}>
  {t('sl_SendAPIRequest')}
</Button>
```

## Интеграция с MikoPBX

### Структура файлов переводов в MikoPBX:

**Английский (оригинал):**
`/Users/nb/PhpstormProjects/mikopbx/Core/src/Common/Messages/en/StoplightElements.php`

**Русский:**
`/Users/nb/PhpstormProjects/mikopbx/Core/src/Common/Messages/ru/StoplightElements.php`

### Формат файла переводов:
```php
<?php
return [
    'sl_Request' => 'Запрос',
    'sl_Response' => 'Ответ',
    'sl_RequestSample' => 'Пример запроса: %languageName%',
    // ... другие переводы
];
```

### Параметры в переводах:
Используется формат `%parameterName%` для подстановки динамических значений:
```php
'sl_ComingSoon' => 'Скоро: %schemeName%',
'sl_RequestSample' => 'Пример запроса: %languageName%',
```

## Процесс сборки

### 1. Установка зависимостей:
```bash
cd /path/to/elements
yarn install
```

### 2. Сборка пакетов:
```bash
# Сборка всего проекта
yarn build

# Или сборка конкретных пакетов
yarn workspace @stoplight/elements-core build
yarn workspace @stoplight/elements build
```

### 3. Сборка web-components:
```bash
cd packages/elements
yarn build.webcomponents
```

### 4. Результирующие файлы:
- **JavaScript:** `/packages/elements/dist/web-components.min.js` (~1.9 MB)
- **CSS:** `/packages/elements/dist/styles.min.css` (~289 KB)

## Развертывание в MikoPBX

### Копирование файлов:
```bash
# JavaScript
cp packages/elements/dist/web-components.min.js \
   /path/to/mikopbx/Core/sites/admin-cabinet/assets/js/vendor/stoplight-elements/

# CSS
cp packages/elements/dist/styles.min.css \
   /path/to/mikopbx/Core/sites/admin-cabinet/assets/css/vendor/stoplight-elements/
```

### Требования в HTML:
```html
<!-- 1. Сначала загружается система переводов MikoPBX -->
<script src="/path/to/global-translate.js"></script>

<!-- 2. Затем web-components -->
<script src="/path/to/web-components.min.js"></script>
<link rel="stylesheet" href="/path/to/styles.min.css">
```

## Добавление новых переводов

### Шаг 1: Добавить ключ в английский файл
Файл: `/path/to/mikopbx/Core/src/Common/Messages/en/StoplightElements.php`
```php
'sl_NewKey' => 'English text here',
```

### Шаг 2: Добавить перевод в русский файл
Файл: `/path/to/mikopbx/Core/src/Common/Messages/ru/StoplightElements.php`
```php
'sl_NewKey' => 'Русский текст здесь',
```

### Шаг 3: Использовать в компоненте
```typescript
import { t } from '@stoplight/elements-core/utils/i18n';

<div>{t('sl_NewKey')}</div>
```

### Шаг 4: Пересобрать проект
```bash
yarn build
```

## Особенности реализации

### 1. Runtime проверка
Функция `t()` проверяет доступность глобальной функции `i18n()` во время выполнения, что позволяет использовать компоненты как с системой переводов, так и без неё.

### 2. Fallback механизм
Если функция `i18n()` недоступна, возвращается сам ключ перевода. Это позволяет компонентам работать автономно.

### 3. Относительные импорты
В каждом компоненте используется правильный относительный путь для импорта функции `t()`:
```typescript
// Для компонентов на уровне components/Docs/
import { t } from '../../../utils/i18n';

// Для компонентов на уровне components/
import { t } from '../../utils/i18n';
```

### 4. Поддержка параметров
Система поддерживает динамическую подстановку параметров:
```typescript
t('sl_RequestSample', { languageName: 'cURL' })
// → "Пример запроса: cURL"
```

### 5. TypeScript совместимость
Все изменения полностью типизированы и совместимы с TypeScript.

## Проверка работоспособности

### В браузере:
1. Откройте консоль разработчика
2. Проверьте наличие глобальной функции:
   ```javascript
   typeof i18n === 'function' // должно быть true
   ```
3. Проверьте работу перевода:
   ```javascript
   i18n('sl_Request') // должно вернуть "Запрос" для русской локали
   ```

### В коде компонента:
Проверьте, что все строки обёрнуты в вызовы `t()` и нет хардкодных английских строк.

## Патчи для внешних библиотек

### @stoplight/json-schema-viewer

Для поддержки i18n в схемах и моделях данных был создан патч для библиотеки `@stoplight/json-schema-viewer`.

**Файл патча:** `/patches/@stoplight+json-schema-viewer+4.16.3.patch`

**Изменённые строки:**
- `"required"` → `t('sl_Required')` - "обязательный"
- `"read-only"` → `t('sl_ReadOnly')` - "только для чтения"

**Применение патча:**
Патч автоматически применяется к файлам `index.js` и `index.mjs` в `node_modules/@stoplight/json-schema-viewer/`.

Изменения добавляют локальную функцию `t()` в компонент `Properties`, которая проверяет доступность глобальной функции `i18n()` и использует её для перевода.

**Примечание:** После `yarn install` может потребоваться повторное применение патча, если используется пакет patch-package.

## Известные ограничения

1. **TypeScript ошибки в persistAtom.ts** - существующие ошибки типов в файле `src/utils/jotai/persistAtom.ts` не связаны с реализацией i18n и присутствовали в оригинальном коде.

2. **Циклические зависимости** - предупреждения о циклических зависимостях между HttpOperation и Callbacks компонентами существовали до внедрения i18n.

3. **Webpack size** - размер бандла может увеличиться незначительно из-за добавления проверок `typeof i18n` в каждом компоненте.

4. **Внешние библиотеки** - некоторые строки из библиотек `@stoplight/mosaic` могут оставаться непереведёнными, так как патчи для них ещё не созданы.

## Поддержка и обновления

При обновлении Stoplight Elements до новой версии необходимо:

1. Проверить новые компоненты на наличие хардкодных строк
2. Добавить новые ключи переводов в файлы переводов
3. Обернуть новые строки в вызовы `t()`
4. Пересобрать проект
5. Скопировать обновлённые файлы в MikoPBX

## Контрольный список для новых строк

- [ ] Строка добавлена в `/en/StoplightElements.php`
- [ ] Строка добавлена в `/ru/StoplightElements.php`
- [ ] Ключ имеет префикс `sl_`
- [ ] Строка обёрнута в `t()` в компоненте
- [ ] Добавлен импорт `import { t } from '...'`
- [ ] Проект пересобран
- [ ] Файлы скопированы в MikoPBX
- [ ] Проверена работа в браузере

---

**Дата создания:** 17 октября 2025
**Версия Stoplight Elements:** 9.0.8
**Автор:** Интеграция с MikoPBX i18n system
