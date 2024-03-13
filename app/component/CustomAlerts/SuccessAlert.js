import { View, Text } from 'react-native'
import React from 'react'
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { Button } from 'react-native-elements';

export default function SuccessAlert() {
  return (
    <AlertNotificationRoot>
    <View>
      <Button
        title={'dialog box'}
        onPress={() =>
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'عملية مرفوضة',
            textBody: 'هناك مشكلة ! حاول مرة اخري'   ,
            button: 'إغلاق',

          })
        }
      />
      <Button
        title={'toast notification'}
        onPress={() =>
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'Congrats! this is toast notification success',
          })
        }
      />
    </View>
  </AlertNotificationRoot>
  )
}