import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Dialog from "react-native-dialog";
import AppText from '../AppText';
import { Colors, Sizes ,Fonts} from '../../constant/styles';
import AppButton from '../AppButton';

const { width } = Dimensions.get('screen')
 const   LocationModal = ({ visible, onConfirm }) => {
  const reverseGeoCode = async (location) => {
    try {
    //    const parseLocation =  JSON.parse(location)
    console.log()
      const reverGeoCodeAdress = await Location.reverseGeocodeAsync({
        longitude: location?.longitude,
        latitude: location?.latitude,
      });
      return (reverGeoCodeAdress[0]);
    } catch (error) {
        console.log("erre",error)
    }
  };
  
  const getAddressFromObject = (locationObject) => {
    const {
      city,
      country,
      district,
      isoCountryCode,
      name,
      postalCode,
      region,
      street,
      streetNumber,
      subregion,
      timezone
    } = locationObject;
  
    let address = '';
    // if (street || name) {
    //   address += street || name;
    // }
    if (streetNumber) {
      address += ` ${streetNumber}`;
    }
    if (city || subregion) {
      address += `, ${city || subregion}`;
    }
    if (region) {
      address += `, ${region}`;
    }
    // if (postalCode) {
    //   address += `, ${postalCode}`;
    // }
    if (country) {
      address += `, ${country}`;
    }
  
    return address;
  };
  const handleConfirm = async () => {
    try {
      // Request permission to access the user's location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // Fetch user's location
        const location = await Location.getCurrentPositionAsync({});
        console.log(location,status,"rrrrrrrrrrr")
        // // Save the location to storage
        // await AsyncStorage.setItem('userLocation', JSON.stringify({
        //   readble:getAddressFromObject(reverseGeoCode(location?.coords)),
        //   coordinate:location?.coords
        // }));
        // Close the modal and notify the parent component
        onConfirm();
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <Dialog.Container
      visible={visible}
      contentStyle={styles.dialogContainerStyle}
    >
      <View style={{ backgroundColor: "white", alignItems: "center" ,justifyContent:'center'}}>
        <View
          style={{
            ...Fonts.grayColor18Medium,
            marginTop: Sizes.fixPadding * 2.0,
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          }}
        >
         <AppText text={' يجب السماح للتطبيق بالوصول لموقعك '} style={{color:Colors.blackColor}}/>
         <AppButton title={'تاكيد'}onPress={handleConfirm}/>
        </View>
      </View>
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 80,
        paddingBottom: Sizes.fixPadding * 3.0,
      },
})




export default  LocationModal