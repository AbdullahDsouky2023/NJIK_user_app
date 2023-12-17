import { Alert, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserData } from './user';
import { useSelector} from 'react-redux'
import { useTranslation } from 'react-i18next';
const { width }= Dimensions.get('screen')
export default function UseLocation() {
    const [currentLocation,setCurrentLocation]=useState(null)
    const userData = useSelector((state)=>state?.user?.userData)
    const [locationCorrdinate,setLocationCoordinate]=useState(null)
    const { t} = useTranslation()
  
    const requestLocationPermission = async () => {
      try {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      function getCurrentLocation() {
        const timeout = 10000;
        return new Promise(async (resolve, reject) => {
          setTimeout(() => { reject(Alert.alert(`Error getting gps location after ${(timeout * 2) / 1000} s`)) }, timeout * 2);
          setTimeout(async () => { resolve(await Location.getLastKnownPositionAsync()) }, timeout);
          resolve(await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest}));
        });
      }
        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest})
      const coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
          setLocationCoordinate(JSON.stringify(coordinate))
          const localStorageLocation = await AsyncStorage.getItem('userLocation')
          if(JSON.parse(localStorageLocation)){
            // console.log("location is present in local stroage",JSON.parse(localStorageLocation))
            setCurrentLocation(JSON.parse(localStorageLocation))
            if(!userData?.location){
              await updateUserData(userData?.id,{
                location:JSON.parse(localStorageLocation)?.readable
              })
            }
            Alert.alert("Data Found",JSON.stringify(localStorageLocation))
          }else {               
            handleSetCurrentLocation(coordinate)
            Alert.alert("Data Not  Found",JSON.stringify(localStorageLocation))

          }
        }catch(error){
          Alert.alert("error requesting the location")
        }
   
          
    };
    useEffect(() => {
      requestLocationPermission()
      console.log("the user current location",currentLocation)
      }, []);

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
    {
        location:currentLocation,
        coordinate:locationCorrdinate
    }
 )
}