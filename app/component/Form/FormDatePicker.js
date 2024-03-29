import React, { memo, useState } from "react";
import { useFormikContext } from "formik";
import { format } from "date-fns";
import { arSA } from "date-fns/locale"; // Import the Saudi Arabian locale

import FormTextInput from "./FormInput";
import ErrorMessage from "./ErrorMessage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Dimensions, StyleSheet, Text, TextInput } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");

function FormDatePicker({ name, width, ...otherProps }) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const formattedDate = format(date, "dd MMMM yyyy", {
    locale: arSA, // Use the Arabic locale
  });
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); // Hide the DateTimePicker for iOS
    setDate(currentDate);
    setFieldValue(name, currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };


  return (
    <>
      <TouchableOpacity onPress={showDatepicker}>
        <View style={styles.date}>
          <TextInput
            onChangeText={(text) => setFieldValue(name, text)}
            value={formattedDate}
            editable={false}
            onBlur={() => setFieldTouched(name)}
          />
          <Ionicons name="calendar" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          minimumDate={new Date()}
          onChange={onChange}
        />)
      }
    </>)
}


export default memo(FormDatePicker);

const styles = StyleSheet.create({
  date: {
    borderWidth: 1,
    width: width * 0.93,
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
