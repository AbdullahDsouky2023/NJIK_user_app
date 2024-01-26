import React from "react";
import { View, Dimensions, Image ,StyleSheet} from "react-native";
import {RFPercentage} from 'react-native-responsive-fontsize'
import { Colors } from "../../constant/styles";
import AppText from "../AppText";
const { width ,height} = Dimensions.get("screen");

export default function ReviewCard({ username, review, userImage }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.reviewContainer}>
        <View style={styles.header}>
     
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.userImageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: userImage 
              }}
            />
            <AppText
              text={username}
              style={styles.name}
              
            />
          </View>
          <AppText
          style={styles.review}
            centered={false}
            text={review}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    height: height*0.27,
    width: width * 0.91,
    padding: 20,
    marginTop:5,
    marginBottom: 10,
    borderTopWidth:0,
    backgroundColor: Colors.whiteColor,
    elevation: 2,
    borderTopColor: Colors.whiteColor,
    // borderColor: Colors.grayColor,
    borderTopWidth: 1,
    marginHorizontal:4,
    borderRadius: 10,
  },
  text: {},
  userImageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
    // marginBottom: 20,
    justifyContent: "center",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems:'start',
    justifyContent:'center',
    marginTop: 10,
    gap: 17,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  name :{
     color: Colors.grayColor, 
     fontSize: RFPercentage(1.8) 
  },
  review :{
    
      fontSize: RFPercentage(1.55),
      color: Colors.blackColor,

      flexWrap: 'wrap',
      maxWidth:width,
      textAlign:'center',
      width: width * 0.81,
    
  }
});
