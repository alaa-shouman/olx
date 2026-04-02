import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

export type AppStackParamList = {
    MainTabs: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 3000,
            }}
        >
            <Stack.Screen name="MainTabs" component={TabNavigator} />
        </Stack.Navigator>
    );
};

export default AppStack;