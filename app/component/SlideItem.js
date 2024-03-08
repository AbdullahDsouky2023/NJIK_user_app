import React, { memo, useCallback } from "react";
import { View, TouchableWithoutFeedback, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ITEM_DETAILS } from "../navigation/routes";
import { Image } from "react-native-expo-image-cache";
import { Colors } from "../constant/styles";
const { height , width }= Dimensions.get('screen')
const SlideItem = ({ item }) => {
  const navigation = useNavigation();
  const uri = item?.attributes?.image?.data?.attributes?.url;
  const handlePress = useCallback(() => {
    navigation.navigate(ITEM_DETAILS, { item: item?.attributes?.service?.data });
  }, [item, navigation]);
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={{
          width: "100%",
          height: height * 0.2,
          backgroundColor: Colors.whiteColor,
          marginTop: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            width: "95%",
            minHeight: height * 0.19,
            maxHeight: height * 0.2,
            borderRadius: 10,
            backgroundColor: Colors.whiteColor,
          }}
          {...{ uri }}
          resizeMode="stretch"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(SlideItem);
