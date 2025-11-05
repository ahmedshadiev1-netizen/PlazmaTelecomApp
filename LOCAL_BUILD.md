# 🚀 Локальная сборка APK (100% рабочий вариант)

Если GitHub Actions не работает, используйте локальную сборку:

## Windows

```bash
build-local.bat
```

Или вручную:

```bash
cd PlazmaTelecomApp
npm install --legacy-peer-deps
cd android
gradlew.bat assembleDebug
```

APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

## Linux/Mac

```bash
chmod +x build-local.sh
./build-local.sh
```

Или вручную:

```bash
cd PlazmaTelecomApp
npm install --legacy-peer-deps
cd android
chmod +x gradlew
./gradlew assembleDebug
```

APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

## Требования

- Node.js 18+
- Java 17
- Android SDK (через Android Studio)
- Переменные окружения: ANDROID_HOME, ANDROID_SDK_ROOT

## Альтернатива: GitHub Actions

Если хотите использовать CI, проверьте сборку #46+ - там минимальная конфигурация без pluginManagement.

