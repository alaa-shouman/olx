import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AccountScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account Screen</Text>
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

export default AccountScreen;
