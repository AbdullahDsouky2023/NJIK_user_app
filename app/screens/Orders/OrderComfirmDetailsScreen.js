import {  Dimensions, FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as Updates from "expo-updates";

import { clearCurrentOrder, setOrders } from "../../store/features/ordersSlice";
import LoadingModal from "../../component/Loading";
import {
  CURRENCY,
  ORDER_SUCCESS_SCREEN,
} from "../../navigation/routes";
import PriceTextComponent from "../../component/PriceTextComponent";
import { ScrollView } from "react-native-virtualized-view";
import AppButton from "../../component/AppButton";
import useOrders, { cancleOrder, postOrder } from "../../../utils/orders";
import AppText from "../../component/AppText";
import { Colors } from "../../constant/styles";
import LoadingScreen from "../loading/LoadingScreen";
import AppModal from "../../component/AppModal";
import useRegions from "../../../utils/region";
import { clearCart } from "../../store/features/CartSlice";
import useServices from "../../../utils/services";
import ArrowBack from "../../component/ArrowBack";
import usePackages from "../../../utils/packages";
import { updateUserData } from "../../../utils/user";

const { width ,height} = Dimensions.get("screen");

export default function OrderComfirmDetailsScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: orders, isLoading: loading, isError } = useOrders();
  const currentOrderData = useSelector(
    (state) => state?.orders?.currentOrderData
  );
  const { data } = useRegions();
  const region = data?.data?.filter(
    (item) => item?.id === currentOrderData.region
  )[0]?.attributes?.name;
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const { item, image } = route?.params;
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const { data: services } = useServices();
  const { data: packages } = usePackages();
  const [currentSelectedServices, setCurrentSelectedServices] = useState([]);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState([]);
  const userData = useSelector((state) => state?.user?.userData);
  const handleComfirmOrder = async () => {
    try {
      setIsLoading(true);
      if (
        currentOrderData.packages.connect.length === 0 &&
        currentOrderData.services.connect.length === 0
      ) {
        await Updates.reloadAsync();
      }
      const data = await postOrder(currentOrderData);
      if (currentOrderData?.coupons?.connect[0]?.id) {
        await updateUserData(userData?.id, {
          coupons: {
            connect: [{ id: currentOrderData?.coupons?.connect[0]?.id }],
          },
        });
      }
      if (data) {
        dispatch(clearCurrentOrder());
        dispatch(clearCart());

        if (totalPrice > 0) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Payment", params: { orderId: data } }],
            })
          );
        } else if (totalPrice === 0) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: ORDER_SUCCESS_SCREEN }],
            })
          );
        }
      }
    } catch (error) {
      console.log(error, "error deleting the order");
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const data = currentOrderData?.services?.connect.map((item) => {
      const service = services.data.filter(
        (service) => service?.id === item?.id
      );
      return service[0];
    });
    setCurrentSelectedServices(data);
  }, []);
  useEffect(() => {
    const data = currentOrderData?.packages?.connect.map((item) => {
      const service = packages.data.filter(
        (Packageitem) => Packageitem?.id === item?.id
      );
      return service[0];
    });
    setCurrentSelectedPackages(data);
  }, []);

  if (isLoading) return <LoadingScreen />;
  return (
    <View style={{ backgroundColor: Colors.whiteColor ,    height:height*1,
    }}>
      <ArrowBack subPage={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {currentSelectedServices?.length > 0 && (
          <View style={styles.itemContainer}>
            <FlatList
              data={currentSelectedServices}
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
                      style={[
                        styles.name,
                        { fontSize: RFPercentage(1.9), paddingRight: 10 },
                      ]}
                    />
                    {item.attributes?.Price > 0 && (
                      <AppText
                        text={`${item.attributes?.Price} ` + CURRENCY}
                        style={{
                          backgroundColor: Colors.primaryColor,
                          fontSize: RFPercentage(1.9),
                          padding: 6,
                          borderRadius: 40,
                          color: Colors.whiteColor,
                        }}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        )}
        {currentSelectedPackages.length > 0 && (
          <View style={styles.itemContainer}>
            <FlatList
              data={currentSelectedPackages}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              style={{
                display: "flex",
                flexDirection: "column",
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
                      style={[
                        styles.name,
                        { fontSize: RFPercentage(1.9), paddingRight: 10 },
                      ]}
                    />
                    <PriceTextComponent
                style={{ color: Colors.blackColor, fontSize: 16, marginTop: 4 }}
                price={item?.attributes?.totalPrice}
              />
                  </View>
                );
              }}
            />
          </View>
        )}
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" السعر"} style={styles.title} />
          <PriceTextComponent
            style={{
              color: Colors.blackColor,
              fontSize: RFPercentage(1.9),
              marginTop: 4,
            }}
            price={totalPrice}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" العنوان"} style={styles.title} />
          <AppText
            centered={false}
            text={
              currentOrderData?.googleMapLocation?.readable || "not provided"
            }
            style={styles.price}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" التاريخ"} style={styles.title} />
          <AppText
            centered={false}
            text={currentOrderData.date}
            style={styles.price}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" ملاحظات"} style={styles.title} />
          <AppText
            centered={false}
            text={
              currentOrderData?.description
                ? currentOrderData?.description
                : "لا يوجد"
            }
            style={styles.price}
          />
        </View>
        <Image
          source={{
            uri: image,
          }}
          style={{
            height: 120,
            width: 200,
            borderRadius: 10,
          }}
        />
      </ScrollView>
      <View style={styles.ButtonContainer}>
        <AppButton
          title={"تأكيد الطلب"}
          style={{
            marginTop:-height*0.1
            ,
            paddingVertical: 15,
            paddingHorizontal: 50,
          }}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <AppModal
        isModalVisible={isModalVisible}
        message={"تأكيد الطلب"}
        setModalVisible={setModalVisible}
        onPress={() => handleComfirmOrder()}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.whiteColor,
  },
  name: {
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    marginHorizontal: 4,
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
    marginHorizontal: 4,
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
  ButtonContainer: {
    display: "flex",
    alignItems: "center",
    // padding:-1000,
    backgroundColor: Colors.whiteColor,
  },
});
