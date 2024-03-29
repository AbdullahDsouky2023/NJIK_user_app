import React, { memo } from "react";
import IntlPhoneInput from "react-native-intl-phone-input";
import { StyleSheet, I18nManager } from "react-native";

import { Sizes, Fonts, Colors } from "../constant/styles";

 function PhoneNumberTextField({ phoneNumber, updateState }) {
  return (
    <IntlPhoneInput
      onChangeText={(e) => {
        const countryCode = e.dialCode;
        const length = e.selectedCountry.mask.length;
        updateState({ phoneNumber: e.phoneNumber, countryCode, length });
      }}
      flagStyle={{ display: "none" }}
      defaultCountry="EG"
      containerStyle={styles.phoneNumberTextFieldStyle}
      dialCodeTextStyle={styles.dialCodeTextStyle}
      selectionColor={Colors.primaryColor}
      placeholder="5xx xxx xxx"
      phoneInputStyle={styles.phoneInputStyle}
    />
  );
}

export default memo(PhoneNumberTextField)

const styles = StyleSheet.create({
  phoneNumberTextFieldStyle: {
    borderColor: Colors.primaryColor,
    color: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center", // Align items in the center vertically
  },
  dialCodeTextStyle: {
    ...Fonts.blackColor17Medium,
    paddingVertical: 5,
    paddingLeft: Sizes.fixPadding - 5.0,
    fontSize: 17,
    textAlign: "left", // Set text alignment to left
    direction: "ltr", // Set text direction to left-to-right (ltr)
  },
  phoneInputStyle: {
    flex: 1,
    paddingRight: Sizes.fixPadding,
    ...Fonts.blackColor17Medium,
    flexDirection: "column",
    fontSize: 17,
    textAlign: "left", // Set text alignment to left
    direction: "ltr", // Set text direction to left-to-right (ltr)
  },
});
