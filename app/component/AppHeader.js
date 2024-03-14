import React, { useEffect } from "react";
import { Image, TouchableWithoutFeedback, View , Dimensions} from "react-native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constant/styles";
import { MaterialIcons} from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import AppText from "./AppText";
import { color } from "react-native-reanimated";
const { width } = Dimensions.get("screen")
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserLocation from "./Home/UserLocation";
import { CURRENCY } from "../navigation/routes";
import { T } from "ramda";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function AppHeader({ subPage = false}) {
    const navigation = useNavigation()
 const { t } = useTranslation()
  const user = useSelector((state) => state?.user?.userData);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/icon.png")} style={{
        width:70,
        height:70
      }} height={50} width={50} />
      {subPage && (
        <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>

          <MaterialIcons
            name="arrow-forward-ios"
            size={24}
            color={Colors.grayColor}
            />
            </TouchableWithoutFeedback>
          ) }
      {!subPage && (
        <TouchableWithoutFeedback >

          <View style={styles.WalletContainer}>
            <AppText style={{fontSize:15,color:'white'}} text={`${user?.wallet_amount} ${t(CURRENCY)}`}/>
          </View>
            </TouchableWithoutFeedback>
          ) }
          <UserLocation/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row-reverse",
    backgroundColor: Colors.piege,
  },
  WalletContainer:{
    backgroundColor:Colors.primaryColor,
    paddingHorizontal:19,
    paddingVertical:3,
    borderRadius:12
    
  }
});
