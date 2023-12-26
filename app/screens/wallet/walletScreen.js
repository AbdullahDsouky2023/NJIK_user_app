import { View, Text, Dimensions, ScrollView } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../constant/styles";
import { StyleSheet } from "react-native";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import AppHeader from "../../component/AppHeader";
import ArrowBack from "../../component/ArrowBack";
import PaymentMethod from "../../component/Payment/PaymentMethod";
const amount = "0.0";
const { width } = Dimensions.get("screen");
export default function WalletScreen() {
  const [state, setState] = useState({
    currentPaymentMethodIndex: 2,
    showSuccessDialog: false,
})

const updateState = (data) => setState((state) => ({ ...state, ...data }))

const {
    currentPaymentMethodIndex,
    showSuccessDialog,
} = state;

  return (
    <View style={styles.container}>
      <ArrowBack subPage={true} />
<ScrollView>


      <View style={styles.wrapper}>
        <AppText text={"Your Balance"} style={styles.text} />
        <AppText text={`${amount} جنيه`} style={styles.amount} />
      </View>
        <AppText text={"Choose method to charge your wallet"} style={[styles.text,{marginTop:15,marginLeft:22,fontSize:15}]} centered={false} />
    
    
    <View style={styles.wrapper}>
      <PaymentMethod icon={require('../../assets/images/payment_icon/card.png')}
                        paymentType='Card'
                        index={1}
                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}/>
      <PaymentMethod icon={require('../../assets/images/payment_icon/amazon_pay.png')}
                        paymentType='Card'
                        index={2}
                        updateState={updateState}

                        currentPaymentMethodIndex={currentPaymentMethodIndex}/>
      <PaymentMethod icon={require('../../assets/images/payment_icon/paypal.png')}
                        paymentType='Card'
                        index={3}
                        updateState={updateState}

                        currentPaymentMethodIndex={currentPaymentMethodIndex}/>
      
      <AppButton
        title={"Confirm"}
        style={styles.button}
        textStyle={{ color: Colors.whiteColor }}
        />
      </View>
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
  },
  amount: {
    color: Colors.primaryColor,
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    marginTop:19,
    width:width*0.9,
    marginHorizontal:width*0.05,
    borderRadius:15,
    paddingVertical:10,
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
});
