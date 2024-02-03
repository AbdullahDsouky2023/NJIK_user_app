// Invoice.js
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Pdf from './pdf';

const Invoice = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        {/* Your invoice content */}
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        <Text>Invoice #7654</Text>
        {/* Add sender details, recipient info, etc. */}
        {/* Include the Pdf component */}
        <Pdf />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Invoice;