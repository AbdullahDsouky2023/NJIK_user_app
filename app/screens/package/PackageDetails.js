import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import React from "react";
import AppText from "../../component/AppText";
import { StyleSheet } from "react-native";
import { Colors } from "../../constant/styles";
import AppHeader from "../../component/AppHeader";
import ArrowBack from "../../component/ArrowBack";
const { width, height } = Dimensions.get("screen");
export default function PackageDetails({ item }) {
  return (
    <View style={styles.container}>
      <ArrowBack subPage={true} />
      <ScrollView>
        <Image source={{ uri: item?.attributes?.poster_image?.data[0]?.attributes?.url }} style={styles.image} />
        <View style={styles.overlay}>
          <AppText text={item?.attributes?.name} style={{ color: Colors.whiteColor,fontSize:17 }} />
        </View>
          <AppText
            text={"تفاصيل الباقه"}
            centered={false}
            style={{
                fontSize:20,
                padding:15,
                color:Colors.primaryColor
            }}
          />
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
    resizeMode:"cover"
  },
  overlay: {
    height: 150,
    width: width,
    // backgroundColor: Colors.redColor,
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
    fontSize: 14,
    width: width,
    padding:10,
    paddingHorizontal:20,
    // backgroundColor: Colors.redColor,

    minWidth:'95%',
  },
});
