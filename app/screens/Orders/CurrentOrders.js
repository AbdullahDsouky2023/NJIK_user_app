import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState,useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-virtualized-view";
import CurrentOrderCard from "../../component/orders/CurrentOrderCard";
import { FlatList } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import useOrders, { useAllOrders } from "../../../utils/orders";
import LoadingScreen from "../loading/LoadingScreen";
import { CommonActions } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
import { RefreshControl } from 'react-native';
import { ORDERS_DETAILS, REQUIRED_PAY_SCREEN } from "../../navigation/routes";
import { setcurrentChatChannel } from "../../store/features/ordersSlice";
import OrdersLoadingScreen from "../../component/LoadingComponents/OrdersLoadingSceen";
// import useNearProviders from "../../../utils/providers";


function CurrentOrders({ navigation }) {

  const user = useSelector((state) => state?.user?.user);
  const ordersRedux = useSelector((state) => state?.orders?.orders);
  const [orders, setOrders] = useState([])
  const { data, isLoading, refetch } = useOrders()
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch()
  const onRefresh = () => {
    setRefreshing(true)

    fetchData();
  };
  const [currentOrders, setCurrentData] = useState([])

  const fetchData = useCallback(
    () => {
      const currentOrders = data?.data?.filter(
        (order) => order?.attributes?.phoneNumber === user?.phoneNumber && order?.attributes?.status !== "finished" 
      );
      const CurentRequiredOrdersForPayment = currentOrders?.filter((order) => order?.attributes?.status === "payment_required")
      if (CurentRequiredOrdersForPayment?.length > 0) {
        return (
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{
                name: REQUIRED_PAY_SCREEN,
                params: {
                  item: CurentRequiredOrdersForPayment[0]
                }
              }],
            })))
  
      }
      setCurrentData(currentOrders)
      refetch()
  
      setRefreshing(false)
    },
    [currentOrders,refetch],
  )
  
  useEffect(() => {
    fetchData()
  }, [data])
  const renderItem = ({ item }) => (
    <CurrentOrderCard item={item} onPress={() => {
      navigation.navigate(ORDERS_DETAILS, { item });
      dispatch(setcurrentChatChannel(item?.attributes?.chat_channel_id));
    }} />
 );
  if (isLoading) return <OrdersLoadingScreen />

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        height: "100%"
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {currentOrders?.length === 0 ?
        <View style={styles.noItemContainer}>

          <AppText text={"There are no orders."} style={{ marginTop: "50%" }} />
        </View>
        :
        <ScrollView style={styles.container}>
          <FlatList
            data={currentOrders}
            style={styles.listContainer}
            showsVerticalScrollIndicator={false}
            windowSize={10}
            initialNumToRender={10}
            renderItem={renderItem}
            keyExtractor={(item) => item?.id}
          />
        </ScrollView>
      }
    </ScrollView>
  );
}
export default memo(CurrentOrders)
const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.whiteColor,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  listContainer: {
    gap: 1,
    marginVertical: 10
  },
  noItemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    width: width,
    backgroundColor: Colors.whiteColor
  }

});
