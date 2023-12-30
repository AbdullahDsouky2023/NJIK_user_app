import React from "react";
import { Dimensions, FlatList, StyleSheet ,SafeAreaView, View} from "react-native";

// import ServiceCard from "./ServiceCard";
import HeaderTextComponent from "../Home/HeaderTextComponent";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { CART, OFFERS } from "../../navigation/routes";
import useOffers from "../../../utils/offers";
import AppText from "../AppText";
import LoadingScreen from "../../screens/loading/LoadingScreen";
import ArrowBack from "../ArrowBack";
import ServiceCard from "../Home/ServiceCard";
import OffersCard from "./OffersCard";
import { Colors } from "../../constant/styles";
const  { width } = Dimensions.get('screen')

export default function OffersList() {
  const categories = useSelector((state) => state.categories.categories);
  const navigation = useNavigation();
  const {data:OffersData,isLoading} = useOffers()
  const handleServiceCardPress = (item) => {
    navigation.navigate(CART, { name: item?.attributes?.name });
  };

  console.log("ofoers",OffersData?.data)
  if(isLoading){
    return <LoadingScreen/>
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
    <View style={{ flex: 1 }}>
    <ArrowBack/>
    <HeaderTextComponent name={"Offers"} showAll={true}>
      <FlatList
        data={OffersData?.data[0]?.attributes?.services?.data}
        style={styles.listContainer}
        renderItem={({ item }) => {
          console.log(item?.attributes.name)
          return (
            <OffersCard
              // onPress={() => handleServiceCardPress(item)}
              name={item?.attributes.name}
              image={item?.attributes?.image?.data[0]?.attributes.url}
            />
          );
        }}
        keyExtractor={(item, index) => item.id}
      />
    </HeaderTextComponent>
    </View>
</SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    display:'flex',
    flexDirection: "column",
    flexWrap: "wrap",
    // alignItems:'center',
    // justifyContent:'center',
    gap: 10,
    padding: 16,
    width:width
  },
});

  

