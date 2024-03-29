import React, { useEffect, useState, useCallback ,memo} from "react";
import {
 SafeAreaView,
 StatusBar,
 View,
 StyleSheet,
 Dimensions,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useDispatch, useSelector } from "react-redux";
import { Colors, Sizes } from "../../constant/styles";
import AppText from "../../component/AppText";
import useServices from "../../../utils/services";
import { setServices } from "../../store/features/serviceSlice";
import LoadingScreen from "../loading/LoadingScreen";
import { ErrorScreen } from "../Error/ErrorScreen";
import OffersServiceComponentList from "../../component/CurrentOffers/OffersListComponent";
import usePackages from "../../../utils/packages";
import { setpackages } from "../../store/features/PackagesSlice";
import PackagesLoadingScreen from "../../component/LoadingComponents/PackagesLoadingScreen";
import OfferCard from "../../component/OfferCard";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/core";
import { PACKAGE_SCREEN } from "../../navigation/routes";

const { width } = Dimensions.get("screen");

const CurrentOffersScreen = ({ route, navigation }) => {
 const dispatch = useDispatch();
 const categories = useSelector((state) => state.categories.categories);
 const [selectedItem, setSelectedItem] = useState("all");
 const selectedItemsData = categories?.data?.find(
    (category) => category?.attributes?.name === selectedItem
 );
 const { data } = useServices();
 const { data: packages, isLoading, isError } = usePackages();

 const getServices = useCallback(async () => {
    if (data) {
      dispatch(setServices(data));
      dispatch(setpackages(packages));
    } else if (isError) {
      console.log(isError);
    }
 }, [data, packages, isError, dispatch]);

 useEffect(() => {
    if (route?.params?.name) {
      setSelectedItem(route?.params?.name);
    }
 }, [route?.params?.name]);

 useEffect(() => {
    getServices();
 }, [getServices]);

 if (isLoading) return <PackagesLoadingScreen />;
 if (isError) return <ErrorScreen />;
 return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
       <ScrollView           showsVerticalScrollIndicator={false}
 style={styles.container}>
        <View>
          <AppText text="packages" centered={false} style={styles.title} /> 
         {/* <OffersServiceComponentList data={packages}/> */}
         <ListOffers  data={packages}/>

        </View> 
     </ScrollView> 
    </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
    height: "100%",
    paddingVertical: 4,
 },
 listContainer: {
    display: "flex",
    paddingTop: 15,
    paddingBottom: 20,
    width: width * 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
 },
 title: {
    paddingHorizontal: 20,
    paddingTop: 15,
    color: Colors.blackColor,
 },
});

export default memo(CurrentOffersScreen);

const ListOffers = ({data})=>{
   const navigation = useNavigation()
   return (
      <FlashList
      data={data}
     
      estimatedItemSize={200}
      renderItem={({ item }) => {
        return (
          <OfferCard
            service={item?.attributes?.name}
            price={item?.attributes?.price}
            content={item?.attributes?.content}
            onPress={() => navigation.navigate(PACKAGE_SCREEN, { item })}
            image={item?.attributes?.image?.data[0]?.attributes?.url}
          />
        );
      }}
      ItemSeparatorComponent={
         ()=>{
            return <View style={{ height: 10 }} />
         }
      }
      contentContainerStyle={{
         paddingHorizontal: 20,
         paddingTop: 15,
      }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={17}
      keyExtractor={(item) => item?.id}
      
      />
   )
}