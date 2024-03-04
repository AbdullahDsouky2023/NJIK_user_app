import React , { memo} from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import AppText from "../AppText";
import { Colors, Sizes, Fonts } from "../../constant/styles";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { OFFERS } from "../../navigation/routes";
const {
   width,height
}= Dimensions.get('screen')

function HeaderTextComponent({ name, showAll,style, children }) {
  const navigation = useNavigation()
  const { t } = useTranslation()
  return (
    <View style={style}>
      <View style={styles.headerTextContainer}>
        <AppText text={name} style={styles.text} />
      </View>
      <View style={styles.cardContainer}>{children}</View>
    </View>
  );
}


export default memo(HeaderTextComponent);
const styles = StyleSheet.create({
  headerTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:width*0.03,
    gap: 18,
  },
  card: {
    height: 100,
    width: 100,
    backgroundColor: "#FCF1EA",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  text: {
    color: Colors.blackColor,
    ...Fonts.blackColor14Medium,
    fontSize:18,
    paddingVertical:5
    // paddingBottom:5
    // paddingHorizontal:25
  },
  imageCard: {
    height: 40,
    width: 40,
  },
  cardContainer: {},
});
