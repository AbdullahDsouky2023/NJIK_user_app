import React, { useEffect, useState, useCallback, memo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ItemDetails from "../../component/ItemDetails";
import OtherServicesList from "../../component/Home/OtherServicesList";
import ReserveButton from "../../component/ReverveButton";
import UsersReviews from "../../component/Home/UsersReview";
import { useDispatch } from 'react-redux';
import { ITEM_ORDER_DETAILS } from "../../navigation/routes";
import { addServiceToCart, clearCart } from "../../store/features/CartSlice";
import { useFocusEffect } from "@react-navigation/native";
import { setCurrentOrderProperties } from "../../store/features/ordersSlice";
 function ItemScreen({ route, navigation }) {
 const { item } = route.params;
 const dispatch = useDispatch();
 const [buttonDisabled, setButtonDisabled] = useState(false);

 const reserveButtonHandler = useCallback(() => {
    navigation.navigate(ITEM_ORDER_DETAILS);
 }, [navigation]);

 useFocusEffect(
    useCallback(() => {
      setButtonDisabled(false); // Enable the button when the screen gains focus
    }, [])
 );

 const handleReserve = useCallback(() => {
    dispatch(addServiceToCart({
      item: item?.id,
      price: item?.attributes?.Price,
    }));
    dispatch(setCurrentOrderProperties({ category_id: Number(item?.attributes?.category?.data?.id) }));
    navigation.navigate(ITEM_ORDER_DETAILS, { item: route?.params?.item });
    setButtonDisabled(true);
 }, [dispatch, item, navigation, route]);

 return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ItemDetails item={item} />
        <OtherServicesList />
        <UsersReviews />
      </ScrollView>
      <ReserveButton
        disabled={buttonDisabled}
        price={item?.attributes?.Price}
        onPress={handleReserve}
        accessibilityLabel="Reserve Item"
      />
    </View>
 );
}

export default memo(ItemScreen)
const styles = StyleSheet.create({
 container: {
    paddingBottom: 100,
 },
});
