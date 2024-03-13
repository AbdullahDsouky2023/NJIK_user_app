import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import Carousel from "react-native-snap-carousel-v4";
import { useDispatch } from "react-redux";
import {
  CANCEL_ORDER_CONFIRM,
  CECKOUT_WEBVIEW_SCREEN,
  CHANGE_ORDER_DATE,
  CHECkOUT_COUNTRY,
  CURRENCY,
  HOME,
  ORDER_SUCCESS_SCREEN,
  REVIEW_ORDER_SCREEN,
  SUCESS_PAYMENT_SCREEN,
} from "../../navigation/routes";
import { FlatList } from "react-native";
import { RFPercentage } from 'react-native-responsive-fontsize'
import { useTranslation } from "react-i18next";
import { Image } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";
import useOrders, {
  PayOrder,
  cancleOrder,
  updateOrderData,
} from "../../../utils/orders";
import { MaterialIcons } from '@expo/vector-icons'
import ArrowBack from "../../component/ArrowBack";
import LoadingScreen from "../loading/LoadingScreen";
import AppText from "../../component/AppText";
import PriceTextComponent from "../../component/PriceTextComponent";
import AppButton from "../../component/AppButton";
import LoadingModal from "../../component/Loading";
import AppModal from "../../component/AppModal";
import useNotifications from "../../../utils/notifications";
import { Colors } from "../../constant/styles";
import DelayOrderCard from "../../component/orders/DelayOrderCard ";
import useCartServices from "../../../utils/CartService";
import ItemComponent from "../../component/Payment/ItemComponent";
import initiatePayment from "../../utils/Payment/Initate";
import SuccessAlert from "../../component/CustomAlerts/SuccessAlert";
import { calculateTotalWithTax } from "../../utils/Payment/helpers";
const { width, height } = Dimensions.get("screen");
export default function OrderDetails({ navigation, route }) {
  const { item } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const { data: UserOrders, isLoading: loading, isError } = useOrders();
  const [orderID, setOrderID] = useState(false);
  const orders = useSelector((state) => state?.orders?.orders);
  const user = useSelector((state) => state?.user?.userData);
  const dispatch = useDispatch();
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReviewVisble, setIsReviewVisble] = useState(false);
  const [cartServicesSelected, setCartServicesSelected] = useState([])
  const { sendPushNotification } = useNotifications();
  const { t } = useTranslation();
  const categoryName1 = item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name
  const categoryName2 = item?.attributes?.services.data[0]?.attributes?.category?.data?.attributes?.name
  const categoryName3 = item?.attributes?.packages?.data[0]?.attributes?.name
  // console.log("results ",item?.attributes?.service_carts)
  const handleOrderCancle = async (id) => {
    try {
      setIsLoading(true);
        navigation.navigate(CANCEL_ORDER_CONFIRM,{
          itemId:item?.id
        })
       
    } catch (error) {
      console.log(error, "error deleting the order");
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };

  const handlePayOrder = async () => {
    try {
      const id = item?.id

      const res = await PayOrder(id);
      const selectedOrder = UserOrders?.data?.filter((order) => order?.id === id);
      const providerNotificationToken =
        selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;
      if (providerNotificationToken) {
        // console.log("user data",user)
        sendPushNotification(
          providerNotificationToken,
          "تم دفع الطلب",
          `تم دفع الطلب بواسطه ${user?.username}`
        );
      }
      if (res) {
        // Alert.alert(t("payment has been processed successfully."));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{
              name: SUCESS_PAYMENT_SCREEN, params: {
                item,
                firstReview: true
              }
            }], // Replace 'Login' with the name of your login screen
          })
        );

      } else {
        Alert.alert(t("Something Went Wrong, Please try again!"));
      }
    } catch (error) {
      console.log(error, "error paying the order");
    } finally {
      setIsLoading(false);
    }
  };
  const calculateTotalPriceBeforeAddional = () => {
    const provider_fee = Number(item?.attributes?.provider_fee)
    const additional_prices_array = item?.attributes?.additional_prices?.data?.map((accumulator) => {
      return accumulator?.attributes?.Price
    }); //
    const additional_prices_sum = additional_prices_array?.reduce((accumulator, currentValue) => {

      return Number(accumulator) + Number(currentValue);
    }, 0)
    // console.log("adduibaku ",additional_prices_sum )
    // console.log("feee ",provider_fee )
    return (additional_prices_sum > Number(provider_fee)) ? (additional_prices_sum + provider_fee) : (provider_fee + additional_prices_sum)
  }
  const handleRejectAddionalPrices = async (id) => {
    try {

      const res = await updateOrderData(id, {
        additional_prices: null,
        PaymentStatus: 'pending',
        status: "finish_work",
        provider_fee: 0,
        provider_payment_status: 'pending',
        totalPrice: (item?.attributes?.totalPrice > calculateTotalPriceBeforeAddional()) ?
          (item?.attributes?.totalPrice - calculateTotalPriceBeforeAddional()) :
          (calculateTotalPriceBeforeAddional() - item?.attributes?.totalPrice),
        addtional_prices_state: 'rejected',
        provider_fee: 0
      });
      // console.log("the orders length " , UserOrders?.length)
      const selectedOrder = UserOrders?.data?.filter((order) => order?.id === id);
      const providerNotificationToken =
        selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;
      if (providerNotificationToken) {
        sendPushNotification(
          providerNotificationToken,
          "تم رفض  عملية الد فع ",
          `تم رفض  عملية الد فع  ${user?.username} الرجاء ادخال سعر اخر`
        );
      }
      if (res) {
        // Alert.alert(t("payment has been processed successfully."));
        // navigation.goBack()
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "App" }],
          })
        );
        Alert.alert(t("تم بنجاح"));
      } else {
        Alert.alert(t("Something Went Wrong, Please try again!"));
      }
    } catch (error) {
      console.log(error, "error paying the order");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenererateInitator = ()=>{
    const orderAmmount =calculateTotalWithTax(item?.attributes?.totalPrice)
    const username = user.username.trim(); // Remove any leading or trailing spaces
    const nameParts = username.split(' '); // Split the username into parts
    
    const firstName = nameParts[0]; // The first part is the first name
    const lastName = nameParts.slice(1).join(' '); // The rest are the last name
    
    
    
    
// Example usage
const orderDetails = {
  orderId: `ORDER${item?.id}`,
  amount: orderAmmount.toFixed(2),
  currency: CURRENCY,
  description: item?.description || "no description",
  payerFirstName:firstName,
  payerLastName: lastName,
  payerAddress: user?.location,
  payerCountry:CHECkOUT_COUNTRY,
  payerCity:user?.city,
  payerZip: '12345',
  payerEmail: user?.email,
  payerPhone: user?.phoneNumber,
  payerIp: '192.168.1.1'
 };
 
initiatePayment(orderDetails)
 .then(response => {
  navigation.navigate(CECKOUT_WEBVIEW_SCREEN,{
    url:response?.redirect_url,
    orderId: `ORDER${item?.id}`,
    handlePayOrderFun:handlePayOrder
  })
  console.log('Payment initiated successfully:', response?.redirect_url)})
 .catch(error => console.error('Error initiating payment:', error));
  }
  if (isLoading) return <LoadingScreen />;
  return (
    <ScrollView style={{ backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
      <ArrowBack subPage={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ItemComponent name="رقم الطلب" iconName={"hashtag"} data={item?.id} />
        <ItemComponent iconName={"server"} name="حالة الطلب" data={
          item?.attributes?.status === "assigned"
            ? "New"
            : item?.attributes?.status === "pending"
              ? "New"
              : item?.attributes?.status === "accepted"
                ? "Accepted"
                : item?.attributes?.status === "working"
                  ? "Working"
                  : item?.attributes?.status === "finish_work"
                    ? "Finished"
                    : item?.attributes?.status === "payed"
                      ? "Payed"
                      : "Finished"

        } />
        <ItemComponent name="التاريخ" iconName={"clock-o"} data={item?.attributes?.date} />
        {
          item?.attributes?.provider?.data?.attributes?.name &&
          <ItemComponent name=" اسم الفني" iconName="user" data={
            item?.attributes?.provider?.data?.attributes?.name

          } />
        }
        <ItemComponent name="الخدمة" iconName={"gear"} data={
          categoryName1 || categoryName2 || categoryName3

        } />
        {(item?.attributes?.services?.data?.length > 0) ? (
       <FlatList
       data={item?.attributes?.services?.data}
       showsHorizontalScrollIndicator={false}
       showsVerticalScrollIndicator={false}
       initialNumToRender={10}

       keyExtractor={(item, index) => item.id}
       style={{
         display: "flex",
         flexDirection: "row",
         direction: "rtl",
         flexWrap: "wrap",
         marginTop: 15,
         gap: 15,
         padding:5,
         paddingVertical:10,
         borderRadius:7,
         width: width*0.9,
         backgroundColor: Colors.whiteColor,
         shadowColor: "#000",
         shadowOffset: {
           width: 0,
           height: 1,
         },
         shadowOpacity: 0.2,
         shadowRadius: 1.41,
         elevation: 4,
         gap: 10,

       }}
       renderItem={({ item }) => {
         return (
           <View
             style={{
               display: "flex",
               flexDirection: "row",
               alignItems: "center",
               flexWrap: 'wrap',
               backgroundColor:'white',
               width: width * 0.80,
               gap: 15,
             }}
           >
             <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

             <AppText
               centered={false}
               text={item?.attributes?.name}
               style={[styles.name, { fontSize: RFPercentage(1.75), width: width * 0.7 }]}
             />
            
           </View>
         );
       }}
     />
        ) : (item?.attributes?.packages?.data?.length > 0) ? (
          <FlatList
          data={item?.attributes?.packages?.data}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}

          keyExtractor={(item, index) => item.id}
          style={{
            display: "flex",
            flexDirection: "row",
            direction: "rtl",
            flexWrap: "wrap",
            marginTop: 15,
            gap: 15,
            padding:5,
            paddingVertical:10,
            borderRadius:7,
            width: width*0.9,
            backgroundColor: Colors.whiteColor,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 4,
            gap: 10,

          }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: 'wrap',
                  backgroundColor:'white',
                  width: width * 0.80,
                  gap: 15,
                }}
              >
                <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

                <AppText
                  centered={false}
                  text={item?.attributes?.name}
                  style={[styles.name, { fontSize: RFPercentage(1.75), width: width * 0.7 }]}
                />
               
              </View>
            );
          }}
        />
          
          ) : (item?.attributes?.service_carts?.data?.length > 0) ?
          // <View style={styles.itemContainer}>
            <FlatList
              data={item?.attributes?.service_carts?.data}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}

              keyExtractor={(item, index) => item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                direction: "rtl",
                flexWrap: "wrap",
                marginTop: 15,
                gap: 15,
                padding:5,
                borderRadius:7,
                width: width*0.9,
                backgroundColor: Colors.whiteColor,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 4,
                gap: 10,

              }}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: 'wrap',
                      justifyContent:'space-between',
                      backgroundColor:'white',
                      width: width * 0.80,
                      gap: 15,
                    }}
                  >
                    <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

                    <AppText
                      centered={false}
                      text={item?.attributes?.service?.data?.attributes?.name}
                      style={[styles.name, { fontSize: RFPercentage(1.75), width: width * 0.7 }]}
                    />
                   
                  </View>
                );
              }}
            />
          // </View>
          : null}
        <ItemComponent iconName={"money"} data={item?.attributes?.totalPrice > 0 ? `${item?.attributes?.totalPrice} ${t(CURRENCY)}` : "السعر بعد الزيارة"} name={"Price"} />
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={"Location"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.location}
            style={styles.price}
          />
        </View>


        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={"Notes"} style={styles.title} />
          <AppText
            centered={false}
            text={
              item?.attributes?.description
                ? item?.attributes?.description
                : "لا يوجد"
            }
            style={[styles.price, { width: width * 0.9 }]}
          />
        </View>
        {item?.attributes?.orderImages?.length > 0 && (
          <View style={styles.descriptionContainer}>
            <>
              <AppText centered={false} text={"Images"} style={styles.title} />
              <Carousel
                data={item?.attributes?.orderImages}
                sliderWidth={width}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}

                slideStyle={{
                  backgroundColor: "transparent",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                autoplay={true}
                loop={true}
                autoplayInterval={10000}
                itemWidth={width}
                renderItem={({ item }) => {
                  return (
                    <Image
                      //  resizeMethod="contain"
                      source={{
                        uri: item
                      }}
                      style={{
                        height: height * 0.2,
                        width: width * 0.6,
                        objectFit: "fill",
                        borderRadius: 10,
                      }}
                    />
                  );
                }}
              />
            </>
          </View>
        )}
        {((item?.attributes?.additional_prices?.data?.length > 0) || (item?.attributes?.provider_fee > 0)) &&
          <>
            <AppText centered={false} text={"اسعار اضافية"} style={[styles.title, { paddingHorizontal: 10 }]} />
            <FlatList
              data={item?.attributes?.additional_prices?.data}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}

              renderItem={({ item }) => {

                return (

                  <ItemComponent iconName={"tags"} name={item?.attributes?.details} data={`${item?.attributes?.Price} ${t(CURRENCY)}`} />
                )
              }}
              keyExtractor={(item) => item?.id}
            />
            {
              item?.attributes?.provider_fee > 0 &&
              <ItemComponent iconName={"money"} data={`${item?.attributes?.provider_fee} ${t(CURRENCY)}`} name={"أجرة الفنى"} />
            }

            {
              item?.attributes?.addtional_prices_state === 'pending' &&
              <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <AppButton title={"Accept and Pay"} onPress={() => handlePayOrder(item?.id)} style={{ backgroundColor: Colors.success }} />
                <AppButton title={"Reject"} onPress={() => handleRejectAddionalPrices(item?.id)} style={{ backgroundColor: Colors.redColor }} />
              </View>
            }

          </>
        }


        {
          item?.attributes?.delay_request?.data?.attributes?.accepted === 'pending ' &&
          <DelayOrderCard item={item} />
        }
        {item?.attributes?.status === "pending" && (
          <AppButton
            title={"Cancle Order"}
            onPress={() => handleOrderCancle(item.id)}
            />
        )}
        {(item?.attributes?.status === "pending" || item?.attributes?.status === "assigned") && (
          <AppButton
            title={"Delay Order"}
            style={{ marginTop: 10 }}
            onPress={() => navigation.navigate(CHANGE_ORDER_DATE, { orderId: item?.id, item: item })}
          />
        )}
        {item?.attributes?.status === "payed" &&
          item?.attributes?.PaymentStatus === "payed" && (
            <AppButton
              title={"finish Order"}
              style={{ backgroundColor: Colors.success }}
              onPress={() =>
                navigation.navigate(REVIEW_ORDER_SCREEN, {
                  orderID: item?.id,
                  item: item,
                })
              }
            />
          )}
        {item?.attributes?.status === "payment_required" &&
          item?.attributes?.PaymentStatus === "payed" && (
            <AppButton
              title={"finish Order"}
              style={{ backgroundColor: Colors.success }}
              onPress={() =>
                navigation.navigate(REVIEW_ORDER_SCREEN, {
                  orderID: item?.id,
                  item: item,
                })
              }
            />
          )}
        {item?.attributes?.status === "payment_required" &&
          item?.attributes?.PaymentStatus !== "payed" && (
            item?.attributes?.additional_prices?.data?.length === 0 && item?.attributes?.provider_fee === 0
          ) && (
            <AppButton
              title={"Pay"}
              style={{ backgroundColor: Colors.success }}
              onPress={() => handleGenererateInitator()}
            />
          )}
          

      </ScrollView>
      <AppModal
        isModalVisible={isModalVisible}
        message={"Confirm Cancling Order?"}
        setModalVisible={setModalVisible}
        onPress={() => handleOrderCancle(item.id)}
      />
      <LoadingModal visible={isLoading} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.whiteColor,
  },
  name: {
    fontSize: RFPercentage(1.95),
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: width * 0.9,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    gap: 10,
  },
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    gap: 10,
  },
  price: {
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
    marginTop: 5,
  },
  title: {
    fontSize: RFPercentage(2.3),
    color: Colors.primaryColor,
  },
  chatContainer: {
    paddingHorizontal: 19,
    backgroundColor: Colors.primaryColor,
    width: 60,
    height: 40,
    borderRadius: 20,
    marginHorizontal: width * 0.75,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  delayHeader: {
    fontSize: RFPercentage(2.2),
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 10,
    color: Colors.whiteColor
  },
  CartServiceStylesContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 0.5,

    padding: 5,
    borderRadius: 10,
    // height:100,
    // width:100,
    gap: 4,
    backgroundColor: Colors.piege,
    borderColor: Colors.grayColor
  }
});
