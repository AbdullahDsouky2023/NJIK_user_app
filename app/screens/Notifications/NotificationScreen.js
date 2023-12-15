import { View, Text, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowBack from "../../component/ArrowBack";
import LoadingScreen from "../loading/LoadingScreen";
import { SafeAreaView } from "react-native";
import { Colors } from "../../constant/styles";
import { FlatList } from "react-native";
import AppText from "../../component/AppText";
import { ScrollView } from "react-native-virtualized-view";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(null);
  useEffect(() => {
    (async () => {
      const notifications = JSON.parse(
        await AsyncStorage.getItem("notifications")
      );
      setNotifications(notifications);
      console.log(notifications[0].request.content.title)
    })();
  });
  if (!notifications) return <LoadingScreen />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
        <ArrowBack />
      <ScrollView style={{padding:20}}>
      <FlatList
          data={notifications}
          style={{
            display: "flex",
            gap: 20,
            flexWrap:'wrap',
            // backgroundColor:'red',
            flexDirection:'row'
          }}
          renderItem={({ item }) => {
            return <AppText text={item?.request?.content?.title}/>;
          }}
          keyExtractor={(item, index) => item.name + index}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
