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
import useServices from "../../../utils/services";
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
import ReserveButton from "../../component/ReverveButton";
import { ORDER_SELECT_LOCATION } from "../../navigation/routes";
const { width, height } = Dimensions.get("screen");

export default function CartScreen({ route ,navigation}) {
  const category = route.params?.name;
  const { data, isLoading, isError } = useCategories();
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const [slectedCategory, setCategory] = useState([]);
  const cartItems = useSelector((state) => state.cart.services);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
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
    }
  }, []);
  const handlePressAddButton = (id) => {
    const foundIndex = cartItems.indexOf(id);
    if (foundIndex !== -1) {
      const price = services?.filter((item) => item?.id === id)[0]?.attributes?.Price;
      dispatch(removeServiceFromCart({ item:id,
        price:price}));
      console.log("the price remove is from screen",id, price);
    } else {
      const price = services?.filter((item) => item?.id === id)[0]?.attributes?.Price;
      console.log("the price added is from scree ", id,price);
      dispatch(addServiceToCart({
        item:id,
        price:price
      }));
    }
  };
  if (isLoading) return <LoadingScreen />;
  return (
    <>
      <ScrollView
        style={{
          height: height * 0.78,
        }}
      >
        <View style={styles.header}>
          <AppText
            text={` خدمات ${slectedCategory?.attributes?.name} `}
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
        <FlatList
          data={services}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item.id +index}
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
            //   console.log(item?.attributes?.name)

            return (
              <View style={styles.itemContainer}>
                <View style={styles.itemContainer2}>
                  <AppText
                    centered={false}
                    text={item.attributes?.name}
                    style={[styles.name, { fontSize: 14, paddingRight: 10 }]}
                  />
                  <AppText
                    centered={false}
                    text={`${item.attributes?.Price} جنيه`}
                    style={[styles.price, { fontSize: 14, paddingRight: 10 }]}
                  />
                </View>
                <View style={styles.buttonsContainer}>
                  <AppButton
                    title={
                      cartItems?.indexOf(item?.id) !== -1 ? "remove" : "Add"
                    }
                    textStyle={{ fontSize: 15 }}
                    onPress={() => handlePressAddButton(item?.id)}
                  />
                </View>
              </View>
            );
          }}
        />
      
      
      </ScrollView>
      
            {cartItems.length > 0 && (
        <>
          <ReserveButton
            price={totalPrice}
            onPress={() => navigation.navigate(ORDER_SELECT_LOCATION)}
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
});
