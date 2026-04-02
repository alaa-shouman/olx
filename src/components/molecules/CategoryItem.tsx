import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface CategoryData {
    id: string;
    name: string;
    icon: string;
}

interface CategoryItemProps {
    item: CategoryData;
    onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.circle}>
                <Ionicons name={item.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 72,
        alignItems: 'center',
        marginEnd: 8, // Using marginEnd for RTL support
    },
    circle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F5C518',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 11,
        color: '#212121',
        textAlign: 'center',
    }
});

export default CategoryItem;
