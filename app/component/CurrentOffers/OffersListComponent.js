import { View, Text, FlatList, Dimensions } from "react-native";
import React from "react";
import { Colors } from "../../constant/styles";
import OfferCard from "../OfferCard";
import AppText from "../AppText";
import { useNavigation } from "@react-navigation/native";
import { ITEM_DETAILS, PACKAGE_SCREEN } from "../../navigation/routes";
import { FlashList } from "@shopify/flash-list";
import { ScrollView } from "react-native";
const { width } = Dimensions.get("screen");
export default function OffersServiceComponentList({ data, slectedItem }) {
  const navigation = useNavigation();
  
  if (data?.length === 0) return;

  return (
    <ScrollView
      style={{
        paddingHorizontal: 16,
        width: width,
      }}
    >
      <View style={{ marginBottom: 5 }}>
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
        <View style={{ height: 10 }} />
      }
      showsVerticalScrollIndicator={false}
      initialNumToRender={17}
      keyExtractor={(item) => item?.id}
      
      />
        </View>
    </ScrollView>
  );
}
