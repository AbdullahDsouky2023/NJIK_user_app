import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppText from './AppText'
import { Colors } from '../constant/styles'
import { CURRENCY } from '../navigation/routes'
import { useTranslation } from 'react-i18next'

export default function PriceTextComponent({price,style}) {
    const PriceNum = Number(price)
    const { t} = useTranslation()
  return (
    <View>

    <AppText
          text={`${PriceNum > 0 ?(`  ${PriceNum} `+t(CURRENCY)):"السعر بعد الزياره"}`}
          style={[styles.servicePrice,style]}
          centered={false}
          />
          </View>
  )
}
const styles = StyleSheet.create({
    servicePrice: {
        color: Colors.primaryColor,
        fontSize: 14,
      },
})