// Import necessary modules
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { CECKOUT_WEBVIEW_SCREEN, SUCESS_PAYMENT_SCREEN } from '../../navigation/routes';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { checkOrderStatus } from '../../utils/Payment/Initate';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { Dialog as PaperDialog } from 'react-native-paper';
import { Colors, Fonts, Sizes } from "../../constant/styles";
import AppText from '../../component/AppText';

const { width , height } = Dimensions.get('screen')
export default function PaymentWebview({ route, navigation }) {
    const url = route?.params?.url
    const orderId = route?.params?.orderId
    const handlePayOrder = route?.params?.handlePayOrderFun
    const [lastMessage, setLastMessage] = useState(null);
    const webViewRef = useRef(null)
    const [orderStatusChecked, setOrderStatusChecked] = useState(false);
const [showDialog,setShowDialog]=useState(false)
    const handleWebViewError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error: ', nativeEvent);
        // Handle the error, e.g., show an alert or navigate to an error screen
        Alert.alert('Error loading payment page');
    };

    const debugging = `
    const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({
      'type': 'Console',
      'data': {
        'type': type,
        'log': log
      }
    }));
  
    console = {
        log: (...args) => consoleLog('log', args),
        debug: (...args) => consoleLog('debug', args),
        info: (...args) => consoleLog('info', args),
        warn: (...args) => consoleLog('warn', args),
        error: (...args) => consoleLog('error', args),
     };
  `;
    const reloadWebView = () => {
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    };
    const handleWebViewMessage = (payload) => {
        let dataPayload;
        try {
            dataPayload = JSON.parse(payload.nativeEvent.data);
        } catch (e) {
            console.error("error ", e)
        }

        if (dataPayload && dataPayload.type === 'Console') {
            const Data = (dataPayload?.data?.log[1]?.data?.responseBody)
            if (typeof (Data) === "string") {
                if (Data === "Order Status not allowed to update") {

                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'عملية مرفوضة',
                        button: 'إغلاق',
                        onHide: () => navigation.navigate("App")

                    })
                }
                try {
                    const jsonObject = JSON.parse(Data);
                    const ErrorMessage = jsonObject?.errors[0]?.error_message
                    if (ErrorMessage) {
                        reloadWebView()

                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'عملية مرفوضة',
                            textBody: 'بيانات البطافة المدخلة غير صحيحة',
                            button: 'إغلاق',

                        })
                    }

                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    // Handle the error, e.g., show an error message to the user
                }
            }
        }
    };

    const CheckOrderStatusAndDisplayMessage = () => {
        if (orderStatusChecked) return;

        checkOrderStatus(orderId)
            .then(data => {
                if (data?.responseBody?.status === "settled") {
                    navigation.goBack()
                    handlePayOrder()


                } else {
                    setOrderStatusChecked(true); // Mark the status as checked
                        
                 
                    setShowDialog(true)
                    navigation.goBack()
                    Alert.alert("عملية مرفوضة ","هناك  مشكلة في البطاقة المدخلة حاول مرة اخري")
                    // Dialog.show({
                    //     type: ALERT_TYPE.DANGER,
                    //     title: 'عملية مرفوضة',
                    //     button: 'إغلاق',
                    //     onHide: () => navigation.navigate("App")

                    // })

                }
                console.log('Success:', data?.responseBody !== "The order ORD1134 has already been paid, the link is expired")
            })
            .catch(error => console.log('Error:', error));
    }



    return (
        <AlertNotificationRoot>

            <View style={styles.container}>
                <WebView

                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    ref={webViewRef} // Assign the reference to the WebView

                    startInLoadingState={true}
                    onNavigationStateChange={async (navState) => {
                        try {

                            if (navState?.url.includes("https://pay.expresspay.sa/interaction/")) {

                                CheckOrderStatusAndDisplayMessage()
                            } else if (navState?.url.includes("https://gemini.google.com/")) {
                                CheckOrderStatusAndDisplayMessage()
                            }


                            // console.log("the navigation state ",navState)
                        } catch (error) {
                            console.log("error when payment ", error)
                        }
                    }
                    }

                    onError={handleWebViewError} // Add this line

                    source={{ uri: url }}


                    injectedJavaScript={debugging}
                    onMessage={handleWebViewMessage}


                />

            </View>
            <AlertDialog
            
            setShowSuccessDialog={setShowDialog}
            showSuccessDialog={showDialog}
            />
        </AlertNotificationRoot>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dialogWrapStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 100,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 3.,
        alignSelf: 'center',
    },
});

function AlertDialog({showSuccessDialog,setShowSuccessDialog}) {
    return (
        <PaperDialog
            visible={showSuccessDialog}
            style={styles.dialogWrapStyle}
            onDismiss={() => setShowSuccessDialog( false )}
        >
            <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                <View style={styles.successIconWrapStyle}>
                    <MaterialIcons name="error" size={40} color={Colors.primaryColor} />
                </View>
                <AppText  style={{ ...Fonts.blackColor20Medium, marginTop: Sizes.fixPadding + 10.0 }} text={" عملية مرفوضة"}/>
                 
            </View>
        </PaperDialog>
    )
}