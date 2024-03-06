import {  Dimensions, FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import { CommonActions } from "@react-navigation/native";
import * as Updates from "expo-updates";

import { clearCurrentOrder, setOrders } from "../../store/features/ordersSlice";
import LoadingModal from "../../component/Loading";
import {
  CURRENCY,
  ORDER_SUCCESS_SCREEN,
} from "../../navigation/routes";
import PriceTextComponent from "../../component/PriceTextComponent";
import { ScrollView } from "react-native-virtualized-view";
import AppButton from "../../component/AppButton";
import useOrders, { CreateCartService, cancleOrder, postOrder, updateOrderData } from "../../../utils/orders";
import AppText from "../../component/AppText";
import { Colors } from "../../constant/styles";
import LoadingScreen from "../loading/LoadingScreen";
import AppModal from "../../component/AppModal";
import useRegions from "../../../utils/region";
import { clearCart } from "../../store/features/CartSlice";
import useServices from "../../../utils/services";
import ArrowBack from "../../component/ArrowBack";
import usePackages from "../../../utils/packages";
import { updateUserData } from "../../../utils/user";
import Carousel from "react-native-snap-carousel-v4";

const { width ,height} = Dimensions.get("screen");

export default function OrderComfirmDetailsScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: orders, isLoading: loading, isError } = useOrders();
  const currentOrderData = useSelector(
    (state) => state?.orders?.currentOrderData
  );
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const { item, image } = route?.params;
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalPriceServices = useSelector((state) => state.cartService.totalPrice);
  const CartServicesItems = useSelector((state) => state.cartService.services);
  const { data: services } = useServices();
  const { data: packages } = usePackages();
  const [currentSelectedServices, setCurrentSelectedServices] = useState([]);
  const [currentSelectedPackages, setCurrentSelectedPackages] = useState([]);
  const userData = useSelector((state) => state?.user?.userData);
  const [cartServiceIds,setCartServiceIds] = useState([])
  const category_id = useSelector((state) => state.cart.category_id);
  const handleComfirmOrder = async () => {
    try {
      setIsLoading(true);
      if (
        currentOrderData?.packages?.connect?.length === 0 &&
        currentOrderData?.services?.connect?.length === 0  && CartServicesItems?.length === 0
      ) {
        await Updates.reloadAsync();
      }
      const data = await postOrder(currentOrderData);
      if (currentOrderData?.coupons?.connect[0]?.id) {
        await updateUserData(userData?.id, {
          coupons: {
            connect: [{ id: currentOrderData?.coupons?.connect[0]?.id }],
          },
          
        });
      }
      if (data) {
        dispatch(clearCurrentOrder());
        dispatch(clearCart());
        setCartServiceIds([])
        
        if (CartServicesItems?.length > 0) {
          if(cartServiceIds?.length === 0 ){
          const idData = await   handleCreatingServiceCartIds()
          if(idData){
            await updateOrderData(data, {
              service_carts: cartServiceIds,
              totalPrice:totalPriceServices
            });
          }
          }else {
            await updateOrderData(data, {
              service_carts: cartServiceIds,
              totalPrice:totalPriceServices
            });
             
        }
        }
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:ORDER_SUCCESS_SCREEN
                 ,params:{
                order:data
              }}],
            })
          );
        // }
      }
    } catch (error) {
      console.log(error, "error deleting the order");
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const data = currentOrderData?.services?.connect.map((item) => {
      const service = services?.filter(
        (service) => service?.id === item?.id
      );
      return service[0];
    });
    setCurrentSelectedServices(data);
  }, []);

  useEffect(() => {
    const data = currentOrderData?.packages?.connect.map((item) => {
      const service = packages.filter(
        (Packageitem) => Packageitem?.id === item?.id
      );
      return service[0];
    });
    setCurrentSelectedPackages(data);
  }, []);
  useEffect(() => {
    handleCreatingServiceCartIds()
  }, []);
  const handleCreatingServiceCartIds = async () => {
    const promises = CartServicesItems.map(async (item) => {
      const itemSent = {
        qty: item.qty,
        service: {
          connect: [{ id: item.id }],
        },
      };
      const id = await CreateCartService({ ...itemSent });
      if (id) {
        return { id }; // Return the object directly
      }
    });
  
    // Wait for all promises to resolve
    const resolvedIds = await Promise.all(promises);
  
    // Filter out undefined values (in case any promise didn't resolve correctly)
    const filteredIds = resolvedIds.filter((idObj) => idObj !== undefined);
  
    // Update the state with the resolved IDs
    setCartServiceIds(filteredIds);
  };
  
  
  if (isLoading) return <LoadingScreen />;
  return (
    <View style={{ backgroundColor: Colors.whiteColor ,    height:height*1,
    }}>
      <ArrowBack subPage={true} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
       
        {currentSelectedServices?.length > 0 && (
          <View style={styles.itemContainer}>
            <FlatList
              data={currentSelectedServices}
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
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: 15,
                    }}
                  >
                    <AppText
                      centered={false}
                      text={item.attributes?.name}
                      style={[
                        styles.name,
                        { fontSize: RFPercentage(1.9), paddingRight: 10 },
                      ]}
                    />
                    
                      <PriceTextComponent
                style={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: RFPercentage(1.5),
                  padding: 6,
                  borderRadius: 40,
                  color: Colors.whiteColor,
                }}
                price={item?.attributes?.Price}
              />
              
                  </View>
                );
              }}
            />
          </View>
        )}
        {currentSelectedPackages?.length > 0 && (
          <View style={styles.itemContainer}>
            <FlatList
              data={currentSelectedPackages}
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
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: 15,
                    }}
                  >
                    <AppText
                      centered={false}
                      text={item.attributes?.name}
                      style={[
                        styles.name,
                        { fontSize: RFPercentage(1.9), paddingRight: 10 },
                      ]}
                    />
                    
                      <PriceTextComponent
                style={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: RFPercentage(1.5),
                  padding: 6,
                  borderRadius: 40,
                  color: Colors.whiteColor,
                }}
                price={item?.attributes?.price}
              />
              
                  </View>
                );
              }}
            />
          </View>
        )}
        {CartServicesItems?.length > 0 && (
          <View style={styles.itemContainer}>
            <FlatList
              data={CartServicesItems}
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
                      flexWrap:"wrap",
                      // backgroundColor:"red",
                      width:width*0.92,
                      gap: 15,
                    }}
                  >
                    <AppText
                      centered={false}
                      text={item?.name}
                      style={[
                        styles.name,
                        { fontSize: RFPercentage(1.8), paddingRight: 10 ,paddingTop:10},
                      ]}
                    />
                    <View style={styles.CartServiceStylesContainer}>

                      <PriceTextComponent
                style={{
                  backgroundColor: Colors.primaryColor,
                  fontSize: RFPercentage(1.5),
                  padding: 6,
                  borderRadius: 40,
                  color: Colors.whiteColor,
                }}
                price={item?.price}
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
                fontSize: RFPercentage(1.8),
                padding: 6,
                borderRadius: 40,
                paddingHorizontal:15,
                color: Colors.whiteColor,
              }}
              text={item?.qty}
            />
            </View>
                  </View>
                );
              }}
            />
          </View>
        )}
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" السعر"} style={styles.title} />
          <PriceTextComponent
            style={{
              color: Colors.blackColor,
              fontSize: RFPercentage(1.9),
              marginTop: 4,
            }}
            price={(totalPrice || totalPriceServices)}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" العنوان"} style={styles.title} />
          <AppText
            centered={false}
            text={
              currentOrderData?.googleMapLocation?.readable || "not provided"
            }
            style={styles.price}
          />
        </View>
        <View style={styles.itemContainer}>
          <AppText centered={false} text={" التاريخ"} style={styles.title} />
          <AppText
            centered={false}
            text={currentOrderData.date}
            style={styles.price}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <AppText centered={false} text={" ملاحظات"} style={styles.title} />
          <AppText
            centered={false}
            text={
              currentOrderData?.description
                ? currentOrderData?.description
                : "لا يوجد"
            }
            style={[styles.price,{width:width*0.9}]}
          />
        </View>
        {currentOrderData?.orderImages?.length > 0 && (
          <View style={styles.descriptionContainer}>
            <>
              <AppText centered={false} text={"Images"} style={styles.title} />
              <Carousel
                data={currentOrderData?.orderImages}
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
                      width={50}
                      style={{
                        height: height * 0.2,
                        width: 200,
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

        <View
        
     
          style={{
            height:height*0.15,

            width: 200,
            // display:'none',
            borderRadius: 10,
          }}
        />
      
        </ScrollView>
      </ScrollView>
      <View style={styles.ButtonContainer}>
        <AppButton
          title={"تأكيد الطلب"}
          style={styles.buttonStyles}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <AppModal
        isModalVisible={isModalVisible}
        message={"تأكيد الطلب"}
        setModalVisible={setModalVisible}
        onPress={() => handleComfirmOrder()}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // paddingBottom:height*0.2,
    backgroundColor: Colors.whiteColor,
    position:'relative',
    marginBottom: height*0.15

  },
  name: {
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: width * 0.92,
    // maxWidth: width * 0.9,
    padding: 10,
    marginHorizontal: 4,
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
  borderColor:Colors.grayColor},
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    width: width * 0.92,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 4,
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
  ButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent:'center',
    // padding:-1000,
    height:height*0.15,
    width:width*1,
    // paddingBottom:20,
    backgroundColor: Colors.whiteColor,
    position:'absolute',
    bottom:100,
    marginTop:height*0.15,
    right: 0,
    margin:'auto',
    alignSelf:'center',
                // marginVertical:15,
            // paddingVertical: 15,
            // paddingHorizontal: 50,
  },
  buttonStyles :{
    // backgroundColor:'orange',
    paddingHorizontal:width*0.095,
    paddingVertical:width*0.03,


  }
});
