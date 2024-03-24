import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import useServices from "../../../utils/services";
import { ScrollView } from "react-native-virtualized-view";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addServiceToCart,
  addTotalBalance,
  clearCart,
  removeFromtotalBalance,
  removeServiceFromCart,
} from "../../store/features/CartSlice";
import ReserveButton from "../../component/ReverveButton";
import {
  CURRENCY,
  ITEM_DETAILS,
  ITEM_ORDER_DETAILS,
  ORDER_SELECT_LOCATION,
} from "../../navigation/routes";
import { Colors } from "../../constant/styles";
import AppText from "../AppText";
import LoadingScreen from "../../screens/loading/LoadingScreen";
import useBanners from "../../../utils/banners";
import { ErrorScreen } from "../../screens/Error/ErrorScreen";
import OffersLoadingComponent from "../LoadingComponents/OffersLoadingComponent";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/core";
const { width, height } = Dimensions.get("screen");

export default function OffersScreen({ route, navigation, Offers }) {

  const { data: Banners, isLoading ,isError} = useBanners();

  if (isLoading || !Banners) return <OffersLoadingComponent />;
  if (isError) return <ErrorScreen hanleRetry={()=>console.log("data")}/>

  return (
    <>
      <ScrollView
        style={{
          height: height * 0.78,
          backgroundColor: Colors.whiteColor,
        }}
      >
        <View style={styles.header}>
          <AppText
            text={` العروض`}
            centered={true}
            style={styles.containerHeader}
          />
        </View>
        <FlashList
          data={Banners}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          estimatedItemSize={200}
            ItemSeparatorComponent={
          ()=>{
            return <View style={{height:10}}/>
          }
            }
          keyExtractor={(item, index) => item.id + index}
          contentContainerStyle={{
          paddingHorizontal:width*0.1*0.5
          }}
          renderItem={({ item }) => {
            return (
              <OfferItem item={item} />
            );
          }}
        />
      </ScrollView>
    </>
  );
}


const OfferItem = memo(({item})=>{
  const navigation = useNavigation()
  const ImageUrl = item?.attributes?.image?.data?.attributes?.url
  const ItemData = item?.attributes?.service?.data
  return (
    <TouchableWithoutFeedback
                onPress={() => {
                  if(ItemData){

                    navigation.navigate(ITEM_DETAILS, {
                      item: ItemData,
                    });
                  }}
                }
              >
                <Image
                  source={{
                    uri:ImageUrl ,
                  }}
                  style={styles.image}
                />
              </TouchableWithoutFeedback>
  )
});
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.whiteColor,
  },
  containerHeader:{
    backgroundColor: "white",
    width: width,
    textAlign: "center",
    color: Colors.blackColor,
    marginTop: 10,
    padding: 5,
    borderRadius: 15,
  },
  header: {
    textAlign: "center",
  },
  name: {
    fontSize: 17,
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: width * 0.95,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginHorizontal: 8,
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    gap: 10,
  },
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    gap: 10,
  },
  price: {
    fontSize: 17,
    color: Colors.primaryColor,
    marginTop: 5,
    fontWeight: 700,
  },
  title: {
    fontSize: 21,
    color: Colors.primaryColor,
  },
  itemContainer2: {
    display: "flex",
    flex: 2,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  increaseButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 40,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5.0,
    marginTop: 4.0,
    borderRadius: 40,
    backgroundColor: Colors.primaryColor,
  },
  buttonText: {
    color: Colors.whiteColor,
  },
  image: {
    // minHeight: "100%",
    height:height*0.133,
    width: width * 0.9,
    borderRadius: 15,
    objectFit: "fill",
  },
});