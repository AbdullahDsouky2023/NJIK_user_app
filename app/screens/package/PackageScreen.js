import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import ItemDetails from "../../component/ItemDetails";
import OtherServicesList from "../../component/Home/OtherServicesList";
import ReserveButton from "../../component/ReverveButton";
import UsersReviews from "../../component/Home/UsersReview";
import { useDispatch } from "react-redux";
import {
  ITEM_ORDER_DETAILS,
  ORDER_SELECT_LOCATION,
} from "../../navigation/routes";
import {
  addPackageToCart,
  addServiceToCart,
  clearCart,
} from "../../store/features/CartSlice";
import PackageDetails from "./PackageDetails";
import { useFocusEffect } from "@react-navigation/native";



export default function PackageScreen({ route, navigation }) {
  
  const { item } = route.params;
  const dispatch = useDispatch();
  const [buttonDisabled,setButtonDisabled]=useState(false)
  const ReserveButtonHandler = () => {
    navigation.navigate(ITEM_ORDER_DETAILS);
  };
  // useEffect(() => {
  //   return () => {
  //     dispatch(clearCart());
  //     console.log("clearing packag dea");
  //   };
  // });

  useFocusEffect(
    React.useCallback(() => {
 
        setButtonDisabled(false); // Enable the button when the screen gains focus
 
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <PackageDetails item={item} />
        <OtherServicesList />
        <UsersReviews />
      </ScrollView>
      <ReserveButton
        price={item?.attributes?.price}
        onPress={(e) => {
          dispatch(
            addPackageToCart({
              item: item?.id,
              price: item?.attributes?.price,
            })
            )
            navigation.navigate(ITEM_ORDER_DETAILS, {
              item: route?.params?.item,
            });
            setButtonDisabled(true)
        }}
        disabled={buttonDisabled}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
});
