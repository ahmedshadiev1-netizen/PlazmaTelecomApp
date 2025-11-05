@echo off
REM Скрипт для локальной сборки APK на Windows (БЕЗ плагина)

echo === Локальная сборка Android APK (без react-native-gradle-plugin) ===
echo.

echo 1. Проверка Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js не установлен
    exit /b 1
)

echo.
echo 2. Установка зависимостей...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Ошибка установки зависимостей
    exit /b 1
)

echo.
echo 3. Создание директорий для бандла...
if not exist "android\app\src\main\assets" mkdir android\app\src\main\assets

echo.
echo 4. Сборка JS бандла вручную (без плагина)...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
if %errorlevel% neq 0 (
    echo ERROR: Ошибка сборки JS бандла
    exit /b 1
)

echo.
echo 5. Переход в android директорию...
cd android

echo.
echo 6. Создание keystore (если нужно)...
if not exist "app\debug.keystore" (
    echo Создаю debug.keystore...
    keytool -genkeypair -v -storetype PKCS12 ^
        -keystore app\debug.keystore ^
        -storepass android ^
        -alias androiddebugkey ^
        -keypass android ^
        -keyalg RSA -keysize 2048 -validity 10000 ^
        -dname "CN=Android Debug,O=Android,C=US"
)

echo.
echo 7. Сборка debug APK...
call gradlew.bat assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo ERROR: Ошибка сборки APK
    exit /b 1
)

echo.
echo 8. Проверка результата...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo ========================================
    echo ✓ APK успешно собран!
    echo ========================================
    dir app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo APK находится в: android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ✗ APK не найден!
    exit /b 1
)

