# Варианты сборки APK без Expo EAS

## Вариант 1: GitHub Actions (БЕСПЛАТНО)

### Настройка:
1. Загрузите проект на GitHub
2. Создайте репозиторий на GitHub
3. Загрузите код:
   ```powershell
   cd C:\Users\shadiev-an\Documents\LB\PlazmaTelecomApp
   git remote add origin https://github.com/ваш-username/PlazmaTelecomApp.git
   git push -u origin master
   ```

4. GitHub Actions автоматически соберет APK при каждом push
5. APK будет доступен в разделе "Actions" → "Artifacts"

### Преимущества:
- ✅ Бесплатно
- ✅ Автоматическая сборка
- ✅ Не требует локальной установки Android SDK
- ✅ APK доступен для скачивания

---

## Вариант 2: Локальная сборка через Android Studio

### Требования:
- Android Studio (установить с https://developer.android.com/studio)
- Android SDK
- JDK 17

### Шаги:
1. Установите Android Studio
2. Откройте папку `android` в Android Studio
3. Дождитесь синхронизации Gradle
4. Build → Generate Signed Bundle / APK → APK
5. Выберите существующий keystore или создайте новый
6. APK будет в `android/app/build/outputs/apk/release/`

### Преимущества:
- ✅ Полный контроль
- ✅ Не зависит от облачных сервисов
- ✅ Можно тестировать локально

### Недостатки:
- ❌ Требует установки Android Studio (несколько GB)
- ❌ Дольше настройка

---

## Вариант 3: Codemagic.io (БЕСПЛАТНО до 500 минут/месяц)

### Настройка:
1. Зарегистрируйтесь на https://codemagic.io
2. Подключите GitHub репозиторий
3. Codemagic автоматически определит React Native проект
4. Нажмите "Start new build"
5. APK будет доступен после сборки

### Преимущества:
- ✅ Бесплатный тариф (500 минут/месяц)
- ✅ Простая настройка
- ✅ Автоматическая сборка

---

## Вариант 4: Bitrise.io (БЕСПЛАТНО до 200 сборок/месяц)

### Настройка:
1. Зарегистрируйтесь на https://bitrise.io
2. Подключите GitHub репозиторий
3. Выберите шаблон "React Native"
4. Запустите сборку
5. APK будет доступен для скачивания

### Преимущества:
- ✅ Бесплатный тариф (200 сборок/месяц)
- ✅ Мощная платформа
- ✅ Хорошая документация

---

## Рекомендация

**Для быстрого результата:** Используйте **GitHub Actions** - уже настроен в проекте!

**Для локальной разработки:** Используйте **Android Studio**

