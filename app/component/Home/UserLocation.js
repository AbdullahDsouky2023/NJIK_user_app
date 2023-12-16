import { View, Text, Alert, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../AppText';
import UseLocation from '../../../utils/useLocation';
const { width }= Dimensions.get('screen')
export default function UserLocation() {
  const { location } = UseLocation()  
  return (
    <AppText text={location?.readable || "no location" } style={{fontSize:12,width:width*0.4}}/>
  )
}