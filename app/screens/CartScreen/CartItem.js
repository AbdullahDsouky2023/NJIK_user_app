import {
    View,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { StyleSheet } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import { useDispatch, useSelector } from "react-redux";
import {
    addServiceToCart,
    updateServiceQuantity,
} from "../../store/features/CartServiceSlice";
import { CURRENCY } from "../../navigation/routes";
import { useTranslation } from "react-i18next";
const { width, height } = Dimensions.get("screen");

 function CartItem({ item }) {
    const dispatch = useDispatch()
    const cartServicesItem = useSelector((state) => state?.cartService?.services)
    const IsSelected = cartServicesItem?.filter((service)=>service?.id === item?.id);



    return (
        <View style={styles.itemContainer}>
               <ItemInfoComponent price={item?.attributes?.Price} name={item?.attributes?.name}/> 
            <QuantiyControlButton item={item} 
            IsSelected={IsSelected}
            />

        </View>
    )
}
export default memo(CartItem)

const ItemInfoComponent = memo(({name,price})=>{
    const { t} = useTranslation()
    return (
        <View style={styles.itemContainer2}>
        <AppText
            centered={false}
            text={name}
            style={[styles.name, { fontSize: RFPercentage(2), paddingRight: 10 }]}
        />
        <AppText
            centered={false}
            text={`${price} ` + t(CURRENCY)}
            style={[styles.price, { fontSize: RFPercentage(2), paddingRight: 10 }]}
        />
    </View>
    )
})
const QuantiyControlButton = memo(({IsSelected,item})=>{
    const dispatch = useDispatch()
    const cartServicesItem = useSelector((state) => state?.cartService?.services)
    const handlePressAddButton = useCallback((id)=>{

        dispatch(addServiceToCart({ id, qty: 1 , price:item?.attributes?.Price,name:item.attributes?.name}))
    },[])

    const handlePressUpdateQuantityButton = useCallback((id, newQuantity) => {
        dispatch(updateServiceQuantity({ id, quantity: newQuantity }));
    },[])
    return (
        <View style={styles.buttonsContainer}>
                {
                    (IsSelected[0]?.qty > 0)? 
                    <View style={styles.buttonsContainer2} >
                        <TouchableOpacity style={styles.button1} onPress={()=>handlePressAddButton(item?.id)}>
                            <AppText text={"+"} style={{    color:Colors.whiteColor,fontSize:RFPercentage(3.1)}}/>
                        </TouchableOpacity>
                  
                    <AppText text={IsSelected[0]?.qty} style={{color:Colors.whiteColor,fontSize:RFPercentage(2.4)}}/> 
                  
                    <TouchableOpacity style={styles.button1}      
                                   onPress={()=>handlePressUpdateQuantityButton(item?.id,IsSelected[0]?.qty-1)}
>
                            <AppText text={"-"} style={{    color:Colors.whiteColor,fontSize:RFPercentage(3.1)}}/>
                        </TouchableOpacity>
                    </View>  :     
                <AppButton title={"Add"} 
                textStyle={styles.buttonText} 
                onPress={()=>{
                    handlePressAddButton(item?.id)
                }} />
                    }
            </View>
    )
})
const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        backgroundColor: Colors.whiteColor,
    },
    button1:{
    width:width*0.098,
    borderRadius:width*0.098*0.5,
    backgroundColor:Colors.primaryColor,
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
    buttonsContainer2: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:Colors.primaryColor,
        // height:height*0.07,
        height:height*0.05,
        gap:7,
        width:width*0.3,
        // paddingHorizontal:height*0.1,
        borderRadius:width*0.9,
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
