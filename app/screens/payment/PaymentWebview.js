// Import necessary modules
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PaymentWebview({route}) {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://pay.edfapay.com/merchant/checkout/ORD001/7b613448-c297-4a9e-b996-cb210f5461ab' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height:100,
    // backgroundColor:'red',
    // borderWidth:1
  },
});
