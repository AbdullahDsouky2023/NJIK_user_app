import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Colors } from "../constant/styles";
import AppText from "./AppText";
import { Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import PriceTextComponent from "./PriceTextComponent";
import Markdown from 'react-native-markdown-display';
const { width, height } = Dimensions.get("screen");
import { RenderHTML } from 'react-native-render-html';

export default function OfferCard({ service, price, image,onPress,content }) {
  // console.log(content[0].children[0].text,"ceontnt")
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

          }}
          centered={false}
        />
        <AppText
          text={content}
          style={{
            color: Colors.grayColor,
            fontSize: 14,
            maxWidth: width * 0.5,
            fontSize:12
          }}
          centered={false}
        />
      <AppText
          text={`${price} جنيه`}
          style={{
            color: Colors.primaryColor,
            maxWidth: width * 0.5,
            fontSize:16,
            fontWeight:800,
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

const styles = StyleSheet.create({
  itemCardContainer: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    height:"auto",
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius: 10,
    borderColor: Colors.grayColor,
    gap: 20,
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
