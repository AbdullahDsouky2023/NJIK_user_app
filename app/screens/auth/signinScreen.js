import React, { useState, useCallback, useRef } from "react";
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
import * as Linking from 'expo-linking'
import { CheckBox } from "react-native-elements";
import { useTranslation } from "react-i18next";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signInWithPhoneNumber } from "firebase/auth";
import i18n from "i18next";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import PhoneNumberTextField from "../../component/PhoneInput";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import Logo from "../../component/Logo";
import { auth, firebaseConfig } from "../../../firebaseConfig";
import { errorMessages } from "../../data/signin";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('screen')
const SigninScreen = ({ navigation }) => {
  const [disabled, setDisabled] = useState(true);
  const [state, setState] = useState({ phoneNumber: null });
  const recaptchaVerifier = useRef(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { t } = useTranslation();

  const updateState = useCallback((data) => {
    setState((state) => ({ ...state, ...data }));
    const { phoneNumber, agreedToTerms, length } = { ...state, ...data };

    console.log(phoneNumber, agreedToTerms, length, "fff");
    if (phoneNumber?.length === state?.length - 1 && agreedToTerms === true) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  });
  const toggleAgreement = () => {
    setAgreedToTerms(!agreedToTerms);
    updateState({ agreedToTerms: !agreedToTerms });
  };
  const handleSendVerificationCode = useCallback(async () => {
    try {
      setDisabled(true);
      console.log("curreit", state);
      const phoneNumberValidToFirebase = `${state.countryCode}${state.phoneNumber}`;
      const validPhone = `${phoneNumberValidToFirebase
        .replace(/\s/g, "")
        .trim()}`;
      const PhoneNumberValidated = convertPhoneTovalid(validPhone);

      const result = await signInWithPhoneNumber(
        auth,
        phoneNumberValidToFirebase,
        recaptchaVerifier.current
      );
      if (result.verificationId) {
        navigation.navigate("Verification", {
          result,
          // handleSendVerificationCode,
          phoneNumber: PhoneNumberValidated,
        });
        setDisabled(false);
      }
    } catch (error) {
      const errorMessage = errorMessages[error.message];

      console.log("the error is ", errorMessage, error.message);
      Alert.alert(t(errorMessage) || t("Something Went Wrong, Please try again!"));
    } finally {
      setDisabled(false);
    }
  })
  const convertPhoneTovalid = (phone) => {
    const phoneNumberWithoutPlus = phone?.replace("+", "");
    const phoneNumber = Number(phoneNumberWithoutPlus);
    return phoneNumber;
  };

  const { phoneNumber } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.LogoContainer}>
            <Logo />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <AppText
              centered={true}
              text={"Signin with Phone Number"}
              style={{ marginBottom: width*0.05,color:Colors.primaryColor ,fontSize: RFPercentage(2.3) }}
            />
          </View>
          <PhoneNumberTextField
            phoneNumber={phoneNumber}
            updateState={updateState}
          />
          <CheckBox
            title={t("I agree to the Terms and Conditions")}
            checked={agreedToTerms}
            style={{ backgroundColor: Colors.redColor }}
            checkedColor={Colors.redColor}
            textStyle={{
              fontSize: RFPercentage(2)
            }}
            containerStyle={{
              backgroundColor: Colors.white,
              borderWidth: 0,
              marginTop: 10,
              // flexDirection:"row"
            }}
            onPress={toggleAgreement}
          />
      <View style={{ flex: 1,width:100, justifyContent: 'center', alignItems: 'center' }}>
            <FirebaseRecaptchaVerifierModal
              // style={{ backgroundColor: "red" ,width:100}}
              ref={recaptchaVerifier}
              
              firebaseConfig={firebaseConfig}
            />
          </View>
          <AppButton
            path={"Verification"}
            title={"Continue"}
            disabled={disabled}
            style={{ paddingHorizontal: width * 0.4,paddingVertical:width*0.035, alignSelf: 'center' }}
            textStyle={{ fontSize: RFPercentage(2.3) }}
            onPress={() => handleSendVerificationCode()}
          />
          <View style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
            <AppText
              text={"We'll send OTP for Verification"}
              style={{
                marginTop: Sizes.fixPadding - 5.0,
                ...Fonts.grayColor18Medium,
                fontSize:RFPercentage(2.3)

              }}
            />
          </View>
        </ScrollView>
        <View style={{ flex: 1, alignItems: "center", marginTop: 150 }}>
          <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>

            <AppText
              text={"Privacy"}
              style={{
                fontSize:RFPercentage(2.1),
                color: Colors.primaryColor
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  LogoContainer: {
    margin: 50,
  },
});

export default SigninScreen;
