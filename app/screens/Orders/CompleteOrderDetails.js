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
  import { HOME, ORDERS } from "../../navigation/routes";
  import PriceTextComponent from "../../component/PriceTextComponent";
  import { Image } from "react-native";
  import { ScrollView } from "react-native";
  import LoadingScreen from "../loading/LoadingScreen";
  import AppModal from "../../component/AppModal";
  import { CommonActions } from "@react-navigation/native";
  
  const { width } = Dimensions.get("screen");
  export default function CompleteOrderDetails({ navigation, route }) {
    const { item } = route?.params;
    const [isLoading, setIsLoading] = useState(false);
    const { data:orders,isLoading:loading,isError } = useOrders()
    
   
  const dispatch = useDispatch()
  const [isModalVisible, setModalVisible] = useState(false);
  
 
  
    if(isLoading) return <LoadingScreen/>
    return (
      <ScrollView>
        <AppHeader subPage={true} />
        <ScrollView style={styles.container}>
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
            style={{color:Colors.blackColor,fontSize:14,marginTop:4}}
            price={item?.attributes?.service?.data?.attributes?.name}
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
            <AppText centered={false} text={" الوقت"} style={styles.title} />
            <AppText
              centered={false}
              text={item?.attributes?.time}
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
           {
             ( item?.attributes?.images?.data ) ? 
             <Image 
            //  resizeMethod="contain"
             source={{
              uri:item?.attributes?.images?.data[0]?.attributes?.url}} style={{
               height:120,
               width:200,
               borderRadius:10
             }}/> : 
            <AppText
              centered={false}
              text={ "لا يوجد"}
              style={styles.price}
            />
           }
           
            
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
      fontSize: 17,
      color: Colors.blackColor,
      marginTop: 5,
    },
    title: {
      fontSize: 21,
      color: Colors.primaryColor,
    },
  });
  