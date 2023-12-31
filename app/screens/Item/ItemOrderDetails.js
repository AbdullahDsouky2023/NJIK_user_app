import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import * as yup from "yup";
import { format } from "date-fns";
import { arDZ } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";

import ArrowBack from "../../component/ArrowBack";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppForm from "../../component/Form/Form";
import ErrorMessage from "../../component/Form/ErrorMessage";
import FormField from "../../component/Form/FormField";

import FormDatePicker from "../../component/Form/FormDatePicker";
import SubmitButton from "../../component/Form/FormSubmitButton";
import FormTimePicker from "../../component/Form/FormTimePicker";
import FormImagePicker from "../../component/Form/FormImagePicker";
import { ORDER_COMFIRM_DETAILS, ORDER_SUCCESS_SCREEN } from "../../navigation/routes";
import { clearCurrentOrder, setCurrentOrderProperties } from "../../store/features/ordersSlice";
import PriceTextComponent from "../../component/PriceTextComponent";
import LoadingModal from "../../component/Loading";
import {  EXPO_PUBLIC_BASE_URL} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import UseLocation from "../../../utils/useLocation";
import { clearCart } from "../../store/features/CartSlice";
import OrderCoupon from "../../component/Coupons/OrderCoupon";

const { width } = Dimensions.get("window");

export default function ItemOrderDetails({ route, navigation }) {
  const { item } = route.params;
  const [error, setError] = useState();
  const dispatch = useDispatch()
  const { location:userCurrentLocation} = UseLocation()
  const [showSuccess, setShowSuccess] = useState(false);
const [isLoading,setIsLoading]=useState(false)
const totalPrice = useSelector((state)=>state.cart.totalPrice)
  const user = useSelector((state) => state?.user?.user);
  const cartItems = useSelector((state) => state.cart.services);
  const packagesCartItems = useSelector((state) => state.cart.packages);
  const selectedServicesConnect =  cartItems.map(item => ({ id: item }));
  const selectedPackagesConnect =  packagesCartItems.map(item => ({ id: item }));
  const [currentLocation,setCurrenttLocation]=useState()
  const userData = useSelector((state) => state?.user?.userData);
  const currentOrderData = useSelector((state) => state?.orders?.currentOrderData);
  console.log("ititit",totalPrice)
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
  
      // Wait for the image upload to complete
      await uploadImage(values.images);
  console.log(values.images)
      // Create valid Date objects
      const date = new Date(values?.Date);
  
      // Format the date and time
      const formattedDate = format(date, "dd MMMM yyyy", {
        locale: arDZ,
      });
  
      const formSubmitionData = {
        date: formattedDate?.toString(),
        description: values?.description || "",
        services: {
          connect: selectedServicesConnect
        },
        packages: {
          connect: selectedPackagesConnect
        },
        totalPrice:totalPrice,
        phoneNumber: user?.phoneNumber,
        user: userData?.id,
         location: currentLocation?.readable ?  currentLocation?.readable :userCurrentLocation?.readable,
         googleMapLocation:currentLocation ? currentLocation : userCurrentLocation 
      };
  
      dispatch(setCurrentOrderProperties(formSubmitionData));
      console.log(formSubmitionData)
      navigation.navigate(ORDER_COMFIRM_DETAILS,{item,image:"ff"})
    } catch (error) {
      Alert.alert("حدثت مشكله حاول مرة اخري");
      console.error("Error parsing date or time:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    (async () => {
      const currentLocation = await AsyncStorage.getItem("userLocation")
      setCurrenttLocation(JSON.parse(currentLocation))
   
    })();
  },[])
  useEffect(()=>{
    return ()=>{
      dispatch(clearCart())
      console.log("clearing order dea")
    }
  },[])

  const validationSchema = yup.object().shape({
    Date: yup.date().required("من فضلك اختار يوم التنفيذ"),
    description: yup.string(),
  });
  const uploadImage = async (image, values) => {
    try {
      const imageIds = [];
      console.log("the images array ",image)
    for (const imageUri of image) {
      const formData = new FormData();
      formData.append("files", {
        name: `Nijk_IMAGE_ORDER`,
        type: "image/jpeg",
        uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
      });

      try {
        const response = await fetch(`${EXPO_PUBLIC_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Image upload failed with status: ${response.status}`);
        }

        const responseData = await response.json();
        const imageId = responseData[0]?.id;
        imageIds.push(imageId);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error gracefully
      }
    }
    console.log("the image ids are ",imageIds)
    dispatch(setCurrentOrderProperties({ images: imageIds }));

    // ... continue with form submission ...
  } catch (error) {
    // ... error handling ...
  }
  };
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.bodyBackColor,
        position: "relative",
        height: "100%",
      }}
    >
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1, paddingBottom: 100 }}>
        <ArrowBack />
        <AppForm
          enableReinitialize={true}
          initialValues={{ Date: "", description: "", images: [] }}
          onSubmit={handleFormSubmit}
          validationSchema={validationSchema}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <AppText
                text={item?.attributes?.name}
                style={{
                  color: Colors.primaryColor,
                  marginBottom: 10,
                  fontSize: 15,
                }}
              />
              <ErrorMessage error={error} visible={error} />
              <AppText
                text={"يوم التنفيذ"}
                centered={false}
                style={styles.label}
              />
              <FormDatePicker name="Date" placeholder="Date" />
              <AppText
                text={"معلومات  اخري"}
                centered={false}
                style={styles.label}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="description" // Make sure the name matches the field in the form values
                // placeholder="description"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top" // Add this line

                // ... other props
              />
              <AppText
                text={"ارفق صورة"}
                centered={false}
                style={styles.label}
              />
              <FormImagePicker name="images" width={width} />
              {
               Number(totalPrice) >0 &&
             <OrderCoupon/>
              }

            </View>
          </ScrollView>
          <View style={styles.orderButtonContainer}>
           <PriceTextComponent price={totalPrice} style={{fontSize:19}}/>
            <SubmitButton title={"Book"} style={styles.buttonSubmit} />
          </View>
        </AppForm>

        <LoadingModal visible={isLoading} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    color: Colors.blackColor,
  },
  orderButtonContainer: {
    height: 100,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    width: width,
    backgroundColor: Colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    bottom: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  buttonSubmit: {
    width: width * 0.3,
    marginTop: 10,
  },
});