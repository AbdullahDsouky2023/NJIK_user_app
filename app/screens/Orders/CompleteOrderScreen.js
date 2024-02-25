import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState,memo } from "react";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";
import CurrentOrderCard from "../../component/orders/CurrentOrderCard";
import { FlatList } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import useOrders, { useAllOrders } from "../../../utils/orders";
import LoadingScreen from "../loading/LoadingScreen";
const { width } = Dimensions.get("screen");
import { RefreshControl  } from 'react-native';
import { COMPLETE_ORDER_DETAILS, ORDERS_DETAILS } from "../../navigation/routes";
import CompleteOrderCard from "../../component/orders/CompleteOrderCard";


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
const fetchData=()=>{
  const currentOrders = data?.filter(
    (order) => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.PaymentStatus === "payed"
     && order?.attributes?.status === "finished");
    setCurrentData(currentOrders)
  setRefreshing(false)
  refetch()
}
  useEffect(()=>{
    fetchData()
    },[data])

    if(isLoading) return <LoadingScreen/>
    
  return (
    <ScrollView 
    style={{
      backgroundColor:"white",
      height:"100%"
    }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }>
    {currentOrders?.length === 0 ? 
      <View style={styles.noItemContainer}>

      <AppText text={"لا يوجد طلبات لعرضها"} style={{marginTop:"50%"}}/> 
      </View>
      :
      <ScrollView style={styles.container}>
      <FlatList
      
      data={currentOrders}
      style={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({item})=>{
        return <CompleteOrderCard item={item} onPress={() => navigation.navigate(COMPLETE_ORDER_DETAILS, { item })} />
      }}
      keyExtractor={(item)=>item?.id}
      />
      </ScrollView>
    }
        </ScrollView>
  );
}
export default memo(CompleteOrderScreen)
const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.whiteColor,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
  },
 listContainer:{
  // display:"flex",
  gap:1,
  marginVertical:10 
 },
 noItemContainer:{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  height:"100%",
  // marginVertical:50,
  width:width,
  backgroundColor:Colors.whiteColor
 }

});
