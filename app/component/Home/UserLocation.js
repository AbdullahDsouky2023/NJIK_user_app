import { View, Text, Alert, Linking, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from '../AppText';
import UseLocation from '../../../utils/useLocation';
const { width }= Dimensions.get('screen')
export default function UserLocation() {
  const { location ,coordinate } = UseLocation()  
  return (
    null
  )
}