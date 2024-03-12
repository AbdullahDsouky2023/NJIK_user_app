import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState,memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";
import CurrentOrderCard from "../../component/orders/CurrentOrderCard";
import { FlatList } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import useOrders, { useAllOrders } from "../../../utils/orders";
import LoadingScreen from "../loading/LoadingScreen";
import { RefreshControl  } from 'react-native';
import { COMPLETE_ORDER_DETAILS, ORDERS_DETAILS } from "../../navigation/routes";
import CompleteOrderCard from "../../component/orders/CompleteOrderCard";
import OrdersLoadingScreen from "../../component/LoadingComponents/OrdersLoadingSceen";
import { FlashList } from "@shopify/flash-list";

const { width , height } = Dimensions.get("screen");

 function CompleteOrderScreen({navigation}) {
  
  const user = useSelector((state) => state?.user?.user);
  const ordersRedux = useSelector((state) => state?.orders?.orders);
  const [orders,setOrders] = useState([])
  const {data,isLoading,refetch} = useAllOrders()
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
const [currentOrders,setCurrentData]=useState([])
const fetchData=useCallback(()=>{
  const currentOrders = data?.data?.filter(
    (order) => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.PaymentStatus === "payed"
     && order?.attributes?.status === "finished");
    setCurrentData(currentOrders)
  setRefreshing(false)
  refetch()
},[currentOrders,refetch])
  useEffect(()=>{
    fetchData()
    },[data])

    if(isLoading) return <OrdersLoadingScreen/>
    
  return (
    <ScrollView 
    style={styles.wrapperStyles}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }>
  
      
      <FlashList
       initialNumToRender={10}
      data={currentOrders}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({item})=>{
        return <CompleteOrderCard item={item} onPress={() => navigation.navigate(COMPLETE_ORDER_DETAILS, { item })} />
      }}
      estimatedItemSize={200}
      keyExtractor={(item)=>item?.id}
      ListEmptyComponent={()=>(
        <View style={styles.noItemContainer}>

        <AppText text={"لا يوجد طلبات لعرضها"} /> 
        </View>
      )}
      />
    
        </ScrollView>
  );
}
export default memo(CompleteOrderScreen)
const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.whiteColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 5,
    backgroundColor:Colors.whiteColor,
    paddingBottom:10

  },
 noItemContainer: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height:height*0.7,
  width: width*0.88,
  backgroundColor: Colors.whiteColor
},
wrapperStyles: {
  backgroundColor:Colors.whiteColor,
  height:200,
  display:'flex',
  width:width*1,
  paddingHorizontal:width*0.12*0.5,
  paddingTop:10,
  
  }

});
