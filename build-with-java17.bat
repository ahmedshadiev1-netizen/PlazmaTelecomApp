@echo off
REM Скрипт для сборки APK с правильной Java 17

echo === Сборка APK с Java 17 ===
echo.

REM Установка JAVA_HOME на JDK из Android Studio
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

echo Проверка Java:
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java не найден!
    exit /b 1
)

echo.
echo Переход в директорию проекта...
cd /d "%~dp0"

echo.
echo Установка зависимостей...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Ошибка установки зависимостей
    exit /b 1
)

echo.
echo Создание директорий для бандла...
if not exist "android\app\src\main\assets" mkdir android\app\src\main\assets

echo.
echo Сборка JS бандла...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
if %errorlevel% neq 0 (
    echo ERROR: Ошибка сборки JS бандла
    exit /b 1
)

echo.
echo Переход в android директорию...
cd android

echo.
echo Создание keystore (если нужно)...
if not exist "app\debug.keystore" (
    echo Создаю debug.keystore...
    "%JAVA_HOME%\bin\keytool.exe" -genkeypair -v -storetype PKCS12 ^
        -keystore app\debug.keystore ^
        -storepass android ^
        -alias androiddebugkey ^
        -keypass android ^
        -keyalg RSA -keysize 2048 -validity 10000 ^
        -dname "CN=Android Debug,O=Android,C=US"
)

echo.
echo Сборка debug APK с Java 17...
call gradlew.bat assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo ERROR: Ошибка сборки APK
    exit /b 1
)

echo.
echo Проверка результата...
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

