import { View, Text, Dimensions, Alert } from 'react-native'
import React ,{useState} from 'react'
import AppText from '../AppText'
import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Colors } from '../../constant/styles';
import AppButton from '../AppButton';
import useOrders, { handleDelayOrder, updateOrderData } from '../../../utils/orders';
import { useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { HOME } from '../../navigation/routes';
import { useTranslation } from 'react-i18next';
import LoadingModal from '../Loading';
import LoadingScreen from '../../screens/loading/LoadingScreen';
import useNotifications from '../../../utils/notifications';
const { width , height } = Dimensions.get('screen')
export default function DelayOrderCard ({item}) {
    const {data:orders} =useOrders()
    const navigation = useNavigation()
    const { t} = useTranslation()
    const [isLoading, setIsLoading] = useState(false);
    const { sendPushNotification} = useNotifications()
    const user = useSelector((state) => state?.user?.userData);

    const handleDelayAccept = async (id) => {
        try {
          setIsLoading(true);

          const res = await handleDelayOrder(id,{
            accepted:"true"
          });
          const selectedOrder = orders?.data?.filter((order) => order?.id === item?.id);
          const providerNotificationToken =
          selectedOrder[0]?.attributes?.provider?.data?.attributes
          ?.expoPushNotificationToken;
          if (providerNotificationToken) {
            const res2 = await updateOrderData(item?.id,{
                date:item?.attributes?.delay_request?.data?.attributes?.date
              })
            sendPushNotification(
              providerNotificationToken,
              "تم قبول تأجيل  الطلب",
              `تم قبول تأجيل  الطلب بواسطه ${user?.username}`
            );
          }
          if (res) {
            
            
            navigation.goBack();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: t(HOME) }],
              })
            );
            Alert.alert(t(" تم تعديل الطلب بنجاح"));
          } else {
            Alert.alert(t("Something Went Wrong, Please try again!"));
          }
        } catch (error) {
          console.log(error, "error deleting the order");
        } finally {
        //   setModalVisible(false);
          setIsLoading(false);
        }
      };
    const handleRejectDelay = async (id) => {
        try {
          setIsLoading(true);
          const res = await handleDelayOrder(id,{
            accepted:"false"
          });
          const res2 = await updateOrderData(item?.id,{
            delay_request:null
          })
          const selectedOrder = orders?.data?.filter((order) => order?.id === item?.id);
          const providerNotificationToken =
            selectedOrder[0]?.attributes?.provider?.data?.attributes
              ?.expoPushNotificationToken;
          if (providerNotificationToken) {
            sendPushNotification(
              providerNotificationToken,
              "تم  رفض  تأجيل  الطلب",
              `تم  رفض  تأجيل  الطلب" بواسطه ${user?.username}`
            );
          }
          if (res) {
            
            
            navigation.goBack();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: t(HOME) }],
              })
            );
            Alert.alert(t(" تم تعديل الطلب بنجاح"));
          } else {
            Alert.alert(t("Something Went Wrong, Please try again!"));
          }
        } catch (error) {
          console.log(error, "error deleting the order");
        } finally {
          setIsLoading(false);
        }
      };
      if (isLoading) return <LoadingScreen />;

  return (
    <View style={styles.descriptionContainer}>
    <AppText centered={true} text={"Delay Request"} style={styles.delayHeader} />
    <AppText
      centered={false}
      text={
      "Reason"
      }
      style={styles.title}
    />
    <AppText
      centered={false}
      text={
      item?.attributes?.delay_request?.data?.attributes?.reason
      }
      style={styles.text}
    />
    <AppText
      centered={false}
      text={
      "Date"
      }
      style={styles.title}
    />
    <AppText
      centered={false}
      text={
      item?.attributes?.delay_request?.data?.attributes?.date
      }
      style={styles.text}
    />
    <View style={styles.buttonContainer}>
        <AppButton title={"Accept"} 
        onPress={()=>handleDelayAccept(item?.attributes?.delay_request?.data?.id)}
        style={{backgroundColor:Colors.success}}/>
        <AppButton title={"Reject"}
        onPress={()=>handleRejectDelay(item?.attributes?.delay_request?.data?.id)}
        style={{backgroundColor:Colors.redColor}}/>
    </View>
    <LoadingModal visible={isLoading}  />

  </View>
  )
}
const styles = StyleSheet.create({
    title: {
        fontSize: RFPercentage(2),
        color: Colors.primaryColor,
    },
    text: {
        fontSize: RFPercentage(2),
        color: Colors.blackColor,
        maxWidth:width*0.97
      },
      descriptionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "auto",
        width: width * 0.9,
        padding: 10,
        // borderWidth: 0.7,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: Colors.whiteColor,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 4,
        gap: 10,
      },
      delayHeader:{
        fontSize:RFPercentage(2.2),
        backgroundColor: Colors.primaryColor,
        padding:10,
        borderRadius:10,
        color:Colors.whiteColor
      },
      buttonContainer:{
        display:'flex',
        flexDirection:'row',

      }
});