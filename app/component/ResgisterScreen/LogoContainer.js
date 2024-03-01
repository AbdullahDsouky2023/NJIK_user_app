// LogoContainer.js
import React from "react";
import { View } from "react-native";
import Logo from "../Logo";
import { StyleSheet } from "react-native";

const LogoContainer = () => (
  <View style={styles.logoContainer}>
    <Logo />
  </View>
);

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default LogoContainer;
