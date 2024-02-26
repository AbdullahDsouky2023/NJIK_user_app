import { View, Dimensions, StyleSheet, Image } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'

import Carousel from 'react-native-snap-carousel-v4';
import { userReviews } from '../../data/home'
import PaginationComponent from './Pagination';
import ReviewCard from './ReviewCard';
import useReviews from '../../../utils/reviews';
import AppText from '../AppText';
import { Colors } from '../../constant/styles';

const { width ,height} = Dimensions.get("window");

export default   function UsersReviews() {
    const { data } = useReviews();
    const [state, setState] = useState({
      reviews: userReviews,
      activeSlide: 0,
      days: 694,
    });
  
    const updateState = (data) => {
      setState((state) => ({ ...state, ...data }));
    };
  
    const { reviews, activeSlide, days } = state;
  
    useEffect(() => {
      // Fetch data when the component mounts or when the data changes
      // You can add a dependency array to control when this effect runs
      // For now, it runs whenever 'data' changes
      // If you want it to run only once when the component mounts, provide an empty dependency array: []
      if (data) {
        updateState({ reviews: data });
      }
    }, [data]);
    return (
        <View style={styles.container}>
          <View style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            alignSelf:'center',
            backgroundColor:Colors.whiteredColor,
             gap:10,
             marginBottom:10
          }}>

               <AppText text={"SercureOrder"} style={{ color: Colors.primaryColor ,marginBottom:10}} />
               <Image source={require('../../assets/images/award.png')} style={{ height:40, width:40}}/>
          </View>
          <View style={styles.container2}>

            <Carousel
                data={data}
                sliderWidth={width}
                autoplay={true}
                loop={true}
                slideStyle={styles.container2}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                autoplayInterval={4000}
                itemWidth={width}
                renderItem={({item})=><ReviewCard 
                 username={item?.attributes?.username} 
                 review={item?.attributes?.content}
                  userImage={item?.attributes?.image?.data?.attributes?.url} />}
                onSnapToItem={(index) => updateState({ activeSlide: index })}
            />
           <PaginationComponent activeSlide={activeSlide} length={reviews.length}/>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container :{
        // paddingHorizontal:height*0.017,
        paddingVertical:20,
        display:'flex',
        flexDirection:'column',
        
        
    },container2:{
      // height: "100%",
      backgroundColor: Colors.whiteColor,
      width: width*1,
      // paddingHorizontal: 20,
      // paddingTop:10,
      paddingBottom:30,
      marginBottom: -10,
      marginVertical:10,
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
    }
})