import {
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AppButton from "../../component/AppButton";
  import AppText from "../../component/AppText";
  import { Colors } from "../../constant/styles";
  import AppHeader from "../../component/AppHeader";
  import useOrders, { cancleOrder, postOrder } from "../../../utils/orders";
  import { useDispatch, useSelector } from "react-redux";
  import { clearCurrentOrder, setOrders } from "../../store/features/ordersSlice";
  import LoadingModal from "../../component/Loading";
  import { CURRENCY, HOME, ORDERS, ORDER_SUCCESS_SCREEN } from "../../navigation/routes";
  import PriceTextComponent from "../../component/PriceTextComponent";
  import { Image } from "react-native";
  import { ScrollView } from "react-native-virtualized-view";
  import LoadingScreen from "../loading/LoadingScreen";
  import AppModal from "../../component/AppModal";
  import { CommonActions } from "@react-navigation/native";
import useRegions from "../../../utils/region";
import useNotifications from "../../../utils/notifications";
import { clearCart } from "../../store/features/CartSlice";
import useServices from "../../../utils/services";
import ArrowBack from "../../component/ArrowBack";
import usePackages from "../../../utils/packages";
import * as Updates from "expo-updates";
import { updateUserData } from "../../../utils/user";

  const { width } = Dimensions.get("screen");
  export default function OrderComfirmDetailsScreen({ navigation, route }) {
    // const { item } = route?.params;
    const [isLoading, setIsLoading] = useState(false);
    const { data:orders,isLoading:loading,isError } = useOrders()
    const currentOrderData = useSelector((state) => state?.orders?.currentOrderData);
    const {data} = useRegions()
    const region = data?.data?.filter((item)=>item?.id === currentOrderData.region)[0]?.attributes?.name
    const dispatch = useDispatch()
  const [isModalVisible, setModalVisible] = useState(false);
  const { item ,image} = route?.params
  const totalPrice = useSelector((state)=>state.cart.totalPrice)
  const {data:services} = useServices()
  const {data:packages} = usePackages()
  const [currentSelectedServices,setCurrentSelectedServices] = useState([])
  const [currentSelectedPackages,setCurrentSelectedPackages] = useState([])
  const userData = useSelector((state) => state?.user?.userData);
  // console.log(currentOrderData)
  const handleComfirmOrder = async () => {
    try {
      setIsLoading(true)
      if(currentOrderData.packages.connect.length ===0 && currentOrderData.services.connect.length ===0 ){
        await Updates.reloadAsync()
      }
        const data = await postOrder(currentOrderData);
        if(currentOrderData?.coupons?.connect[0]?.id){

          await updateUserData(userData?.id,{
            coupons:{
              connect: [{ id: currentOrderData?.coupons?.connect[0]?.id }],
            },
          });
        }
      // console.log("updaing user coupons ",userData?.id,...currentOrderData.coupons )
        if (data) {
          dispatch(clearCurrentOrder());
          // console.log("order data after subit ",data)
          dispatch(clearCart());
    
          if (totalPrice > 0) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Payment" ,params:{orderId:data}}],
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
      setModalVisible(false)
      setIsLoading(false)

    }
  };
  useEffect(()=>{
    const data =currentOrderData?.services?.connect.map((item)=>{

      const service = services.data.filter((service)=>service?.id ===item?.id)
      return service[0]
    }
    )
    setCurrentSelectedServices(data)
// console.log("the data ",data)
  },[])
  useEffect(()=>{
    const data =currentOrderData?.packages?.connect.map((item)=>{

      const service = packages.data.filter((Packageitem)=>Packageitem?.id ===item?.id)
      return service[0]
    }
    )
    setCurrentSelectedPackages(data)
// console.log("the data ",data)
  },[])
  
    if(isLoading) return <LoadingScreen/>
    return (
      <>
        <ArrowBack subPage={true} />
       <ScrollView style={styles.container}>
       {
        currentSelectedServices?.length>0 &&
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
                    style={[styles.name, { fontSize: 14, paddingRight: 10 }]}
                    />
                    {
                      item.attributes?.Price > 0 &&
                  <AppText
                    text={`${item.attributes?.Price} `+CURRENCY}
                    style={{
                      backgroundColor: Colors.primaryColor,
                      fontSize: 14,
                      padding: 6,
                      borderRadius: 40,
                      color: Colors.whiteColor,
                    }}
                  />
                    }
                </View>
              );
            }}
            />
        </View>
      }
      {currentSelectedPackages.length >0 &&
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
                    style={[styles.name, { fontSize: 14, paddingRight: 10 }]}
                  />
                  <AppText
                    text={`${item.attributes?.price} `+CURRENCY}
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
          }
          <View>
            {/* <AppText
              centered={false}
              text={item?.attributes?.service?.data?.attributes?.name}
              style={styles.name}
            /> */}
          </View>
          <View style={styles.itemContainer}>
            <AppText centered={false} text={" السعر"} style={styles.title} />
            <PriceTextComponent
            style={{color:Colors.blackColor,fontSize:14,marginTop:4}}
            price={totalPrice}
            />
          </View>
          <View style={styles.itemContainer}>
            <AppText centered={false} text={" العنوان"} style={styles.title} />
            <AppText
              centered={false}
              text={currentOrderData?.googleMapLocation?.readable || "not provided"}
              style={styles.price}
            />
          </View>
          {/* <View style={styles.itemContainer}>
            <AppText centered={false} text={" المنطقه"} style={styles.title} />
            <AppText
              centered={false}
              text={region}
              style={styles.price}
              />
            </View> */}
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
            uri:image}} style={{
               height:120,
               width:200,
               borderRadius:10
             }}/> 

        </ScrollView> 
        <View style={styles.ButtonContainer}>

          <AppButton
            title={"تأكيد الطلب"}
            style={{marginBottom:19,paddingVertical:15,paddingHorizontal:50}}
            onPress={() => setModalVisible(true)}
            />
            </View>
        <AppModal isModalVisible={isModalVisible} 
        message={"تأكيد الطلب"}
        setModalVisible={setModalVisible} onPress={()=> handleComfirmOrder()}/>
        <LoadingModal visible={isLoading} />
      </>
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
    ButtonContainer :{
      display:'flex',
      alignItems:'center'
    }
  });
  