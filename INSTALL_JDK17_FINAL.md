# 🔧 КРИТИЧНО: Установка JDK 17

## ❌ Проблема
Gradle 7.6.3 **НЕ поддерживает Java 21** (major version 65).
Нужен **Java 17** (major version 61).

Android Studio содержит JDK 21, но для Gradle 7.6.3 нужен JDK 17.

## ✅ Решение: Установить JDK 17

### Шаг 1: Скачать JDK 17

1. Откройте: https://adoptium.net/temurin/releases/?version=17
2. Выберите:
   - **Operating System:** Windows
   - **Architecture:** x64
   - **Package Type:** JDK
   - **Version:** 17 (LTS)
3. Нажмите **Download** (файл .msi)

### Шаг 2: Установить JDK 17

1. Запустите скачанный .msi файл
2. Следуйте инструкциям (обычная установка)
3. Запомните путь установки (обычно: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\`)

### Шаг 3: Настроить gradle.properties

1. Откройте файл `android/gradle.properties`
2. Найдите строку с `org.gradle.java.home`
3. Раскомментируйте и укажите путь к JDK 17:

```properties
org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.x-hotspot
```

(Замените `17.0.x` на вашу версию)

### Шаг 4: Проверить

```powershell
cd android
.\gradlew.bat --version
```

Должно показать, что используется Java 17.

### Шаг 5: Собрать APK

```powershell
cd C:\Users\shadiev-an\Documents\LB\PlazmaTelecomApp
.\build-with-java17.bat
```

Или вручную:

```powershell
cd android
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
.\gradlew.bat assembleDebug
```

---

## 🎯 Альтернатива: Использовать Gradle 8.5 с Java 21

Если не хотите устанавливать JDK 17, можно вернуться к Gradle 8.5:

1. Откройте `android/gradle/wrapper/gradle-wrapper.properties`
2. Измените на: `gradle-8.5-all.zip`
3. Откройте `android/build.gradle`
4. Измените AGP на: `8.1.4`
5. Измените `compileSdkVersion` на: `34`

Но это может привести к другим проблемам с зависимостями.

---

## ✅ Рекомендация

**Установите JDK 17** - это самый надежный способ для React Native 0.72.17.

После установки JDK 17 сборка должна работать!

