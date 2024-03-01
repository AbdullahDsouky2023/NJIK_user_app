import React, { useState, useMemo } from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel-v4";

import { offersBannerList } from "../../data/home";
import PaginationComponent from "./Pagination";
import useBanners from "../../../utils/banners";
import SlideItem from "../SlideItem";
import LoadingScreen from "../../screens/loading/LoadingScreen";

const { width } = Dimensions.get("window");

export default function OffersBanner() {
 const { data: banners, isLoading } = useBanners();
 const [state, setState] = useState({
    offers: offersBannerList,
    activeSlide: 0,
    days: 694,
 });

 const updateState = (data) => setState((state) => ({ ...state, ...data }));

 const { offers, activeSlide, days } = state;

 // Use useMemo to optimize the carousel data
 const carouselData = useMemo(() => banners, [banners]);

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
        renderItem={({ item }) => <SlideItem item={item} />}
        onSnapToItem={(index) => updateState({ activeSlide: index })}
      />
      <PaginationComponent activeSlide={activeSlide} length={offers.length} />
    </View>
 );
}
