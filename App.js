import "react-native-gesture-handler";

import RootNavigator from "./app/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { I18nManager, LogBox } from "react-native";
import { Provider } from "react-redux";
import store from "./app/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from 'react-native';
import * as Updates from 'expo-updates';
export const client = new QueryClient();
const App = () => {

  useEffect(() => {
    I18nManager.forceRTL(true);
  }, []);
  useEffect(() => {
    // Subscribe to app state change events
    AppState.addEventListener('change', handleAppStateChange);
    console.log("tracking")

    // Unsubscribe from app state change events when the component unmounts
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  // Define a handler function for app state change events
  const handleAppStateChange = async (nextAppState) => {
    // If the app state changes from background to active, reload the app
    if (AppState.currentState === 'active' && nextAppState === 'background') {
      console.log("reloading")
      await Updates.reloadAsync();
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
