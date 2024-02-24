import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-snap-carousel-v4";
// import { ScrollView } from "react-native";
import { RFPercentage } from 'react-native-responsive-fontsize'
import { Image, FlatList } from "react-native";

import AppText from "../../component/AppText";
import { Colors, Sizes } from "../../constant/styles";
import useOrders, { PayOrder } from "../../../utils/orders";
import PriceTextComponent from "../../component/PriceTextComponent";
import LoadingScreen from "../loading/LoadingScreen";
import ArrowBack from "../../component/ArrowBack";
import { ScrollView } from "react-native-virtualized-view";
import { CHAT_ROOM_fireBase, CURRENCY, HOME, ORDERS_DETAILS, ORDER_SUCCESS_SCREEN } from "../../navigation/routes";
import { FontAwesome,AntDesign, MaterialIcons } from '@expo/vector-icons';
import ReserveButton from "../../component/ReverveButton";
import AppButton from "../../component/AppButton";
import { setcurrentChatChannel } from "../../store/features/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import useNotifications from "../../../utils/notifications";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import Pdf from "../Invoice/pdf";

const { width, height } = Dimensions.get("screen");

export default function PaymentRequiredScreen({ navigation, route }) {
  const { item } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const { sendPushNotification } = useNotifications();
  const { t } = useTranslation()
  const orders = useSelector((state) => state?.orders?.orders);
  const user = useSelector((state) => state?.user?.userData);
  const categoryName1 = item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name
  const categoryName2 = item?.attributes?.services.data[0]?.attributes?.category?.data?.attributes?.name
  const categoryName3 = item?.attributes?.packages?.data[0]?.attributes?.name
  const handlePayOrder = async (id) => {
    try {
      console.log("the button is just clikcked", id);
      const res = await PayOrder(id);
      const selectedOrder = orders?.data?.filter((order) => order?.id === id);
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
            routes: [{ name: t(ORDER_SUCCESS_SCREEN) }],
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
  console.log("services", item?.attributes?.packages?.data[0]?.attributes?.name)
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
        <View style={{ marginVertical: 10, paddingVertical: 8, backgroundColor: Colors.primaryColor, width: width * 0.5, alignSelf: 'center', borderRadius: 10 }}>
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
          <ItemComponent2 name="الموقع" iconName={"map-marker"} data={item?.attributes?.location} />
          <ItemComponent name="الخدمة" data={
            categoryName1 || categoryName2 || categoryName3

          } />
          <ItemComponent name=" اسم الفني" iconName="user" data={
            item?.attributes?.provider?.data?.attributes?.name

          } />

          {/* <ArrowBack subPage={true} /> */}
          {(item?.attributes?.services?.data?.length > 0) ? (
            <View style={styles.itemContainer}>
              <FlatList
                data={item?.attributes?.services.data}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}

                keyExtractor={(item, index) => item.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  direction: "rtl",
                  flexWrap: "wrap",
                  marginTop: 15,
                  gap: 15,
                  width: width,
                }}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 15,
                      }}
                    >
                      <AppText
                        centered={false}
                        text={item.attributes?.name}
                        style={[styles.name, { fontSize: RFPercentage(1.8), paddingRight: 10 }]}
                      />

                      <PriceTextComponent
                        style={{
                          backgroundColor: Colors.primaryColor,
                          fontSize: RFPercentage(1.5),
                          padding: 6,
                          borderRadius: 40,
                          color: Colors.whiteColor,
                        }}
                        price={item?.attributes?.Price}
                      />
                    </View>
                  );
                }}
              />
            </View>
          ) : (item?.attributes?.packages?.data?.length > 0) ? (
            <View style={styles.itemContainer}>
              <FlatList
                data={item?.attributes?.packages.data}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}

                keyExtractor={(item, index) => item.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  direction: "rtl",
                  flexWrap: "wrap",
                  marginTop: 15,
                  gap: 15,
                  width: width,
                }}
                renderItem={({ item }) => {
                  console.log('item')
                  return (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 15,
                      }}
                    >
                      <AppText
                        centered={false}
                        text={item.attributes?.name}
                        style={[styles.name, { fontSize: RFPercentage(1.65), paddingRight: 10 }]}
                      />
                      <PriceTextComponent
                        style={{
                          backgroundColor: Colors.primaryColor,
                          fontSize: RFPercentage(1.5),
                          padding: 6,
                          borderRadius: 40,
                          color: Colors.whiteColor,
                        }}
                        price={item?.attributes?.price}
                      />
                    </View>
                  );
                }}
              />
            </View>) : (item?.attributes?.service_carts?.data?.length > 0) ?
            <View style={styles.itemContainer}>
              <FlatList
                data={item?.attributes?.service_carts?.data}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}

                keyExtractor={(item, index) => item.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  direction: "rtl",
                  flexWrap: "wrap",
                  marginTop: 15,
                  gap: 15,
                  width: width,
                }}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: 'wrap',
                        maxWidth: width * 0.90,
                        gap: 15,
                      }}
                    >
                      <AppText
                        centered={false}
                        text={item?.attributes?.service?.data?.attributes?.name}
                        style={[styles.name, { fontSize: RFPercentage(1.65), paddingRight: 10, paddingTop: 10 }]}
                      />
                      <View style={styles.CartServiceStylesContainer}>
                        <PriceTextComponent
                          style={{
                            backgroundColor: Colors.primaryColor,
                            fontSize: RFPercentage(1.5),
                            padding: 6,
                            borderRadius: 40,
                            color: Colors.whiteColor,
                          }}
                          price={item?.attributes?.service?.data?.attributes?.Price}
                        />
                        <AppText
                          style={{
                            backgroundColor: Colors.whiteColor,
                            fontSize: RFPercentage(1.8),
                            padding: 6,
                            borderRadius: 40,
                            paddingHorizontal: 15,
                            color: Colors.primaryColor,
                          }}
                          text={"x"}
                        />
                        <AppText
                          style={{
                            backgroundColor: Colors.primaryColor,
                            fontSize: RFPercentage(1.5),
                            padding: 6,
                            borderRadius: 40,
                            paddingHorizontal: 15,
                            color: Colors.whiteColor,
                          }}
                          text={item?.attributes?.qty}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            </View>
            : null}
          <View>
            <AppText
              centered={false}
              text={item?.attributes?.service?.data?.attributes?.name}
              style={styles.name}
            />
          </View>
          <ItemComponent name={"اجمالي الفاتورة"} iconName={"money"} data={`${item?.attributes?.totalPrice} ${CURRENCY}`} />
          <ItemComponent name={"الرقم الضريبي"} data={`311964554400003`} />


          {
            item?.attributes?.provider_fee > 0 &&
<ItemComponent name={"اجرة الفني"} data={        `${item?.attributes?.provider_fee} ${CURRENCY}`}/>
          }
          {item?.attributes?.additional_prices?.data?.length > 0 &&
            <>
              <FlatList
                data={item?.attributes?.additional_prices?.data}
                showsVerticalScrollIndicator={false}

                renderItem={({ item }) => {

                  return <ItemComponent name={item?.attributes?.details} data={`${item?.attributes?.Price} ${CURRENCY}`} />
                }}
                keyExtractor={(item) => item?.id}
              />

            </>
          }
          <ItemComponent name={"التكلفة المخصومة من الرصيد"} iconName={"money"} data={`${0} ${CURRENCY}`} />
          <ItemComponent name={"الضريبة"} iconName={"money"} data={`${0} ${CURRENCY}`} />
          <ItemComponent name={"الإجمالي بعد الخصم"} iconName={"money"} data={`${item?.attributes?.totalPrice} ${CURRENCY}`} />
          <View style={{marginVertical:10}}>

            <Pdf item={item} chatContainerStyles={{width:200,height:50,alignSelf:'center'}}>
              <View style={{display:'flex',flexDirection:'row',gap:15,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>

              <AppText text={"تصدير"} style={{color:Colors.whiteColor}}/>
            <AntDesign name="upload" size={20} color={Colors.whiteColor} />
            {/* <AntDesign name="upload" size={24} color="black" /> */}
              </View>
              </Pdf>
          </View>

        </ScrollView>
      </ScrollView>
      <View style={styles.ButtonContainer}>
        <AppButton
          title={" 💳  دفع الفاتورة "}
          textStyle={{ fontSize: RFPercentage(1.7) }}

          style={styles.buttonStyles}
          onPress={() => handlePayOrder(item?.id)}
        />
        <AppButton
          title={" ما اتفقنا علي كذا"}
          style={styles.buttonStyles2}
          textStyle={{ fontSize: RFPercentage(1.7) }}
          onPress={() => {
            navigation.navigate(CHAT_ROOM_fireBase);
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
    position: 'relative'
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

  }

});

const ItemComponent = ({ name, data, iconName }) => {
  return (
    <View style={[styles.itemContainer, { justifyContent: 'space-between' }]}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 15, alignItems: 'center', }}>
        <FontAwesome name={iconName} size={RFPercentage(2.2)} color={Colors.grayColor} />

        <AppText centered={false} text={name} style={[styles.title, { fontSize: RFPercentage(2.1) }]} />
      </View>
      <AppText
        centered={false}
        text={data}
        style={[styles.price, { fontSize: RFPercentage(2) }]}
      />
    </View>
  )
}
const ItemComponent2 = ({ name, data, iconName }) => {
  return (
    <View style={[styles.descriptionContainer, { justifyContent: 'space-between' }]}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', width: width * 0.8 }}>
        <FontAwesome name={iconName} size={RFPercentage(2.2)} color={Colors.grayColor} />

        <AppText centered={false} text={name} style={styles.title} />
      </View>
      <AppText
        centered={false}
        text={data}
        style={[styles.price, { fontSize: RFPercentage(1.7) }]}
      />
    </View>
  )
}