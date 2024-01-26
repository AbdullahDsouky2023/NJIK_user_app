import { View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { ITEM_DETAILS } from "../navigation/routes";
import { Image } from "react-native-expo-image-cache";
import { Colors } from "../constant/styles";
const { width , height } = Dimensions.get("screen");
export default function SlideItem({ item }) {
  const navigation = useNavigation();
  const uri = item?.attributes?.image?.data?.attributes?.url 
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(ITEM_DETAILS, { item: item?.attributes?.service?.data });
      }}
      style={{ width: width, height: 180.0 ,borderRadius:10,
        display:'flex',alignItems:'center',justifyContent:'center' }}
    >
      <View 
        style={{ width:  width*1, height:  height*0.2, backgroundColor:Colors.whiteColor,marginTop:5,        display:'flex',alignItems:'center',justifyContent:'center' }}
      >

      <Image
        style={{ width:  width*0.95, minHeight: height*0.19, maxHeight:height*0.2,borderRadius:10,backgroundColor:Colors.whiteColor}}
      {...{ uri}}
      resizeMode="stretch"
      />
      </View>
    </TouchableWithoutFeedback>
  );
}
