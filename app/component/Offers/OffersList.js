import React ,{memo} from "react";
import { Dimensions, FlatList, StyleSheet ,SafeAreaView, View} from "react-native";
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

function OffersList() {
  const categories = useSelector((state) => state.categories.categories);
  const navigation = useNavigation();
  const {data:OffersData,isLoading} = useOffers()
  const handleServiceCardPress = (item) => {
    navigation.navigate(CART, { name: item?.attributes?.name });
  };

  if(isLoading){
    return <LoadingScreen/>
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
    <View style={{ flex: 1 }}>
    <ArrowBack/>
    <HeaderTextComponent name={"Offers"} showAll={false}>
      <FlatList
        data={OffersData?.data[0]?.attributes?.services?.data}
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}

        renderItem={({ item }) => {
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
export default memo(OffersList)
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

  

