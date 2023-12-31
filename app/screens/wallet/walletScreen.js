import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constant/styles";
import { StyleSheet } from "react-native";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import AppHeader from "../../component/AppHeader";
import ArrowBack from "../../component/ArrowBack";
import PaymentMethod from "../../component/Payment/PaymentMethod";
import { CURRENCY } from "../../navigation/routes";
import { ColorSpace } from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import SuccessModel from "../../component/SuccessModal";

const { width } = Dimensions.get("screen");
export default function WalletScreen() {
  const [state, setState] = useState({
    currentPaymentMethodIndex: 2,
    showSuccessDialog: false,
  });
  const [amount, setAmmount] = useState("0");
  const [AddedAmount, setAddedAmount] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const handleAmountChange = (text) => {
    const parsedAmount = Number(text);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setAddedAmount(parsedAmount);
      updateState({ currentPaymentMethodIndex: 4 });
    } else {
      // Display an error message or visual cue
      setAddedAmount(null); // Clear invalid input
      // Alert.alert("Please enter a valid amount greater than 0.");
    }
  };
  const handleConfirmCharge = () => {
    if (Number(AddedAmount) > 0) {
      setAmmount((prevAmount) => Number(prevAmount) + Number(AddedAmount));
      setShowSuccessModal(true);
      setAddedAmount(null); // Clear the input after successful charge
    }
  };

  // In SuccessModel component:
  const handleModalDismiss = () => {
    setShowSuccessModal(false);
    setAddedAmount(null); // Clear input when modal closes
  };

  const { currentPaymentMethodIndex, showSuccessDialog } = state;

  return (
    <View style={styles.container}>
      <ArrowBack subPage={true} />
      <ScrollView>
        <View style={styles.wrapper}>
          <AppText text={"Your Balance"} style={styles.text} />
          <AppText text={`${amount} ` + CURRENCY} style={styles.amount} />
        </View>

        <View style={styles.wrapper}>
          <View style={styles.HeaderContainer}>
            <FontAwesome5 name="money-check" size={16} color="black" />
            <AppText
              text={"Choose method to charge your wallet"}
              style={[styles.text]}
              centered={false}
            />
          </View>
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/card.png")}
            paymentType="Card"
            index={1}
            updateState={updateState}
            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/amazon_pay.png")}
            paymentType="Card"
            index={2}
            updateState={updateState}
            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/paypal.png")}
            paymentType="Card"
            index={3}
            updateState={updateState}
            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          <TouchableWithoutFeedback
            index={4}
            onPress={() => updateState({ currentPaymentMethodIndex: 4 })}
          >
            <View style={styles.amountContainer}>
              <AppText
                text={"Enter Amount"}
                centered={false}
                style={styles.amountText}
              />
              <TextInput
                keyboardType="numeric"
                selectionColor={Colors.primaryColor}
                value={AddedAmount}
                onChangeText={(text) => handleAmountChange(text)}
                style={styles.input}
              />
              <AppText
                text={CURRENCY}
                centered={false}
                style={{ paddingHorizontal: 5, color: Colors.blackColor }}
              />
            </View>
          </TouchableWithoutFeedback>

          <AppButton
            title={"Confirm"}
            style={styles.button}
            // onPress={handleConfirmCharge}
            textStyle={{ color: Colors.whiteColor }}
          />
        </View>
        <SuccessModel
          visible={showSuccessModal}
          onPress={() => handleModalDismiss()}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    height: "100%",
  },
  text: {
    color: Colors.blackColor,
    fontSize: 15,
  },
  amount: {
    color: Colors.primaryColor,
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 19,
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    paddingVertical: 10,
    justifyContent: "center",
    backgroundColor: Colors.piege,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    // width:width * 0.7.toFixed,
    // marginHorizontal:20
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  operation: {
    paddingVertical: 100,
    display: "flex",
    alignItems: "center",
  },
  amountText: {
    paddingHorizontal: 10,
    color: Colors.blackColor,
    // paddingTop:10
  },
  input: {
    color: "red",
    borderBottomWidth: 1,
    paddingHorizontal: 35,
    marginTop: -10,
    fontSize: 18,
    borderColor: Colors.primaryColor,
  },
  amountContainer: {
    paddingTop: 18,
    display: "flex",
    alignItems: "center",
    // justifyContent:'center',
    flexDirection: "row",
    gap: 10,
  },
  HeaderContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
    alignItems: "center",
    // justifyContent:'center',
    gap: 10,
    // backgroundColor:'red',
    paddingVertical: 10,
    width: width * 0.8,
  },
});
