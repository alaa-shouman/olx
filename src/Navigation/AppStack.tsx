import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import SearchScreen from '../Screen/SearchScreen';
import FilterScreen from '../Screen/FilterScreen';
import CategoryListScreen from '../Screen/CategoryListScreen';

export type AppStackParamList = {
    MainTabs: undefined;
    SearchScreen: { query?: string; categoryId?: string };
    FilterScreen: { categoryId?: string };
    CategoryListScreen: { category?: any };
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
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="FilterScreen" component={FilterScreen} />
            <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
        </Stack.Navigator>
    );
};

export default AppStack;