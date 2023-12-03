import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import ItemDetails from "../../component/ItemDetails";
import OtherServicesList from "../../component/Home/OtherServicesList";
import ReserveButton from "../../component/ReverveButton";
import UsersReviews from "../../component/Home/UsersReview";
import {useDispatch} from 'react-redux'
import { ITEM_ORDER_DETAILS, ORDER_SELECT_LOCATION } from "../../navigation/routes";
import { addServiceToCart, clearCart } from "../../store/features/CartSlice";
export default function ItemScreen({ route,navigation }) {


  const { item } = route.params;
  const dispatch = useDispatch()
  const ReserveButtonHandler = ()=>{
    navigation.navigate(ITEM_ORDER_DETAILS)
  }
  useEffect(()=>{
    return ()=>{
      dispatch(clearCart())
    }
  })
  return (
    <View style={styles.container}>
      <ScrollView>
        <ItemDetails item={item} />
        <OtherServicesList />
        <UsersReviews/>
      </ScrollView>
     <ReserveButton price={item?.attributes?.Price} onPress={()=>{
      dispatch(addServiceToCart({
        item:item?.id,
        price:item?.attributes?.Price
      }))
      navigation.navigate(ORDER_SELECT_LOCATION)
     }}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  
});
