import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, I18nManager, KeyboardAvoidingView, Platform } from 'react-native';
import { getCategoryFields, mapCategoryFieldsToFilters } from '../services/categories';
import { DynamicFilter } from '../validation';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const FilterScreen = ({ navigation, route }: any) => {
    const categoryId = route.params?.categoryId || '23'; // Defaults to Vehicles -> Cars (23) testing spec
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [filters, setFilters] = useState<DynamicFilter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await getCategoryFields();
                const processedFilters = mapCategoryFieldsToFilters(response, categoryId);
                setFilters(processedFilters);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, [categoryId]);

    // Mock category details mapped from ID (In real app, comes from categories API)
    const getCategoryDetails = () => {
        switch (categoryId) {
            case '23': return { name: 'Cars for sale', icon: 'car-sport' };
            case '402': return { name: 'Mobile Phones', icon: 'phone-portrait' };
            case '1426': return { name: 'Apartments for sale', icon: 'business' };
            default: return { name: 'All Categories', icon: 'grid' };
        }
    };
    const catDetails = getCategoryDetails();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#212121" />
                </TouchableOpacity>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity>
                    <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#F5C518" />
                </View>
            ) : (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scroll}>
                        
                        {/* Category Header */}
                        <View style={styles.categoryHeader}>
                            <View style={styles.categoryInfo}>
                                <View style={styles.categoryIconCircle}>
                                    <Ionicons name={catDetails.icon} size={20} color="#FFFFFF" />
                                </View>
                                <Text style={styles.categoryName}>{catDetails.name}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Location List Item (Mocked standard item) */}
                        <TouchableOpacity style={styles.listItem}>
                            <Text style={styles.listLabel}>Location</Text>
                            <View style={styles.listAction}>
                                <Text style={styles.listValue}>All country</Text>
                                <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#757575" />
                            </View>
                        </TouchableOpacity>

                        {/* Dynamic Filters */}
                        {filters.map((filter) => {
                            if (filter.filterType === 'range') {
                                return (
                                    <View key={filter.id} style={styles.filterSection}>
                                        <Text style={styles.sectionLabel}>{filter.name}</Text>
                                        <View style={styles.rangeRow}>
                                            <View style={styles.inputContainer}>
                                                <TextInput 
                                                    style={styles.input} 
                                                    placeholder="Min" 
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#9E9E9E"
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <TextInput 
                                                    style={styles.input} 
                                                    placeholder="Max" 
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#9E9E9E"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                );
                            }

                            if (filter.filterType === 'multiple_choice') {
                                // If many choices, render as list item (e.g., Brand, Payment Options)
                                if (filter.choices && filter.choices.length > 5) {
                                    return (
                                        <TouchableOpacity key={filter.id} style={styles.listItem}>
                                            <Text style={styles.listLabel}>{filter.name}</Text>
                                            <View style={styles.listAction}>
                                                <Text style={styles.listValue}>Any</Text>
                                                <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#757575" />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }
                                
                                // Few choices, render as selection pills (e.g., Condition, Highlights)
                                return (
                                    <View key={filter.id} style={styles.filterSection}>
                                        <Text style={styles.sectionLabel}>{filter.name}</Text>
                                        <View style={styles.pillsContainer}>
                                            <TouchableOpacity style={[styles.pill, styles.pillActive]}>
                                                <Text style={[styles.pillText, styles.pillTextActive]}>Any</Text>
                                            </TouchableOpacity>
                                            {filter.choices?.map((choice) => (
                                                <TouchableOpacity key={choice.id} style={styles.pill}>
                                                    <Text style={styles.pillText}>{choice.label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                );
                            }

                            if (filter.filterType === 'boolean') {
                                return (
                                    <View key={filter.id} style={styles.filterSection}>
                                        <Text style={styles.sectionLabel}>{filter.name}</Text>
                                        <View style={styles.pillsContainer}>
                                            <TouchableOpacity style={[styles.pill, styles.pillActive]}>
                                                <Text style={[styles.pillText, styles.pillTextActive]}>Any</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.pill}>
                                                <Text style={styles.pillText}>Yes</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            }

                            return null;
                        })}
                    </ScrollView>
                </KeyboardAvoidingView>
            )}

            <View style={styles.footer}>
                <TouchableOpacity style={styles.applyButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.applyText}>See 2,450 Results</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        borderBottomWidth: 1, 
        borderColor: '#EEEEEE' 
    },
    closeButton: { padding: 4, marginStart: -4 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#212121' },
    clearText: { fontSize: 16, color: '#212121', fontWeight: '500' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { paddingBottom: 100 },
    
    categoryHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16, 
        borderBottomWidth: 1, 
        borderColor: '#EEEEEE',
        backgroundColor: '#FAFAFA'
    },
    categoryInfo: { flexDirection: 'row', alignItems: 'center' },
    categoryIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5C518', // Yellow brand
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
    },
    categoryName: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
    changeText: { fontSize: 14, color: '#00BCD4', fontWeight: 'bold' },

    listItem: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16, 
        borderBottomWidth: 1, 
        borderColor: '#EEEEEE' 
    },
    listLabel: { fontSize: 16, color: '#212121', fontWeight: '500' },
    listAction: { flexDirection: 'row', alignItems: 'center' },
    listValue: { fontSize: 16, color: '#757575', marginEnd: 8 },

    filterSection: { padding: 16, borderBottomWidth: 1, borderColor: '#EEEEEE' },
    sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#212121', marginBottom: 16 },
    
    rangeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#FFFFFF',
    },
    input: { 
        paddingHorizontal: 12, 
        paddingVertical: 12, 
        fontSize: 16,
        color: '#212121'
    },

    pillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    pill: { 
        borderWidth: 1, 
        borderColor: '#E0E0E0', 
        borderRadius: 20, 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        marginEnd: 12,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
    },
    pillActive: { 
        backgroundColor: '#E0F7FA', // Light Cyan background
        borderColor: '#00BCD4', 
    },
    pillText: { fontSize: 14, color: '#424242', fontWeight: '500' },
    pillTextActive: { color: '#00BCD4', fontWeight: 'bold' },

    footer: { 
        position: 'absolute', 
        bottom: 0, left: 0, right: 0, 
        padding: 16, 
        backgroundColor: '#FFFFFF', 
        borderTopWidth: 1, 
        borderColor: '#EEEEEE',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    applyButton: { 
        backgroundColor: '#3B3B3B', // Dark Grey background
        paddingVertical: 16, 
        borderRadius: 4, 
        alignItems: 'center' 
    },
    applyText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});

export default FilterScreen;
