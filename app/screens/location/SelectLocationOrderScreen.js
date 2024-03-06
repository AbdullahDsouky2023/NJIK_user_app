import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import ArrowBack from "../../component/ArrowBack";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";

import { auth } from "../../../firebaseConfig";

import { Ionicons } from "@expo/vector-icons";

import LoadingModal from "../../component/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getLocationFromStorage } from "../../../utils/location";
import { TouchableOpacity } from "react-native";
import {
  ITEM_ORDER_DETAILS,
  MANUAL_LOCATION_ADD,
  ORDER_SELECT_REGION,
} from "../../navigation/routes";
import * as Location from 'expo-location';

import SelectLocationItem from "../../component/location/SelectLocationItem";
import AppButton from "../../component/AppButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCurrentOrderProperties } from "../../store/features/ordersSlice";
import useRegions from "../../../utils/region";
import MapScreen from "../map/MapScreen";
const { width } = Dimensions.get("screen");

const SlectLocationOrderScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const validPhone = auth?.currentUser?.phoneNumber?.replace("+", "");
  const userData = useSelector((state) => state.user?.userData);
  const { data:regions} = useRegions()
  const [manualLocations, setManualLocations] = useState([]);
  useEffect(() => {
    loadManualLocations();
    // Check if there are updated locations from the AddAddressScreen
    if (route.params?.updatedLocations) {
      setManualLocations(route?.params?.updatedLocations);
    }
  }, [route?.params?.updatedLocations]);
  const loadManualLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem("manualLocations");

      if (storedLocations !== null) {
        setManualLocations(JSON.parse(storedLocations));
      }
    } catch (error) {
      console.error("Error loading manual locations:", error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
     handleSetCurrentLocation(coordinate)
    })();
  }, []);
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
const handleSetCurrentLocation =   async (coordinate) => {
    try {
       const readableLocation = await  reverseGeoCode(coordinate)
       if (readableLocation) {
           const fromatedLocation = getAddressFromObject(readableLocation)
           setCurrentLocation({
            readable:fromatedLocation,
            coordinate 
           })
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


  const handleSubmitLocation = () => {
    dispatch(setCurrentOrderProperties({ location: selectedLocation.readable,googleMapLocation:selectedLocation }));
    // dispatch(setCurrentOrderProperties({ region: regions.data[0]?.id }));

       navigation.navigate(ITEM_ORDER_DETAILS, { item: route?.params?.item });

  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        <ArrowBack />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={styles.headerContainer}>
              <AppText
                text={"address"}
                style={{
                  color: Colors.primaryColor,
                  marginBottom: 10,
                  fontSize: 19,
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(MapScreen,  { item: route?.params?.item })
                }
              >
                <Ionicons
                  name="ios-add-circle-outline"
                  size={32}
                  color={Colors.blackColor}
                />
              </TouchableOpacity>
            </View>
            <SelectLocationItem
              selectedLocation={selectedLocation}
              item={currentLocation}
              setSelectedLocation={setSelectedLocation}
            />
            <View>
              <AppText
                text={"Manual Location"}
                centered={false}
                style={{ color: Colors.blackColor, marginBottom: 10 }}
              />
              {/* currentLocation primary */}
              {
                manualLocations?.length ===0 ? (<AppText text={"There is no locations"}/>):
                <FlatList
                data={manualLocations}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}

                renderItem={({ item }) => (
                  <SelectLocationItem
                  selectedLocation={selectedLocation}
                  item={item}
                  setSelectedLocation={setSelectedLocation}
                  />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  />
                }
            </View>
          </View>
        </ScrollView>
        {selectedLocation && (
          <AppButton title={"Confirm"} onPress={handleSubmitLocation}  />
        )}
        <LoadingModal visible={isLoading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  currentLocation: {
    height: "auto",
    width: width * 0.95,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 10,
    padding: 10,
  },
  headerContainer: {
    display: "flex",
    alignContent: "center",
    width: width * 0.94,
    marginTop: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default SlectLocationOrderScreen;
