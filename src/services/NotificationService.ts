import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  initialize() {
    if (this.isInitialized) {
      return;
    }

    const service = this;

    PushNotification.configure({
      onRegister(token) {
        console.log('TOKEN:', token);
        AsyncStorage.setItem('push_token', token.token).catch((error) =>
          console.warn('Failed to persist push token', error)
        );
      },

      onNotification(notification) {
        console.log('NOTIFICATION:', notification);

        const payload = notification.userInfo ?? notification.data;
        if (!payload) {
          return;
        }

        const { type, data } = payload;

        switch (type) {
          case 'low_balance':
            service.handleLowBalanceNotification(data);
            break;
          case 'payment_received':
            service.handlePaymentNotification(data);
            break;
          case 'service_blocked':
            service.handleServiceBlockedNotification(data);
            break;
          case 'maintenance':
            service.handleMaintenanceNotification(data);
            break;
          default:
            break;
        }
      },

      onAction(notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError(err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });

    this.isInitialized = true;
  }

  private handleLowBalanceNotification(data: any) {
    // Navigate to balance screen or show payment options
    console.log('Low balance notification:', data);
  }

  private handlePaymentNotification(data: any) {
    // Show payment confirmation
    console.log('Payment notification:', data);
  }

  private handleServiceBlockedNotification(data: any) {
    // Navigate to service management
    console.log('Service blocked notification:', data);
  }

  private handleMaintenanceNotification(data: any) {
    // Show maintenance info
    console.log('Maintenance notification:', data);
  }

  // Send local notification
  sendLocalNotification(title: string, message: string, data?: any) {
    PushNotification.localNotification({
      title: title,
      message: message,
      data: data,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
    });
  }

  // Schedule notification
  scheduleNotification(title: string, message: string, date: Date, data?: any) {
    PushNotification.localNotificationSchedule({
      title: title,
      message: message,
      date: date,
      data: data,
      playSound: true,
      soundName: 'default',
    });
  }

  // Cancel all notifications
  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Get notification permissions
  async checkPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions.alert && permissions.badge && permissions.sound);
      });
    });
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then((permissions) => {
        resolve(permissions.alert && permissions.badge && permissions.sound);
      });
    });
  }
}

export default NotificationService;

