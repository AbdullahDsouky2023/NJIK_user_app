import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import ModalComponent from '../Modal'
import RBSheet from "react-native-raw-bottom-sheet";
import AppText from '../AppText';
const { width, height } = Dimensions.get("screen");

export default function CouponModal({ref}) {
  return (
    <RBSheet
    ref={ref}
    closeOnDragDown={true}
    closeOnPressMask={false}
    customStyles={{
      wrapper: {
        backgroundColor: "transparent",
        height:100,
        width:width

      },
      draggableIcon: {
        backgroundColor: "#000"
      }
    }}
  >
<AppText text={'add'}/>
  </RBSheet>
  )
}