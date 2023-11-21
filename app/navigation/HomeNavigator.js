import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import { TransitionPresets } from "@react-navigation/stack";
import HomeScreen from '../screens/home/homeScreen';
import { useTranslation } from 'react-i18next';
import { HOME } from './routes';

export default function HomeNavigator() {
    const Stack = createStackNavigator()
    const { t } = useTranslation()
    
  return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
        <Stack.Screen
                    name={HOME}
                    component={HomeScreen}
                   
                />
    </Stack.Navigator>
  )
}