import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/Tabs/HomeScreen';
import ChatsScreen from '../Screen/Tabs/ChatsScreen';
import SellScreen from '../Screen/Tabs/SellScreen';
import MyAdsScreen from '../Screen/Tabs/MyAdsScreen';
import AccountScreen from '../Screen/Tabs/AccountScreen';

export type TabParamList = {
    Home: undefined;
    Chats: undefined;
    Sell: undefined;
    MyAds: undefined;
    Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chats" component={ChatsScreen} />
            <Tab.Screen name="Sell" component={SellScreen} />
            <Tab.Screen name="MyAds" component={MyAdsScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
