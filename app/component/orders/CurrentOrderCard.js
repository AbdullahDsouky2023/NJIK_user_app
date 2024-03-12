import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

import React, { useEffect ,useState, memo} from "react";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import { useNavigation } from "@react-navigation/native";
import { CHAT_ROOM_fireBase, ORDERS_DETAILS } from "../../navigation/routes";
import PriceTextComponent from "../PriceTextComponent";
const { width ,height} = Dimensions.get("screen");
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setcurrentChatChannel } from "../../store/features/ordersSlice";
import Pdf from "../../screens/Invoice/pdf";

function CurrentOrderCard({ item, onPress }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.orderCardContainer,{backgroundColor: item?.attributes?.packages?.data.length > 0 ? Colors.piege : Colors.whiteColor}]}>
       
         <View style={styles.headerContainer}>
          {item?.attributes?.services?.data?.length > 0 && (
            <>
              <Image
                height={22}
                width={22}
                source={{
                  uri: item?.attributes?.services?.data[0]?.attributes?.category
                    ?.data?.attributes?.image?.data[0]?.attributes?.url,
                }}
              />
              <AppText
                text={
                  item?.attributes?.services?.data[0]?.attributes?.category
                    ?.data?.attributes?.name
                }
                style={[
                  styles.header,
                  { color: Colors.primaryColor, fontSize: 17 },
                ]}
                centered={false}
              />
            </>
          )}
          {item?.attributes?.service_carts?.data?.length >  0 && 
  <>
    <AppText
      text={item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name }
      style={[
        styles.header,
        { color: Colors.primaryColor, fontSize:  17 },
      ]}
      centered={false}
      />
  </>
    }
    {item?.attributes?.packages?.data?.length > 0 && (
            <AppText
              text={item?.attributes?.packages?.data[0]?.attributes?.name}
              style={[
                styles.header,
                { color: Colors.primaryColor, fontSize: 17 },
              ]}
              centered={false}
            />
          )}
        </View>
        <View style={styles.date}>
          <AppText text={`Status`} centered={false} style={styles.status} />
          <AppText
            text={`${
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
            }`}
            centered={false}
            style={styles.title}
          />
        </View>
        <View style={styles.date}>
          <FontAwesome5 name="money-check" size={16} color="black" />
          <PriceTextComponent price={item?.attributes?.totalPrice} />
        </View>
        <View style={styles.date}>
          <FontAwesome name="calendar" size={21} color="black" />
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
            <Ionicons name="person-outline" size={21} color="black" />
            <AppText
              text={
                item?.attributes?.provider?.data?.attributes?.name ||
                "waiting for the technician"
              }
              centered={false}
              style={[styles.title,{width:width*0.52,
                textAlign: "left", // Align text to the right
              }]}            />
          </View>

          <View>
            {item?.attributes?.provider?.data?.attributes?.name && (
              <TouchableOpacity
                style={styles.chatContainer}
                onPress={() => {
                  dispatch(
                    setcurrentChatChannel(item?.attributes?.chat_channel_id)
                  );

                  navigation.navigate(CHAT_ROOM_fireBase);
                }}
              >
                <Entypo name="chat" size={22} color="white" />
              </TouchableOpacity>
            )}
          </View>
          {/* <Pdf item={item}/> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
export default memo(CurrentOrderCard)
const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.whiteColor,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // backgroundColor:'red',
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor:'red',
    // paddingHorizontal: 11,
    paddingVertical: 4,
    gap: 10,
  },
  orderCardContainer: {
    paddingVertical: 10,
    width: width * 0.88,
    paddingHorizontal: 20,
    marginBottom: 10,
    height: "auto",
    flex: 1,
    gap: 3,
    elevation: 2,
    borderColor: Colors.grayColor,
    borderRadius: 8,
  },
  name: {
    color: Colors.blackColor,
    fontSize: 12,
  },
  title: {
    color: Colors.blackColor,
    fontSize: 12,
  },
  price: {
    color: Colors.primaryColor,
    fontSize: 12,
  },
  date: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  status: {
    color: Colors.primaryColor,
    fontSize: 14,
  },
  chatContainer: {
    paddingHorizontal: 19,
    backgroundColor: Colors.primaryColor,
    width: "auto",
    height: 40,
    borderRadius: 20,
    // marginHorizontal:width*0.65,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
