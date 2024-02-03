import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Image,
  StyleSheet,
  BackHandler,
  Animated,
} from "react-native";
import { Colors, Sizes } from "../constant/styles";
import { CircleFade } from "react-native-animated-spinkit";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import Logo from "../component/Logo";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, userRegisterSuccess } from "../store/features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserByPhoneNumber } from "../../utils/user";
import LocationModal from "../component/location/LocationModal";

import { auth } from "../../firebaseConfig";
const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user?.user?.phoneNumber);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLocationConfirm = () => {
    setLocationConfirmed(true);
    setLocationModalVisible(false);
  };
  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };
  useEffect(() => {
    // Start the fade out animation after 3 seconds
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      });
    }, 3000);
  }, [fadeAnim, navigation]);

  useEffect(() => {
    async function checkUserAndNavigate() {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString && auth.currentUser !== null) {
          const userData = JSON.parse(userDataString);
          const gottenuser = await getUserByPhoneNumber(user);
          dispatch(setUserData(gottenuser));
          dispatch(userRegisterSuccess(userData));
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:"App" ,
           }],
            }))
        } else {
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:"Auth" ,
           }],
            }))
        }
      } catch (error) {}
    }
  });

  useEffect(() => {
    async function checkUserAndNavigate() {
      try {
        // await getLocationFromStorage()
        const userDataString = await AsyncStorage.getItem("userData");
        const userData = JSON.parse(userDataString);
        const validPhone = `${userData?.phoneNumber
          ?.replace(/\s/g, "")
          .trim()}`;
        const PhoneNumberValidated = convertPhoneTovalid(validPhone);
        if (userData?.phoneNumber) {
          const gottenuser = await getUserByPhoneNumber(PhoneNumberValidated);
          if (gottenuser) {
            dispatch(setUserData(gottenuser));
            dispatch(userRegisterSuccess(userData));
            
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name:"App" ,
             }],
              }))
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name:"Auth" ,
             }],
              }))
          }
        } else {
          // navigation.push("App");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:"Auth" ,
           }],
            }))
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkUserAndNavigate();
  }, []);

  const convertPhoneTovalid = (phone) => {
    const phoneNumberWithoutPlus = phone?.replace("+", "");

    // Convert the string to a number
    const phoneNumber = Number(phoneNumberWithoutPlus);
    return phoneNumber;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [backAction])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />

      <Animated.View
        style={{
          flex: 1,
          display:'flex',
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeAnim,
          // backgroundColor:'red',
          paddingTop:120

        }}
      >
        <Logo />
        <CircleFade
          size={55}
          color={Colors.primaryColor}
          style={{ alignSelf: "center", paddingTop: 150 }}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appLogoStyle: {
    width: 200.0,
    height: 200.0,
    alignSelf: "center",
    marginBottom: Sizes.fixPadding * 4.0,
  },
});

export default SplashScreen;
