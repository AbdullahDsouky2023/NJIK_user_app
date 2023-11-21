import { Rating, AirbnbRating } from "react-native-ratings";
import Modal from "react-native-modal";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import AppText from "./AppText";
import AppFormField from "./Form/FormField";
import AppForm from "./Form/Form";
import SubmitButton from "./Form/FormSubmitButton";
import { AddOrderReview } from "../../utils/orders";
import { Alert } from "react-native";
import { HOME } from "../navigation/routes";
const { width } = Dimensions.get("screen");
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
export default function StarsComponent({
  setIsModalVisible,
  isModalVisible,
  orderID
}) {
  const [rating, setRating] = useState(0);
  const navigation = useNavigation()
  const handleFormSubmit = async (values) => {
    try {
      const res = await AddOrderReview(orderID,{
        rating:rating === 0 ? "5" :rating.toString() ,
        content:values.review || ""
      });
   
      if (res) {
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name:HOME }],
            }))
          Alert.alert("تم بنجاح");
      } else {
        Alert.alert("حدثت مشكله حاول مرة اخري");
      }
    } catch (error) {
      console.log(error, "error paying the order");
    } finally {
      setIsModalVisible(false)
    }
  };
  return (
    <Modal isVisible={isModalVisible}>
      <View style={{ flex: 1, marginTop: "50%" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
          }}
        >
          <AppText text={"تقييمك للخدمه"} />
          <AirbnbRating
            count={5}
            size={35}
            defaultRating={5}
            showRating={false}
            onFinishRating={(r) => setRating(r)}
            starContainerStyle={{
              display: "flex",
              gap: 10,
              width: 100,
              flexDirection: "row-reverse",
              marginVertical: 20,
            }}
          />
        </View>
        <AppForm
          initialValues={{ rating: "", review: "" }}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              borderWidth: 1,
              width: width * 0.85,
              borderColor: "white",
              padding: 10,
            }}
            name="review"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top" 
          />
          <SubmitButton title={"تأكيد"} style={styles.buttonSubmit} />
        </AppForm>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  buttonSubmit: {
    width: width * 0.4,
    marginTop: 10,
    marginLeft: width * 0.2,
  },
});
