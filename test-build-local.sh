#!/bin/bash
# Скрипт для локальной проверки сборки (только для диагностики)

echo "=== Локальная проверка сборки ==="
echo ""

# Проверка структуры
echo "1. Проверка структуры проекта..."
[ -f "package.json" ] && echo "✓ package.json" || echo "✗ package.json missing"
[ -d "android" ] && echo "✓ android/" || echo "✗ android/ missing"
[ -f "android/gradlew" ] && echo "✓ android/gradlew" || echo "✗ android/gradlew missing"
[ -f "android/app/build.gradle" ] && echo "✓ android/app/build.gradle" || echo "✗ build.gradle missing"

echo ""
echo "2. Проверка зависимостей..."
if [ -d "node_modules" ]; then
  echo "✓ node_modules exists"
  [ -d "node_modules/@react-native-community/cli-platform-android" ] && echo "✓ React Native CLI found" || echo "✗ React Native CLI missing"
else
  echo "✗ node_modules missing - run 'npm install' first"
fi

echo ""
echo "3. Проверка Gradle..."
cd android
if [ -x "gradlew" ]; then
  echo "✓ gradlew is executable"
  echo "Testing Gradle version..."
  ./gradlew --version 2>&1 | head -5 || echo "Gradle check failed"
else
  echo "✗ gradlew not executable"
fi

echo ""
echo "4. Проверка keystore..."
if [ -f "app/debug.keystore" ]; then
  echo "✓ debug.keystore exists"
else
  echo "⚠ debug.keystore missing (will be created during build)"
fi

echo ""
echo "=== Проверка завершена ==="

