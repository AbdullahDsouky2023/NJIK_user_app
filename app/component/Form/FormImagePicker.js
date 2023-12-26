import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";
import { Image } from "react-native";

const { width } = Dimensions.get('screen');

const FormImagePicker = ({ name, width, ...otherProps }) => {
  const { setFieldTouched, setFieldValue, errors, touched, values } = useFormikContext();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setFieldValue(name, result.assets[0].uri);
    }
  };

  const pickImageFromCamera = async () => {
    // Request camera permissions explicitly
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Please grant camera permissions to take a photo.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setFieldValue(name, result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Ionicons name="camera" size={24} color="black" />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImageFromCamera}>
        <View style={styles.imagePicker}>
          <Ionicons name="image" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};

export default FormImagePicker;

const styles = StyleSheet.create({
container:{
  
},
  imagePicker: {
    borderWidth: 1,
    width: width * 0.3,
    borderRadius: 10,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10,
    flexDirection:"row"

  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
});
