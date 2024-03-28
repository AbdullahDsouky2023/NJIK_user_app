import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Dialog } from "react-native-paper";
import ArrowBack from "../../component/ArrowBack";
import { CommonActions } from "@react-navigation/native";
import { ORDER_SUCCESS_SCREEN } from "../../navigation/routes";
import { useTranslation } from "react-i18next";
import AppText from "../../component/AppText";
import { GetOrderData, PayOrderForReserve, updateOrderData } from "../../../utils/orders";
import LoadingModal from "../../component/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getUserByPhoneNumber, updateProviderData, updateUserData } from "../../../utils/user";
import { setUserData } from "../../store/features/userSlice";
import MultiPaymentMethod from '../../component/Payment/MultiPaymentMethods'
import PaymentMethod from '../../component/Payment/PaymentMethod'
import AppButton from "../../component/AppButton";
import { paymentMethodsArray } from "../../data/payment";
const { width, height } = Dimensions.get('screen');

const PaymentScreen = ({ navigation, route }) => {

    const [state, setState] = useState({
        currentPaymentMethodIndex: 2,
        showSuccessDialog: false,
    })
    const user = useSelector((state) => state?.user?.userData);
    const dispatch = useDispatch()
    const updateState = (data) => setState((state) => ({ ...state, ...data }))
    const [isLoading, setIsLoading] = useState(false)
    const [CurrentOrderData, setCurrentOrderData] = useState(null)
    const { handleGenererateInitator, totalAmount, handlePayOrder, orderId } = route?.params
    
    const {
        currentPaymentMethodIndex,
        showSuccessDialog,
    } = state;
    const handleConfirmPayment = async () => {
        console.log("paythe paymendt ", CurrentOrderData?.attributes?.provider?.data?.attributes?.wallet_amount)
        if (currentPaymentMethodIndex === 7) {
            if (CurrentOrderData?.attributes?.provider?.data?.attributes?.wallet_amount >= CalculateProviderFeeForCash()) {
                const providerID = CurrentOrderData?.attributes?.provider?.data?.id
                const FeeDisCounted = Number(CurrentOrderData?.attributes?.provider?.data?.attributes?.wallet_amount) - Number(CalculateProviderFeeForCash());

                handlePayOrder()
                FeeDisCounted > 0 && await updateProviderData(providerID, {
                    wallet_amount: FeeDisCounted
                })
            } else {
                updateState({ showSuccessDialog: true })
                // 

            }
            // console.log("handle pay wit cath",),)
        } else {


            setIsLoading(true)
            handleGenererateInitator()
            setTimeout(() => {

                setIsLoading(false)
            }, 1000);
        }}
    useEffect(() => {
        GetOrderDataComplete()
    }, [])
    const GetOrderDataComplete = async () => {
        try {
            if (orderId) {
                console.log("item ,", orderId)

                const currentOrderData = await GetOrderData(orderId)
                if (currentOrderData) {

                    setCurrentOrderData(currentOrderData)
                }
            }
        } catch (err) {
            console.log("err")
        }
    }
    const handlePayWithWallet = async (amount) => {
        try {
            const res = await updateUserData(user?.id, {
                wallet_amount: Number(user?.wallet_amount) - Number(amount),

            })
            const res2 = await updateOrderData(orderId, {
                payed_with_wallet: true

            })
            if (res) {
                console.log("Success Update User", res)
                const gottenuser = await getUserByPhoneNumber(user?.phoneNumber);

                dispatch(setUserData(gottenuser));
                //   Alert.alert("  تمت عمليةالشحن بنجاح ")

            } else {
                Alert.alert("عذراً هناك مشكلة")
            }
        } catch (err) {
            console.log("error updating the user ", err.message)
        }
    }
    const multiPaymentArray = [
        require("../../assets/images/payment_icon/visa.png"),
        require("../../assets/images/payment_icon/master.png"),
        require("../../assets/images/payment_icon/mada.png"),

    ]
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0, display: 'flex', gap: 18 }}
                >
                    <MultiPaymentMethod
                        icons={multiPaymentArray}
                        paymentType="Card"
                        index={1}
                        updateState={updateState}

                        PaymentStyles={styles.PaymentStyles}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    />
                    <PaymentMethod
                        icon={require('../../assets/images/payment_icon/stc.png')}
                        paymentType='Wallet'
                        index={2}
                                   PaymentStyles={styles.PaymentStyles}

                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    />
                    <PaymentMethod
                        icon={require('../../assets/images/payment_icon/urpay.png')}
                        paymentType='Wallet'
                        index={3}

                                   PaymentStyles={styles.PaymentStyles}


                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    />
                    <PaymentMethod
                        icon={require('../../assets/images/payment_icon/apple.png')}
                        paymentType='Wallet'
                        index={4}
                                   PaymentStyles={styles.PaymentStyles}


                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    />
                    <PaymentMethod
                        icon={require('../../assets/images/payment_icon/tabby.png')}
                        paymentType='Wallet'
                        index={5}
                                   PaymentStyles={styles.PaymentStyles}


                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    />
                    <PaymentMethod
                        icon={require('../../assets/images/payment_icon/tamara.png')}
                        paymentType='Wallet'
                        index={6}
                                   PaymentStyles={styles.PaymentStyles}


                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    />

                    {/* <PaymentMethod
                        icon={require('../../assets/images/payment_icon/cash.png')}
                        paymentType='Wallet'
                        index={7}
                        updateState={updateState}
                        currentPaymentMethodIndex={currentPaymentMethodIndex}
                    /> */}
                </ScrollView>
                {payButton()}
            </View>
            <LoadingModal visible={isLoading} />
            {AlertDialog(`لا يشمل  ${paymentMethodsArray[currentPaymentMethodIndex-1]}  الضمان`,handleConfirmPayment)}

        </SafeAreaView>
    )

    function AlertDialog(text,onPress) {
        return (
            <Dialog
                visible={showSuccessDialog}
                style={styles.dialogWrapStyle}
                onDismiss={() => updateState({ showSuccessDialog: false })}
            >
                <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                    <View style={styles.successIconWrapStyle}>
                        <MaterialIcons name="warning" size={40} color={Colors.primaryColor} />
                    </View>
                    <Text style={{ ...Fonts.blackColor20Medium, marginTop: Sizes.fixPadding + 10.0,textAlign:'center' }}>
                        {text}
                    </Text>
                    <AppButton title={"موافق"} onPress={onPress} />
                </View>
            </Dialog>
        )
    }

    function payButton() {
        const CalculateProviderFeeForCash = () => {
            const fee = totalAmount * 0.2
            return Number(fee).toFixed(2)
        }
        return (
            <View style={styles.payButtonOuterWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={
                ()=>   updateState({ showSuccessDialog: true })
                        // else if(currentPaymentMethodIndex === 2){
                        //     if(user?.wallet_amount >= totalAmount  ){

                        //         handlePayOrder()
                        //         handlePayWithWallet(totalAmount)
                        //     }else {
                        //         updateState({ showSuccessDialog: true })
                        //         console.log(totalAmount,user?.wallet_amount)
                        //     }

                        // }
                    }
                    
                    style={styles.payButtonWrapStyle}
                >
                    <Text style={{ ...Fonts.whiteColor19Medium }}>
                        تأكيد
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }


    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.whiteColor19Medium, marginLeft: Sizes.fixPadding + 5.0 }}>
                    أختيار وسيلة الدفع
                </Text>
                {/* <ArsrowBack/> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-between",
        height: 50,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
    },
    paymentMethodWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        borderWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: Sizes.fixPadding,
    },
    radioButtonStyle: {
        width: 20.0,
        height: 20,
        borderRadius: 10.0,
        borderWidth: 1.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    payButtonOuterWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        borderTopColor: '#ECECEC',
        borderTopWidth: 1.0,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 2.0
    },
    payButtonWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding,
        width: '100%'
    },
    dialogWrapStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 100,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 3.,
        alignSelf: 'center',
    },
    successIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 70.0,
        height: 70,
        borderRadius: 35.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payableAmountWrapStyle: {
        backgroundColor: '#F8F3EC',
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding
    },
    PaymentStyles:
  { 
    height:height*0.09,
    width:width*0.90
  }
})

export default PaymentScreen;