import React, { useEffect, useState, useCallback , memo} from 'react';
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel-v4';
import { userReviews } from '../../data/home';
import PaginationComponent from './Pagination';
import ReviewCard from './ReviewCard';
import useReviews from '../../../utils/reviews';
import AppText from '../AppText';
import { Colors } from '../../constant/styles';

const { width, height } = Dimensions.get("window");

 function UsersReviews() {
 const { data } = useReviews();
 const [state, setState] = useState({
    reviews: userReviews,
    activeSlide: 0,
    days: 694,
 });

 const updateState = useCallback((data) => {
    setState((state) => ({ ...state, ...data }));
 }, []);
 const handleSanpItem =  useCallback((index) => updateState({ activeSlide: index }),[])
 useEffect(() => {
    if (data) {
      updateState({ reviews: data });
    }
 }, [data, updateState]);
 return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText text={"SercureOrder"} style={styles.title} />
        <Image source={require('../../assets/images/award.png')} style={styles.awardImage} />
      </View>
      <View style={styles.carouselContainer}>
        <Carousel
          data={data}
          sliderWidth={width}
          autoplay={true}
          loop={true}
          slideStyle={styles.carouselContainer}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          autoplayInterval={4000}
          itemWidth={width}
          renderItem={({ item }) => (
            <ReviewCard
              username={item?.attributes?.username}
              review={item?.attributes?.content}
              userImage={item?.attributes?.image?.data?.attributes?.url}
            />
          )}
          onSnapToItem={handleSanpItem}
        />
        <PaginationComponent activeSlide={state.activeSlide} length={state.reviews.length} />
      </View>
    </View>
 );
}
export default memo(UsersReviews)
const styles = StyleSheet.create({
 container: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column',
 },
 header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteredColor,
    gap: 10,
    marginBottom: 10,
 },
 title: {
    color: Colors.primaryColor,
    marginBottom: 10,
 },
 awardImage: {
    height: 40,
    width: 40,
 },
 carouselContainer: {
    backgroundColor: Colors.whiteColor,
    width: width * 1,
    paddingBottom: 30,
    marginBottom: -10,
    marginVertical: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
 },
});
