import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, memo, useCallback } from "react";
import { Colors, Sizes } from "../../constant/styles";
import { StyleSheet } from "react-native";
import AppText from "../../component/AppText";
import AppButton from "../../component/AppButton";
import AppHeader from "../../component/AppHeader";
import ArrowBack from "../../component/ArrowBack";
import PaymentMethod from "../../component/Payment/PaymentMethod";
import { CECKOUT_WEBVIEW_SCREEN, CHECkOUT_COUNTRY, CURRENCY } from "../../navigation/routes";
import { ColorSpace } from "react-native-reanimated";
import MultiPaymentMethod from '../../component/Payment/MultiPaymentMethods'
import { FontAwesome5 } from "@expo/vector-icons";
import { v4 as uuidv4 } from 'uuid';
import { T } from "ramda";
import { useTranslation } from "react-i18next";
import Dialog from "react-native-dialog";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import initiatePayment from "../../utils/Payment/Initate";
import { calculateTotalWithTax, fetchZipCode, getZipCode } from "../../utils/Payment/helpers";
import { useNavigation } from "@react-navigation/native";
import { getUserByPhoneNumber, updateUserData } from "../../../utils/user";
import { setUserData } from "../../store/features/userSlice";
import LoadingModal from "../../component/Loading";
import UseLocation from "../../../utils/useLocation";
import SuccessModel from "../../component/SuccessModal";

const { width ,height} = Dimensions.get("screen");
export default function WalletScreen() {
  const { t } = useTranslation()
  const [loading, setIsLoading] = useState(false)
  const [state, setState] = useState({
    currentPaymentMethodIndex: 1,
    showSuccessDialog: false,
  });
  const user = useSelector((state) => state?.user?.userData);

  const [modalVisible, setShowModalVisible] = useState(false);

  const [amount, setAmmount] = useState(0);
  const updateState = (data) => setState((state) => ({ ...state, ...data }))
  const { currentPaymentMethodIndex, showSuccessDialog } = state;
  const multiPaymentArray = [
    require("../../assets/images/payment_icon/visa.png"),
    require("../../assets/images/payment_icon/master.png"),
    require("../../assets/images/payment_icon/mada.png"),

  ]
  return (
    <View style={styles.container}>
      <ArrowBack subPage={true} />
      <ScrollView>
        <View style={styles.wrapper}>
          <AppText text={"Your Balance"} style={styles.text} />
          <AppText text={`${user?.wallet_amount || 0} ` + t(CURRENCY)} style={styles.amount} />
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
          <View style={{marginBottom:10,display:'flex',alignItems:'center',}}>
          <MultiPaymentMethod
          icons = {multiPaymentArray}
            paymentType="Card"
            index={1}
            PaymentStyles={styles.PaymentStyles}

            updateState={updateState}
            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
         
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/stc.png")}
            paymentType="Card"
            index={2}
            PaymentStyles={styles.PaymentStyles}
            updateState={updateState}
            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/urpay.png")}
            paymentType="Card"
            index={3}
            PaymentStyles={styles.PaymentStyles}

            updateState={updateState}
            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/apple.png")}
            paymentType="Card"
            index={4}
            updateState={updateState}
            PaymentStyles={styles.PaymentStyles}

            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          <PaymentMethod
            icon={require("../../assets/images/payment_icon/sadad.png")}
            paymentType="Card"
            index={5}
            updateState={updateState}
            PaymentStyles={styles.PaymentStyles}

            currentPaymentMethodIndex={currentPaymentMethodIndex}
          />
          </View>
      
          <AppButton
            title={"Confirm"}
            disabled={!(currentPaymentMethodIndex )}
            textStyle={{fontSize:RFPercentage(2.7)}}
            style={styles.button}
            onPress={() => setShowModalVisible(true)}
          // textStyle={{ color: Colors.whiteColor }}
          />

        </View>
        <HandleGetAmountComponentModal
          visible={modalVisible}
          updateState={updateState}
          // onPress={() => handleModalDismiss()}
          setVisible={setShowModalVisible}
          setIsLoading={setIsLoading}
        />
        <LoadingModal visible={loading} />
        <SuccessModel visible={showSuccessDialog} onPress={() => updateState({ showSuccessDialog: false })} />
      </ScrollView>
    </View>
  );
}



