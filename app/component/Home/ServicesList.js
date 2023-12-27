import React from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";

import ServiceCard from "./ServiceCard";
import HeaderTextComponent from "./HeaderTextComponent";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { CART, OFFERS } from "../../navigation/routes";
const  { width } = Dimensions.get('screen')

export default function ServicesList() {
  const categories = useSelector((state) => state.categories.categories);
  const navigation = useNavigation();
  const handleServiceCardPress = (item) => {
    navigation.navigate(CART, { name: item?.attributes?.name });
  };
  return (
    <HeaderTextComponent name={"Services"} showAll={true}>
      <FlatList
        data={categories.data}
        style={styles.listContainer}
        renderItem={({ item }) => {
          return (
            <ServiceCard
              onPress={() => handleServiceCardPress(item)}
              name={item?.attributes.name}
              image={item?.attributes?.image?.data[0]?.attributes.url}
            />
          );
        }}
        keyExtractor={(item, index) => item.id}
      />
    </HeaderTextComponent>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    // alignItems:'center',
    // justifyContent:'center',
    gap: 10,
    // padding: 16,
    width:width
  },
});
