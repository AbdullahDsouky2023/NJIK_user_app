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
import {  EXPO_PUBLIC_BASE_URL} from '@env'
import { CommonActions } from "@react-navigation/native";

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
import NotificationComponent from "../../component/NotificationComponent";
import { createComplain } from "../../../utils/complain";
import { AddOrderComplain } from "../../../utils/orders";
import { HOME } from "../../navigation/routes";
const { width } = Dimensions.get('screen')
const ComplainCreatingScreen = ({ navigation ,route}) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [image,setImage] = useState(null)
  const dispatch = useDispatch();
  const validPhone = auth?.currentUser?.phoneNumber?.replace("+", "");
  const [ImageID,setImageId]=useState(null)
  const userData = useSelector((state)=>state?.user?.userData)
  const validationSchema = yup.object().shape({
    message: yup
      .string()
      // .required(t("Full name is required"))
      .min(10, "الشكوي  المدخله قصيره جدا")
      .max(500, "الشكوي  المدخله طويله جدا"),
    
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);

        const formData = {
          message: values.message ,
          order:{
            connect: [
              {
                id:route?.params?.item?.id
              }
            ]
          } ,
          // phoneNumber: Number(validPhone),
        }
        res = await createComplain(formData);
        
        if (res) {
          console.log("the resit is ",res?.data.id)
          // const gottenuser = await getUserByPhoneNumber(Number(validPhone))
          await AddOrderComplain(route?.params?.item?.id,res?.data.id)
        // dispatch(setUserData(gottenuser));
        // console.log("the image id is ",ImageID)
        
        // console.log("the new user is ",gottenuser)
        // await AsyncStorage.setItem("userImage", JSON.stringify(image));

          Alert.alert("تم  تقديم الشكوي بنجاح");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: t(HOME) }],
            })
          );
          navigation.goBack()
          // if(image) navigation.navigate("Account", { newImage:image })

      } else {
        Alert.alert("Something goes wrong");
      }}
      catch (err) {
        console.log("error creating the resi", err);
      } finally {
        setIsLoading(false);
    }
  };
  

  
  const getItemInfo =async()=>{
    try {
      console.log("item for comlain" ,route?.params?.item?.id)
      
    } catch (error) {
      console.log("error getting the user fo rthe fir",error)
    }
  }
  
  useEffect(()=>{
    getItemInfo()
  },[dispatch])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
        <ArrowBack />
      <ScrollView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <AppText
              text={"Report Complain"}
              style={{ color: Colors.primaryColor, marginBottom: 10 }}
            />
            <AppForm
              enableReinitialize={true}
              initialValues={{ fullName: "", emailAddress: "",location:"" }}
              onSubmit={(data) => handleFormSubmit(data)}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={error} />
             


<AppText text={"The Complain"} centered={false} style={[styles.header,{marginTop:10}]}/>
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                mul
                // keyboardType="email-address"
                name="message"
                // placeholder="emailAddress"
                // textContentType="emailAddress"
                multiline={true}
                styles={{
                  // backgroundColor:'red',
                  padding:10
                }}
                numberOfLines={7}
                // placeholder={userData?.city}

              />

              <SubmitButton title="Send" />
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
  },
  headerContainer:{
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row'
  }
});

export default ComplainCreatingScreen;
