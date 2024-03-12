import {
  View,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import useCategories from "../../../utils/categories";
import { ScrollView } from "react-native-virtualized-view";
import LoadingScreen from "../loading/LoadingScreen";
import { StyleSheet } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import { useDispatch, useSelector } from "react-redux";
import {
  addServiceToCart,
  clearCart,
} from "../../store/features/CartSlice";
import {
  clearCart as clearCartService, setCategoryId,
} from "../../store/features/CartServiceSlice";
import ReserveButton from "../../component/ReverveButton";
import { CURRENCY, ITEM_ORDER_DETAILS, ORDER_SELECT_LOCATION, Offer_route_name } from "../../navigation/routes";
import CartItem from "./CartItem";
import { clearCurrentOrder, setCurrentOrderProperties } from "../../store/features/ordersSlice";
import CartLoadingComponent from "../../component/LoadingComponents/CartScreenLoadingComponent";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/core";
const { width, height } = Dimensions.get("screen");


function CartScreen({ route, navigation }) {
  const category = route.params?.name;
  const { data, isLoading, isError } = useCategories();
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const [slectedCategory, setCategory] = useState([]);

  useEffect(() => {
    const SelectedCategory = data?.filter(
      (item) => item?.attributes?.name === category
    )[0];
    const services = SelectedCategory?.attributes?.services;
    const cartServices = services?.data?.filter(
      (item) => item?.attributes?.Price !== "0"
    );
    setServices(cartServices);
    setCategory(SelectedCategory);
    dispatch(setCurrentOrderProperties({ category_id: Number(SelectedCategory?.id) }))

    return () => {
      dispatch(clearCart())
      dispatch(clearCartService())
      dispatch(clearCurrentOrder())

    }
  }, []);
  if (isLoading) return <CartLoadingComponent category={route?.params?.category} />;
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          height: height * 0.78,
        }}
      >
        <HeaderComponent category={category} slectedCategory={slectedCategory}/>
       <CartServiceList services={services}/>
    
      </ScrollView>
     <ReverveButtonComponent />
    </>

  );
}
export default memo(CartScreen)


const CartServiceList = memo(({services})=>{
  if(!services){
    return <LoadingScreen/>
  }
  return  (

  <View style={styles.listContainer}>
  <FlashList
    data={services}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    initialNumToRender={10}
    windowSize={5}
    
    keyExtractor={(item, index) => item.id + index}
    contentContainerStyle={{
      paddingVertical:10,
      // width:width*1,
      paddingHorizontal:width * (1-0.99)
    }}
    estimatedItemSize={200}
    ListEmptyComponent={()=>(
      <View style={styles.noItemContainer}>
              <AppText text={"Soon"} />
            </View>
    )}
    ItemSeparatorComponent={
    
      () => (
        <View
          style={{
            height: 10,
            width: "100%",
          }}
        />
      )
    }
    renderItem={({ item }) => {
      return (
        <CartItem item={item} />
        );
      }}
      /> 
      </View>
  )
    }
)
const HeaderComponent = memo(({category,slectedCategory})=>{
return(
  <View style={styles.header}>
  <AppText
    text={category === Offer_route_name ? `${Offer_route_name}` : ` خدمات ${slectedCategory?.attributes?.name} `}
    centered={true}
    style={styles.headerStyle}
  />
</View>
)
})

const ReverveButtonComponent = memo(()=>{
  const cartItems = useSelector((state) => state?.cartService?.services);
  const totalPrice = useSelector((state) => state?.cartService?.totalPrice);
  const navigation = useNavigation()
  if(cartItems?.length === 0){
    return
  }

  return (
    <View>
      <ReserveButton
        price={totalPrice}
        onPress={() => navigation.navigate(ITEM_ORDER_DETAILS, { item: "" })}
      />
    </View>
  )
})
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
  noItemContainer: {
    height: height * 1,
    marginTop: 10,
    paddingBottom: height * 0.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor
  },
  listContainer:{
    display: "flex",
    flexDirection: "row",
    direction: "rtl",
    justifyContent: 'center',
    flexWrap: "wrap",
    marginVertical: 15,
    backgroundColor: Colors.grayColor/10,
    gap: 15,
    width: width,
    maxHeight: height * 1,
    minHeight: height * 0.8,
    // overflow:'hidden'
  },
  headerStyle:{
    backgroundColor: "white",
    width: width,
    textAlign: "center",
    color: Colors.blackColor,
    marginTop: 10,
    padding: 5,
    borderRadius: 15,
  }
});