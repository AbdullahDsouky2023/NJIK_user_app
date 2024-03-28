import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import Carousel from "react-native-snap-carousel-v4";
// import { ScrollView } from "react-native";
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Image, FlatList } from "react-native";

import AppText from "../../component/AppText";
import { Colors, Sizes } from "../../constant/styles";
import useOrders, { GetOrderData, PayOrder, updateOrderData } from "../../../utils/orders";
import PriceTextComponent from "../../component/PriceTextComponent";
import LoadingScreen from "../loading/LoadingScreen";
import ArrowBack from "../../component/ArrowBack";
import { ScrollView } from "react-native-virtualized-view";
import { CECKOUT_WEBVIEW_SCREEN, CHAT_ROOM_fireBase, CHECkOUT_COUNTRY, CURRENCY, HOME, ORDERS_DETAILS, ORDER_SUCCESS_SCREEN, SUCESS_PAYMENT_SCREEN } from "../../navigation/routes";
import { FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';
import ReserveButton from "../../component/ReverveButton";
import { setUserData } from "../../store/features/userSlice";

import AppButton from "../../component/AppButton";
import { setcurrentChatChannel } from "../../store/features/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import useNotifications from "../../../utils/notifications";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import Pdf from "../Invoice/pdf";
import * as Linking from "expo-linking";
import initiatePayment from "../../utils/Payment/Initate";
import { CalculatePriceWithCoupon, CalculatePriceWithoutCoupon, CalculateTax, CalculteServicePriceWithoutAddionalPrices, calculateProviderProfitAfterPayment, calculateTotalWithTax, getValueDiscountFromBalance } from "../../utils/Payment/helpers";
import { getUserByPhoneNumber, updateProviderData, updateUserData } from "../../../utils/user";

const { width, height } = Dimensions.get("screen");

export default function PaymentRequiredScreen({ navigation, route }) {
  const { item } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { sendPushNotification } = useNotifications();
  const { t } = useTranslation();
  const orders = useSelector((state) => state?.orders?.orders);
  const user = useSelector((state) => state?.user?.userData);
  const [CurrentOrderData, setCurrentOrderData] = useState(null)

  // Added checks to ensure objects are defined before accessing their properties
  const categoryName1 = item?.attributes?.service_carts?.data?.[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes;
  const categoryName2 = item?.attributes?.services?.data?.[0]?.attributes?.category?.data?.attributes;
  const categoryName3 = item?.attributes?.packages?.data?.[0]?.attributes;

  const handlePayOrder = async () => {
    try {
      const id = item?.id
      const res = await PayOrder(id);
      const selectedOrder = orders?.data?.filter((order) => order?.id === id);
      const providerNotificationToken = selectedOrder?.[0]?.attributes?.provider?.data?.attributes?.expoPushNotificationToken;
      if (providerNotificationToken) {
        sendPushNotification(
          providerNotificationToken,
          "تم  دفع الطلب",
          `تم  دفع الطلب  بواسطة ${user?.username}`
        );
      }
      if (res) {
        // Inside your sign-out function:

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
      console.log(error, "error paying3 the order");
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenererateInitator = () => {
    const orderAmmount = getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayInCash

    const username = user.username.trim(); // Remove any leading or trailing spaces
    const nameParts = username.split(' '); // Split the username into parts

    const firstName = nameParts[0]; // The first part is the first name
    const lastName = nameParts.slice(1).join(' '); // The rest are the last name




    // Example usage
    const orderDetails = {
      orderId: `ORDER${item?.id}`,
      amount: orderAmmount,
      currency: CURRENCY,
      description: item?.description || "no description",
      payerFirstName: firstName,
      payerLastName: lastName,
      payerAddress: user?.location,
      payerCountry: CHECkOUT_COUNTRY,
      payerCity: user?.city,
      payerZip: '12345',
      payerEmail: user?.email,
      payerPhone: user?.phoneNumber,
      payerIp: '192.168.1.1'
    };

    initiatePayment(orderDetails)
      .then(response => {
        navigation.navigate(CECKOUT_WEBVIEW_SCREEN, {
          url: response?.redirect_url,
          orderId: `ORDER${item?.id}`,
          handlePayOrderFun: handlePayOrder,
          decreadedAmountFromWallet: getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayWithWallet
        })
        console.log('Payment initiated successfully:', response?.redirect_url)
      })
      .catch(error => console.error('Error initiating payment:', error));
  }
  useEffect(() => {
    GetOrderDataComplete()
  }, [])
  const GetOrderDataComplete = async () => {
    try {
      if (item?.id) {
        console.log("item ,", item?.id)

        const currentOrderData = await GetOrderData(item?.id)
        if (currentOrderData) {

          setCurrentOrderData(currentOrderData)
        }
      }
    } catch (err) {
      console.log("err")
    }
  }
  const CalculateTotalPriceWithFee = (item) => {
    //45 5
    let TotalPrice = calculateTotalWithTax(item?.attributes?.totalPrice);
    console.log("the total price is ", TotalPrice)
    // if (CurrentOrderData?.attributes?.coupons?.data[0]) {
    //     const CouponPrice = CalculatePriceWithCoupon(CalculteServicePriceWithoutAddionalPrices(item), CurrentOrderData?.attributes?.coupons?.data[0]?.attributes?.value)?.discountAmount;
    //     TotalPrice = TotalPrice - CouponPrice ;
    //     console.log("the tootla price ",CouponPrice,TotalPrice)
    // }
    // Convert to string with fixed decimal places at the end
    return Number(TotalPrice).toFixed(2);
  }
  const handleWidthrawAmountFromWallet = async () => {
    try {

      const walletDiscount = getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayWithWallet
      if (walletDiscount > 0) {
        const value = Number(user?.wallet_amount) - Number(walletDiscount)
        const res = await updateUserData(user?.id, {
          wallet_amount: value?.toFixed(2)
        })
        await updateOrderData(item?.id, {
          payed_amount_with_wallet: Number(walletDiscount),
          //   paymentO
        })
        if (res) {
          console.log("Success Update User", res)
          const gottenuser = await getUserByPhoneNumber(user?.phoneNumber);

          dispatch(setUserData(gottenuser));
          //   Alert.alert("  تمت عمليةالشحن بنجاح ")

        }

      }
    } catch (err) {
      console.log("err handle oeration", err)
    }
  }
  const HandleProviderProfitAfterSuccessPayment = async () => {
    try {
      if (CurrentOrderData?.id) {
        const amount = calculateProviderProfitAfterPayment(CurrentOrderData)
        const providerCurrentWalletAmount = CurrentOrderData?.attributes?.provider?.data?.attributes?.wallet_amount
        const FinalAmount = Number(amount) + Number(providerCurrentWalletAmount)
        await updateProviderData(CurrentOrderData?.attributes?.provider?.data?.id, {
          wallet_amount: FinalAmount.toFixed(2)
        })
        console.log("the order data is there***************",)
      }
    } catch (err) {
      console.log("HandleProviderProfitAfterSuccessPayment", err)
    }
  }
  console.log("daa", CurrentOrderData?.attributes?.additional_prices?.data[0]?.attributes)
  if (isLoading) return <LoadingScreen />;
  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.whiteColor, position: 'relative' }}

      >
        <MaterialIcons
          name="arrow-back"
          size={27}
          color="black"
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginVertical: Sizes.fixPadding * 2.0,
            position: 'relative'
          }}
          onPress={() => navigation.navigate("App")}
        />
        <View style={{ marginVertical: 1, paddingVertical: 8, backgroundColor: Colors.primaryColor, width: width * 0.5, alignSelf: 'center', borderRadius: 10 }}>
          <AppText text={"الدفع"} style={{ color: Colors.whiteColor, fontSize: RFPercentage(2.8) }} />
        </View>
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

          <ItemComponent name=" اسم الفني" iconName="user" data={
            item?.attributes?.provider?.data?.attributes?.name

          } />
          <View style={[styles.shadowStyles, styles.itemContainer, { flexDirection: 'column', gap: -20, padding: 0, paddingBottom: 5 }]}>

            <ItemComponent name="الخدمة" iconName={"gear"} NoShadowed={true} data={
              categoryName1?.name || categoryName2?.name || categoryName3?.name

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
                  padding: 5,
                  paddingVertical: 10,
                  borderRadius: 7,
                  width: width * 0.9,
                  backgroundColor: Colors.whiteColor,

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
                        backgroundColor: 'white',
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
                  padding: 5,
                  paddingVertical: 10,
                  borderRadius: 7,
                  width: width * 0.9,
                  backgroundColor: Colors.whiteColor,

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
                        backgroundColor: 'white',
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
              />) : (item?.attributes?.service_carts?.data?.length > 0) ?
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
                  padding: 5,
                  borderRadius: 7,
                  width: width * 0.9,
                  backgroundColor: Colors.whiteColor,

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
                        backgroundColor: 'white',
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
              : null}
          </View>

          <View>
            <AppText
              centered={false}
              text={item?.attributes?.service?.data?.attributes?.name}
              style={styles.name}
            />
          </View>
          {/* Prices here */}
          <ItemComponent name={"إجمالي الفاتورة"} iconName={"money"} data={`${CalculatePriceWithoutCoupon(CalculteServicePriceWithoutAddionalPrices(CurrentOrderData), CurrentOrderData?.attributes?.coupons?.data[0]?.attributes?.value)?.originalPrice} ${t(CURRENCY)}`} />
          {CurrentOrderData?.attributes?.coupons?.data[0] && <ItemComponent name={"خصم الكوبون"} iconName={"money"}
            data={`${(CalculatePriceWithCoupon(CalculatePriceWithoutCoupon(CalculteServicePriceWithoutAddionalPrices(CurrentOrderData), CurrentOrderData?.attributes?.coupons?.data[0]?.attributes?.value)?.originalPrice, CurrentOrderData?.attributes?.coupons?.data[0]?.attributes?.value)?.discountAmount)} ${t(CURRENCY)}`} />}


          {
            item?.attributes?.provider_fee > 0 &&
            <ItemComponent name={"أجرة الفني"} iconName="money" data={`${item?.attributes?.provider_fee} ${t(CURRENCY)}`} />
          }
          {CurrentOrderData?.attributes?.additional_prices?.data?.length > 0 &&
            <>
              <FlatList
                data={CurrentOrderData?.attributes?.additional_prices?.data}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}

                renderItem={({ item }) => {

                  return <ItemComponent iconName={"tags"} name={item?.attributes?.details} data={`${item?.attributes?.Price} ${t(CURRENCY)}`} />
                }}
                keyExtractor={(item) => item?.id}
              />

            </>
          }
          <ItemComponent name={"سعر الكشف والزيارة"} iconName={"money"} data={`${item?.attributes?.visit_price} ${t(CURRENCY)}`} />
          <ItemComponent name={"ضريبة القيمة المضافة "} iconName={"money"} data={`${CalculateTax(item?.attributes?.totalPrice)} ${t(CURRENCY)}`} />
          <ItemComponent name={"التكلفة المخصومة من الرصيد"} iconName={"money"} data={`${getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayWithWallet} ${t(CURRENCY)}`} />
          {/* <ItemComponent name={"التكلفة المخصومة من الرصيد"} iconName={"money"} data={`${0} ${t(CURRENCY)}`} /> */}
          <ItemComponent name={"الإجمالي بعد الخصم"} iconName={"money"} data={`${getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayInCash}  ${t(CURRENCY)}`} />


        </ScrollView>
      </ScrollView>
      <View style={styles.ButtonContainer}>
        <AppButton
          title={" 💳  دفع الفاتورة "}
          textStyle={{ fontSize: RFPercentage(1.7) }}

          style={styles.buttonStyles}
          onPress={() => {
            const amountToPay = getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayInCash
            console.log("the user will pay ", amountToPay === 0)
            if (Number(amountToPay) === 0) {
              console.log("the amountToPay will pay ", amountToPay)
              handleWidthrawAmountFromWallet()
              handlePayOrder()
              HandleProviderProfitAfterSuccessPayment()
            } else if (amountToPay > 0) {
              console.log("the amount it ", getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayWithWallet)
              navigation.navigate("Payment", {
                handleGenererateInitator,
                handlePayOrder,
                orderId: item?.id,
                totalAmount: amountToPay,
                decreadedAmountFromWallet: getValueDiscountFromBalance(user?.wallet_amount, CalculateTotalPriceWithFee(item))?.amountToPayWithWallet
              })
            }
          }}
        />
        <AppButton
          title={" ما اتفقنا على كذا"}
          style={styles.buttonStyles2}
          textStyle={{ fontSize: RFPercentage(1.7) }}
          onPress={() => {

            // console.log("f222eeees",item?.attributes?.provider_fee >0,item?.attributes?.additional_prices?.data?.data?.length )
            if (CurrentOrderData?.attributes?.additional_prices?.data?.length > 0 || item?.attributes?.provider_fee > 0) {
              navigation.navigate(ORDERS_DETAILS, { item: item });

            } else {
              navigation.navigate(CHAT_ROOM_fireBase)
              dispatch(setcurrentChatChannel(item?.attributes?.chat_channel_id))

            }
            dispatch(setcurrentChatChannel(item?.attributes?.chat_channel_id))
          }}
        />
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.whiteColor,
    position: 'relative',

  },
  name: {
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginHorizontal: 1,
    marginVertical: 3,
    backgroundColor: Colors.whiteColor,
    gap: 10,

  },
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    marginHorizontal: 1,

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
    fontSize: RFPercentage(2.1),
    color: Colors.primaryColor,
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
  },
  ButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10, // Adjust padding as needed
    paddingVertical: 10, // Adjust padding as needed
    backgroundColor: Colors.whiteColor, // Ensure the background matches your design
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyles: {
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingHorizontal: width * 0.07,
    paddingVertical: width * 0.03,
    fontSize: RFPercentage(2)

  },
  buttonStyles2: {
    backgroundColor: Colors.redColor,
    borderRadius: 10,
    paddingHorizontal: width * 0.07,
    paddingVertical: width * 0.03,
    fontSize: RFPercentage(1)


  },
  wrapper: {
    paddingBottom: width * 0.3,

  },
  shadowStyles: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,

  }
});

