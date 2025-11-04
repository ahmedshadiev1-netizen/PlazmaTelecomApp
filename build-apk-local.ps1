# Скрипт для локальной сборки APK (требует Android Studio/SDK)

Write-Host "=== Сборка APK локально ===" -ForegroundColor Green

# Проверка наличия Android SDK
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    Write-Host "ОШИБКА: ANDROID_HOME не установлен!" -ForegroundColor Red
    Write-Host "Установите Android Studio и настройте ANDROID_HOME" -ForegroundColor Yellow
    exit 1
}

Write-Host "Android SDK найден: $androidHome" -ForegroundColor Green

# Установка зависимостей
Write-Host "`nУстановка зависимостей..." -ForegroundColor Yellow
npm install

# Сборка APK
Write-Host "`nСборка APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew.bat assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ APK успешно собран!" -ForegroundColor Green
    Write-Host "APK находится в: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Ошибка при сборке APK" -ForegroundColor Red
}

Set-Location ..

