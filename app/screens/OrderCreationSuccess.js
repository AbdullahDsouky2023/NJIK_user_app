import React, { useEffect, useState } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import AppButton from "../component/AppButton";
import useOrders from "../../utils/orders";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../store/features/ordersSlice";
import useNotifications from "../../utils/notifications";
// import useNearProviders from "../../utils/providers";
import UseLocation from "../../utils/useLocation";

export default function OrderCreationSuccess({navigation,route}) {
  const dispatch = useDispatch()
  const { data:orders } = useOrders()
  const user = useSelector((state)=>state?.user?.userData)
  const { location:userCurrentLocation} = UseLocation()
  const {sendPushNotification,token}=useNotifications()
  // const { data} = useNearProviders()

  // const CurrentCreatedOrder = orders?.data?.filter((order)=>order?.id=== route?.params?.order)
  const handleReturn = ()=> {
    dispatch(setOrders(orders?.data))
    navigation.navigate('App')
    sendPushNotification(token,"تم حجز الطلب بنجاح")

  }
  // console.log("the current order d dal ltdhe item ddcdurreara",data)
  
  
  return (
       <View style={{ backgroundColor: "white", alignItems: "center",height:"100%" ,display:'flex',
       alignItems:'center',justifyContent:'center'}}>
      <LottieView
        autoPlay
        loop={false}
        // ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/success.json')}
      />

        <AppButton title={"عودة"} onPress={()=>handleReturn()} />
      </View>
  )
}