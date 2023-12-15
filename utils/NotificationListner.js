import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Call this function to listen for notifications
export const registerNotificationListeners = async () => {
  // Listener for notifications received while the app is foregrounded
  console.log("the notoification", JSON.parse(await AsyncStorage.getItem('notifications')).length)
  Notifications.addNotificationReceivedListener(storeNotification)

  // Listener for interactions with notifications (e.g., user tapped on notification)
  Notifications.addNotificationResponseReceivedListener(response => {
    storeNotification(response.notification);
  });
};

// Call this function to store the notification
const storeNotification = async (notification) => {
  // Retrieve existing notifications
  const existingNotifications = JSON.parse(await AsyncStorage.getItem('notifications')) || [];
  
  // Add the new notification to the list
  const updatedNotifications = [...existingNotifications, notification];
  
  // Store the updated list back in AsyncStorage
  await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  console.log("the notoification",updatedNotifications)
  // Update your notification screen with the new list
  // ...
};

// Don't forget to call `registerNotificationListeners` somewhere in your app initialization code
