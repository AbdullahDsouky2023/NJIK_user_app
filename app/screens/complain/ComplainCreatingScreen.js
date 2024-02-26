import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {  EXPO_PUBLIC_CLOUDINARY_KEY,EXPO_PUBLIC_CLOUDINARY_PERSIST } from "@env"

import ArrowBack from "../../component/ArrowBack";
import { Colors } from "../../constant/styles";
import AppText from "../../component/AppText";
import AppForm from "../../component/Form/Form";
import ErrorMessage from "../../component/Form/ErrorMessage";
import FormField from "../../component/Form/FormField";
import SubmitButton from "../../component/Form/FormSubmitButton";
import { auth } from "../../../firebaseConfig";
import * as Updates from "expo-updates";

import LoadingModal from "../../component/Loading";
import { useDispatch, useSelector } from "react-redux";
import { EXPO_PUBLIC_BASE_URL } from "@env";

import { createComplain } from "../../../utils/complain";
import { AddOrderComplain } from "../../../utils/orders";
import { HOME } from "../../navigation/routes";
import FormImagePicker from "../../component/Form/FormImagePicker";
const { width } = Dimensions.get("screen");
const ComplainCreatingScreen = ({ navigation, route }) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const validPhone = auth?.currentUser?.phoneNumber?.replace("+", "");
  const [ImageID, setImageId] = useState(null);

  const userData = useSelector((state) => state?.user?.userData);
  const validationSchema = yup.object().shape({
    message: yup
      .string()
      // .required(t("Full name is required"))
      .min(10, "الشكوي  المدخله قصيره جدا")
      .max(500, "الشكوي  المدخله طويله جدا"),
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsLoading(true);
      const formData = {
        message: values.message,
        order: {
          connect: [
            {
              id: route?.params?.item?.id,
            },
          ],
        },
        images: null,
        // phoneNumber: Number(validPhone),
      };
      if (values.images) {
        console.log("uplading images", values.images);
        const imagesUrls = await uploadImage(values.images);
        formData.complainImages = imagesUrls;
        res = await createComplain(formData);
      } else {
        res = await createComplain(formData);
      }
      console.log("the dat will be complain", formData);
      if (res) {
        console.log("the resit is ", res?.data.id);
        // const gottenuser = await getUserByPhoneNumber(Number(validPhone))
        await AddOrderComplain(route?.params?.item?.id, res?.data.id);
        // dispatch(setUserData(gottenuser));
        // console.log("the image id is ",ImageID)

        // console.log("the new user is ",gottenuser)
        // await AsyncStorage.setItem("userImage", JSON.stringify(image));

        Alert.alert("تم  تقديم الشكوي بنجاح");
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: t(HOME) }],
          })
        );
        navigation.goBack();
        // if(image) navigation.navigate("Account", { newImage:image })
      } else {
        Alert.alert("Something goes wrong");
      }
    } catch (err) {
      console.log("error creating the resi", err);
    } finally {
      setIsLoading(false);
    }
  };
  const uploadImage = async (images, values, ImageName, retryCount =  0) => {
    try {
      setIsLoading(true);
      const imageUrls = []; // Use an object to store image URLs with their IDs as keys
  
      for (const imageUri of images) {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg", // Ensure this matches the file type
          name: `image_${Date.now()}.jpg`, // Generate a unique file name
        });
        formData.append("upload_preset", EXPO_PUBLIC_CLOUDINARY_PERSIST ); // Replace with your Cloudinary upload preset
  
        try {
          const response = await fetch(`https://api.cloudinary.com/v1_1/${EXPO_PUBLIC_CLOUDINARY_KEY }/image/upload`, {
            method: "POST",
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error(`Image upload failed with status: ${response.status}`);
          }
  
          const responseData = await response.json();
          const imageUrl = responseData.secure_url; // The URL of the uploaded image
          const imageId = responseData.public_id; // Assuming the response includes the public_id of the image
  
          if (imageUrl && imageId) {
            imageUrls.push(imageUrl); // Store the URL with its ID as the key
            console.log("The image URL:", imageUrl);
          } else {
            console.error("Error: imageUrl or imageId is undefined");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          // If upload fails and retries are not exhausted, retry
          if (retryCount < MAX_RETRIES -  1) {
            console.log(`Retrying upload... Attempt ${retryCount +  1}`);
            return uploadImage(images, values, ImageName, retryCount +  1);
          } else {
            console.error("Upload failed after maximum retries.");
          }
        }
      }
      console.log("the images was upload correlty ",imageUrls)
      // Dispatch the image URLs to your Redux store or handle them as needed
      //  dispatch(setCurrentOrderProperties({ orderImages: imageUrls }));
  
      return imageUrls;
    } catch (error) {
      console.log("Error uploading image ", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const getItemInfo = async () => {
    try {
      console.log("item for comlain", route?.params?.item?.id);
    } catch (error) {
      console.log("error getting the user fo rthe fir", error);
    }
  };

  useEffect(() => {
    getItemInfo();
  }, [dispatch]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <ArrowBack />
      <ScrollView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <AppText
              text={"Report Complain"}
              style={{ color: Colors.primaryColor, marginBottom: 10 }}
            />
            <AppForm
              enableReinitialize={true}
              initialValues={{
                fullName: "",
                emailAddress: "",
                location: "",
                images: [],
              }}
              onSubmit={(data) => handleFormSubmit(data)}
              validationSchema={validationSchema}
            >
              <ErrorMessage error={error} visible={error} />

              <AppText
                text={"The Complain"}
                centered={false}
                style={[styles.header, { marginTop: 10 }]}
              />
              <FormField
                autoCapitalize="none"
                autoCorrect={false}
                mul
                // keyboardType="email-address"
                name="message"
                // placeholder="emailAddress"
                // textContentType="emailAddress"
                multiline={true}
                styles={{
                  // backgroundColor:'red',
                  padding: 10,
                }}
                numberOfLines={7}
                // placeholder={userData?.city}
              />
              <AppText
                text={"أرفق صورة"}
                centered={false}
                style={[styles.header, { marginTop: 10 }]}
              />

              <FormImagePicker name="images" width={width} />

              <SubmitButton title="Confirm" />
            </AppForm>
          </View>
        </ScrollView>
        <LoadingModal visible={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: RFPercentage(2.1),
    paddingHorizontal: width * 0.05,
    color: Colors.blackColor,
    // backgroundColor:'red',
    marginBottom: width * 0.001,
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default ComplainCreatingScreen;