const HandleGetAmountComponentModal = memo(({ visible, setVisible, setIsLoading, updateState }) => {
  const { t } = useTranslation()
  const [amount, setAmmount] = useState(null)
  const dispatch = useDispatch()
  const user = useSelector((state) => state?.user?.userData);
  const navigation = useNavigation()
  const handleSetAmount = useCallback(
    (text) => {
      // Check if the text is numeric or empty
      if (/^\d*$/.test(text)) {
        setAmmount(text);
        console.log("text", text)
      }

    },
    [],
  )
  console.log("usre ", user?.wallet_amount)
  const handlePayOrder = async () => {
    navigation.navigate("App");
    console.log("the order Was payed Successfully with amooount ", amount);
    if (!user) {
      console.log("User data is not available");
      // Handle the case where user data is not available
      return;
    }
    try {
      const res = await updateUserData(user.id, {
        wallet_amount: Number(user.wallet_amount) + Number(amount),
      });
      if (res) {
        console.log("Success Update User", res);
        const gottenuser = await getUserByPhoneNumber(user.phoneNumber);
        dispatch(setUserData(gottenuser));
        updateState({ showSuccessDialog: true });
      } else {
        Alert.alert("عذراً هناك مشكلة");
      }
    } catch (err) {
      console.log("error updating the user ", err.message);
    }
  };

  const handleGenererateInitator = (amount) => {
    console.log("amount is ", amount)
    setIsLoading(true)
    const orderAmmount = Number(amount)
    const uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const username = user?.username.trim(); // Remove any leading or trailing spaces
    const nameParts = username?.split(' '); // Split the username into parts

    const firstName = nameParts[0]; // The first part is the first namef
    const lastName = nameParts.slice(1).join(' '); // The rest are the last name
    const orderDetails = {
      orderId: `CHARGE_${uniqueId}`,
      amount: orderAmmount.toFixed(2),
      currency: CURRENCY,
      description: `Charge Wallet With amount of ${Number(amount).toFixed(2)}`,
      payerFirstName: firstName,
      payerLastName: lastName,
      payerAddress: user?.location,
      payerCountry: CHECkOUT_COUNTRY,
      payerCity: user?.city,
      payerEmail: user?.email,
      payerPhone: user?.phoneNumber,
    };
    setVisible(false)
    setAmmount(null)
    initiatePayment(orderDetails)
      .then(response => {
        // console.log("the charge respons ie ",response?.redirect_url)
        navigation.navigate(CECKOUT_WEBVIEW_SCREEN, {
          url: response?.redirect_url,
          orderId: `CHARGE_${uniqueId}`,
          handlePayOrderFun: handlePayOrder
        })
        console.log('Payment initiated successfully:', response?.redirect_url)
      })
      .catch(error => {
        console.error('Error genereation payment:', error)
        // Alert.alert("Error genereation ", JSON.stringify(orderDetails), [ { text: "OK", }, ]);

      }).finally(() => {


        setIsLoading(false)
        setAmmount(null)

      }
      )


      ;
  }
  return (
    <Dialog.Container
      visible={visible}
      onBackdropPress={() => {
        setVisible(false)
        setAmmount(null)

      }}
      contentStyle={styles.dialogContainerStyle}
    >

      <AppText
        text={"Enter Amount"}
        centered={true}
        style={styles.amountText}
      />
      <TouchableWithoutFeedback
        index={4}
        onPress={() => updateState({ currentPaymentMethodIndex: 4 })}
      >
        <View style={styles.amountContainer}>
          <TextInput
            keyboardType="numeric"
            selectionColor={Colors.primaryColor}
            value={amount}
            onChangeText={handleSetAmount}
            style={styles.input}
          />


          {/* <AppText text={CURRENCY} style={styles.currencyStyle}/> */}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.buttonsContainer}>
        <AppButton
          title={"Confirm"}
          disabled={!amount || amount < 50}

          style={styles.button}
          onPress={() => handleGenererateInitator(amount)}
        />

      </View>
    </Dialog.Container>
  )
})
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
    fontSize: RFPercentage(2.3)
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    width: width * 0.9,
    gap: 6,
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    paddingVertical: 10,
    justifyContent: "center",
    backgroundColor: Colors.piege,
  },
  button: {
    width: width * 0.4,
    marginTop:5
  },
  CloseButton: {
    backgroundColor: 'red'
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
    fontSize: RFPercentage(2.5)
    // paddingTop:10
  },
  input: {
    color: "red",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 15,
    fontSize: RFPercentage(2.8),
    borderColor: Colors.primaryColor,
    textAlign: 'center'
  },
  amountContainer: {
    paddingTop: 18,
    display: "flex",
    // paddingLeft:width*0.15,
    alignItems: "center",
    // justifyContent:'center',
    flexDirection: "row",
    gap: 20,
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
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width * 0.9,
    // paddingBottom: Sizes.fixPadding * 3.0,
    display: 'flex',
    alignItems: 'center',
    // gap:5,
    justifyContent: 'center'
  },
  currencyStyle: {
    color: Colors.primaryColor,

    fontSize: RFPercentage(2.5)

  },PaymentStyles:
  { 
    height:height*0.08,
    width:width*0.85
  }
});