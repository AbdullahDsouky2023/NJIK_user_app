import React, { useCallback, memo } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";

import ServiceCard from "./ServiceCard";
import HeaderTextComponent from "./HeaderTextComponent";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { CART, OFFERS } from "../../navigation/routes";

const { width } = Dimensions.get('screen');
import { RFPercentage } from "react-native-responsive-fontsize";
import { Colors } from "react-native/Libraries/NewAppScreen";

 function ServicesList() {
 const categories = useSelector((state) => state.categories.categories);
 const navigation = useNavigation();

 const handleServiceCardPress = useCallback((item) => {
    navigation.navigate(CART, { name: item?.attributes?.name });
 }, [navigation]);
console.log("the servlice list is render .........")
 return (
    <HeaderTextComponent style={styles.container} name={"Services"} showAll={true}>
      <FlatList
        data={categories}
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => (
          {length: 100, offset: 100 * index, index}
        )}
        initialNumToRender={15}

        renderItem={({ item }) => (
          <ServiceCard
            onPress={() => handleServiceCardPress(item)}
            name={item?.attributes.name}
            image={item?.attributes?.image?.data[0]?.attributes.url}
          />
        )}
        keyExtractor={(item, index) => item.id}
      />
    </HeaderTextComponent>
 );
}
export default memo(ServicesList)
const styles = StyleSheet.create({
 listContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor:Colors.white,
    justifyContent:'center',
    gap: 10,
    width:width
 },
 container:{
    backgroundColor:Colors.white,
    display: 'flex',
    marginTop:10
 }
});
