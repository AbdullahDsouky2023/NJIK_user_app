import { Alert, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserData } from './user';
import { useSelector} from 'react-redux'
import * as Updates from "expo-updates";

import { useTranslation } from 'react-i18next';
const { width }= Dimensions.get('screen')
export default function UseLocation() {
    const [currentLocation,setCurrentLocation]=useState(null)
    const userData = useSelector((state)=>state?.user?.userData)
    const [locationCorrdinate,setLocationCoordinate]=useState(null)
    const { t} = useTranslation()
    const [zipCode, setZipCode] = useState(null); // New state for zip code
    const requestLocationPermission = async () => {
      try {

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
        return;
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
        return;

      }
        let location = await Location.getCurrentPositionAsync({})
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
          }else {               
            handleSetCurrentLocation(coordinate)

          }
        }catch(error){
          console.log("error requesting the location",JSON.stringify(error.message))
          // console.error(error)
        }
   
          
    };
    useEffect(() => {
      requestLocationPermission()
      if(currentLocation === null){
        requestLocationPermission()
        //  Updates.reloadAsync();
      }
      }, []);

      const handleSetCurrentLocation = async (coordinate) => {
        try {
          const readableLocation = await reverseGeoCode(coordinate);
          if (readableLocation) {
            const formattedLocation = getAddressFromObject(readableLocation);
            setCurrentLocation({
              readable: formattedLocation,
              coordinate,
            });
            // Set the zip code
            setZipCode(readableLocation?.postalCode);
            await AsyncStorage.setItem("userLocation", JSON.stringify({
              readable: formattedLocation,
              coordinate,
            }));
            if (!userData?.location) {
              await updateUserData(userData?.id, {
                location: formattedLocation,
              });
            }
            console.log("setting the location", {
              readable: formattedLocation,
              coordinate,
            });
          }
        } catch (error) {
          console.log("handleSetCurrentLocation", JSON.stringify(error.message));
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
            console.log("reverseGeoCode",JSON.stringify(error.message))
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
      console.log("the postal Code is ",postalCode)
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
        coordinate:locationCorrdinate,
        zipCode: zipCode, // Return the zip code

    }
 )
}