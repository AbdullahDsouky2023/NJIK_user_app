import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState,memo } from "react";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";
import CurrentOrderCard from "../../component/orders/CurrentOrderCard";
import { FlatList } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import useOrders from "../../../utils/orders";
import LoadingScreen from "../loading/LoadingScreen";
import { RefreshControl  } from 'react-native';
import { COMPLAIN_ORDER_DETAILS, COMPLETE_ORDER_DETAILS, ORDERS_DETAILS } from "../../navigation/routes";
import CompleteOrderCard from "../../component/orders/CompleteOrderCard";
import ComplainOrderCard from "./ComplainOrderCard";
import ArrowBack from "../../component/ArrowBack";

const { height , width } = Dimensions.get('screen')
 function ComplainListScreen({navigation}) {
  
  const user = useSelector((state) => state?.user?.user);
  const ordersRedux = useSelector((state) => state?.orders?.orders);
  const [orders,setOrders] = useState([])
  const {data,isLoading,refetch} = useOrders()
  const [refreshing, setRefreshing] = useState(false);
  const [currentOrders,setCurrentData]=useState([])
console.log("currentOrders",currentOrders?.length)
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
const fetchData=()=>{
  const currentOrders = data?.data?.filter(
    (order) => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.PaymentStatus === "payed" && order?.attributes?.complain?.data !== null
    );
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
    <ArrowBack />
    {
      currentOrders?.length === 0  &&
      <View style={styles.noItemContainer}>
        <AppText text={"There is no complains yet!"} /> 

      </View>
    }
    { currentOrders?.length > 0 &&
      <ScrollView style={styles.container}>
      <FlatList
      data={currentOrders}
      style={styles.listContainer}
      renderItem={({item})=>{
        return <ComplainOrderCard item={item} 
        // onPress={() => navigation.navigate(COMPLAIN_ORDER_DETAILS, { item })} 
        />
      }}
      keyExtractor={(item)=>item?.id}
      />
      </ScrollView>
    }
        </ScrollView>
  );
}
export default memo(ComplainListScreen)
const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.whiteColor,
    width: width,
    paddingHorizontal: 20,
    // paddingTop:10,
    // paddingBottom:10,
    paddingVertical: -10,
  },
 listContainer:{
  display:"flex",
  gap:10
 },
 noItemContainer:{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  height:height*0.7
  ,
  // marginVertical:50,
  width:width,
  backgroundColor:Colors.whiteColor
 }

});
