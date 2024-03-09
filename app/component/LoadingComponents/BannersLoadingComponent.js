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
export default function HomeScreenLoadingComponent() {


    return (
        <ScrollView>
            <AppHeader />
            <MotiView
                transition={{
                    type: 'timing',
                    duration: 20,
                }}
                style={[styles.container, styles.padded]}

                animate={{ backgroundColor: Colors.whiteColor }}

            >
                <View style={[styles.container,{paddingHorizontal:15}]}>

                <Skeleton colorMode={Colors.redColor} backgroundColor={Colors.grayColor} width={width * 0.89} height={height * 0.25} />
                <Spacer />
                </View>

                <HeaderTextComponent style={styles.container} name={"Services"} showAll={true}>


                    <FlatList
                        numColumns={3}
                        
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer} renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 2 }}>
                                <Skeleton colorMode={Colors.redColor} backgroundColor={Colors.grayColor} width={width * 0.30} height={height * 0.12} />
                                {/* <Spacer /> */}
                            </View>
                        )}

                        keyExtractor={(item, index) => item}
                    />
                </HeaderTextComponent>
                <HeaderTextComponent style={styles.container} name={"Packages"} showAll={true}>
                    <FlatList
                        data={[1, 2,]}
                        // style={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={2}

                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 20 }}>

                                <Skeleton colorMode={Colors.redColor} backgroundColor={Colors.grayColor} width={width * 0.93} height={height * 0.25} />
                                <Spacer />
                            </View>
                        )}
                        keyExtractor={(item, index) => item}
                    />
                </HeaderTextComponent>
                <HeaderTextComponent style={styles.container} name={""} showAll={true}>
                    <View style={styles.header}>
                        <AppText text={"SercureOrder"} style={styles.title} />
                        <Image source={require('../../assets/images/award.png')} style={styles.awardImage} />
                    </View>
                    <FlatList
                        data={[1]}
                        // style={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={2}

                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 20 }}>
                                <Skeleton colorMode={Colors.redColor} backgroundColor={Colors.grayColor} width={width * 0.93} height={height * 0.25} />
                                <Spacer />
                            </View>
                        )}
                        keyExtractor={(item, index) => item}
                    />
                </HeaderTextComponent>
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
        flexDirection: "column",
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
