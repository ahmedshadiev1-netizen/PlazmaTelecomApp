@echo off
REM Скрипт для локальной сборки APK на Windows

echo === Локальная сборка Android APK ===
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
echo 3. Переход в android директорию...
cd android

echo.
echo 4. Создание keystore (если нужно)...
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
echo 5. Сборка debug APK...
call gradlew.bat assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo ERROR: Ошибка сборки
    exit /b 1
)

echo.
echo 6. Проверка результата...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✓ APK успешно собран!
    dir app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo APK находится в: android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ✗ APK не найден!
    exit /b 1
)

