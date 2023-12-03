import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import AppButton from "../../component/AppButton";
import AppText from "../../component/AppText";
import { Colors } from "../../constant/styles";
import AppHeader from "../../component/AppHeader";
import useOrders, {
  PayOrder,
  cancleOrder,
  requestPayment,
} from "../../../utils/orders";
import { useDispatch } from "react-redux";
import { setOrders } from "../../store/features/ordersSlice";
import LoadingModal from "../../component/Loading";
import { HOME, ORDERS } from "../../navigation/routes";
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
const { width } = Dimensions.get("screen");
export default function OrderDetails({ navigation, route }) {
  const { item } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  // const { data:orders,isLoading:loading,isError } = useOrders()
  const [orderID, setOrderID] = useState(false);
  const orders = useSelector((state) => state?.orders?.orders);
  const user = useSelector((state) => state?.user?.userData);
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReviewVisble, setIsReviewVisble] = useState(false);
  const { sendPushNotification } = useNotifications();
  const handleOrderCancle = async (id) => {
    try {
      const res = await cancleOrder(id);
      const selectedOrder = orders?.data.filter((order) => order?.id === id);
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
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: HOME }],
          })
        );
        Alert.alert("تم الغاء الطلب بنجاح");
      } else {
        Alert.alert("حدثت مشكله حاول مرة اخري");
      }
    } catch (error) {
      console.log(error, "error deleting the order");
    } finally {
      setModalVisible(false);
    }
  };

  const handlePayOrder = async (id) => {
    try {
      const res = await PayOrder(id);
      const selectedOrder = orders?.data.filter((order) => order?.id === id);

      const providerNotificationToken =
        selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;
      if (res) {
        setIsReviewVisble(true);

        sendPushNotification(
          providerNotificationToken,
          `${selectedOrder[0]?.attributes?.service?.data?.attributes?.name}`,
          `تم انهاء الطلب بواسطه ${selectedOrder[0]?.attributes?.user?.data?.attributes?.username}`
        );

        setOrderID(id);
        // Alert.alert("تم بنجاح");
      } else {
        Alert.alert("حدثت مشكله حاول مرة اخري");
      }
    } catch (error) {
      console.log(error, "error paying the order");
    } finally {
      setModalVisible(false);
    }
  };

  if (isLoading) return <LoadingScreen />;
  return (
    <ScrollView>
      <AppHeader subPage={true} />
      <ScrollView style={styles.container}>
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
                  <AppText
                    text={`${item.attributes?.Price} جنيه`}
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
        <View style={styles.itemContainer}>
          <AppText centered={false} text={"السعر الكلي"} style={styles.title} />
          <PriceTextComponent
            style={{ color: Colors.blackColor, fontSize: 16, marginTop: 4 }}
            price={item?.attributes?.totalPrice}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" العنوان"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.location}
            style={styles.price}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" المنطقه"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.region?.data?.attributes?.name}
            style={styles.price}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" التاريخ"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.date}
            style={styles.price}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" ملاحظات"} style={styles.title} />
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
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" صور لطلبك"} style={styles.title} />
          {item?.attributes?.images?.data ? (
            <Image
              //  resizeMethod="contain"
              source={{
                uri: item?.attributes?.images?.data[0]?.attributes?.url,
              }}
              style={{
                height: 120,
                width: 200,
                borderRadius: 10,
              }}
            />
          ) : (
            <AppText centered={false} text={"لا يوجد"} style={styles.price} />
          )}
        </View>

        {item?.attributes?.status !== "pending" ? (
          <>
            <AppButton
              title={"دردشه"}
              style={{ backgroundColor: Colors.success }}
              onPress={() => navigation.navigate("Chat")}
            />
          </>
        ) : (
          <AppButton
            title={"الغاء الطلب"}
            onPress={() => setModalVisible(true)}
          />
        )}
        {item?.attributes?.status === "finished" && (
          <AppButton
            title={"finish work"}
            style={{ backgroundColor: Colors.success }}
            onPress={() => handlePayOrder(item?.id)}
          />
        )}
      </ScrollView>
      <AppModal
        isModalVisible={isModalVisible}
        message={"تأكيد الغاء الطلب"}
        setModalVisible={setModalVisible}
        onPress={() => handleOrderCancle(item.id)}
      />
      <LoadingModal visible={isLoading} />
      <StarsComponent
        isModalVisible={isReviewVisble}
        orderID={orderID}
        setIsModalVisible={setIsReviewVisble}
      />
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
});
