import React, { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Card } from "react-native-paper";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Sizes } from "../../constant/styles";
import { Avatar } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { intlFormat } from "date-fns";

const { width } = Dimensions.get("screen");
const NotificationItem = ({ text, onDeleteNotfication,time:selecttime,body }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date(selecttime));
  if(!text) return ;

  useEffect(() => {
    const timer = setInterval(() => {
      const formattedTime = new intlFormat.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(new Date(selecttime));
      setTime(formattedTime);
      console.log("the data is ",formattedTime)
    }, 60000); // Updates every minute

    return () => {
      clearInterval(timer);
    };
  })
  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    if(!text)return;
    return (
      <RectButton style={styles.leftAction} onPress={() => setIsOpen(false)}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
              paddingTop: 15,
              paddingLeft: 5,
            },
          ]}
        >
          <MaterialIcons
            name="delete"
            size={27}
            color={Colors.redColor}
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              marginVertical: Sizes.fixPadding * 2.0,
            }}
            onPress={onDeleteNotfication}
          />
        </Animated.Text>
      </RectButton>
    );
  };

  const handleSwipeLeft = () => {
    console.log("Swiped left");
  };

  const handleSwipeRight = () => {
    console.log("Swiped right");
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      onSwipeableLeftOpen={handleSwipeLeft}
      onSwipeableRightOpen={handleSwipeRight}
    >
      <View style={styles.card}>
        {/* <AntDesign name="notification" size={24} color="black" /> */}

        <AntDesign
          size={20}
          style={{ padding: 6, borderRadius: 10 }}
          name="notification"
          color={Colors.whiteColor}
          backgroundColor={Colors.primaryColor}
        />
        <View style={styles.content}>

          <AppText
            text={text}
            centered={false}
            style={{ fontSize: 13, color: Colors.primaryColor }}
          />
        {
          body &&
          <AppText
          text={body}
            centered={false}
            style={{ fontSize: 13, color: Colors.blackColor }}
          />
        }
        
          <AppText text= {time.toDateString()} style={styles.date} centered={false}/>
        </View>
        {/* <View style={styles.time}> */}
        {/* </View> */}
      </View>
    </Swipeable>
  );
};

export default NotificationItem;
const styles = StyleSheet.create({
  card: {
    width: width * 0.89,
    // height:50,
    backgroundColor: "white",
    padding: 10,
    margin: 1,
    shadowColor: "#000",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent:'space-between',
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    borderRadius: 14,
  },
  content:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'flex-start'
  },
  time: {
    width: "auto",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    borderRadius: 14,
  },
  date:{
    fontSize:11,
  }
});
