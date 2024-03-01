import React from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { Sizes } from "../constant/styles";
import { useNavigation } from "@react-navigation/native";

export default function ArrowBack({ back }) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (back) {
      // Handle custom back action if provided
      back();
    } else if (navigation.canGoBack()) {
      // Navigate back if possible
      navigation.goBack();
    }
  };

  return (
    <MaterialIcons
      name="arrow-back"
      size={27}
      color="black"
      style={{
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 2.0,
      }}
      onPress={handlePress}
    />
  );
}
