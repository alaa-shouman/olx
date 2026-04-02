import React from 'react';
import { I18nManager, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
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

const TAB_ACTIVE_COLOR = '#3B3B3B';
const TAB_INACTIVE_COLOR = '#4A4A4A';
const SELL_BG = '#F6D95B';

const TabNavigator = () => {
    const { t } = useTranslation();

    const getLabel = (routeName: keyof TabParamList) => {
        switch (routeName) {
            case 'Home':
                return t('navigation.categories.tabs.home');
            case 'Chats':
                return t('navigation.categories.tabs.chats');
            case 'Sell':
                return t('navigation.categories.tabs.sell');
            case 'MyAds':
                return t('navigation.categories.tabs.myAds');
            default:
                return t('navigation.categories.tabs.account');
        }
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabItem,
                tabBarLabel: ({ focused }) => (
                    <Text
                        style={[
                            styles.tabLabel,
                            { color: focused ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR },
                        ]}
                    >
                        {getLabel(route.name)}
                    </Text>
                ),
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'Sell') {
                        return (
                            <View style={styles.sellIconWrapper}>
                                <Ionicons name="add" size={32} color={TAB_ACTIVE_COLOR} />
                            </View>
                        );
                    }

                    const iconColor = focused ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR;

                    if (route.name === 'Home') {
                        return (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={32}
                                color={iconColor}
                            />
                        );
                    }

                    if (route.name === 'Chats') {
                        return <Ionicons name="chatbubble-outline" size={34} color={iconColor} />;
                    }

                    if (route.name === 'MyAds') {
                        return <Ionicons name="list-outline" size={34} color={iconColor} />;
                    }

                    return <Ionicons name="person-outline" size={34} color={iconColor} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chats" component={ChatsScreen} />
            <Tab.Screen name="Sell" component={SellScreen} />
            <Tab.Screen name="MyAds" component={MyAdsScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 88,
        paddingTop: 6,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        elevation: 0,
    },
    tabItem: {
        paddingTop: 2,
    },
    tabLabel: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'none',
    },
    sellIconWrapper: {
        width: 74,
        height: 74,
        borderRadius: 37,
        backgroundColor: SELL_BG,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -18,
        marginStart: I18nManager.isRTL ? 4 : 0,
        marginEnd: I18nManager.isRTL ? 0 : 4,
    },
});

export default TabNavigator;
