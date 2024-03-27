import { View, Text, StatusBar, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowBack from "../../component/ArrowBack";
import LoadingScreen from "../loading/LoadingScreen";
import { SafeAreaView } from "react-native";
import { Colors } from "../../constant/styles";
import { FlatList } from "react-native";
import AppText from "../../component/AppText";
import { ScrollView } from "react-native-virtualized-view";
import NotificationItem from "../../component/notifications/NotificationItem";
import AppButton from "../../component/AppButton";
const { width, height } = Dimensions.get('screen')
export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(null);
  useEffect(() => {
    (async () => {
      const notifications = JSON.parse(
        await AsyncStorage.getItem("notifications")
      );
      if(notifications){

        setNotifications(notifications);
      }
    })();
  },[]);
  const deleteNotification = async(item) => {
    try {
        
      setNotifications(notifications.filter((n) => n !== item));
      await AsyncStorage.setItem("notifications",JSON.stringify(notifications.filter((n) => n !== item)))
    } catch (error) {
      
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
        <ArrowBack />
      
      <ScrollView style={{paddingHorizontal:20,}}>
        {
          notifications?.length > 0 ?
          <FlatList
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}

          data={notifications}
          style={{
            display: "flex",
            gap: 10,
            flexWrap:'wrap',
            marginBottom:10,
            // backgroundColor:'red',
            flexDirection:'column'
          }}
          renderItem={({ item,index }) => {
            return <NotificationItem  
            text={item?.request?.content?.title} 
            time={item?.date}
            body={item?.request?.content?.body}
            onDeleteNotfication={()=>deleteNotification(item)} />;
          }}
          inverted={true} // This line inverts the order of items

          keyExtractor={(item, index) => item + index}
          />
        :<AppText text={"There is no notifications yet"} style={{marginTop:height*0.35}}/>}
      </ScrollView>
    </SafeAreaView>
  );
}
