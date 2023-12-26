import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons'; 

import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import Logo from "../../component/Logo";
import AppForm from "../../component/Form/Form";
import ErrorMessage from "../../component/Form/ErrorMessage";
import FormField from "../../component/Form/FormField";
import SubmitButton from "../../component/Form/FormSubmitButton";
import { auth } from "../../../firebaseConfig";
// import { SECRET_PASSWORD} from "@env"
import LoadingModal from "../../component/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setItem } from "../../utils/secureStore";
import { setUserData, userRegisterSuccess } from "../../store/features/userSlice";
import { createUser } from "../../../utils/user";
import { getLocationFromStorage } from "../../../utils/location";
const { width }= Dimensions.get('screen')
const RegisterScreen = ({ navigation,route}) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const memoizedUser = useMemo(() => user, [user]);

  const { phoneNumber } = route?.params
  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      .required(t("name is required"))
      .min(3, "Name is too short")
      .max(50, "Name is too long"),
    city: yup
      .string(),
    district: yup
      .string(),
    emailAddress: yup
      .string()
      .email(t("Invalid email address"))
      .required(t("Email is required")),
  });

  const handleFormSubmit = async (values) => {
    try {
      const userLocation = await getLocationFromStorage()
      // const validPhone = auth?.currentUser?.phoneNumber?.replace("+", "")
      setIsLoading(true);
      const res = await createUser({
        email:values.emailAddress,
        username:values.fullName,
        password:"hoohofyu242121fyufdh",
        city:values?.city || null,
        district:values?.district || null,
        // location:userLocation,
        phoneNumber:phoneNumber
      })

      if(res){
        dispatch(userRegisterSuccess(auth?.currentUser));
        setItem("userData", auth?.currentUser);
        dispatch(setUserData(res.data));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name:"App" }],
          }))
        console.log("the current resposnse after register is ",res.data)
      }else {
        Alert.alert("الاسم او البريد الالكتروني مستخدم من قبل ")
      }

    
    } catch (err) {
      console.log("error creating the resi", err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoCotnainer}>

          <Logo />
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <AppText
              text={"Register New Account"}
              style={{ color: Colors.primaryColor, marginBottom: 10 }}
            />
            <AppForm
          enableReinitialize={true}

initialValues={{ fullName: "", emailAddress: "",city:"",district:"" }}
              onSubmit={handleFormSubmit}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={error} />
              <FormField
                autoCorrect={false}
                icon="account"
                name="fullName"
                placeholder="fullName"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="emailAddress"
                placeholder="emailAddress"
                textContentType="emailAddress"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                // keyboardType="email-address"
                name="city"
                placeholder="city"
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                // keyboardType="email-address"
                name="district"
                placeholder="district"
              />
              <View style={styles.termsContainer}>

                <FontAwesome name="edit" size={24} color={Colors.primaryColor} />
               <AppText
              text={"By Creating an account you accept our Terms and Condition"}
              style={{ color: Colors.blackColor,fontSize:11,width:width }}
              // centered={false}
              />

              
              </View>

              <SubmitButton title="Register" />
            </AppForm>
          </View>
        </ScrollView>
        <LoadingModal visible={isLoading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  termsContainer:{
    display:'flex',
    alignItems:'center',
    flexDirection:'row',
    padding:15,
    gap:10,
    width:width,
    // flexWrap:'wrap'
  },
  logoCotnainer:{
    margin:40
  }
});

export default RegisterScreen;
