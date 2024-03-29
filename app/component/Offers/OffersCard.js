import { View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React , { memo } from 'react'
import { StyleSheet } from 'react-native'
import { Colors,Fonts } from '../../constant/styles'
import { Image } from 'react-native'
import AppText from '../AppText'
const  { width } = Dimensions.get('screen')
 function OffersCard({image,name,onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.card}>
            <Image style={styles.imageCard} source={{uri:image}}/>
            <AppText text={name} style={styles.text}/>
        </View>
    </TouchableWithoutFeedback>
  )
}
export default memo(OffersCard)
const styles = StyleSheet.create({
    card :{
        height:100,
        width:width*0.28,
        backgroundColor:'#FCF1EA',
        borderRadius:10,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        gap:4
    },
    text:{
        color:Colors.blackColor,
        // ...Fonts.blackColor14Medium,
        fontSize:12,
        textAlign:'center'
    },
    imageCard :{
        height:40,
        width:40
    }
})