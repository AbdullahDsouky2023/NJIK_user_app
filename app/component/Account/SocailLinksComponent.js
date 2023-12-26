import { View, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { FontAwesome,Entypo,AntDesign,Feather } from '@expo/vector-icons'; 
import { StyleSheet } from 'react-native';
import { Colors } from '../../constant/styles';
import * as Linking from 'expo-linking'
import AppText from '../AppText';
export default function SocailLinksComponent() {
  return (
    <View style={styles.container}>
     <FontAwesome name="facebook-square" size={32} color={Colors.primaryColor} onPress={()=>Linking.openURL('https://facebook.com')} />
     <Entypo name="instagram" size={30} color={Colors.primaryColor}   onPress={()=>Linking.openURL('https://instagram.com')}/>
     <AntDesign name="linkedin-square"  size={32}  color={Colors.primaryColor}   onPress={()=>Linking.openURL('https://linkedin.com')}/>
     <AntDesign name="twitter" size={32} color={Colors.primaryColor}  onPress={()=>Linking.openURL('https://x.com')}/>


    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        display:'flex',
         alignItems:'center',
         justifyContent:'center',
         padding:10,
         gap:18,
         flexDirection:'row'
    }
})