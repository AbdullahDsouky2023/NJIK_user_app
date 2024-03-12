import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from "react-native";
import { Entypo, Octicons } from "@expo/vector-icons";
import { RFPercentage } from 'react-native-responsive-fontsize'

import React, { memo, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import { useNavigation } from "@react-navigation/native";
import { ACCOUNT, COMPLAIN_CREATE_SCREEN, ORDERS_DETAILS } from "../../navigation/routes";
import PriceTextComponent from "../PriceTextComponent";
const { width } = Dimensions.get("screen");
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setcurrentChatChannel } from "../../store/features/ordersSlice";
import { useTranslation } from "react-i18next";
import Pdf from "../../screens/Invoice/pdf";
 function CompleteOrderCard({ item, onPress }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation()
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.orderCardContainer}>
        <View style={styles.headerContainer}>
          {item?.attributes?.services.data.length > 0 ? (
            <View style={styles.headerText}>
              <View style={styles.date}>
                <Image
                  height={25}
                  width={25}
                  source={{
                    uri: item?.attributes?.services?.data[0]?.attributes
                      ?.category?.data?.attributes?.image?.data[0]?.attributes
                      ?.url,
                  }}
                />
                <AppText
                  text={
                    item?.attributes?.services?.data[0]?.attributes?.category
                      ?.data?.attributes?.name
                  }
                  style={[
                    styles.header,
                    { color: Colors.primaryColor, fontSize: RFPercentage(1.9) },
                  ]}
                  centered={false}
                />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.complainContainer}
                  onPress={() => {
                    if (item?.attributes?.complain?.data) {
                      navigation.navigate(t(ACCOUNT), { screen: "compass" })
                      // navigation.navigate("compass")
                    } else {
                      navigation.navigate(COMPLAIN_CREATE_SCREEN, { item: item })
                    }
                  }}
                >
                  <Octicons name="report" size={21} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) :
            item?.attributes?.packages?.data?.length > 0  ? (
              <View style={styles.headerText}>
                <AppText
                  text={item?.attributes?.packages?.data[0]?.attributes?.name}
                  style={[
                    styles.header,
                    { color: Colors.primaryColor, fontSize: 17 },
                  ]}
                  centered={false}
                />
                <View>
                  <TouchableOpacity
                    style={styles.complainContainer}
                    onPress={() => {
                      if (item?.attributes?.complain?.data) {
                        navigation.navigate(t(ACCOUNT), { screen: "compass" })
                        // navigation.navigate("compass")
                      } else {
                        navigation.navigate(COMPLAIN_CREATE_SCREEN, { item: item })
                      }
                    }}
                  >
                    <Octicons name="report" size={21} color="white" />
                  </TouchableOpacity>
                </View>

              </View>
            ):
            item?.attributes?.service_carts?.data?.length >  0 && 
              <View style={styles.headerText}>
                <AppText
                  text={item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name }
                  style={[
                    styles.header,
                    { color: Colors.primaryColor, fontSize:  17 },
                  ]}
                  centered={false}
                  />
                   <View>
                  <TouchableOpacity
                    style={styles.complainContainer}
                    onPress={() => {
                      if (item?.attributes?.complain?.data) {
                        navigation.navigate(t(ACCOUNT), { screen: "compass" })
                        // navigation.navigate("compass")
                      } else {
                        navigation.navigate(COMPLAIN_CREATE_SCREEN, { item: item })
                      }
                    }}
                  >
                    <Octicons name="report" size={21} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
                
            }
        </View>
        <View style={styles.date}>
          <Ionicons name="ios-location-outline" size={22} color="black" />
          <AppText
            text={item?.attributes?.location}
            centered={false}
            style={styles.title}
          />
        </View>
        {/* Price */}
        <View style={styles.date}>
          <FontAwesome5 name="money-check" size={18} color="black" />
          <PriceTextComponent price={item?.attributes?.totalPrice} />
        </View>
        {/* date */}
        <View style={styles.date}>
          <FontAwesome name="calendar" size={22} color="black" />
          <AppText
            text={`${item?.attributes?.date}`}
            centered={false}
            style={styles.title}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.date}>
            <Ionicons name="person-outline" size={22} color="black" />
            <AppText
              text={
                item?.attributes?.provider?.data?.attributes?.name ||
                "في انتظار العامل "
              }
              centered={false}
              style={[styles.title,{width:width*0.58,
                textAlign: "left", // Align text to the right
              }]}
            />
          </View>

          <Pdf item={item} >
          <FontAwesome5 name="receipt" size={24} color={Colors.whiteColor} />

            </Pdf>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}
export default memo(CompleteOrderCard)
const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.redColor,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor:'red',
    // paddingHorizontal: 11,
    // paddingVertical: 4,
    gap: 10,
  },
  orderCardContainer: {
    paddingVertical: 10,
    width: width * 0.88,
    paddingHorizontal: 20,
    // height: 170,
    flex: 1,
    gap: 5,
    height:"auto",
    backgroundColor: Colors.whiteColor,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    elevation: 2,
    marginBottom:10,
    borderColor: Colors.grayColor,
    // borderWidth: 0.5,
    borderRadius: 8,
  },
  name: {
    color: Colors.blackColor,
    fontSize: RFPercentage(1.3),
  },
  headerText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.8,
  },
  title: {
    color: Colors.blackColor,
    fontSize: RFPercentage(1.5),
  },
  price: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.9),
  },
  date: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  chatContainer: {
    paddingHorizontal: 19,
    backgroundColor: Colors.primaryColor,
    width: "auto",
    height: 40,
    borderRadius: 20,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  complainContainer: {
    paddingHorizontal: 13,
    backgroundColor: Colors.redColor,
    width: "auto",
    height: 40,
    borderRadius: 20,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
