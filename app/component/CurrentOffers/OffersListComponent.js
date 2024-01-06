import { View, Text, FlatList, Dimensions } from "react-native";
import React from "react";
import { Colors } from "../../constant/styles";
import OfferCard from "../OfferCard";
import AppText from "../AppText";
import { useNavigation } from "@react-navigation/native";
import { ITEM_DETAILS, PACKAGE_SCREEN } from "../../navigation/routes";
const { width } = Dimensions.get("screen");
export default function OffersServiceComponentList({ data, slectedItem }) {
  const navigation = useNavigation();
  
  if (data?.data?.length === 0) return;
  // const name = data[0]?.attributes?.category?.data?.attributes?.name;
// console.log("the data are",data?.data)
  return (
    <View
      style={{
        paddingHorizontal: 16,
        // paddingTop: 10,
        // marginBottom: 100,
        width: width,
      }}
    >
      <View style={{ marginBottom: 5 }}>
        {/* <AppText
          text={data[0]?.attributes?.category?.data?.attributes?.name}
          centered={false}
          style={{ fontSize: 22, color: Colors.blackColor }}
        /> */}
      </View>
      <FlatList
        data={data?.data}
        scrollEnabled={false}
        renderItem={({ item }) => {
          console.log("heh",item?.attributes?.image?.data[0]?.attributes?.url)
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
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={<View style={{ height: 10 }} />}
      />
    </View>
  );
}
