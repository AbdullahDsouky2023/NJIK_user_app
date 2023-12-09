import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FAB, IconButton } from 'react-native-paper';
import AppButton from '../../component/AppButton';
import ReserveButton from '../../component/ReverveButton';
import { Colors } from '../../constant/styles';
import AppText from '../../component/AppText';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ITEM_ORDER_DETAILS } from '../../navigation/routes';
import { useDispatch} from 'react-redux'
import { setCurrentOrderProperties } from '../../store/features/ordersSlice';
const MapScreen = ({navigation,route}) => {
 const [markers, setMarkers] = useState([]);
 const [region, setRegion] = useState(null);
 const [marker, setMarker] = useState(null);
 const [address, setAddress] = useState(null);
 const dispatch = useDispatch()
const [locationData,setLocationData] = useState(null)
useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  })();
}, []);


 const handleMapPress = async (e) => {
    try {
        const coordinate = e.nativeEvent.coordinate;
        console.log(coordinate);
        setMarker(coordinate);
       
       const readableLocation = await  reverseGeoCode(coordinate)
       if (readableLocation) {
           const fromatedLocation = getAddressFromObject(readableLocation)
           setLocationData({
            readable:fromatedLocation,
            coordinate 
           })
        setAddress(fromatedLocation);
        }
        
    } catch (error) {
        console.log("location",error)
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
  const handleAddLocation = async (data) => {
    if (data) {
      try {
        const storedLocations = await AsyncStorage.getItem("manualLocations");
        const existingLocations = storedLocations
          ? JSON.parse(storedLocations)
          : [];

        const updatedLocations = [...existingLocations, data];
        await AsyncStorage.setItem(
          "manualLocations",
          JSON.stringify(updatedLocations)
        );
        dispatch(setCurrentOrderProperties({ googleMapLocation:data ,location:data.readable }));
    
           navigation.navigate(ITEM_ORDER_DETAILS, { item: route?.params?.item });
         
          // Navigate back to the Address screen
          
      } catch (error) {
        console.error("Error adding manual location:", error);
      }
    }
  };
  
 return (
 <View style={{ flex: 1 }}>
  <MapView
    provider={PROVIDER_GOOGLE}
    style={{ flex: 1 }}
    initialRegion={region}
    onPress={handleMapPress}
  >
    {marker && <Marker coordinate={marker} />}
  </MapView>
  {marker && (
    <View style={{ position: 'absolute', bottom: 0, right: 0 ,backgroundColor:Colors.grayColor}}>
      <ReserveButton title={"تاكيد"}  text={address} onPress={() => handleAddLocation(locationData)}/>
         </View>
  )}
 </View>
 );
};

export default MapScreen;