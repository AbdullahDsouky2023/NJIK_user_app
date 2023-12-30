import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import AppButton from "../../component/AppButton";
import AppText from "../../component/AppText";
import { Colors } from "../../constant/styles";

import Carousel from "react-native-snap-carousel-v4";

import useOrders, {
  PayOrder,
  cancleOrder,
  requestPayment,
} from "../../../utils/orders";
import { useDispatch } from "react-redux";
import { setOrders } from "../../store/features/ordersSlice";
import LoadingModal from "../../component/Loading";
import {
  CURRENCY,
  HOME,
  ORDERS,
  REVIEW_ORDER_SCREEN,
} from "../../navigation/routes";
import PriceTextComponent from "../../component/PriceTextComponent";
import { Image } from "react-native";
import LoadingScreen from "../loading/LoadingScreen";
import AppModal from "../../component/AppModal";
import { CommonActions } from "@react-navigation/native";
import StarsComponent from "../../component/StarsComponent";
import useNotifications from "../../../utils/notifications";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";

import { FlatList } from "react-native";
import { color } from "react-native-reanimated";
import { updateProviderData, updateUserData } from "../../../utils/user";
import ArrowBack from "../../component/ArrowBack";
import { useTranslation } from "react-i18next";
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
  const { sendPushNotification } = useNotifications();
  const { t } = useTranslation();
  const handleOrderCancle = async (id) => {
    try {
      setIsLoading(true);
      const res = await cancleOrder(id);
      const selectedOrder = orders?.data?.filter((order) => order?.id === id);
      const providerNotificationToken =
        selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;
      if (providerNotificationToken) {
        sendPushNotification(
          providerNotificationToken,
          "تم الغاء الطلب",
          `تم الغاء الطلب بواسطه ${user?.attributes?.name}`
        );
      }
      if (res) {
        console.log(
          {
            id:id,
            selectedOrder:selectedOrder,
            providerNotificationToken:providerNotificationToken,
            res:res
          }
        )
        navigation.goBack();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: t(HOME) }],
          })
        );
        Alert.alert(t("payment has been cancled successfully."));
      } else {
        Alert.alert(t("Something Went Wrong, Please try again!"));
      }
    } catch (error) {
      console.log(error, "error deleting the order");
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };

  const handlePayOrder = async (id) => {
    try {
      console.log("the button is just clikcked", id);
      const res = await PayOrder(id);
      if (res) {
        Alert.alert("payment has been processed successfully.");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: t(HOME) }],
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
  // console.log(item?.attributes?.images?.data[0].attributes.url)
  if (isLoading) return <LoadingScreen />;
  return (
    <ScrollView>
      <ArrowBack subPage={true} />
      <ScrollView style={styles.container}>
        {item?.attributes?.services.data.length > 0 ? (
          <View style={styles.itemContainer}>
            <FlatList
              data={item?.attributes?.services.data}
              showsHorizontalScrollIndicator={false}
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
                      style={[styles.name, { fontSize: 14, paddingRight: 10 }]}
                    />
                    {
                      item.attributes?.Price > 0 &&
                    <AppText
                    text={`${item.attributes?.Price} ` + CURRENCY}
                      style={{
                        backgroundColor: Colors.primaryColor,
                        fontSize: 14,
                        padding: 6,
                        borderRadius: 40,
                        color: Colors.whiteColor,
                      }}
                    />
                  }
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View style={styles.itemContainer}>
            <FlatList
              data={item?.attributes?.packages.data}
              showsHorizontalScrollIndicator={false}
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
                      style={[styles.name, { fontSize: 14, paddingRight: 10 }]}
                    />
                    <AppText
                      text={`${item.attributes?.price} ` + CURRENCY}
                      style={{
                        backgroundColor: Colors.primaryColor,
                        fontSize: 14,
                        padding: 6,
                        borderRadius: 40,
                        color: Colors.whiteColor,
                      }}
                    />
                  </View>
                );
              }}
            />
          </View>
        )}
        <View style={styles.itemContainer}>
          <AppText centered={false} text={"Price"} style={styles.title} />
          <PriceTextComponent
            style={{ color: Colors.blackColor, fontSize: 16, marginTop: 4 }}
            price={item?.attributes?.totalPrice}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={"Location"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.location}
            style={styles.price}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={"Date"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.date}
            style={styles.price}
          />
        </View>
        {item?.attributes?.description && (
          <View style={styles.descriptionContainer}>
            <AppText centered={false} text={"Notes"} style={styles.title} />
            <AppText
              centered={false}
              text={
                item?.attributes?.description
                  ? item?.attributes?.description
                  : "لا يوجد"
              }
              style={styles.price}
            />
          </View>
        )}
        {item?.attributes?.images?.data ? (
          <View style={styles.descriptionContainer}>
            <>
              <AppText centered={false} text={"Images"} style={styles.title} />
              <Carousel
                data={item?.attributes?.images?.data}
                sliderWidth={width}
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
                  console.log(item?.attributes?.url);
                  return (
                    <Image
                      //  resizeMethod="contain"
                      source={{
                        uri: item?.attributes?.url,
                      }}
                      style={{
                        height: height * 0.2,
                        width: width * 0.6,
                        objectFit: "contain",
                        borderRadius: 10,
                      }}
                    />
                  );
                }}
                // onSnapToItem={(index) => updateState({ activeSlide: index })}
              />
            </>
          </View>
        ) : null}

        {item?.attributes?.status === "pending" && (
          <AppButton
            title={"Cancle Order"}
            onPress={() => setModalVisible(true)}
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
            <AppButton
              title={"Pay"}
              style={{ backgroundColor: Colors.success }}
              onPress={() => handlePayOrder(item?.id)}
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
    fontSize: 17,
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
    fontSize: 17,
    color: Colors.blackColor,
    marginTop: 5,
  },
  title: {
    fontSize: 21,
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
});
