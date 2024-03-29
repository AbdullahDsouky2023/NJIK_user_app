import React, { useState, useCallback } from "react";
import { BackHandler, View, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons'; 
import HomeScreen from "../screens/home/homeScreen";
import { Colors, Sizes, Fonts } from "../constant/styles";
import AccountNavigator from "../navigation/AccountNavigator";
import OrderScreen from "../screens/Orders/OrderScreen.js";
import CurrentOffersScreen from "../screens/CurrentOffersScreen/CurrentOffersScreen";
import { ACCOUNT, HOME, MY_ORDERS, OFFERS } from "../navigation/routes.js";

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
    const { t } = useTranslation()
    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.primaryColor,
                    tabBarInactiveTintColor: Colors.blackColor,
                    tabBarLabelStyle: {
                        fontSize: 13.0,
                        fontFamily: 'Janna-Lt',
                        fontWeight:700,
                    },
                    tabBarStyle: { ...styles.tabBarStyle, },
                }}
            >
                <Tab.Screen
                    name={t(HOME)}
                    component={HomeScreen}
                    
                    options={{
                        tabBarIcon: ({ color }) => 
                        <Octicons name="home" size={25} color={color}/>

                    }}
                />
                <Tab.Screen
                    name={t(OFFERS)}
                    component={CurrentOffersScreen}
                    options={{
                        tabBarIcon: ({ color }) => <Feather name="shopping-cart" size={25} color={color} />
                    }}
                />
                <Tab.Screen
                     name={t(MY_ORDERS)}
                    component={OrderScreen}
                    options={{
                        tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={25} color={color} />
                    }}
                />
                <Tab.Screen
                    name={t(ACCOUNT)}
                    component={AccountNavigator}
                    options={{
                        tabBarIcon: ({ color, }) => (
                            <AntDesign name="user" size={25} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
            {exitInfo()}
        </>
    )

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={[styles.animatedView]}>
                    <Text style={{ ...Fonts.whiteColor15Regular }}>
                        Press back once again to exit
                    </Text>
                </View>
                :
                null
        )
    }
}

const styles = StyleSheet.create({
    animatedView: {
        backgroundColor: '#333333',
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    tabBarStyle: {
        height: 70.0,
        backgroundColor:Colors.piege,
        borderTopLeftRadius: Sizes.fixPadding + 10.0,
        borderTopRightRadius: Sizes.fixPadding + 10.0,
        paddingTop: Sizes.fixPadding - 5.0,
        paddingBottom: Sizes.fixPadding - 5.0,
    }
})

export default BottomTabBar;