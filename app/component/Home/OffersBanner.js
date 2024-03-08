import React, { memo, useState,useMemo, useCallback } from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel-v4";
import { offersBannerList } from "../../data/home";
import PaginationComponent from "./Pagination";
import useBanners from "../../../utils/banners";
import SlideItem from "../SlideItem";
import LoadingScreen from "../../screens/loading/LoadingScreen";

const { width } = Dimensions.get("window");

const OffersBanner = () => {
  const { data: banners, isLoading } = useBanners();
  const [state, setState] = useState({
    offers: offersBannerList,
    activeSlide: 0,
    days: 694,
  });

  const updateState = useCallback((data) => {
    setState((prevState) => ({ ...prevState, ...data }));
  }, []);

  const { offers, activeSlide } = state;

  const carouselData = useMemo(() => banners, [banners]);

  
  
  const handleSnapToItem = useCallback((index) => {
    updateState({ activeSlide: index });
  }, []);

   
  const SlideItemMemoized = React.memo(({ item }) => {
    return <SlideItem item={item} />;
  });
  
  
  
  if (isLoading) return <LoadingScreen />;
  return (
    <View>
      <Carousel
        data={carouselData}
        sliderWidth={width}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        autoplay={true}
        loop={true}
        autoplayInterval={10000}
        itemWidth={width}
        renderItem={({ item }) => <SlideItemMemoized item={item} />}
        keyExtractor={(item, index) => index.toString()}

        onSnapToItem={handleSnapToItem}
      />
      <PaginationComponent activeSlide={activeSlide} length={offers.length} />
    </View>
  );
};

export default memo(OffersBanner);
