import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AppBarProps {
    location: string;
    onLocationPress: () => void;
    onNotificationPress: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ location, onLocationPress, onNotificationPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.locationChip} onPress={onLocationPress} activeOpacity={0.7}>
                <Ionicons name="location-sharp" size={20} color="#212121" />
                <Text style={styles.locationText}>{location}</Text>
                <Ionicons name="chevron-down" size={16} color="#212121" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onNotificationPress} activeOpacity={0.7} style={styles.bellButton}>
                <Ionicons name="notifications-outline" size={24} color="#212121" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 44,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    locationChip: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginStart: 4,
        marginEnd: 4,
    },
    bellButton: {
        padding: 4,
    }
});

export default AppBar;
