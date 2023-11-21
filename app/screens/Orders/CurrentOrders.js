import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";
import CurrentOrderCard from "../../component/orders/CurrentOrderCard";
import { FlatList } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import useOrders from "../../../utils/orders";
import LoadingScreen from "../loading/LoadingScreen";
const { width } = Dimensions.get("screen");
import { RefreshControl  } from 'react-native';
import { ORDERS_DETAILS } from "../../navigation/routes";
import { setcurrentChatChannel } from "../../store/features/ordersSlice";


export default function CurrentOrders({navigation}) {
  
  const user = useSelector((state) => state?.user?.user);
  const ordersRedux = useSelector((state) => state?.orders?.orders);
  const [orders,setOrders] = useState([])
  const {data,isLoading} = useOrders()
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch()
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
const [currentOrders,setCurrentData]=useState([])
const fetchData=()=>{
  const currentOrders = data?.data?.filter(
    (order) => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.PaymentStatus !== "payed"
    );
    setCurrentData(currentOrders)
  setRefreshing(false)
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
      renderItem={({item})=>{
        
        return <CurrentOrderCard item={item} onPress={() => {
          navigation.navigate(ORDERS_DETAILS, { item })
          dispatch(setcurrentChatChannel(item?.attributes?.chat_channel_id))

        }} />
      }}
      keyExtractor={(item)=>item?.id}
      />
      </ScrollView>
    }
        </ScrollView>
  );
}

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
  height:"100%",
  // marginVertical:50,
  width:width,
  backgroundColor:Colors.whiteColor
 }

});
