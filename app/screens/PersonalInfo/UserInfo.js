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
import { BASE_URL} from '@env'

import ArrowBack from "../../component/ArrowBack";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppForm from "../../component/Form/Form";
import ErrorMessage from "../../component/Form/ErrorMessage";
import FormField from "../../component/Form/FormField";
import SubmitButton from "../../component/Form/FormSubmitButton";
import { auth} from "../../../firebaseConfig";
import * as Updates from 'expo-updates';


import LoadingModal from "../../component/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getUserByPhoneNumber, updateUserData } from "../../../utils/user";
import { setUserData } from "../../store/features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserImagePicker from "../../component/Account/UserImagePicker";
import { uploadToStrapi } from "../../../utils/UploadToStrapi";
import UserDatePicker from "../../component/Account/UserDatePicker";
const { width } = Dimensions.get('screen')
const UserInfo = ({ navigation }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [image,setImage] = useState(null)
  const dispatch = useDispatch();
  const validPhone = auth?.currentUser?.phoneNumber?.replace("+", "");
  const [ImageID,setImageId]=useState(null)
  const userData = useSelector((state)=>state?.user?.userData)
  // let user = useSelector((state) => state.user?.user?.phoneNumber);
  console.log(userData?.birth_date,"dddd")
  const validationSchema = yup.object().shape({
    fullName: yup
      .string()
      // .required(t("Full name is required"))
      .min(2, "الاسم  المدخل قصير جدا")
      .max(50, "الاسم المدخل طويل جدا"),
    emailAddress: yup
      .string()
      .email(("الايميل المدخل غير صالح"))
      // .required("الايميل مطلوب"),
     , location:yup.string() ,
     city:yup.string(),
     birth_date:yup.date(),
      // .required(t("Email is required")),
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      let res;
      if(image){
        console.log(image)
       res= await confirmImage(values) 

      }else {
        const formData = {
          email: values.emailAddress || userData?.email,
          username: values.fullName || userData?.username,
          city: values.city || userData?.city,
          birth_date: values.birth_date || userData?.birth_date,
          // phoneNumber: Number(validPhone),
        }

        res = await updateUserData(userData?.id,formData);
      }
      if (res) {
        const gottenuser = await getUserByPhoneNumber(Number(validPhone))
        dispatch(setUserData(gottenuser));
        Alert.alert("تم التعديل بنجاح");
        console.log("the image id is ",ImageID)
        if(image) await Updates.reloadAsync();


      } else {
        Alert.alert("Something goes wrong");
      }}
     catch (err) {
      console.log("error creating the resi", err);
    } finally {
      setIsLoading(false);
    }
  };
  const confirmImage = async (values) => {
    try {
      
      if (image) {
        const response = await uploadToStrapi(image,BASE_URL).then(async(res)=>{
          const formData = {
            email: values?.emailAddress || userData?.email,
            username: values?.fullName || userData?.username,
            city: values.city || userData?.city,
          birth_date: values.birth_date || userData?.birth_date,
          // phoneNumber: Number(validPhone),
            image:res
            // phoneNumber: Number(validPhone),
          }
          return await updateUserData(userData?.id,formData);
        })
        return response
        
    }
    } catch (error) {
      console.log("error comfirm the upload",error)
    }
  };
  const convertNumber =(phoneNumber)=>{

// Convert the number to a string
let phoneNumberString = phoneNumber?.toString();

// Remove the first character
let phoneNumberWithoutFirstDigit = phoneNumberString.slice(1);

// Add "0" at the beginning
let finalPhoneNumber =  phoneNumberWithoutFirstDigit;
return finalPhoneNumber
  }
  const getUserInfo =async()=>{
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(userDataString);
      const validPhone = `${userData?.phoneNumber?.replace(/\s/g, "").trim()}`;
      const PhoneNumberValidated = convertPhoneTovalid(validPhone)
      if (userData?.phoneNumber ) {
        const gottenuser = await getUserByPhoneNumber(PhoneNumberValidated )
        dispatch(setUserData(gottenuser));
      } else {
      }
      
    } catch (error) {
      console.log("error getting the user fo rthe fir",error)
    }
  }
  const convertPhoneTovalid=(phone)=>{
    const phoneNumberWithoutPlus = phone?.replace("+", "");
              
              // Convert the string to a number
              const phoneNumber = Number(phoneNumberWithoutPlus);
              return phoneNumber
  }

  useEffect(()=>{
    getUserInfo()
  },[dispatch])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
        <ArrowBack />
      <ScrollView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <AppText
              text={"Register Your Account"}
              style={{ color: Colors.primaryColor, marginBottom: 10 }}
            />
            <AppForm
              enableReinitialize={true}
              initialValues={{ fullName: "", emailAddress: "",location:"" }}
              onSubmit={(data) => handleFormSubmit(data)}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={error} />
              <UserImagePicker setImage={setImage} image={image}/>
              <AppText text={"FullName"} centered={false} style={styles.header}/>
              <FormField
                autoCorrect={false}
                name="fullName"
                // placeholder="fullName"
                icon = {"user"}
                placeholder={userData?.username }
              />

<AppText text={"emailAddress"} centered={false} style={styles.header}/>
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="emailAddress"
                // placeholder="emailAddress"
                textContentType="emailAddress"
                placeholder={userData?.email}

              />
              <AppText text={"Birth Date"} centered={false} style={[styles.header,{marginBottom:10}]}/>
              <UserDatePicker name="birth_date" birthDate={userData?.birth_date}  />
<AppText text={"city"} centered={false} style={[styles.header,{marginTop:10}]}/>
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                // keyboardType="email-address"
                name="city"
                // placeholder="emailAddress"
                // textContentType="emailAddress"
                placeholder={userData?.city}

              />
              <SubmitButton title="Save" />
            </AppForm>
          </View>
        </ScrollView>
        <LoadingModal visible={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header:{
    fontSize:15,
    paddingHorizontal:width*0.05,
    color:Colors.blackColor,
    // backgroundColor:'red',
    marginBottom:width*0.001,
  }
});

export default UserInfo;
