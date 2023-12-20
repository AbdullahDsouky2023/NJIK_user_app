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
  import useOrders, { PayOrder, cancleOrder, requestPayment } from "../../../utils/orders";
  import { useDispatch } from "react-redux";
  import { setOrders } from "../../store/features/ordersSlice";
  import LoadingModal from "../../component/Loading";
  import { COMPLAIN_CREATE_SCREEN, HOME, ORDERS } from "../../navigation/routes";
  import PriceTextComponent from "../../component/PriceTextComponent";
  import { Image } from "react-native";
  import { ScrollView } from "react-native";
  import LoadingScreen from "../loading/LoadingScreen";
  import AppModal from "../../component/AppModal";
  import { CommonActions } from "@react-navigation/native";
import ArrowBack from "../../component/ArrowBack";
  
  const { width } = Dimensions.get("screen");
  export default function ComplainOrderDetails({ navigation, route }) {
    const { item } = route?.params;
    const [isLoading, setIsLoading] = useState(false);
    const { data:orders,isLoading:loading,isError } = useOrders()
    
   
  const dispatch = useDispatch()
  const [isModalVisible, setModalVisible] = useState(false);
  
 
  console.log("complained ite",item?.attributes.complain.data)
    if(isLoading) return <LoadingScreen/>
    return (
      <ScrollView>
        <ArrowBack subPage={true} />
        <ScrollView style={styles.container}>
          <View>
            <AppText
              centered={false}
              text={item?.attributes?.service?.data?.attributes?.name}
              style={styles.name}
            />
          </View>
         
          
         
          
          <View style={styles.descriptionContainer}>
            <AppText centered={false} text={"    الشكوي "} style={styles.title} />
            <AppText
              centered={false}
              text={
                item?.attributes?.complain.data?.attributes?.message
              }
              style={styles.price}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <AppText centered={false} text={"   حاله الطلب "} style={styles.title} />
            <AppText
              centered={false}
              text={
                item?.attributes?.complain?.data.attributes?.status === "pending"?
                "قيد الانتظار":item?.attributes?.complain?.data.attributes?.status === "resolved"? "تم معالجه الطلب":item?.attributes?.complain?.data.attributes?.status === "reject"?"تم رفض الطلب":null
               }
              style={styles.price}
            />
          </View>
         
          {
            !item?.attributes.complain.data &&
            <AppButton title={"Report Complain"} onPress={()=>navigation.navigate(COMPLAIN_CREATE_SCREEN,{item:route?.params?.item})}/>
            // <AppButton title={"Track Complain"} onPress={()=>navigation.navigate(COMPLAIN_CREATE_SCREEN,{item:route?.params?.item})}/>
          }
         
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
      shadowColor: '#000',
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 4,    gap: 10,
    },
    price: {
      fontSize: 14,
      color: Colors.blackColor,
      marginTop: 5,
      paddingHorizontal:10
    },
    title: {
      fontSize: 19,
      color: Colors.primaryColor,
    },
  });
  