const ItemComponent = ({ name, data, iconName, NoShadowed }) => {
  return (
    <View style={[styles.itemContainer, !NoShadowed && styles.shadowStyles, { justifyContent: 'space-between' }]}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 15, alignItems: 'center', }}>
        <FontAwesome name={iconName} size={RFPercentage(2.2)} color={Colors.grayColor} />

        <AppText centered={false} text={name} style={[styles.title, { fontSize: RFPercentage(2.1) }]} />
      </View>
      <AppText

        centered={false}
        text={data}
        style={[styles.price, { fontSize: RFPercentage(1.9) }]}
      />
    </View>
  )
}
const ItemComponent2 = ({ name, data, iconName }) => {
  return (
    <View style={[styles.itemContainer, styles.shadowStyles, { justifyContent: 'space-between' }]}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', width: width * 0.7 }}>
        <FontAwesome name={iconName} size={RFPercentage(2.2)} color={Colors.grayColor} />

        <AppText centered={false} text={name} style={styles.title} />
      </View>
      <View style={{ backgroundColor: Colors.primaryColor, width: 50, display: 'flex', alignItems: 'center', padding: 10, borderRadius: 10 }}>

        <FontAwesome name={iconName} onPress={() => {
          Linking.openURL("https://maps.app.goo.gl/UXMEAg7v7eAQCQAp9")
        }} size={RFPercentage(2.3)} color={Colors.whiteColor} />
      </View>
      {/* <AppText
        centered={false}
        text={data}
        style={[styles.price, { fontSize: RFPercentage(1.7) }]}
      /> */}
    </View>
  )
}
