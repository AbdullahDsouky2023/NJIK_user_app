import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Call this function to listen for notifications
export const registerNotificationListeners = async () => {
  // Listener for notifications received while the app is foregrounded
  console.log("the notoification", JSON.parse(await AsyncStorage.getItem('notifications')))
  Notifications.addNotificationReceivedListener(response => {
    storeNotification(response.notification);
  })
  Notifications.addNotificationsDroppedListener(notifications => {
    // Loop through the notifications array and store each notification
    console.log("reveced un tabed one so store ")
    notifications.forEach(notification => {
      storeNotification(notification);
    });
  });
  
  // Listener for interactions with notifications (e.g., user tapped on notification)
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log("tab on un tabed one so store ")
    storeNotification(response.notification);
  });
};

// Call this function to store the notification
// Call this function to store the notification
export const storeNotification = async (notification) => {
  // Check if the notification is null
  if (!notification) {
    // Do nothing or log an error message
    console.error('Received a null notification');
    return;
  }
  // Retrieve existing notifications
  try {
    const existingNotifications = JSON.parse(await AsyncStorage.getItem('notifications')) || [];
    // Add the new notification to the list
    const updatedNotifications = [...existingNotifications, notification];
    
    // Store the updated list back in AsyncStorage
    await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

  console.log("the notoification",updatedNotifications)
  // Update your notification screen with the new list
  // ...
} catch (error) {
  // Handle the error
  console.error("error notfication ", error);
  return;
}  
};
