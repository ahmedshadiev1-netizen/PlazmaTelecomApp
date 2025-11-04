# Настройка мобильного приложения Плазмателеком

## Предварительные требования

### 1. Установка Node.js
- Скачайте и установите Node.js 16+ с [nodejs.org](https://nodejs.org/)
- Проверьте установку: `node --version`

### 2. Установка React Native CLI
```bash
npm install -g react-native-cli
```

### 3. Для Android разработки:
- Установите Android Studio
- Настройте Android SDK
- Создайте виртуальное устройство (AVD)

### 4. Для iOS разработки (только на macOS):
- Установите Xcode из App Store
- Установите CocoaPods: `sudo gem install cocoapods`

## Установка приложения

### 1. Перейдите в папку приложения
```bash
cd PlazmaTelecomApp
```

### 2. Установите зависимости
```bash
npm install
```

### 3. Для iOS (только на macOS):
```bash
cd ios && pod install && cd ..
```

## Запуск приложения

### Android
```bash
npx react-native run-android
```

### iOS (только на macOS)
```bash
npx react-native run-ios
```

### Запуск Metro bundler
```bash
npx react-native start
```

## Настройка API

### 1. Убедитесь, что backend API запущен
```bash
# В папке lanbilling-client
python main.py
```

### 2. Проверьте подключение
- API должен быть доступен по адресу: `http://localhost:8000`
- Проверьте в браузере: `http://localhost:8000/docs`

### 3. Настройка IP адреса (для физических устройств)
Если тестируете на реальном устройстве, измените IP в файлах:
- `App.tsx` (строка 24): `const API_BASE_URL = 'http://YOUR_IP:8000';`
- `src/services/ApiService.ts` (строка 20): `this.baseURL = 'http://YOUR_IP:8000';`
- `src/components/PeriodicServicesModal.tsx` (строка 47): замените URL

## Тестирование

### 1. Запустите приложение
### 2. Войдите с тестовыми данными:
- Логин: `Test-Ne-Udalyat`
- Пароль: `Test-Ne-Udalyat`

### 3. Проверьте функциональность:
- Просмотр договоров (свайп влево/вправо)
- Просмотр услуг (свайп влево/вправо)
- Обещанные платежи
- Периодические услуги

## Сборка для продакшена

### Android APK
```bash
cd android
./gradlew assembleRelease
```

### iOS (только на macOS)
```bash
npx react-native run-ios --configuration Release
```

## Решение проблем

### 1. Ошибка "Metro bundler not found"
```bash
npx react-native start --reset-cache
```

### 2. Ошибка подключения к API
- Проверьте, что backend запущен
- Проверьте IP адрес в настройках
- Проверьте firewall настройки

### 3. Ошибка сборки Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 4. Ошибка сборки iOS
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

## Push-уведомления

### Настройка Firebase (опционально)
1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Добавьте Android/iOS приложение
3. Скачайте конфигурационные файлы
4. Настройте в приложении

### Локальные уведомления
Приложение поддерживает локальные уведомления без настройки Firebase.

## Структура проекта

```
PlazmaTelecomApp/
├── src/
│   ├── components/          # React компоненты
│   └── services/           # API сервисы
├── android/                # Android конфигурация
├── ios/                    # iOS конфигурация
├── App.tsx                 # Главный компонент
└── package.json           # Зависимости
```

## Поддержка

При возникновении проблем:
1. Проверьте логи в Metro bundler
2. Проверьте подключение к API
3. Убедитесь, что все зависимости установлены
4. Попробуйте очистить кеш: `npx react-native start --reset-cache`

