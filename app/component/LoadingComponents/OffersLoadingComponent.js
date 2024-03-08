import { useReducer } from 'react';
import { StyleSheet, Pressable, View, Dimensions, Image } from 'react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { Colors } from '../../constant/styles';
import AppHeader from '../AppHeader';
import { FlatList } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-virtualized-view';
import HeaderTextComponent from '../Home/HeaderTextComponent';
import AppText from '../AppText';
const { height, width } = Dimensions.get('screen')
export default function OffersLoadingComponent() {


    return (
        <ScrollView>
                   <View style={styles.header}>
          <AppText
            text={` العروض`}
            centered={true}
            style={{
              backgroundColor: "white",
              width: width,
              textAlign: "center",
              color: Colors.blackColor,
              marginTop: 10,
              padding: 5,
              borderRadius: 15,
            }}
          />
        </View>
            <MotiView
                transition={{
                    type: 'timing',
                    duration: 20,
                }}
                style={[styles.container, styles.padded]}

                animate={{ backgroundColor: Colors.whiteColor }}

            >
                
                    <FlatList
                        data={[1, 2,3,4,5,6]}
                        // style={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={7}

                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 10 }}>

                                <Skeleton colorMode={Colors.redColor} backgroundColor={Colors.grayColor} 
                                
                              
                                width={width * 0.92} height={height * 0.18} />
                                <Spacer />
                            </View>
                        )}
                        keyExtractor={(item, index) => item}
                    />
      
            </MotiView>
        </ScrollView>
    );
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
    shape: {
        justifyContent: 'center',
        // height: 250,
        // width: 250,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    padded: {
        padding: 16,
    },
    listContainer: {
        display: 'flex',
        flexDirection: "row",
        // flexWrap: "wrap",
        backgroundColor: Colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: width
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteredColor,
        gap: 10,
        marginBottom: 10,
    },
    title: {
        color: Colors.primaryColor,
        marginBottom: 10,
    },
    awardImage: {
        height: 40,
        width: 40,
    },
});
