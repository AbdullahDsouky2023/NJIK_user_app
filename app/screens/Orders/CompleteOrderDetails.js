import {
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-snap-carousel-v4";
// import { ScrollView } from "react-native";
import {RFPercentage } from 'react-native-responsive-fontsize'
import { Image ,FlatList} from "react-native";

import AppText from "../../component/AppText";
import { Colors } from "../../constant/styles";
import useOrders from "../../../utils/orders";
import PriceTextComponent from "../../component/PriceTextComponent";
import LoadingScreen from "../loading/LoadingScreen";
import ArrowBack from "../../component/ArrowBack";
import { ScrollView } from "react-native-virtualized-view";
import { CURRENCY } from "../../navigation/routes";
import ItemComponent from "../../component/Payment/ItemComponent";
import { MaterialIcons} from '@expo/vector-icons'
const { width, height } = Dimensions.get("screen");

export default function CompleteOrderDetails({ navigation, route }) {
  const { item } = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const categoryName1 = item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name
  const categoryName2 = item?.attributes?.services.data[0]?.attributes?.category?.data?.attributes?.name
  const categoryName3 = item?.attributes?.packages?.data[0]?.attributes?.name
  if (isLoading) return <LoadingScreen />;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: Colors.whiteColor }}
    >
      <ArrowBack subPage={true} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ItemComponent name="رقم الطلب" iconName={"hashtag"} data={item?.id} />
      <ItemComponent iconName={"server"} name="حالة الطلب" data={
            item?.attributes?.status === "assigned"
              ? "New"
              : item?.attributes?.status === "pending"
                ? "New"
                : item?.attributes?.status === "accepted"
                  ? "Accepted"
                  : item?.attributes?.status === "working"
                    ? "Working"
                    : item?.attributes?.status === "finish_work"
                      ? "Finished"
                      : item?.attributes?.status === "payed"
                        ? "Payed"
                        : "Finished"

          } />
              <ItemComponent name="التاريخ" iconName={"clock-o"} data={item?.attributes?.date} />
          {/* <ItemComponent2 name="الموقع" iconName={"map-marker"} data={item?.attributes?.location} /> */}
          <ItemComponent name="الخدمة" iconName={"gear"} data={
            categoryName1 || categoryName2 || categoryName3

          } />
        

      {(item?.attributes?.services?.data?.length > 0 )? (
          <View style={styles.itemContainer}>
            <FlatList
              data={item?.attributes?.services.data}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}

              keyExtractor={(item, index) => item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                direction: "rtl",
                flexWrap: "wrap",
                marginTop: 15,
                gap: 15,
                width: width,
              }}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      // justifyContent: "center",
                      gap: 15,
                    }}
                  >
                                                       <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

                    <AppText
                      centered={false}
                      text={item.attributes?.name}
                      style={[styles.name, { fontSize: RFPercentage(1.8), paddingRight: 10, width:width*0.9 }]}
                    />
{/*                      
                     <PriceTextComponent
                style={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: RFPercentage(1.5),
                  padding: 6,
                  borderRadius: 40,
                  color: Colors.whiteColor,
                }}
                price={item?.attributes?.Price}
              /> */}
                  </View>
                );
              }}
            />
          </View>
        ) : (item?.attributes?.packages?.data?.length > 0)  ? (
          <View style={styles.itemContainer}>
            <FlatList
              data={item?.attributes?.packages.data}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}

              keyExtractor={(item, index) => item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                direction: "rtl",
                flexWrap: "wrap",
                marginTop: 15,
                gap: 15,
                width: width,
              }}
              renderItem={({ item }) => {
                console.log('item')
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      // justifyContent: "center",
                      gap: 15,
                    }}
                  >
                                                       <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

                    <AppText
                      centered={false}
                      text={item.attributes?.name}
                      style={[styles.name, { fontSize:RFPercentage(1.75), paddingRight: 10 , width:width*0.9}]}
                    />
                     {/* <PriceTextComponent
                style={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: RFPercentage(1.5),
                  padding: 6,
                  borderRadius: 40,
                  color: Colors.whiteColor,
                }}
                price={item?.attributes?.price}
              /> */}
                  </View>
                );
              }}
            />
          </View> ): (item?.attributes?.service_carts?.data?.length > 0) ? 
          <View style={styles.itemContainer}>
          <FlatList
            data={ item?.attributes?.service_carts?.data}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}

            keyExtractor={(item, index) => item.id}
            style={{
              display: "flex",
              flexDirection: "row",
              direction: "rtl",
              flexWrap: "wrap",
              marginTop: 15,
              gap: 15,
              width: width,
            }}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap:'wrap',
                    maxWidth:width*0.90,
                    gap: 15,
                  }}
                >
                                                     <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

                  <AppText
                    centered={false}
                    text={item?.attributes?.service?.data?.attributes?.name}
                    style={[styles.name, { fontSize:RFPercentage(1.65), paddingRight: 10,width:width*0.9 }]}
                  />
                   {/* <View style={styles.CartServiceStylesContainer}>
                   <PriceTextComponent
              style={{
                backgroundColor: Colors.primaryColor,
                fontSize: RFPercentage(1.5),
                padding: 6,
                borderRadius: 40,
                color: Colors.whiteColor,
              }}
              price={item?.attributes?.service?.data?.attributes?.Price}
            />
                   <AppText
              style={{
                backgroundColor: Colors.whiteColor,
                fontSize: RFPercentage(1.8),
                padding: 6,
                borderRadius: 40,
                paddingHorizontal:15,
                color: Colors.primaryColor,
              }}
              text={"x"}
            />
                   <AppText
              style={{
                backgroundColor: Colors.primaryColor,
                fontSize: RFPercentage(1.5),
                padding: 6,
                borderRadius: 40,
                paddingHorizontal:15,
                color: Colors.whiteColor,
              }}
              text={item?.attributes?.qty}
            />
                    </View> */}
                </View>
              );
            }}
          />
        </View>
         : null }
           <ItemComponent name=" اسم الفنى" iconName="user" data={
            item?.attributes?.provider?.data?.attributes?.name

          } />
                    <ItemComponent name={"اجمالي الفاتورة"} iconName={"money"} data={`${item?.attributes?.totalPrice} ${CURRENCY}`} />
        <View>
          <AppText
            centered={false}
            text={item?.attributes?.service?.data?.attributes?.name}
            style={styles.name}
          />
        </View>
        
        <ItemComponent name={"التكلفة المخصومة من الرصيد"} iconName={"money"} data={`${0} ${CURRENCY}`} />
          <ItemComponent name={"الضريبة"} iconName={"money"} data={`${0} ${CURRENCY}`} />
          {
            item?.attributes?.provider_fee > 0 &&
<ItemComponent name={"اجرة الفني"} iconName={"money"} data={        `${item?.attributes?.provider_fee} ${CURRENCY}`}/>
          }
          {item?.attributes?.additional_prices?.data?.length > 0 &&
            <>
              <FlatList
                data={item?.attributes?.additional_prices?.data}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}

                renderItem={({ item }) => {

                  return <ItemComponent   iconName="tags" name={item?.attributes?.details} data={`${item?.attributes?.Price} ${CURRENCY}`} />
                }}
                keyExtractor={(item) => item?.id}
              />

            </>
          }
          <ItemComponent name={"الإجمالي بعد الخصم"} iconName={"money"} data={`${item?.attributes?.totalPrice} ${CURRENCY}`} />
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" ملاحظات"} style={styles.title} />
          <AppText
            centered={false}
            text={
              item?.attributes?.description
                ? item?.attributes?.description
                : "لا يوجد"
            }
            style={[styles.price,{width:width*0.9}]}
          />
        </View>
        {item?.attributes?.orderImages?.length > 0 && (
          <View style={styles.descriptionContainer}>
            <>
              <AppText centered={false} text={"Images"} style={styles.title} />
              <Carousel
                data={item?.attributes?.orderImages}
                sliderWidth={width}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}

                slideStyle={{
                  backgroundColor: "transparent",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                autoplay={true}
                loop={true}
                autoplayInterval={10000}
                itemWidth={width}
                renderItem={({ item }) => {
                  return (
                    <Image
                      //  resizeMethod="contain"
                      source={{
                        uri: item
                      }}
                      style={{
                        height: height * 0.2,
                        width: width * 0.6,
                        objectFit: "fill",
                        borderRadius: 10,
                      }}
                    />
                  );
                }}
              />
            </>
          </View>
        ) }
       
             
     
      </ScrollView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.whiteColor,
  },
  name: {
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginHorizontal: 1,
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
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    marginHorizontal: 1,

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
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
    marginTop: 5,
  },
  title: {
    fontSize: RFPercentage(2.1),
    color: Colors.primaryColor,
  },
  CartServiceStylesContainer:{
    display:'flex',
  flexDirection:'row',
  borderWidth:0.5,
 
  padding:5,
  borderRadius:10,
  // height:100,
  // width:100,
  gap:4,
  backgroundColor:Colors.piege,
  borderColor:Colors.grayColor}

});
