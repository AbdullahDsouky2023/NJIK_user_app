import { useFormikContext } from "formik";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import ErrorMessage from "./Form/ErrorMessage";
import { useTranslation } from "react-i18next";
import { Colors } from "../constant/styles";

const GenderSelect = ({ value, onChange, name }) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  const { t } = useTranslation();
  const [gender, setGender] = useState(null);
  return (
    <RadioButton.Group
      onValueChange={(text) => {
        setFieldValue(name, text);
        setGender(text);
      }}
      value={gender}
    >
      <View style={styles.container}>
        <RadioButton.Item
          label={t("Male")}
          style={styles.radioItem} /* Apply style here */
          value="male"
          color={Colors.primaryColor}
        />
        <RadioButton.Item
          label={t("Female")}
          value="female"
          style={styles.radioItem}
          color={Colors.primaryColor}
        />
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </RadioButton.Group>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    // flex:1,
    flexDirection: "row",
    // backgroundColor:'red'
  },
  radioItem: {
    flexDirection: "row-reverse",
    fontSize: 25,
    /* Reverse radio and label within each item */
  },
});

export default GenderSelect;
