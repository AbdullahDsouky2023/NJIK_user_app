// RegisterForm.js
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppForm from "../Form/Form";
import ErrorMessage from "../Form/ErrorMessage";
import FormField from "../Form/FormField";
import SubmitButton from "../Form/FormSubmitButton";
import LoadingModal from "../Loading";
import { setItem } from "../../utils/secureStore";
import {
  setUserData,
  userRegisterSuccess,
} from "../../store/features/userSlice";
import { createUser } from "../../../utils/user";
import { getLocationFromStorage } from "../../../utils/location";
import UserDatePicker from "../../component/Account/UserDatePicker";
import GenderSelect from "../../component/GenderSelect";
import { FontAwesome} from '@expo/vector-icons'
import { auth } from "../../../firebaseConfig";
const { width , height } = Dimensions.get('screen')
const RegisterForm = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [gender, setGender] = useState(""); // Add state for gender

  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      .required(t("name is required"))
      .min(3, t("Name is too short"))
      .max(50, t("Name is too long")),
    city: yup.string().required("This Field is Required!"),
    district: yup.string().required("This Field is Required!"),
    birth_date: yup.date().required("This Field is Required!"),
    gender: yup.string().required("This Field is Required!"),
    emailAddress: yup
      .string()
      .email(t("Invalid email address"))
      .required(t("Email is required")),
      
  });

  const handleFormSubmit = async (values) => {
    try {
      const userLocation = await getLocationFromStorage();
      const validPhone = auth?.currentUser?.phoneNumber?.replace("+", "");
      setIsLoading(true);
      const res = await createUser({
        email: values.emailAddress,
        username: values.fullName,
        password: `${values?.emailAddress}${values?.fullName}`,
        city: values?.city || null,
        district: values?.district || null,
        birth_date: values?.birth_date,
        gender:values?.gender,
        phoneNumber: phoneNumber,
      });
      if (res) {
        dispatch(userRegisterSuccess(auth?.currentUser));
        setItem("userData", auth?.currentUser);
        dispatch(setUserData(res.data));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "App" }],
          })
        );
        console.log("the current resposnse after register is ", res.data);
      } else {
        Alert.alert("الاسم او البريد الالكتروني مستخدم من قبل ");
      }
    } catch (err) {
      console.log("error creating the resi", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <AppText text={t("Register New Account")} style={styles.formTitle} />
      <AppForm
        enableReinitialize={true}
        initialValues={{
          fullName: "",
          emailAddress: "",
          city: "",
          district: "",
          birth_date: "",
          gender: "",
        }}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage error={error} visible={error} />
              <HeaderComponent header={"fullName"} />
              <FormField
                autoCorrect={false}
                icon="account"
                width={width*1}
                name="fullName"
              />
              <HeaderComponent header={"emailAddress"} />

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="emailAddress"
                width={width*1}
                textContentType="emailAddress"
              />
              <HeaderComponent header={"city"} />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="city"
                width={width*1}

              />
              <HeaderComponent header={"district"} />

              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="district"
                width={width*1}

              />
              <HeaderComponent header={"Birth Date"} />
              <UserDatePicker name="birth_date" birthDate={Date.now()} />
              <GenderSelect value={gender} onChange={setGender} name={"gender"} />
              <View style={styles.termsContainer}>
                <FontAwesome
                  name="edit"
                  size={24}
                  color={Colors.primaryColor}
                />
                <AppText
                  text={
                    "By Creating an account you accept our Terms and Condition"
                  }
                  style={{
                    color: Colors.blackColor,
                    fontSize: RFPercentage(1.55),
                    minWidth: width*0.85,
                    maxWidth: width*0.87,
                    // textAlign:'center',
                    // backgroundColor:'red'
                  }}
                />
              </View>
        <SubmitButton title={t("Register")} />
      </AppForm>
      <LoadingModal visible={isLoading} />

    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formTitle: {
    color: Colors.primaryColor,
    marginBottom: 10,
  },
    termsContainer: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      padding: 15,
      gap: 10,
      // backgroundColor:'white',
      width: width,
    },
    logoCotnainer: {
      marginTop: 10,
    },
    headerContainer: {
      display: "flex",
      flexDirection: "row",
      width: width,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      paddingHorizontal: 16,
      paddingVertical: 0,
      margin: 0,
      gap: 4,
    },
    header: {
      fontSize: 14,
      color: Colors.blackColor,
    },
    Star: {
      color: Colors.primaryColor,
    },

});

const HeaderComponent = ({ header }) => (
  <View style={styles.headerContainer}>
    <AppText text={"*"} centered={false} style={styles.Star} />
    <AppText text={header} centered={false} style={styles.header} />
  </View>
);

export default RegisterForm;
