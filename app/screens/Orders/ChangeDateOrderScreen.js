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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import ArrowBack from "../../component/ArrowBack";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppForm from "../../component/Form/Form";
import ErrorMessage from "../../component/Form/ErrorMessage";
import FormField from "../../component/Form/FormField";
import SubmitButton from "../../component/Form/FormSubmitButton";
import { auth } from "../../../firebaseConfig";
import * as Updates from "expo-updates";

import LoadingModal from "../../component/Loading";
import { useDispatch, useSelector } from "react-redux";
import { EXPO_PUBLIC_BASE_URL } from "@env";

import { createComplain } from "../../../utils/complain";
import { AddOrderComplain, updateOrderData } from "../../../utils/orders";
import { HOME } from "../../navigation/routes";
import FormImagePicker from "../../component/Form/FormImagePicker";
import FormDatePicker from "../../component/Form/FormDatePicker";
import { updateUserData } from "../../../utils/user";
import useNotifications from "../../../utils/notifications";
const { width } = Dimensions.get("screen");
const ChangeDateOrderScreen = ({ navigation, route }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { item }= route?.params
  const { sendPushNotification} = useNotifications()
  const userData = useSelector((state) => state?.user?.userData);
  const validationSchema = yup.object().shape({
    date: yup
      .date()
    
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      const date = new Date(values?.date || Date.now());
  
      // Format the date and time
      const formattedDate = format(date, "dd MMMM yyyy", {
        locale: ar,
      });
  
      const res = await updateOrderData(route?.params?.orderId,{
        date: formattedDate?.toString(),
      })
        //
        if(res){
          Alert.alert("تم اعادة جدولة الطلب  بنجاح");
          if( item?.attributes?.provider?.data?.attributes
            ?.expoPushNotificationToken){

              sendPushNotification(
                item?.attributes?.provider?.data?.attributes
                ?.expoPushNotificationToken,
                "تغيير موعد الطلب",
                `تم تغيير موعد الطلب الي ${formattedDate?.toString()}`
                );
              }
          if( item?.attributes?.user?.data?.attributes
            ?.expoPushNotificationToken){

              sendPushNotification(
                item?.attributes?.user?.data?.attributes
                ?.expoPushNotificationToken,
                "تغيير موعد الطلب",
                `تم تغيير موعد الطلب الي ${formattedDate?.toString()}`
                );
              }
              navigation.goBack();

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: t(HOME) }],
            })
          );
        }
     
      
    } catch (err) {
      console.log("error creating the resi", err);
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <ArrowBack />
      <ScrollView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <AppText
              text={"تغيير موعد الطلب"}
              style={{ color: Colors.primaryColor, marginBottom: 10 }}
            />
            <AppForm
              enableReinitialize={true}
              initialValues={{
                date:""
              }}
              onSubmit={(data) => handleFormSubmit(data)}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={error} />

              <AppText
                text={"أختر التاريخ"}
                centered={false}
                style={{marginBottom:20,marginHorizontal:17}}
              />
              <FormDatePicker name="date" placeholder="date" />
              
            

              <SubmitButton title="Confirm"  />
              
            </AppForm>
          </View>
        </ScrollView>
        <LoadingModal visible={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: RFPercentage(2.1),
    paddingHorizontal: width * 0.05,
    color: Colors.blackColor,
    // backgroundColor:'red',
    marginBottom: width * 0.001,
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default ChangeDateOrderScreen;
