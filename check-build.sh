#!/bin/bash
# Скрипт для проверки конфигурации перед сборкой

set -e

echo "=== Проверка конфигурации проекта ==="
echo ""

# Проверка Node.js
echo "1. Проверка Node.js..."
node --version || (echo "ERROR: Node.js не установлен" && exit 1)
npm --version || (echo "ERROR: npm не установлен" && exit 1)
echo "✓ Node.js и npm установлены"
echo ""

# Проверка зависимостей
echo "2. Проверка зависимостей..."
if [ ! -d "node_modules" ]; then
    echo "ERROR: node_modules не найден. Запустите: npm install"
    exit 1
fi

if [ ! -d "node_modules/react-native" ]; then
    echo "ERROR: react-native не найден в node_modules"
    exit 1
fi
echo "✓ node_modules проверен"
echo ""

# Проверка gradle plugin
echo "3. Проверка Gradle plugin..."
if [ -d "node_modules/@react-native/gradle-plugin" ]; then
    echo "✓ Найден @react-native/gradle-plugin"
    PLUGIN_PATH="node_modules/@react-native/gradle-plugin"
elif [ -d "node_modules/react-native" ]; then
    echo "✓ Найден react-native (плагин должен быть внутри)"
    PLUGIN_PATH="node_modules/react-native"
else
    echo "WARNING: Gradle plugin не найден"
    PLUGIN_PATH=""
fi
echo ""

# Проверка Android
echo "4. Проверка Android конфигурации..."
if [ ! -d "android" ]; then
    echo "ERROR: android директория не найдена"
    exit 1
fi

cd android

# Проверка gradlew
if [ ! -f "gradlew" ]; then
    echo "ERROR: gradlew не найден"
    exit 1
fi
chmod +x gradlew
echo "✓ gradlew найден и выполнимый"
echo ""

# Проверка settings.gradle
echo "5. Проверка settings.gradle..."
if [ ! -f "settings.gradle" ]; then
    echo "ERROR: settings.gradle не найден"
    exit 1
fi

if grep -q "includeBuild" settings.gradle; then
    echo "✓ settings.gradle содержит includeBuild"
    if [ -n "$PLUGIN_PATH" ]; then
        EXPECTED_PATH="../$PLUGIN_PATH"
        if grep -q "$EXPECTED_PATH" settings.gradle; then
            echo "✓ Путь к плагину корректен: $EXPECTED_PATH"
        else
            echo "WARNING: Путь к плагину в settings.gradle не совпадает с фактическим"
        fi
    fi
else
    echo "WARNING: settings.gradle не содержит includeBuild"
fi
echo ""

# Проверка build.gradle
echo "6. Проверка build.gradle..."
if [ ! -f "build.gradle" ]; then
    echo "ERROR: build.gradle не найден"
    exit 1
fi

if grep -q "repositories" build.gradle; then
    echo "✓ build.gradle содержит repositories"
else
    echo "ERROR: build.gradle не содержит repositories"
    exit 1
fi

if grep -q "react-native-gradle-plugin" build.gradle; then
    echo "✓ build.gradle содержит react-native-gradle-plugin"
else
    echo "ERROR: build.gradle не содержит react-native-gradle-plugin"
    exit 1
fi
echo ""

# Тестовая проверка Gradle
echo "7. Тестовая проверка Gradle..."
./gradlew --version || (echo "ERROR: Gradle не работает" && exit 1)
echo "✓ Gradle работает"
echo ""

# Проверка задачи
echo "8. Проверка доступности задач..."
./gradlew tasks --all 2>&1 | grep -q "assembleDebug" || echo "WARNING: assembleDebug задача не найдена"
echo ""

echo "=== Все проверки пройдены! ==="
echo "Можно запускать сборку: ./gradlew assembleDebug"

