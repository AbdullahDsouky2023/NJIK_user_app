import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import React from "react";
import AppText from "./AppText";
import { StyleSheet } from "react-native";
import { Colors } from "../constant/styles";
import {RFPercentage} from "react-native-responsive-fontsize";
import ArrowBack from "./ArrowBack";
const { width, height } = Dimensions.get("screen");
export default function ItemDetails({ item }) {
  return (
    <View style={styles.container}>
      <ArrowBack subPage={true} />
      <ScrollView>
        <Image source={{ uri: item?.attributes?.image?.data?.attributes?.url }} style={styles.image} />
        <AppText
            text={"Service Details :"}
            centered={false}
            style={{
                fontSize:RFPercentage(2.4),
                padding:15,
                color:Colors.primaryColor
            }}
          />
        <View style={styles.overlay}>
          <AppText text={item?.attributes?.name} style={{ color: Colors.whiteColor,fontSize:17 }} />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText
            text={item?.attributes?.description}
            centered={false}
            style={styles.descriptionText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "auto",
    backgroundColor: Colors.whiteColor,
    position: "relative",
  },
  image: {
    height: 150,
    width: width,
  },
  overlay: {
    height: 150,
    width: width,
    // backgroundColor: Colors.overlayColor,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionContainer: {
    width: width,
    backgroundColor: Colors.whiteColor,
    height: "auto",
    marginTop: -10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingBottom: 50,
  },
  descriptionText: {
    color: Colors.blackColor,
    fontSize: RFPercentage(1.9),
    width: width,
    padding:10,
    paddingHorizontal:20,
    // backgroundColor: Colors.redColor,

    minWidth:'95%',
  },
});
