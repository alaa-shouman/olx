import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';

interface SearchFieldProps {
    placeholder?: string;
    onSearch?: (text: string) => void;
    onPress?: () => void;
}

const SearchField: React.FC<SearchFieldProps> = ({ placeholder, onSearch, onPress }) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
            <Ionicons name="search" size={20} color="#757575" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder || t('search.placeholderLong', 'Search for products, brands and more')}
                placeholderTextColor="#757575"
                onChangeText={onSearch}
                onFocus={onPress ? () => onPress() : undefined} // Also trigger if user taps directly into input
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                editable={!onPress} // If onPress is provided, we just act as a button
                pointerEvents={onPress ? 'none' : 'auto'} // Prevents tap going to input only
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginVertical: 8,
    },
    icon: {
        marginEnd: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#212121',
        paddingVertical: 0, // fixes Android centering
    }
});

export default SearchField;
