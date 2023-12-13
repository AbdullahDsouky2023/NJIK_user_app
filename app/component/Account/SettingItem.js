import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constant/styles";
import AppText from "../AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width }  = Dimensions.get('screen')

export default function SettingItem({item }) {
    const { icon, name, desc } = item
    const navigation = useNavigation()
    return (
      <TouchableWithoutFeedback  onPress={()=>navigation.navigate(icon)}>
       
        <View  style={styles.item}>
        {/* <View style={styles.itemHeader}> */}
          <SimpleLineIcons name={icon} size={24} color={Colors.primaryColor} />
          <View style={{
            display:'flex',
            justifyContent:'center',
          }}>
            <AppText text={name} centered={false} style={styles.textHeader} />
            {/* {desc && <AppText
              text={desc}
              centered={false}
              style={styles.headerDescription}
            />} */}
          {/* </View> */}
        </View>
        {/* <MaterialIcons name="arrow-back-ios" size={24} color={Colors.grayColor} /> */}
        </View>
      </TouchableWithoutFeedback>)
}

const styles = StyleSheet.create({
  header: {
    color: Colors.primaryColor,
    fontSize: 18,
  },
  textHeader: {
    color: Colors.blackColor,
    fontSize: 16,
    // alignSelf:"left"
  },
  headerDescription: {
    color: Colors.grayColor,
    fontSize: 16,
  },
  item: {
    backgroundColor: Colors.piege,
    height: 90,
    borderRadius:10,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width:width*0.4,
    paddingVertical:14,
    gap: 5,
  },
  itemHeader: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width:width*0.4,
    // height:120,
    backgroundColor:Colors.piege,
    padding:10,
    borderRadius:10,
    margin:20,
    justifyContent:'center',
    gap: 15,
  },
});
