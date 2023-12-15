import { View, Text, Alert, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import AppText from '../AppText';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserData } from '../../../utils/user';
import { useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../loadingScreen';
const { width }= Dimensions.get('screen')
export default function UserLocation() {
    const [currentLocation,setCurrentLocation]=useState(null)
    const userData = useSelector((state)=>state?.user?.userData)
    const { t} = useTranslation()
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let { canAskAgain } = await Location.getForegroundPermissionsAsync();
      if (!canAskAgain && status !== 'granted') {
        // User has denied permission permanently
        Alert.alert(
          t('Permission Required'),
          t('You have denied location access permanently. Please go to Settings and enable location access for this app.'),
          [
            // { text: 'Cancel', onPress: () => console.log('Permission denied'), style: 'cancel' },
            { text: t('Go to Settings'), onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      } else if(canAskAgain && status !== 'granted') {
        // User has denied permission temporarily
        Alert.alert(
          t('Permission Required'),
          t('This app requires access to your location.'),
          [
            // { text: 'Deny', onPress: () => console.log('Permission denied'), style: 'cancel' },
            { text: t('Allow'), onPress: () => requestLocationPermission() },
          ],
          { cancelable: false }
        );
      }else {
        let location = await Location.getCurrentPositionAsync({});
      const coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
          const localStorageLocation = await AsyncStorage.getItem('userLocation')
          if(JSON.parse(localStorageLocation)){
            // console.log("location is present in local stroage",JSON.parse(localStorageLocation))
            setCurrentLocation(JSON.parse(localStorageLocation))
            if(!userData?.location){
              await updateUserData(userData?.id,{
                location:JSON.parse(localStorageLocation).readable
              })
            }
          }else {               
              handleSetCurrentLocation(coordinate)
            }
   
          }
    };
    useEffect(() => {
      requestLocationPermission()
      }, [currentLocation]);

      const handleSetCurrentLocation =   async (coordinate) => {
        try {
           const readableLocation = await  reverseGeoCode(coordinate)
           if (readableLocation) {
               const fromatedLocation = getAddressFromObject(readableLocation)
               setCurrentLocation({
                readable:fromatedLocation,
                coordinate 
               })
               await AsyncStorage.setItem("userLocation",JSON.stringify({
                readable:fromatedLocation,
                coordinate 
               }))
               if(!userData?.location){
                await updateUserData(userData?.id,{
                  location:fromatedLocation
                })
              }
               console.log("setting the location",{
                readable:fromatedLocation,
                coordinate 
               })
            }
            
        } catch (error) {
            Alert.alert("handleSetCurrentLocation")
        }
       };
       const reverseGeoCode = async (location) => {
        try {
        //    const parseLocation =  JSON.parse(location)
          const reverGeoCodeAdress = await Location.reverseGeocodeAsync({
            longitude: location?.longitude,
            latitude: location?.latitude,
          });
          return (reverGeoCodeAdress[0]);
        } catch (error) {
            Alert.alert("reverseGeoCode")
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
// console.log("location",currentLocation)
  return (
    <AppText text={currentLocation?.readable } style={{fontSize:12,width:width*0.4}}/>
 
  

  )
}