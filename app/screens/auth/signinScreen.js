import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Linking from 'expo-linking';
import { CheckBox } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signInWithPhoneNumber } from "firebase/auth";
import { RFPercentage } from 'react-native-responsive-fontsize';

import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import PhoneNumberTextField from "../../component/PhoneInput";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import Logo from "../../component/Logo";
import { auth, firebaseConfig } from "../../../firebaseConfig";
import { errorMessages } from "../../data/signin";

const { width } = Dimensions.get('screen');

const SigninScreen = ({ navigation }) => {
  const [disabled, setDisabled] = useState(true);
  const [state, setState] = useState({ phoneNumber: null });
  const recaptchaVerifier = useRef(null);
  const { t } = useTranslation();

  const updateState = useCallback((data) => {
    setState((state) => ({ ...state, ...data }));
    const { phoneNumber, agreedToTerms, length } = { ...state, ...data };
    if (phoneNumber?.length === state?.length - 1 ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  });
  const toggleAgreement = useCallback(() => {
    setDisabled((prevDisabled) => !prevDisabled);
    updateState((prevState) => ({ ...prevState, agreedToTerms: !prevState.agreedToTerms }));
  }, [updateState]);

  const handleSendVerificationCode = useCallback(async () => {
    try {
      setDisabled(true);

      const phoneNumberValidToFirebase = `${state.countryCode}${state.phoneNumber}`;
      const validPhone = `${phoneNumberValidToFirebase.replace(/\s/g, "").trim()}`;
      const PhoneNumberValidated = convertPhoneTovalid(validPhone);

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumberValidToFirebase,
        recaptchaVerifier.current
      );

      if (result.verificationId) {
        navigation.navigate("Verification", {
          result,
          handleSendVerificationCode,
          phoneNumber: PhoneNumberValidated,
        });
      }
    } catch (error) {
      const errorMessage = errorMessages[error.message];
      Alert.alert(t(errorMessage) || t("Something Went Wrong, Please try again!"));
    } finally {
      setDisabled(false);
    }
  }, [state, navigation]);

  const convertPhoneTovalid = (phone) => {
    const phoneNumberWithoutPlus = phone?.replace("+", "");
    const phoneNumber = Number(phoneNumberWithoutPlus);
    return phoneNumber;
  };

  const { phoneNumber } = state;

  const handlePrivacyLink = () => {
    Linking.openURL('https://facebook.com');
  };

  // Memoize the formatted phone number to prevent unnecessary re-renders
  const formattedPhoneNumber = useMemo(() => {
    // Your formatting logic here
    return `${state.countryCode}${state.phoneNumber}`;
  }, [state.countryCode, state.phoneNumber]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <View style={styles.centeredView}>
          <AppText
            centered={true}
            text={"Signin with Phone Number"}
            style={{ marginBottom: width * 0.05, color: Colors.primaryColor, fontSize: RFPercentage(1.95), textAlign: 'center' }}
          />
        </View>
        <PhoneNumberTextField
          phoneNumber={phoneNumber}
          updateState={updateState}
        />
        <View style={styles.centeredView}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
        </View>
        <AppButton
          path={"Verification"}
          title={"Continue"}
          disabled={disabled}
          style={{ paddingHorizontal: width * 0.3, alignSelf: 'center' }}
          textStyle={{ fontSize: RFPercentage(2.3) }}
          onPress={handleSendVerificationCode}
        />
        <View style={styles.centeredView}>
          <AppText
            text={"We'll send OTP for Verification"}
            style={{
              marginTop: 25,
              ...Fonts.grayColor18Medium,
              fontSize: RFPercentage(2.3)
            }}
          />
        </View>
      </ScrollView>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={handlePrivacyLink}>
          <AppText
            text={"Privacy"}
            style={{
              fontSize: RFPercentage(2.1),
              color: Colors.primaryColor
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor
  },
  logoContainer: {
    margin: 50,
  },
  centeredView: {
    flex: 1,
    alignItems: "center"
  },
  linkContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 150
  },
});

export default SigninScreen;
