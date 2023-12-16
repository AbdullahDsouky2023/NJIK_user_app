import "react-native-gesture-handler";

import RootNavigator from "./app/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Alert, I18nManager, LogBox } from "react-native";
import { Provider } from "react-redux";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';

import * as Updates from 'expo-updates';
import { Platform } from "react-native";
import { registerNotificationListeners, storeNotification } from "./utils/NotificationListner";
export const client = new QueryClient();
const App = () => {
  const appStateRef = useRef(AppState.currentState);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(()=>{
    reload()
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
  },[])
  useEffect(() => {
    // Add the listener for notifications dropped in the background
    const subscription = Notifications.addNotificationsDroppedListener(notifications => {
      notifications.forEach(notification => {
        storeNotification(notification);
      });
    });
  
    // Remove the listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);
  
  // useEffect(() => {
  //   AppState.addEventListener('change', handleAppStateChange);
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);
  useEffect(()=>{
    registerNotificationListeners()
    
  },[])
  const handleAppStateChange = async (nextAppState) => {
    try {

      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground, reloading...');
      await Updates.reloadAsync();
    }
    appStateRef.current = nextAppState;
    setAppState(nextAppState);
  }catch(err){
    Alert.alert("error reoladiong the app")
  }}

  const reload = async () => {
    try {
      if (!I18nManager.isRTL) {
        // Log the current RTL state
        console.log('Current RTL state:', I18nManager.isRTL);
        
        // Enable RTL layout
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
  
        // Reload the app to apply RTL layout
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Failed to reload the app:', error);
    }
  };


  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <RootNavigator />
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
