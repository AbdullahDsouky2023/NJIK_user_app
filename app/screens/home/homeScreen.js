import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";



import { Colors, Fonts, Sizes } from "../../constant/styles";
import {
  topCategoriesList,
} from "../../data/home";
import OffersBanner from "../../component/Home/OffersBanner";
import ServicesList from "../../component/Home/ServicesList";
import UsersReviews from "../../component/Home/UsersReview";
import AppHeader from "../../component/AppHeader";
import useCategories from "../../../utils/categories";
import { setBanners, setCategories } from "../../store/features/categorySlice";
import { setServices } from "../../store/features/serviceSlice";
import { setOrders } from "../../store/features/ordersSlice";
import useServices from "../../../utils/services";
import LoadingScreen from "../loading/LoadingScreen";
import { ErrorScreen } from "../Error/ErrorScreen";
import useNotifications from "../../../utils/notifications";
import useOrders from "../../../utils/orders";
import { generateUserToken } from "../chat/chatconfig";
import { setUserStreamData } from "../../store/features/userSlice";
import useBanners from "../../../utils/banners";
import CurrentOffersScreen from "../CurrentOffersScreen/CurrentOffersScreen";
import HomeScreenLoadingComponent from "../../component/LoadingComponents/BannersLoadingComponent";
const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const { data, isLoading, isError } = useCategories()
  const { data:services ,isLoading:serviceLoading} = useServices()
  const { data:orders } = useOrders()
  const { data:banners } = useBanners()
  const user = useSelector((state)=>state?.user?.userData)
  const { token} = useNotifications()

  
  const getData =async()=>{
    if (data) {
        dispatch(setCategories(data));
        dispatch(setServices(services));
       dispatch(setOrders(orders?.data));
       dispatch(setBanners(banners));
      const chat = generateUserToken(user)
      dispatch(setUserStreamData(chat));
    } else if (isError) {
      console.log(isError)
    }
  }

  useEffect(
    () => {    
    getData()
  }
  , [data]);
 
  
    const ListHeaderComponent = React.memo(()=>
    <View >
      <OffersBanner />
      <ServicesList />
      <CurrentOffersScreen/> 
    </View>
    )

  if (isLoading || serviceLoading) {
    return (
    <>
    <HomeScreenLoadingComponent/>
    </>
    )
  }

  if (isError) return <ErrorScreen hanleRetry={getData}/>
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1}}>
        <AppHeader />
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          data={topCategoriesList}
          numColumns={2}
          initialNumToRender={7}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          ListFooterComponent={<UsersReviews />}
        />
      </View>
    </SafeAreaView>
  );
};



export default HomeScreen;


