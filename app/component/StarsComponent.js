import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Hoverable } from "react-native-web-hover";
import * as Linking from "expo-linking";
import { MaterialCommunityIcons,AntDesign } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import AppText from "./AppText";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import { updateProviderData, updateUserData } from "../../utils/user";
import useNotifications from "../../utils/notifications";
import AppButton from "./AppButton";
import LoadingScreen from "../screens/loading/LoadingScreen";
import { Colors, mainFont } from "../constant/styles";
import useOrders, { AddOrderReview } from "../../utils/orders";
import { HOME } from "../navigation/routes";
import ArrowBack from "./ArrowBack";
import Pdf from "../screens/Invoice/pdf";
const { width } = Dimensions.get("screen");

export default function StarsComponent({ route }) {
  const { data: UserOrders, isError } = useOrders();
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [focus, setFocus] = useState(null);
  const [description, setDescription] = useState(null);
  const  { t }= useTranslation()
  const TemporaryImage =
    "https://cdn-icons-png.flaticon.com/128/6998/6998122.png";
  const { sendPushNotification } = useNotifications();
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
      setIsLoading(true);
      const { orderID, item } = route?.params || {};
      const SelectedRate = RatingEmojs.filter(
        (item) => item?.explain === focus
      )[0];
      const res = await AddOrderReview(orderID, {
        rating: SelectedRate.rate.toString(),
        content: description,
      });
      const selectedOrder = UserOrders?.data?.filter(
        (order) => order?.id === orderID
      );

   const providerNotificationToken = selectedOrder[0]?.attributes?.provider?.data?.attributes?.expoPushNotificationToken;

      const OrderProvider = selectedOrder[0]?.attributes?.provider?.data?.id;
      const OrderUserId = selectedOrder[0]?.attributes?.user?.data?.id;
      if (res) {
        if(route?.params?.firstReview){
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:"App" }],
            })
          );
          
        }else {
          
          navigation.goBack();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: t(HOME) }],
            })
          );
        }
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
        Alert.alert(
          "تم بنجاح",
          "هل ترغب في تقييمنا على متجر Google Play؟",
          [
            {
              text: "قيم الآن",
              onPress: () => {
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=your.app.id"
                );
              },
            },
            {
              text: "ليس الآن",
              onPress: () => console.log("Not now pressed"),
            },
          ],
          { cancelable: false } // Prevent closing by tapping outside
        );
      } else {
        Alert.alert("حدثت مشكله حاول مرة اخري");
      }
    } catch (error) {
      console.log(error, "error paying the order");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
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
            gap: 5,
          }}
        >
          <Image
            source={{
              uri:
                route?.params?.item?.attributes?.provider?.data?.attributes
                  ?.Personal_image?.data[0]?.attributes?.url || TemporaryImage,
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
            {RatingEmojs.map((item, index) => {
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
        <View style={styles.inputContainer}>
          <TextInput
            showSoftInputOnFocus
            selectTextOnFocus
            selectionColor={Colors.primaryColor}
            textAlign="right"
            textAlignVertical="top"
            placeholder="أكتب تقييمك للفني"
            placeholderTextColor={Colors.grayColor}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            multiline={true}
            numberOfLines={4}
            onChangeText={(t) => setDescription(t)}
          />
        </View>
        <AppButton
          onPress={handleFormSubmit}
          title={"تقييم"}
          disabled={!focus}
          style={styles.buttonSubmit}
        />
        <View style={{marginVertical:10}}>

<Pdf item={route?.params?.item} chatContainerStyles={{width:160,borderRadius:50,height:55,alignSelf:'center'}}>
  <View style={{display:'flex',flexDirection:'row',gap:15,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>

  <AppText text={"تحميل الفاتورة"} style={{color:Colors.whiteColor,fontSize:RFPercentage(2.2)}}/>
{/* <AntDesign name="upload" size={20} color={Colors.whiteColor} /> */}
{/* <AntDesign name="upload" size={24} color="black" /> */}
  </View>
  </Pdf>
</View>
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
    marginVertical: 5,
    fontSize:RFPercentage(1.9)
  },
  review: {
    color: "black",
    paddingHorizontal: 20,
    marginVertical: 5,
    fontSize: RFPercentage(2),
  },
  buttonSubmit: {
    width: width * 0.4,
    marginVertical: 10,
    alignSelf: "center",
  },
  Image: {
    height: 120,
    width: 120,
    borderRadius: 120 / 2,
    alignSelf: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  emojiImage: {
    fontSize: 35,
    color: Colors.grayColor,
  },
  emojiExplain: {
    fontSize: RFPercentage(1.8),
    textAlign: "center",
  },
  Selectedemoji: {
    display: "flex",
    color: Colors.primaryColor,
    flexDirection: "column",
    transform: [{ scale: 1.2 }],
    alignItems: "center",
    justifyContent: "center",
    // gap:10
  },
  SelectEmojiImage: {
    fontSize: 55,
    color: Colors.primaryColor,
    height: "auto",
  },
  SelectedEmojiExplain: {
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
  },
  input: {
    borderWidth: 1,
    width: width * 0.9,
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    fontFamily: mainFont.light,
    borderColor: Colors.blackColor,
    writingDirection: "rtl",
    fontSize: 15,
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
