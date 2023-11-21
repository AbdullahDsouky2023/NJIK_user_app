import { View, Text, Dimensions } from 'react-native'
import { useState } from 'react';
import Carousel from 'react-native-snap-carousel-v4';
import React from 'react'

import { offersBannerList } from '../../data/home'
import PaginationComponent from './Pagination';
import useBanners from '../../../utils/banners';
import SlideItem from '../SlideItem';
import LoadingScreen from '../../screens/loading/LoadingScreen';
const { width } = Dimensions.get("window");

export default   function OffersBanner() {
    const { data:banners,isLoading} = useBanners()
    const [state, setState] = useState({
        offers: offersBannerList,
        activeSlide: 0,
        days: 694,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))
    const {
        offers,
        activeSlide,
        days,
    } = state;
    if(isLoading) return <LoadingScreen/>
    return (
        <View>
            <Carousel
                data={banners?.data}
                sliderWidth={width}
                autoplay={true}
                loop={true}
                autoplayInterval={10000}
                itemWidth={width}
                renderItem={(item)=><SlideItem item={item.item}/>}
                onSnapToItem={(index) => updateState({ activeSlide: index })}
            />
           <PaginationComponent activeSlide={activeSlide} length={offers.length}/>
        </View>
    )
}
