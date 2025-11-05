module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/'],
  dependencies: {
    // Исключаем Expo из auto-linking
    'expo': {
      platforms: {
        android: null, // отключаем для Android
        ios: null, // отключаем для iOS
      },
    },
  },
};

