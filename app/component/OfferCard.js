import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, {memo} from "react";
import { Colors } from "../constant/styles";
import AppText from "./AppText";
import { Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
const { width, height } = Dimensions.get("screen");
import { CURRENCY } from "../navigation/routes";
import { useTranslation } from "react-i18next";

 function OfferCard({ service, price, image,onPress,content }) {
  const { t }= useTranslation()
  return (
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={styles.itemCardContainer}>

      <View>
        <AppText
          text={service}
          style={{
            color: Colors.blackColor,
            fontSize: 17,
            maxWidth: width * 0.5,
            // fontWeight:900

          }}
          centered={false}
        />
        <AppText
          text={content}
          style={{
            color: Colors.grayColor,
            fontSize: 14,
            maxWidth: width * 0.5,
            fontSize:12,
            marginVertical:5
          }}
          centered={false}
        />
      <AppText
          text={`${price} `+t(CURRENCY)}
          style={{
            color: Colors.primaryColor,
            maxWidth: width * 0.5,
            fontSize:16,
            // fontWeight:900,
            marginTop:10
          }}
          centered={false}
          />
      
      </View>
    
      <Image
        style={styles.cardImage}
        source={{
          uri: image,
        }}
      />
</View>
    </TouchableWithoutFeedback>
  );
}
export default memo(OfferCard)
const styles = StyleSheet.create({
  itemCardContainer: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    height:"auto",
    alignItems:'center',
    justifyContent:'space-between',
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius: 10,
    borderColor: Colors.grayColor,
    gap: 20,
    // elevation:1,
    overflow: "hidden",
    // backgroundColor:Colors.piege,
  },
  cardImage: {
    height:height*0.1,
        minHeight: 100,
    width: width * 0.17,
    resizeMode:"contain"
  },
});
