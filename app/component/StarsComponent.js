import { Rating, AirbnbRating } from "react-native-ratings";
import Modal from "react-native-modal";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons} from '@expo/vector-icons'
import React, { useRef, useState } from "react";
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
import { Animated, Easing } from "react-native";

import { updateProviderData, updateUserData } from "../../utils/user";
import useNotifications from "../../utils/notifications";
import { useTranslation } from "react-i18next";
import { useHover } from "react-native-web-hooks";
import { Hoverable } from "react-native-web-hover";
import AppButton from "./AppButton";
import LoadingModal from "./Loading";
import LoadingScreen from "../screens/loading/LoadingScreen";
export default function StarsComponent({ route }) {
  const { data: UserOrders, isError } = useOrders();
  console.log(route.params.orderID);
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();
  const [isLoading,setIsLoading]=useState(false)
  const [focus, setFocus] = useState(null);
  const TemporaryImage =
    "https://cdn-icons-png.flaticon.com/128/6998/6998122.png";
  const { sendPushNotification } = useNotifications();
  const { t } = useTranslation();
  console.log(focus, "this if foucsed");
  const RatingEmojs = [
    {
      emoji: "emoticon-outline",
      explain: "Excellent",
      rate: 5,
    },
    {
      emoji: "emoticon-happy-outline",
      explain: "Good",
      rate: 4,
    },
    {
      emoji: "emoticon-confused-outline",
      explain: "Average",
      rate: 3,
    },
    {
      emoji: "emoticon-frown-outline",
      explain: "Bad",
      rate: 2,
    },
    {
      emoji: "emoticon-angry-outline",
      explain: "Very Bad",
      rate: 1,
    },
  ];
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true)
      const { orderID, item } = route?.params;
      const SelectedRate = RatingEmojs.filter((item)=>item?.explain === focus)[0]
      const res = await AddOrderReview(orderID, {
        rating:SelectedRate.rate.toString(),
        content:SelectedRate.explain,
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
      console.log(OrderProvider, OrderUserId, {
        rating:SelectedRate.rate,
        content:SelectedRate.explain,
      });
      if (res) {
        navigation.goBack();
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: t(HOME) }],
          })
        );
        await updateUserData(OrderUserId, {
          orders: {
            connect: [{ id: orderID }],
          },
        });
        await updateProviderData(OrderProvider, {
          orders: {
            connect: [{ id: orderID }],
          },
        });
        sendPushNotification(
          providerNotificationToken,
          `تم انهاء الطلب بواسطه ${selectedOrder[0]?.attributes?.user?.data?.attributes?.username}`
          );
          Alert.alert("تم بنجاح");
      } else {
        Alert.alert("حدثت مشكله حاول مرة اخري");
      }
    } catch (error) {
      console.log(error, "error paying the order");
    }finally {
      setIsLoading(false)

    }
  };
  if(isLoading ){
    return <LoadingScreen/>
  }
  return (
    <ScrollView style={styles.container}>
      <ArrowBack subPage={true} />
      <View style={{ flex: 1 }}>
        <AppText text={"Your Rate of the Technician"} style={styles.text} />

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 10,
          }}
        >
          <Image
            source={{
              uri:
                route?.params?.item?.attributes?.provider?.data?.attributes
                  ?.image?.url || TemporaryImage,
            }}
            style={styles.Image}
          />
          <AppText
            text={
              route?.params?.item?.attributes?.provider?.data?.attributes?.name
            }
            style={styles.text}
          />
          <View style={styles.emojiContainer}>
            {RatingEmojs.map((item,index) => {
              return (
                <Hoverable
                key={index}
                  onTouchStart={() => setFocus(item?.explain)}
                  onHoverOut={() => console.log(item?.explain)}
                  style={[
                    focus === item.explain
                      ? styles.Selectedemoji
                      : styles.emoji,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item?.emoji}
                    style={[
                      focus === item.explain
                        ? styles.SelectEmojiImage
                        : styles.emojiImage,
                    ]}
                    color={"black"}
                  />
                  <AppText
                    text={item?.explain}
                    style={
                      focus === item.explain
                        ? styles.SelectedEmojiExplain
                        : styles.emojiExplain
                    }
                  />
                </Hoverable>
              );
            })}
          </View>
        </View>
       
      <AppButton onPress={handleFormSubmit} title={"تقييم"} disabled={!focus} style={styles.buttonSubmit}/>
        {/* <AppForm
          initialValues={{ rating: "", review: "" }}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {/* <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
           
            name="review"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top" 
          /> */}
          {/* <SubmitButton title={"تقييم"} dis  style={styles.buttonSubmit} /> */}
        {/* </AppForm> */} 
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
  },
  text: {
    color: "black",
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  buttonSubmit: {
    width: width * 0.4,
    marginVertical: 10,
    alignSelf: "center",
  },
  Image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    // marginBottom: 10,
  },
  emojiContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  emoji: {
    display: "flex",
    flexDirection: "column",
    // gap:10
  },
  emojiImage: {
    fontSize: 35,
    color: Colors.grayColor,
  },
  emojiExplain: {
    fontSize: 15,
    textAlign:'center'
  },
  Selectedemoji: {
    display: "flex",
    color:Colors.primaryColor,
    flexDirection: "column",
    transform: [{ scale: 1.2 ,}],
    
    // gap:10
  },
  SelectEmojiImage: {
    fontSize: 55,
    color:Colors.primaryColor,
    height: "auto",
  },
  SelectedEmojiExplain: {
    fontSize: 15,
    color:Colors.blackColor,

  },
});
