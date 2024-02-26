import { Dimensions, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { FontAwesome} from '@expo/vector-icons'
import { Colors } from "../../constant/styles";
import { View } from "react-native";
import AppText from "../AppText";
const { height , width } = Dimensions.get('screen')
export default function  ItemComponent ({ name, data, iconName })  {
    return (
      <View style={[styles.itemContainer, { justifyContent: 'space-between' }]}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 15, alignItems: 'center', }}>
          <FontAwesome name={iconName} size={RFPercentage(2.2)} color={Colors.grayColor} />
  
          <AppText centered={false} text={name} style={[styles.title, { fontSize: RFPercentage(2.1), maxWidth:width*0.5 }]} />
        </View>
        <AppText
          centered={false}
          text={data}
          style={[styles.price, { fontSize: RFPercentage(2) }]}
        />
      </View>
    )
  }

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: Colors.whiteColor,
    position: 'relative'
  },
  name: {
    fontSize: RFPercentage(1.7),
    color: Colors.blackColor,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    // borderWidth: 0.7,
    borderRadius: 10,
    marginHorizontal: 1,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    gap: 10,
  },
  descriptionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    width: width * 0.9,
    padding: 10,
    marginHorizontal: 1,

    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
    gap: 10,
  },
  price: {
    fontSize: RFPercentage(1.8),
    color: Colors.blackColor,
    marginTop: 5,
  },
  title: {
    fontSize: RFPercentage(2.1),
    color: Colors.primaryColor,
  },
  CartServiceStylesContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 0.5,

    padding: 5,
    borderRadius: 10,
    // height:100,
    // width:100,
    gap: 4,
    backgroundColor: Colors.piege,
    borderColor: Colors.grayColor
  },
  ButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10, // Adjust padding as needed
    paddingVertical: 10, // Adjust padding as needed
    backgroundColor: Colors.whiteColor, // Ensure the background matches your design
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyles: {
    backgroundColor: Colors.success,
    borderRadius: 10,
    paddingHorizontal: width * 0.07,
    paddingVertical: width * 0.03,
    fontSize: RFPercentage(2)

  },
  buttonStyles2: {
    backgroundColor: Colors.redColor,
    borderRadius: 10,
    paddingHorizontal: width * 0.07,
    paddingVertical: width * 0.03,
    fontSize: RFPercentage(1)


  },
  wrapper: {
    paddingBottom: width * 0.3,

  }

});