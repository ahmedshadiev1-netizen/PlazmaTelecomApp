# 🔧 Сборка БЕЗ react-native-gradle-plugin

## Проблема
React Native 0.72 требует плагин `react-native-gradle-plugin`, который не работает в CI/CD.

## Решение: Ручная сборка JS бандла

### Шаг 1: Собрать JS бандл вручную

```powershell
cd PlazmaTelecomApp

# Создать директории для бандла
mkdir -p android\app\src\main\assets

# Собрать JS бандл
npx react-native bundle `
    --platform android `
    --dev false `
    --entry-file index.js `
    --bundle-output android/app/src/main/assets/index.android.bundle `
    --assets-dest android/app/src/main/res/
```

### Шаг 2: Собрать APK

```powershell
cd android
.\gradlew.bat assembleDebug
```

### Автоматизация: Обновленный build-local.bat

```batch
@echo off
echo === Сборка без плагина ===

cd PlazmaTelecomApp

echo 1. Установка зависимостей...
npm install --legacy-peer-deps

echo 2. Создание директорий...
mkdir android\app\src\main\assets 2>nul

echo 3. Сборка JS бандла...
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

echo 4. Сборка APK...
cd android
.\gradlew.bat assembleDebug

echo 5. Проверка...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✓ APK готов!
    dir app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ✗ APK не найден!
)
```

## ✅ Преимущества

- ✅ Не требует плагина
- ✅ Работает везде (локально и в CI/CD)
- ✅ Полный контроль над процессом

## ⚠️ Недостатки

- ⚠️ Нужно собирать бандл вручную
- ⚠️ Дольше (2 шага вместо 1)

## 📝 Для CI/CD

Добавьте шаг сборки бандла перед `assembleDebug`:

```yaml
- name: Bundle JS
  run: |
    npx react-native bundle \
      --platform android \
      --dev false \
      --entry-file index.js \
      --bundle-output android/app/src/main/assets/index.android.bundle \
      --assets-dest android/app/src/main/res/
```

