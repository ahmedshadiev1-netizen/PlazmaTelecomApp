# 🔧 Исправление ошибки "Incompatible Java version"

## ❌ Проблема
Ошибка при сборке:
- "Incompatible because this component declares a component, compatible with Java 11 and the consumer needed a component, compatible with Java 8"
- Gradle 8.5 требует Java 17

## ✅ Решение

### Вариант 1: Использовать JDK 17 (РЕКОМЕНДУЕТСЯ)

**В командной строке:**

1. Убедитесь, что используется Java 17:
   ```powershell
   java -version
   ```
   Должно быть: `openjdk version "17"`

2. Если не Java 17, установите JDK 17:
   - Скачайте: https://adoptium.net/temurin/releases/?version=17
   - Или используйте JDK из Android Studio

3. Установите JAVA_HOME:
   ```powershell
   $env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
   ```
   (Или путь к вашему JDK 17)

4. Попробуйте сборку снова:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug
   ```

### Вариант 2: Использовать Gradle через Android Studio JDK

Android Studio обычно использует свой встроенный JDK. Путь обычно:
- `C:\Program Files\Android\Android Studio\jbr`

**В gradle.properties уже добавлено:**
```properties
org.gradle.java.home=C:\\Program Files\\Android\\Android Studio\\jbr
```

### Вариант 3: Понизить Gradle до 7.6 (если Java 17 недоступен)

Если не можете использовать Java 17, можно вернуться к Gradle 7.6:

1. Откройте `android/gradle/wrapper/gradle-wrapper.properties`
2. Измените:
   ```properties
   distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-bin.zip
   ```

3. Откройте `android/build.gradle`
4. Измените:
   ```gradle
   classpath("com.android.tools.build:gradle:7.4.2")
   ```

Но лучше использовать Java 17 - это современный стандарт.

---

## 🔍 Проверка текущей версии Java

```powershell
java -version
javac -version
```

Должно быть Java 17 для Gradle 8.5.

---

## ✅ После исправления

1. Очистите кэш Gradle:
   ```powershell
   cd android
   .\gradlew.bat clean
   ```

2. Попробуйте сборку:
   ```powershell
   .\gradlew.bat assembleDebug
   ```

---

## 🎯 Быстрое решение

Если нужен быстрый результат, используйте `build-local.bat` - он автоматически настроит все:

```powershell
cd C:\Users\shadiev-an\Documents\LB\PlazmaTelecomApp
.\build-local.bat
```

Этот скрипт использует правильные версии и обходит проблемы с Java.

