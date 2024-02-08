import {
    View,
    Text,
    FlatList,
    Dimensions,
    Image,
    Button,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import useCategories from "../../../utils/categories";
import { ScrollView } from "react-native-virtualized-view";
import LoadingScreen from "../loading/LoadingScreen";
import { StyleSheet } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { color } from "react-native-reanimated";
import {
    addServiceToCart,
    removeServiceFromCart,
    updateServiceQuantity,
    clearCart,
} from "../../store/features/CartServiceSlice";
import ReserveButton from "../../component/ReverveButton";
import { CURRENCY, ITEM_ORDER_DETAILS, ORDER_SELECT_LOCATION, Offer_route_name } from "../../navigation/routes";
const { width, height } = Dimensions.get("screen");
const fontSize = RFPercentage(1.7); // Base font size

export default function CartItem({ item }) {
    const dispatch = useDispatch()
    const cartServicesItem = useSelector((state) => state?.cartService?.services)
    const IsSelected = cartServicesItem?.filter((service)=>service?.id === item?.id);
    const handlePressAddButton = (id)=>{

        dispatch(addServiceToCart({ id, qty: 1 , price:item?.attributes?.Price,name:item.attributes?.name}))
    }
    const handlePressRemoveButton = (id) => {
        dispatch(removeServiceFromCart({ id }));
    };
    const handlePressUpdateQuantityButton = (id, newQuantity) => {
        console.log("is selected",cartServicesItem)
        dispatch(updateServiceQuantity({ id, quantity: newQuantity }));
    };
    const handleClearCart = () => {
        // Dispatch the action to clear the cart
        dispatch(clearCart());
    };


    return (
        <View style={styles.itemContainer}>
            <View style={styles.itemContainer2}>
                <AppText
                    centered={false}
                    text={item.attributes?.name}
                    style={[styles.name, { fontSize: RFPercentage(2), paddingRight: 10 }]}
                />
                <AppText
                    centered={false}
                    text={`${item.attributes?.Price} ` + CURRENCY}
                    style={[styles.price, { fontSize: RFPercentage(2), paddingRight: 10 }]}
                />
            </View>
            <View style={styles.buttonsContainer}>
                {
                    (IsSelected[0]?.qty > 0)? 
                    <View style={styles.buttonsContainer}>
                    <AppButton title={'+'} style={styles.button1} onPress={()=>handlePressAddButton(item?.id)}/> 
                    <AppText text={IsSelected[0]?.qty} style={{marginTop:height*0.03,color:Colors.blackColor,fontSize:RFPercentage(2.4)}}/> 
                    <AppButton title={'-'}  style={styles.button1} onPress={()=>handlePressUpdateQuantityButton(item?.id,IsSelected[0]?.qty-1)}/> 
                    </View>  :     
                <AppButton title={"Add"} 
                textStyle={styles.buttonText} 
                onPress={()=>{
                    handlePressAddButton(item?.id)
                }} />
                    }
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        backgroundColor: Colors.whiteColor,
    },
    button1:{
    paddingVertical:height*0.004,
    height:width*0.098,
    width:width*0.098,
    paddingHorizontal:width*0.035,
    borderRadius:width*0.098*0.5
    },
    header: {
        textAlign: "center",
    },
    name: {
        fontSize: RFPercentage(1.7),
        color: Colors.blackColor,
    },
    itemContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "auto",
        width: width * 0.95,
        padding: 10,
        // borderWidth: 0.7,
        borderRadius: 10,
        marginHorizontal: 8,
        backgroundColor: Colors.whiteColor,
        shadowColor: "#000",
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 4,
        gap: 10,
    },
    price: {
        fontSize: RFPercentage(2),
        color: Colors.primaryColor,
        marginTop: 5,
        fontWeight: 700,
    },
    title: {
        fontSize: RFPercentage(2.2),
        color: Colors.primaryColor,
    },
    itemContainer2: {
        display: "flex",
        flex: 2,
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    buttonsContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor:'red'
    },
    increaseButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 40,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        borderRadius: 5.0,
        marginTop: 4.0,
        borderRadius: 40,
        backgroundColor: Colors.primaryColor,
    },
    buttonText: {
        color: Colors.whiteColor,
        fontSize: RFPercentage(1.7)
    },
    noItemContainer: {
        height: height * 1,
        marginTop: 10,
        paddingBottom: height * 0.3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor
    }
});
