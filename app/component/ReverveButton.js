import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import AppButton from './AppButton'
import AppText from './AppText'
import { Colors } from '../constant/styles'
import { TouchableOpacity } from 'react-native'
import PriceTextComponent from './PriceTextComponent'
const { width } = Dimensions.get("screen");

export default function ReserveButton({price,onPress,text,title,disabled}) {
  return (

    <TouchableOpacity  >
    <View style={styles.ReserveButtonContainer}> 
{
  price && 
    <PriceTextComponent price={price} style={{fontSize:19}}/>
}
    {
      text &&
    <AppText text={text} style={{fontSize:15,color:"black",width:width*0.555}} />
    }
    
    <AppButton title={title || "order"} 
    style={styles.buttonSubmit}
    onPress={onPress} disabled={disabled}/>
    </View>
  </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  ReserveButtonContainer: {
        height: 100,
        // position: "absolute",
        display: "flex",
        // flex:1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: Colors.grayColor,
        // borderRadius: 20,
        width: width,
        bottom: 0,
        right: 0,
        paddingHorizontal: 20,
      },
      price: {
        color: Colors.primaryColor,
        fontSize: 16,
        marginTop:30
      },
      buttonSubmit:{
        width:width*0.3,
        marginTop:0
      }
})