import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import useCategories from "../../../utils/categories";
import { ScrollView } from "react-native-virtualized-view";
import LoadingScreen from "../loading/LoadingScreen";
import { StyleSheet } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { color } from "react-native-reanimated";
import {
  addServiceToCart,
  addTotalBalance,
  clearCart,
  removeFromtotalBalance,
  removeServiceFromCart,
} from "../../store/features/CartSlice";
import {
  clearCart as clearCartService,
} from "../../store/features/CartServiceSlice";
import ReserveButton from "../../component/ReverveButton";
import { CURRENCY, ITEM_ORDER_DETAILS, ORDER_SELECT_LOCATION, Offer_route_name } from "../../navigation/routes";
import CartItem from "./CartItem";
const { width, height } = Dimensions.get("screen");
const fontSize = RFPercentage(1.7); // Base font size

export default function CartScreen({ route ,navigation}) {
  const category = route.params?.name;
  const { data, isLoading, isError } = useCategories();
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const [slectedCategory, setCategory] = useState([]);
  const cartItems = useSelector((state) => state?.cartService?.services);
  const totalPrice = useSelector((state) => state?.cartService?.totalPrice);
  useEffect(() => {
    const SelectedCategory = data?.data.filter(
      (item) => item?.attributes?.name === category
    )[0];
    const services = SelectedCategory?.attributes?.services;
    const cartServices = services?.data?.filter(
      (item) => item?.attributes?.Price !== "0"
    );
    setServices(cartServices);
    setCategory(SelectedCategory);


    return ()=>{
        dispatch(clearCart())
        dispatch(clearCartService())
    }
  }, []);
  const handlePressAddButton = (id) => {
    const foundIndex = cartItems.indexOf(id);
    if (foundIndex !== -1) {
      const price = services?.filter((item) => item?.id === id)[0]?.attributes?.Price;
      console.log("the price removed is from scree ",cartItems);
      // dispatch(addServiceToCart({
      //   "cart-service":{
      //     qty:1,
      //     item:id,
      //   },
      //   price:price
      // }));
    } else {
      const price = services?.filter((item) => item?.id === id)[0]?.attributes?.Price;
      console.log("the price added is from scree ", id,price);
      dispatch(addServiceToCart({
        cart_service:{
          qty:1,
          item:id,
        },
        price:price
      }));
    }
  };
  if (isLoading) return <LoadingScreen />;
  return (
    <>
      <ScrollView
       showsVerticalScrollIndicator={false}
        style={{
          height: height * 0.78,
        }}
      >
        <View style={styles.header}>
          <AppText
            text={category === Offer_route_name ? `${Offer_route_name}`:` خدمات ${slectedCategory?.attributes?.name} `}
            centered={true}
            style={{
              backgroundColor: "white",
              width: width,
              textAlign: "center",
              color: Colors.blackColor,
              marginTop: 10,
              padding: 5,
              borderRadius: 15,
            }}
          />
        </View>
        {
          services?.length > 0 ?
        <FlatList
        data={services}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}

          keyExtractor={(item, index) => item.id +index}
          style={{
            display: "flex",
            flexDirection: "row",
            direction: "rtl",
            justifyContent:'center',
            flexWrap: "wrap",
            marginVertical: 15,
            gap: 15,
            width: width,
          }}
          renderItem={({ item }) => {
            //   console.log(item?.attributes?.name)
            
            return (
              <CartItem item={item}/>
            );
          }}
        />:
        <View style={styles.noItemContainer}>

        <AppText text={"Soon"}/>
        </View>
      
      }
      
      </ScrollView>
      
            {cartItems?.length > 0 && (
        <>
          <ReserveButton
            price={totalPrice}
            onPress={() => navigation.navigate(ITEM_ORDER_DETAILS,{item:""})}
          />
        </>
      )} 
      </>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    textAlign: "center",
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
    fontSize: RFPercentage(2),
    color: Colors.primaryColor,
    marginTop: 5,
    fontWeight: 700,
  },
  title: {
    fontSize: RFPercentage(2.2),
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
  noItemContainer:{
    height:height*1,
    marginTop:10,
    paddingBottom:height*0.3,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:Colors.whiteColor
  }
});
