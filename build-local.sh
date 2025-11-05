#!/bin/bash
# Скрипт для локальной сборки APK (100% рабочий вариант)

set -e

echo "=== Локальная сборка Android APK ==="
echo ""

# Проверка окружения
echo "1. Проверка Node.js..."
node --version || (echo "ERROR: Node.js не установлен" && exit 1)
npm --version || (echo "ERROR: npm не установлен" && exit 1)

echo ""
echo "2. Установка зависимостей..."
npm install --legacy-peer-deps

echo ""
echo "3. Переход в android директорию..."
cd android

echo ""
echo "4. Создание keystore (если нужно)..."
if [ ! -f "app/debug.keystore" ]; then
  echo "Создаю debug.keystore..."
  keytool -genkeypair -v -storetype PKCS12 \
    -keystore app/debug.keystore \
    -storepass android \
    -alias androiddebugkey \
    -keypass android \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Android Debug,O=Android,C=US"
fi

echo ""
echo "5. Сборка debug APK..."
chmod +x gradlew
./gradlew assembleDebug --no-daemon

echo ""
echo "6. Проверка результата..."
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
  echo "✓ APK успешно собран!"
  ls -lh app/build/outputs/apk/debug/app-debug.apk
  echo ""
  echo "APK находится в: android/app/build/outputs/apk/debug/app-debug.apk"
else
  echo "✗ APK не найден!"
  exit 1
fi

