import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Sizes } from "../constant/styles";
import Dialog from "react-native-dialog";


const { width } = Dimensions.get("screen");

export default function LoadingModal({visible,children}) {
  return (
    <Dialog.Container
      visible={visible}
      contentStyle={styles.dialogContainerStyle}
    >
      <View style={{ backgroundColor: "white", alignItems: "center" }}>
        {children}
      </View>
    </Dialog.Container>
  );
}
const styles = StyleSheet.create({
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 80,
        paddingBottom: Sizes.fixPadding * 3.0,
      },
})