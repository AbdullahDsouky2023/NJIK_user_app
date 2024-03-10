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
import useOrders, { AddOrderComplain, cancleOrder, updateOrderData } from "../../../utils/orders";
import { HOME } from "../../navigation/routes";
import FormImagePicker from "../../component/Form/FormImagePicker";
import FormDatePicker from "../../component/Form/FormDatePicker";
import { updateUserData } from "../../../utils/user";
import useNotifications from "../../../utils/notifications";
const { width } = Dimensions.get("screen");
const CancelOrderConfirmSceen = ({ navigation, route }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { itemId }= route?.params
  const { data: UserOrders, isLoading: loading, isError } = useOrders();

  const { sendPushNotification} = useNotifications()
  const userData = useSelector((state) => state?.user?.userData);
  const validationSchema = yup.object().shape({
    reason: yup
      .string().min(15,"السبب المدخل قصير ").max(250,"السبب المدخل طويل ").required("هذا الحقل مطلوب"),
    
    
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      const id = itemId
      const res = await updateOrderData(id,{
        order_cancel_reason:values?.reason,
        status:'canceled'
      })     
       const selectedOrder = UserOrders?.data?.filter((order) => order?.id === id);
      const providerNotificationToken =
        selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;
      if (providerNotificationToken) {
        sendPushNotification(
          providerNotificationToken,
          "تم الغاء الطلب",
          `تم الغاء الطلب بواسطه ${user?.username}`
        );
      }
      if (res) {
        console.log(
          {
            id: id,
            selectedOrder: selectedOrder,
            providerNotificationToken: providerNotificationToken,
            res: res
          }
        )
        navigation.goBack();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: t(HOME) }],
          })
        );
        Alert.alert(("تم الغاء الطلب بنجاح"));
      } else {
        Alert.alert(t("Something Went Wrong, Please try again!"));
      }
    } catch (error) {
      console.log(error, "error deleting the order");
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
              text={"الغاء الطلب"}
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
                text={"سبب إلغاء الطلب"}
                centered={false}
                style={{marginHorizontal:17,color:Colors.blackColor,fontSize:RFPercentage(2)}}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="reason" // Make sure the name matches the field in the form values
                // placeholder="description"
                multiline={true}
                numberOfLines={4}
                width={width*0.97}
                textAlignVertical="top" // Add this line

                // ... other props
              />
              
            

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

export default CancelOrderConfirmSceen;
