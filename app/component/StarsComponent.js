import { Rating, AirbnbRating } from "react-native-ratings";
import Modal from "react-native-modal";
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView } from "react-native";
import React, { useState } from "react";
import AppText from "./AppText";
import AppFormField from "./Form/FormField";
import AppForm from "./Form/Form";
import SubmitButton from "./Form/FormSubmitButton";
import useOrders, { AddOrderReview } from "../../utils/orders";
import { Alert } from "react-native";
import { HOME } from "../navigation/routes";
const { width } = Dimensions.get("screen");
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constant/styles";
import ArrowBack from "./ArrowBack";
import { updateProviderData, updateUserData } from "../../utils/user";
import useNotifications from "../../utils/notifications";
export default function StarsComponent({
  route
}) {
  const { data: UserOrders, isLoading: loading, isError } = useOrders();
  console.log(route.params.orderID)
  const [rating, setRating] = useState(0);
  const navigation = useNavigation()
  const { sendPushNotification } = useNotifications();

  const handleFormSubmit = async (values) => {
    try {
      const orderID = route.params.orderID
      const res = await AddOrderReview(orderID,{
        rating:rating === 0 ? "5" :rating.toString() ,
        content:values.review || ""
      });
      const selectedOrder = UserOrders?.data?.filter(
        (order) => order?.id === orderID
      );

      const providerNotificationToken =
        selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;

      const OrderProvider = selectedOrder[0]?.attributes?.provider?.data?.id;
      const OrderUserId = selectedOrder[0]?.attributes?.user?.data?.id;
      console.log("user is is ", OrderUserId);
      console.log("OrderProvider is is ", OrderProvider);
      console.log(OrderProvider,OrderUserId,{ rating:rating === 0 ? "5" :rating.toString() ,
        content:values.review || ""})
        if (res) {
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:HOME }],
            }))
            navigation.goBack()
            Alert.alert("تم بنجاح");
            await updateUserData(OrderUserId, {
          orders: {
            connect: [{ id:orderID }],
          },
        });
        await updateProviderData(OrderProvider, {
          orders: {
            connect: [{ id:orderID }],
          },
        });
        sendPushNotification(
          providerNotificationToken,
          `تم انهاء الطلب بواسطه ${selectedOrder[0]?.attributes?.user?.data?.attributes?.username}`
        );
      } else {
        Alert.alert("حدثت مشكله حاول مرة اخري");
      }

      
    } catch (error) {
      console.log(error, "error paying the order");
    } 
  };
  return (
    <ScrollView  style={styles.container}>
      <ArrowBack subPage={true} />
      <View style={{ flex: 1}}>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 10,
          }}
        >
          <AppText text={"Your Rate of the Technician"} style={styles.text} />
          <AirbnbRating
            count={5}
            size={35}
            selectedColor={Colors.primaryColor}
            defaultRating={5}
            showRating={false}
            onFinishRating={(r) => setRating(r)}
            starContainerStyle={{
              display: "flex",
              gap: 10,
              width: 100,
              flexDirection: "row-reverse",
              marginVertical: 20,
            }}
          />
        </View>
        <AppForm
          initialValues={{ rating: "", review: "" }}
          enableReinitialize={true}

          onSubmit={handleFormSubmit}
        >
                    <AppText text={"Your Rate of the Technician"} style={styles.text} />

          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
           
            name="review"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top" 
          />
          <SubmitButton title={"تأكيد"} style={styles.buttonSubmit} />
        </AppForm>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container :{
    backgroundColor:Colors.whiteColor,
  },
  text:{
    color:'black',
    paddingHorizontal:15
  },
  buttonSubmit: {
    width: width * 0.4,
    marginTop: 10,
    alignSelf:'center',
    
    
  },
});
