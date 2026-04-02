import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onActionPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onActionPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {actionLabel && (
                <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#212121',
    },
    action: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00838F', // Teal link
    }
});

export default SectionHeader;
