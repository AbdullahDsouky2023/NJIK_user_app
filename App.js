import "react-native-gesture-handler";

import * as Updates from "expo-updates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Alert, Dimensions, I18nManager, LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AnimatedSplash from "react-native-animated-splash-screen";
import { StatusBar } from "react-native";
import i18n from "i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Provider } from "react-redux";
import RootNavigator from "./app/navigation";
import store from "./app/store";
import {
  registerNotificationListeners,
  storeNotification,
} from "./utils/NotificationListner";
import { Colors } from "./app/constant/styles";

const { width, height } = Dimensions.get("screen");
export const client = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    reload()
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    setTimeout(() => {
      setLoading(true);
    }, 500);
    
  },[])
  useEffect(() => {
    registerNotificationListeners();
  }, []);

  const reload = async () => {
    try {
      if (!I18nManager.isRTL) {
        // Log the current RTL state

        // Enable RTL layout
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);

        // Reload the app to apply RTL layout
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error("Failed to reload the app:", error);
    }
  };
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log(`Error fetching latest Expo update: ${error}`);
    }
  }
  useEffect(()=>{
    onFetchUpdateAsync()
  },[])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <Provider store={store}>
        <QueryClientProvider client={client}>
      
          <AnimatedSplash
            // translucent={true}
            isLoaded={loading}
            logoImage={require("./app/assets/images/splash.png")}
            backgroundColor={Colors.primaryColor}
            logoHeight={height}
            logoWidth={width}
          >
            <RootNavigator />
          </AnimatedSplash>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

