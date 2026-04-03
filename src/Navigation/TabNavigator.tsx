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
import SearchScreen from '../Screen/SearchScreen';
import FilterScreen from '../Screen/FilterScreen';
import { createStackNavigator } from '@react-navigation/stack';

export type TabParamList = {
    Home: undefined;
    Chats: undefined;
    Sell: undefined;
    MyAds: undefined;
    Account: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator();

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
);

// --- Theme & Configuration ---
const THEME = {
    colors: {
        active: '#3B3B3B',
        inactive: '#4A4A4A',
        sellBg: '#F6D95B',
        sellIcon: '#000000',
        barBg: '#FFFFFF',
    },
    metrics: {
        barHeight: 88,
        iconSize: 24,
        sellButtonSize: 60,
        sellIconSize: 32,
    }
};

interface TabConfig {
    name: keyof TabParamList;
    component: React.ComponentType<any>;
    labelKey: string;
    iconOutline: string;
    iconSolid: string;
    isAction?: boolean;
}

// Highly generic and reusable tab configuration
const TABS_CONFIG: TabConfig[] = [
    { name: 'Home', component: HomeStack, labelKey: 'home', iconOutline: 'home-outline', iconSolid: 'home' },
    { name: 'Chats', component: ChatsScreen, labelKey: 'chats', iconOutline: 'chatbubble-outline', iconSolid: 'chatbubble' },
    { name: 'Sell', component: SellScreen, labelKey: 'sell', iconOutline: 'add', iconSolid: 'add', isAction: true },
    { name: 'MyAds', component: MyAdsScreen, labelKey: 'myAds', iconOutline: 'list-outline', iconSolid: 'list' },
    { name: 'Account', component: AccountScreen, labelKey: 'account', iconOutline: 'person-outline', iconSolid: 'person' },
];

const TabNavigator = () => {
    const { t } = useTranslation();

    const renderIcon = (tab: TabConfig, focused: boolean) => {
        if (tab.isAction) {
            return (
                <View style={styles.sellActionContainer}>
                    <Ionicons
                        name={tab.iconSolid}
                        size={THEME.metrics.sellIconSize}
                        color={THEME.colors.sellIcon}
                    />
                </View>
            );
        }

        const iconName = focused ? tab.iconSolid : tab.iconOutline;
        const iconColor = focused ? THEME.colors.active : THEME.colors.inactive;
        return <Ionicons name={iconName} size={THEME.metrics.iconSize} color={iconColor} />;
    };

    const renderLabel = (tab: TabConfig, focused: boolean) => {
        if (tab.isAction) return null; // Center action button has no text label

        return (
            <Text
                style={[
                    styles.tabLabel,
                    { color: focused ? THEME.colors.active : THEME.colors.inactive },
                ]}
            >
                {t(`navigation.categories.tabs.${tab.labelKey}`)}
            </Text>
        );
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const currentTab = TABS_CONFIG.find(t => t.name === route.name);
                return {
                    headerShown: false,
                    tabBarStyle: styles.tabBar,
                    tabBarItemStyle: styles.tabItem,
                    tabBarIcon: ({ focused }) => currentTab ? renderIcon(currentTab, focused) : null,
                    tabBarLabel: ({ focused }) => currentTab ? renderLabel(currentTab, focused) : null,
                };
            }}
        >
            {TABS_CONFIG.map((tab) => (
                <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
            ))}
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: THEME.metrics.barHeight,
        paddingTop: 6,
        paddingBottom: 10,
        backgroundColor: THEME.colors.barBg,
        borderTopWidth: 0,
        elevation: 0,
    },
    tabItem: {
        paddingTop: 2,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
    },
    sellActionContainer: {
        width: THEME.metrics.sellButtonSize,
        height: THEME.metrics.sellButtonSize,
        borderRadius: THEME.metrics.sellButtonSize / 2,
        backgroundColor: THEME.colors.sellBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -25,
        // RTL logic to ensure perfect centering in both languages
        marginStart: I18nManager.isRTL ? 0 : 0,
        marginEnd: I18nManager.isRTL ? 0 : 0,
    },
});

export default TabNavigator;
