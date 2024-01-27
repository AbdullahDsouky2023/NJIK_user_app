import "react-native-gesture-handler";

import * as Updates from "expo-updates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Alert, Dimensions, I18nManager, LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AnimatedSplash from "react-native-animated-splash-screen";
import i18n from "i18next";

import { Provider } from "react-redux";
import RootNavigator from "./app/navigation";
import store from "./app/store";
import {
  registerNotificationListeners,
  storeNotification,
} from "./utils/NotificationListner";
import { Colors } from "./app/constant/styles";
import AppButton from "./app/component/AppButton";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("screen");
export const client = new QueryClient();

export const changeLanguage = async(languageKey) => {
  i18n.changeLanguage(languageKey).then(async() => {
    try{

      // Save the language key in local storage
      if (languageKey === 'ar') {
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
      } else {
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
      }
      
      // Reload the app to apply the changes
      await  AsyncStorage.setItem('language', languageKey);
      console.log("your language",languageKey)
      await Updates.reloadAsync();
    }catch(error){
      console.log("error changine the naugagte",error)
    }
  });
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState('ltr');
  useEffect(() => {
    // Get the language key from local storage
    AsyncStorage.getItem('language').then((languageKey) => {
      // If there is a language key, change the app language and layout direction
      if (languageKey) {
       i18n.changeLanguage(languageKey);
        I18nManager.forceRTL(languageKey === 'ar');
        I18nManager.allowRTL(languageKey === 'ar');
        setDirection(languageKey === 'ar' ? 'rtl' : 'ltr'); 
      }
      else {
       i18n.changeLanguage('ar');
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
        setDirection('rtl'); // Set the direction state variable

      }
      setLoading(true);
    });
  }, []);

  useEffect(() => {
    registerNotificationListeners();
  }, []);

  const reload = async () => {
    try {
      if (!I18nManager.isRTL) {
        // Log the current RTL state
        console.log("Current RTL state:", I18nManager.isRTL);

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
