import React from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../constant/styles';
import AppText from '../AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('screen');

export default function ServiceCard({ image, name, onPress }) {
 const handlePress = React.useCallback(onPress, [onPress]);

 return (
    <TouchableWithoutFeedback onPress={handlePress} accessibilityLabel={name}>
      <View style={styles.card}>
        <Image
          style={styles.imageCard}
          source={{ uri: image }}
          onError={(e) => {
            // Handle error, for example, set a default image
            console.error("Failed to load image", e);
          }}
        />
        <AppText text={name} style={styles.text} />
      </View>
    </TouchableWithoutFeedback>
 );
}

const styles = StyleSheet.create({
 card: {
    height: height * 0.12,
    width: width * 0.30,
    backgroundColor: '#FCF1EA',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
 },
 text: {
    color: Colors.blackColor,
    fontSize: RFPercentage(1.67),
    textAlign: 'center',
 },
 imageCard: {
    height: 40,
    width: 40,
 },
});
