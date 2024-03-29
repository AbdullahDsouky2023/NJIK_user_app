import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { LogBox } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import LoadingScreen from "../component/loadingScreen";
import SplashScreen from "../screens/splashScreen";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import {
  CART,
  COMPLAIN_CREATE_SCREEN,
  COMPLAIN_ORDER_DETAILS,
  REVIEW_ORDER_SCREEN,
  ITEM_DETAILS,
  ITEM_ORDER_DETAILS,
  MANUAL_LOCATION_ADD,
  MAP,
  ORDER_COMFIRM_DETAILS,
  ORDER_SELECT_LOCATION,
  ORDER_SELECT_REGION,
  ORDER_SUCCESS_SCREEN,
  PACKAGE_DETAILS,
  PACKAGE_SCREEN,
  OFFERS_SCREEN,
  CHANGE_ORDER_DATE,
  NO_CONNECTION_SCREEN,
  CHAT_ROOM_fireBase,
  SELECT_LAN,
  REQUIRED_PAY_SCREEN,
  ORDERS_DETAILS,
  SUCESS_PAYMENT_SCREEN,
  CANCEL_ORDER_CONFIRM,
  CECKOUT_WEBVIEW_SCREEN,
} from "./routes";
import ItemScreen from "../screens/Item/ItemScreen";
import OrderNavigator from "./orderNavigator";
import ItemOrderDetails from "../screens/Item/ItemOrderDetails";
import OrderCreationSuccess from "../screens/OrderCreationSuccess";
import SlectLocationOrderScreen from "../screens/location/SelectLocationOrderScreen";
import AddManualLocationScreen from "../screens/location/AddManualLocationScreen";
import PaymentScreen from "../screens/payment/paymentScreen";
import SelectRegionScreen from "../screens/RegionScreen";
import OrderComfirmDetailsScreen from "../screens/Orders/OrderComfirmDetailsScreen";
import ChatNavigator from "./ChatNavigator";
import CartScreen from "../screens/CartScreen/CartScreen";
import MapScreen from "../screens/map/MapScreen";
import PackageScreen from "../screens/package/PackageScreen";
import PackageDetails from "../screens/package/PackageDetails";
import ComplainCreatingScreen from "../screens/complain/ComplainCreatingScreen";
import ComplainOrderDetails from "../screens/complain/ComplainOrderDetails";
import StarsComponent from "../component/StarsComponent";
import OffersScreen from "../component/Offers/OffersScreen";
import ChangeDateOrderScreen from "../screens/Orders/ChangeDateOrderScreen";
import NoConnectionScreen from "../screens/NoConnectionScreen";
import ChatRoom from "../screens/firebaseChat/ChatRoom";
import SelectLanguageScreen from "../component/language/SelectLanguageScreen";
import SelectLangaugeScreen from "../component/language/SelectLanguageScreen";
import PaymentRequiredScreen from "../screens/PaymentRequired/PaymentRequiredScreen";
import OrderDetails from "../screens/Orders/OrderDetails";
import PaymentSucessScreen from "../screens/payment/SucessPaymentScreen";
import CancelOrderConfirmScreen from "../screens/Orders/CancelOrderConfirmScreen";
import PaymentWebview from "../screens/payment/PaymentWebview";

LogBox.ignoreAllLogs();

const Stack = createSharedElementStackNavigator();
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="App" component={AppNavigator} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Chat" component={ChatNavigator} />

        <Stack.Screen
          name={ITEM_DETAILS}
          component={ItemScreen}
          // initialParams={{ item }} // Pass the item object to ItemOrderDetails
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={PACKAGE_SCREEN}
          component={PackageScreen}
          // initialParams={{ item }} // Pass the item object to ItemOrderDetails
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={CART}
          component={CartScreen}
          // initialParams={{ item }} // Pass the item object to ItemOrderDetails
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={OFFERS_SCREEN}
          component={OffersScreen}
          // initialParams={{ item }} // Pass the item object to ItemOrderDetails
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MAP}
          component={MapScreen}
          // initialParams={{ item }} // Pass the item object to ItemOrderDetails
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ITEM_ORDER_DETAILS}
          component={ItemOrderDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={COMPLAIN_CREATE_SCREEN}
          component={ComplainCreatingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={COMPLAIN_ORDER_DETAILS}
          component={ComplainOrderDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={PACKAGE_DETAILS}
          component={PackageDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={CHANGE_ORDER_DATE}
          component={ChangeDateOrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={REVIEW_ORDER_SCREEN}
          component={StarsComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ORDER_SUCCESS_SCREEN}
          component={OrderCreationSuccess}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ORDER_SELECT_LOCATION}
          component={SlectLocationOrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ORDER_COMFIRM_DETAILS}
          component={OrderComfirmDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ORDER_SELECT_REGION}
          component={SelectRegionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={MANUAL_LOCATION_ADD}
          component={AddManualLocationScreen}
        />
        <Stack.Screen
          name={SELECT_LAN}
          component={SelectLangaugeScreen}
        />
        <Stack.Screen
          name={SUCESS_PAYMENT_SCREEN}
          component={PaymentSucessScreen}
        />
        <Stack.Screen
          name={REQUIRED_PAY_SCREEN}
          component={PaymentRequiredScreen}
        />
               <Stack.Screen
                    name={ORDERS_DETAILS}
                    component={OrderDetails}
                   
                />
        <Stack.Screen
          name={NO_CONNECTION_SCREEN}
          component={NoConnectionScreen}
        />
        <Stack.Screen
          name={CHAT_ROOM_fireBase}
          component={ChatRoom}
        />
        <Stack.Screen
          name={CANCEL_ORDER_CONFIRM}
          component={CancelOrderConfirmScreen}
        />
        <Stack.Screen
          name={CECKOUT_WEBVIEW_SCREEN}
          component={PaymentWebview}
        />
        <Stack.Screen name={"Payment"} component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
