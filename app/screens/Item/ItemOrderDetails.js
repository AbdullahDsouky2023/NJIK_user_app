import React, { useEffect, useState, useCallback, memo } from "react";
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
import { ar } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "react-native";

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
import { EXPO_PUBLIC_BASE_URL, EXPO_PUBLIC_CLOUDINARY_KEY, EXPO_PUBLIC_CLOUDINARY_PERSIST } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UseLocation from "../../../utils/useLocation";
import { clearCart } from "../../store/features/CartSlice";
import { clearCart as clearServiceCart } from "../../store/features/CartServiceSlice";
import OrderCoupon from "../../component/Coupons/OrderCoupon";

const { width, height } = Dimensions.get("screen");

const ItemOrderDetails = ({ route, navigation }) => {
 const { item } = route.params;
 const [error, setError] = useState();
 const dispatch = useDispatch();
 const { location: userCurrentLocation } = UseLocation();
 const [showSuccess, setShowSuccess] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const totalPrice = useSelector((state) => state.cart.totalPrice);
 const totalPriceServices = useSelector((state) => state.cartService.totalPrice);
 const user = useSelector((state) => state?.user?.user);
 const cartItems = useSelector((state) => state.cart.services);
 const packagesCartItems = useSelector((state) => state.cart.packages);
 const selectedServicesConnect = cartItems.map((item) => ({ id: item }));
 const selectedPackagesConnect = packagesCartItems.map((item) => ({ id: item }));
 const [currentLocation, setCurrentLocation] = useState();
 const userData = useSelector((state) => state?.user?.userData);
 const MAX_RETRIES = 5;

 const currentOrderData = useSelector((state) => state?.orders?.currentOrderData);

 const handleFormSubmit = useCallback(async (values) => {
    try {
      setIsLoading(true);
      await uploadImage(values.images);
      const date = new Date(values?.Date);
      const formattedDate = format(date, "dd MMMM yyyy", {
        locale: ar,
      });

      const formSubmitionData = {
        date: formattedDate?.toString(),
        description: values?.description || "",
        services: {
          connect: selectedServicesConnect,
        },
        packages: {
          connect: selectedPackagesConnect,
        },
        totalPrice: totalPrice,
        phoneNumber: user?.phoneNumber,
        user: userData?.id,
        location: currentLocation?.readable ? currentLocation?.readable : userCurrentLocation?.readable,
        googleMapLocation: currentLocation ? currentLocation : userCurrentLocation,
      };

      dispatch(setCurrentOrderProperties(formSubmitionData));
      navigation.navigate(ORDER_COMFIRM_DETAILS, { item, image: "ff" });
    } catch (error) {
      Alert.alert("حدثت مشكله حاول مرة اخري");
      console.error("Error parsing date or time:", error);
    } finally {
      setIsLoading(false);
    }
 }, [dispatch, totalPrice, user, userData, currentLocation, userCurrentLocation]);

 useEffect(() => {
    (async () => {
      const currentLocation = await AsyncStorage.getItem("userLocation");
      setCurrentLocation(JSON.parse(currentLocation));
    })();
 }, []);

 useEffect(() => {
    return () => {
      dispatch(clearCart());
      dispatch(clearServiceCart());
    };
 }, [dispatch]);

 const validationSchema = yup.object().shape({
    Date: yup.date().required("من فضلك اختار يوم التنفيذ"),
    description: yup.string(),
 });

 const uploadImage = useCallback(async (images, values, ImageName, retryCount = 0) => {
    try {
      setIsLoading(true);
      const imageUrls = [];

      for (const imageUri of images) {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${Date.now()}.jpg`,
        });
        formData.append("upload_preset", EXPO_PUBLIC_CLOUDINARY_PERSIST);

        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${EXPO_PUBLIC_CLOUDINARY_KEY}/image/upload`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Image upload failed with status: ${response.status}`);
          }

          const responseData = await response.json();
          const imageUrl = responseData.secure_url;
          const imageId = responseData.public_id;

          if (imageUrl && imageId) {
            imageUrls.push(imageUrl);
          } else {
            console.error("Error: imageUrl or imageId is undefined");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          if (retryCount < MAX_RETRIES - 1) {
            return uploadImage(images, values, ImageName, retryCount + 1);
          } else {
            console.error("Upload failed after maximum retries.");
          }
        }
      }
      dispatch(setCurrentOrderProperties({ orderImages: imageUrls }));

      return imageUrls;
    } catch (error) {
      console.log("Error uploading image ", error);
    } finally {
      setIsLoading(false);
    }
 }, [dispatch]);

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
                text={"أختر التاريخ"}
                centered={false}
                style={styles.label2}
              />
              <FormDatePicker name="Date" placeholder="Date" />
              <AppText
                text={"معلومات  اخرى"}
                centered={false}
                style={styles.label}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                name="description"
                multiline={true}
                numberOfLines={4}
                width={width * 0.97}
                textAlignVertical="top"
              />
              <AppText
                text={"ارفق صورة"}
                centered={false}
                style={styles.label}
              />
              <FormImagePicker name="images" width={width} />
              {Number(totalPrice || totalPriceServices) > 0 && <OrderCoupon />}
            </View>
          </ScrollView>
          <View style={styles.orderButtonContainer}>
            <PriceTextComponent price={totalPrice || totalPriceServices} style={{ fontSize: 19 }} />
            <SubmitButton title={"Book"} style={styles.buttonSubmit} />
          </View>
        </AppForm>

        <LoadingModal visible={isLoading} />
      </View>
    </SafeAreaView>
 );
};
export default memo(ItemOrderDetails)


const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 15,
    // paddingVertical: 4,
    marginTop:10,
    marginBottom:-4,
    color: Colors.blackColor,
  },
  label2: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    // marginTop:10,
    // marginBottom:-4,
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