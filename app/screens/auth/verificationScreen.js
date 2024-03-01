import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { RFPercentage } from 'react-native-responsive-fontsize';
import DropdownAlert, {
  DropdownAlertType,
} from 'react-native-dropdownalert';
import { Colors } from "../../constant/styles";
import ArrowBack from "../../component/ArrowBack";
import AppButton from "../../component/AppButton";
import AppText from "../../component/AppText";
import LoadingModal from "../../component/Loading";
import OtpFields from "../../component/OtpFields";
import { errorMessages } from "../../data/signin";
import {
  setUserData,
  userRegisterSuccess,
} from "../../store/features/userSlice";
import { auth, db } from "../../../firebaseConfig";
import { getUserByPhoneNumber } from "../../../utils/user";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");

const VerificationScreen = ({ navigation, route }) => {
  const [isLoading, setisLoading] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { result, handleSendVerificationCode, phoneNumber } = route.params;

  let alert = (_data) => new Promise(res => res);

  const confirmVerificationCode = async () => {
    try {
      console.log("the code want send to ", phoneNumber);
      const res = await result?.confirm(otpInput);
      setResendDisabled(true);
      setisLoading(true);
      setSecondsRemaining(30);
      dispatch(userRegisterSuccess(auth?.currentUser));
      await AsyncStorage.setItem("userData", JSON.stringify(auth?.currentUser));
      const user = await getUserByPhoneNumber(phoneNumber);
      if (user) {
        dispatch(setUserData(user[0]));
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "App" }],
          })
        );
      } else if (!user) {
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "Register",
                params: { phoneNumber: phoneNumber },
              },
            ],
          })
        );
      }
    } catch (error) {
      console.log("Error from verification screen:", error?.message);
      const errorMessage =
        errorMessages[error.message] ||
        t("Something Went Wrong, Please try again!");
      setOtpInput("");

      const alertData = await alert({
        type: DropdownAlertType.Error,
        title: t('Error'),
        Colors: Colors.primaryColor,
        message: errorMessage,
      });
    } finally {
      setisLoading(false);
      setOtpInput("");
    }
  };

  const convertPhoneTovalid = (phone) => {
    const phoneNumberWithoutPlus = phone?.replace("+", "");

    // Convert the string to a number
    const phoneNumber = Number(phoneNumberWithoutPlus);
    return phoneNumber;
  };

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        if (secondsRemaining > 0) {
          setSecondsRemaining(secondsRemaining - 1);
        } else {
          setResendDisabled(false); // Enable the "Resend SMS" button
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendDisabled, secondsRemaining]);

  const formattedPhoneNumber = useMemo(() => {
    // Your formatting logic here
    return `+${phoneNumber}`;
  }, [phoneNumber]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <ArrowBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.textContainer}>
            <AppText
              text={"verification"}
              style={{
                fontSize: RFPercentage(3.8),
                color: Colors.primaryColor,
                marginBottom: 10,
              }}
              centered={false}
            />
            <View style={styles.phoneContainer}>
              <AppText
                text={`OTP Code Was Sent To`}
                style={{ fontSize: RFPercentage(2.3) }}
              />
              <AppText
                text={formattedPhoneNumber}
                style={{
                  fontSize: RFPercentage(2.3),
                  color: Colors.primaryColor,
                }}
              />
            </View>
          </View>
          <OtpFields
            setisLoading={setisLoading}
            setOtpInput={setOtpInput}
            otpInput={otpInput}
            confirmVerificationCode={(otpInput) =>
              confirmVerificationCode(otpInput)
            }
          />
          <AppButton
            title={"Continue"}
            path={"Register"}
            disabled={otpInput.length !== 6}
            style={{
              paddingHorizontal: width * 0.35,
              paddingVertical: height * 0.012,
              alignSelf: "center",
            }}
            textStyle={{ fontSize: RFPercentage(2.5) }}
            onPress={confirmVerificationCode}
          />
          <View style={styles.sendMessasesContainer}>
            <AppText
              text={"didntReceiveOTP"}
              style={{
                fontSize: RFPercentage(2.4),
                paddingTop: 44,
                paddingRight: 20,
              }}
              centered={false}
            />
            <AppButton
              title={
                resendDisabled
                  ? ` 00 :${secondsRemaining} `
                  : "Resend"
              }
              textStyle={{ fontSize: RFPercentage(1.9) }}
              disabled={resendDisabled}
              onPress={() => {
                setResendDisabled(true);
                setSecondsRemaining(30);
                handleSendVerificationCode();
              }}
            />
          </View>
        </View>
      </ScrollView>
      <LoadingModal visible={isLoading} />
      <DropdownAlert alert={func => (alert = func)} />
    </SafeAreaView>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginTop: 10,
    paddingHorizontal: 25,
  },
  phoneContainer: {
    flexDirection: "row",
    width: width,
    gap: 8,
    paddingHorizontal: 10,
  },
  sendMessasesContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
