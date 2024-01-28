import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-snap-carousel-v4";
import { ScrollView } from "react-native";
import {RFPercentage } from 'react-native-responsive-fontsize'
import { Image } from "react-native";

import AppText from "../../component/AppText";
import { Colors } from "../../constant/styles";
import useOrders from "../../../utils/orders";
import PriceTextComponent from "../../component/PriceTextComponent";
import LoadingScreen from "../loading/LoadingScreen";
import ArrowBack from "../../component/ArrowBack";

const { width, height } = Dimensions.get("screen");

export default function CompleteOrderDetails({ navigation, route }) {
  const { item } = route?.params;
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <LoadingScreen />;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: Colors.whiteColor }}
    >
      <ArrowBack subPage={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View>
          <AppText
            centered={false}
            text={item?.attributes?.service?.data?.attributes?.name}
            style={styles.name}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" السعر"} style={styles.title} />
          <PriceTextComponent
            style={{ color: Colors.blackColor, fontSize: RFPercentage(1.9), marginTop: 4 }}
            price={item?.attributes?.totalPrice}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" العنوان"} style={styles.title} />
          <AppText
            centered={false}
            text={item?.attributes?.location}
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
            <Carousel
              data={item?.attributes?.images?.data}
              sliderWidth={width}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              loop={true}
              autoplayInterval={10000}
              slideStyle={{
                backgroundColor: "transparent",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              autoplay={true}
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
          ) : (
            <AppText centered={false} text={"لا يوجد"} style={styles.price} />
          )}
        </View>
      </ScrollView>
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
});
