import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ChatsScreen = () => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('navigation.categories.tabs.chats', 'CHATS')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F6F8',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E2329',
    },
});

export default ChatsScreen;
