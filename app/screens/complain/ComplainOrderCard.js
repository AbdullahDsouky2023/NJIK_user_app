import {
    Dimensions,
    StyleSheet,
    Text,
    Image,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
  } from "react-native";
  import { Entypo } from '@expo/vector-icons'; 
  
  import React, { useEffect } from "react";
  import { FontAwesome } from "@expo/vector-icons";
  import { FontAwesome5 } from "@expo/vector-icons";
  import { Colors } from "../../constant/styles";
  import AppText from "../../component/AppText";
  import { useNavigation } from "@react-navigation/native";
  import { ORDERS_DETAILS } from "../../navigation/routes";
  import PriceTextComponent from "../../component/PriceTextComponent";
  const { width, height } = Dimensions.get("screen");
  import { Ionicons } from "@expo/vector-icons";
  import { useDispatch} from  'react-redux'
  import { setcurrentChatChannel } from "../../store/features/ordersSlice";
import LoadingScreen from "../loading/LoadingScreen";
  export default function ComplainOrderCard({ item, onPress }) {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.orderCardContainer}>
               <View style={styles.date}>
          <AppText
              text={
                "Complain Id: "
              }
              centered={false}
              style={styles.Status}
              />
            <AppText
              text={item?.id}
              centered={false}
              style={[styles.Status,{
                color:Colors.primaryColor
              }]}
            />
          </View>
          <View style={styles.date}>
          <AppText
              text={
                "Complain : "
              }
              centered={false}
              style={styles.Status}
              />
            <AppText
              text={item?.attributes?.complain?.data?.attributes?.message}
              centered={false}
              style={[styles.Status,{
                color:Colors.primaryColor,
                maxWidth:width*0.62
              }]}
            />
          </View>
          <View  style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between'
          }}>
            <View style={styles.date}>
  
            {/* <Ionicons name="person-outline" size={24} color="black" /> */}
            <AppText
              text={
                "الحاله : "
              }
              centered={false}
              style={styles.Status}
              />
            <AppText
              text={
               item?.attributes?.complain?.data?.attributes?.status === "pending"?
               "قيد المراجعه":item?.attributes?.complain?.data?.attributes?.status === "replied"?
               "تم الرد" :item?.attributes?.complain?.data?.attributes?.status === "resolved"?
                "تم معالجه الطلب بنجاح":item?.attributes?.complain?.data?.attributes?.status === "rejected"?"تم رفض الطلب":null
              }
              centered={false}
              style={[styles.Status,{
                color:Colors.primaryColor
              }]}
              />
              </View>
            <View >
  
          </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      height: "auto",
      backgroundColor: Colors.whiteColor,
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
      paddingVertical: 4,
      gap: 10,
    },
    orderCardContainer: {
      paddingVertical: 10,
      width: width * 0.88,
      paddingHorizontal: 20,
      // height: height*0.16,
      // maxHeight: height * 0.16,
      height: "auto",
      // minHeight: height * 0.14,
      marginTop: 5,
      flex: 1,
      gap: 5,
      backgroundColor: Colors.whiteColor,
      // shadowColor: "#000",
      // shadowOffset: {
      //   width: 0,
      //   height: 1,
      // },
      // shadowOpacity: 0.2,
      // shadowRadius: 1.41,
      elevation: 2,
      borderColor: Colors.grayColor,
      marginBottom:5,
      borderWidth: 0.4,
      borderRadius: 8,
    },
    name: {
      color: Colors.blackColor,
      fontSize: 15,
    },
    title: {
      color: Colors.blackColor,
      fontSize: 13,
    },
    Status: {
      color: Colors.blackColor,
      fontSize: 14,
    },
    price: {
      color: Colors.primaryColor,
      fontSize: 14,
    },
    date: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      justifyContent: "flex-start",
      flexDirection: "row",
    },
    chatContainer:{paddingHorizontal:19,
      backgroundColor:Colors.primaryColor,
      width:"auto",
    height:40,
    borderRadius:20,
    // marginHorizontal:width*0.65,
    left:0,
    display:"flex",
    alignItems:'center',
    justifyContent:'center',}
  });
  