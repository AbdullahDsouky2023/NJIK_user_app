import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { RFPercentage } from 'react-native-responsive-fontsize';
const { width , height} = Dimensions.get('screen')
export default function ServicesSelectedList({data}) {
  return (
    <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}

              keyExtractor={(item, index) => item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                direction: "rtl",
                flexWrap: "wrap",
                marginTop: 15,
                gap: 15,
                padding:5,
                borderRadius:7,
                width: width*0.9,
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

              }}
              renderItem={({ item }) => {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: 'wrap',
                      backgroundColor:'white',
                      width: width * 0.80,
                      gap: 15,
                    }}
                  >
                    <MaterialIcons name="miscellaneous-services" size={24} color={Colors.grayColor} />

                    <AppText
                      centered={false}
                      text={item?.attributes?.service?.data?.attributes?.name}
                      style={[styles.name, { fontSize: RFPercentage(1.75), width: width * 0.7 }]}
                    />
                   
                  </View>
                );
              }}
            />
  )
}
const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      backgroundColor: Colors.whiteColor,
    },
    name: {
      fontSize: RFPercentage(1.95),
      color: Colors.blackColor,
    },
    itemContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "auto",
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      width: width * 0.9,
      padding: 10,
      // borderWidth: 0.7,
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
    descriptionContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "auto",
      width: width * 0.9,
      padding: 10,
      // borderWidth: 0.7,
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
      fontSize: RFPercentage(2.3),
      color: Colors.primaryColor,
    },
    chatContainer: {
      paddingHorizontal: 19,
      backgroundColor: Colors.primaryColor,
      width: 60,
      height: 40,
      borderRadius: 20,
      marginHorizontal: width * 0.75,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    delayHeader: {
      fontSize: RFPercentage(2.2),
      backgroundColor: Colors.primaryColor,
      padding: 10,
      borderRadius: 10,
      color: Colors.whiteColor
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
    }
  });