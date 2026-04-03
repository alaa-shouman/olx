import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, I18nManager, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { getCategoryFields, mapCategoryFieldsToFilters } from '../services/categories';
import { DynamicFilter } from '../validation';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationModal, { LocationItem } from '../components/molecules/LocationModal';

const FilterScreen = ({ navigation, route }: any) => {
    // We should parse 51 for Cars, 70 for Mobile Phones, 60 for Apartments as OLX LB mappings returned by the actual API
    let categoryId = route.params?.categoryId;
    if (!categoryId) categoryId = '51'; // Defaults to Cars for sale for testing

    // Convert old mock IDs if user testing passed them directly
    if (categoryId === '23') categoryId = '51'; // Pet -> Cars
    if (categoryId === '402') categoryId = '70'; // Mobile phone
    if (categoryId === '1426') categoryId = '60'; // Apartments

    const appliedFilters = route.params?.appliedFilters || {};
    const appliedLocationId = route.params?.appliedLocationId || null;

    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const [filters, setFilters] = useState<DynamicFilter[]>([]);
    const [loading, setLoading] = useState(true);

    // State for local changes
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(appliedFilters);
    const [location, setLocation] = useState<{ id: string, name: string, externalID?: string } | null>(
        appliedLocationId ? { id: appliedLocationId, name: t('filter.selectedLocation', 'Custom Location'), externalID: appliedLocationId } : null
    );
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);
    const [activeFilterModal, setActiveFilterModal] = useState<DynamicFilter | null>(null);

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

    const handleApply = () => {
        navigation.navigate({
            name: 'SearchScreen',
            params: {
                categoryId: categoryId,
                appliedFilters: selectedFilters,
                appliedLocationId: location?.externalID || location?.id || null
            },
            merge: true,
        });
    };

    const handleClearAll = () => {
        setSelectedFilters({});
        setLocation(null);
    };

    // Helper functions for state manipulation
    const updateFilter = (attr: string, value: any) => {
        setSelectedFilters(prev => ({
            ...prev,
            [attr]: value
        }));
    };

    const toggleMultipleChoice = (attr: string, choiceValue: string) => {
        setSelectedFilters(prev => {
            const current = Array.isArray(prev[attr]) ? prev[attr] : [];
            const isSelected = current.includes(choiceValue);

            let newArr;
            if (isSelected) {
                newArr = current.filter((v: string) => v !== choiceValue);
            } else {
                newArr = [...current, choiceValue];
            }

            return {
                ...prev,
                [attr]: newArr.length > 0 ? newArr : undefined
            };
        });
    };

    const updateRange = (attr: string, type: 'gte' | 'lte', val: string) => {
        const num = parseInt(val, 10);
        setSelectedFilters(prev => {
            const current = typeof prev[attr] === 'object' && prev[attr] !== null ? { ...prev[attr] } : {};
            if (isNaN(num)) {
                delete current[type];
            } else {
                current[type] = num;
            }

            // Remove entirely if empty
            if (Object.keys(current).length === 0) {
                const newState = { ...prev };
                delete newState[attr];
                return newState;
            }

            return { ...prev, [attr]: current };
        });
    };

    // Category mapping to nice UI representation
    const getCategoryDetails = () => {
        switch (String(categoryId)) {
            case '51': return { name: t('mockCategories.carsForSale', 'Cars for sale'), icon: 'car-sport' };
            case '70': return { name: t('mockCategories.mobilePhones', 'Mobile Phones'), icon: 'phone-portrait' };
            case '60': return { name: t('mockCategories.apartmentsForSale', 'Apartments for sale'), icon: 'business' };
            default: return { name: t('mockCategories.allCategories', 'All Categories'), icon: 'grid' };
        }
    };
    const catDetails = getCategoryDetails();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color="#212121" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('filter.title', 'Filters')}</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearText}>{t('filter.clearAll', 'Clear all')}</Text>
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
                            <TouchableOpacity onPress={() => navigation.navigate('CategoryListScreen')}>
                                <Text style={styles.changeText}>{t('filter.change', 'Change')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Location List Item */}
                        <TouchableOpacity style={styles.listItem} onPress={() => setLocationModalVisible(true)}>
                            <Text style={styles.listLabel}>{t('filter.location', 'Location')}</Text>
                            <View style={styles.listAction}>
                                <Text style={styles.listValue}>{location ? location.name : t('filter.allCountry', 'All country')}</Text>
                                <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#757575" />
                            </View>
                        </TouchableOpacity>

                        {/* Dynamic Filters */}
                        {filters.map((filter) => {
                            if (filter.filterType === 'range') {
                                const currentRange = selectedFilters[filter.attribute] || {};
                                return (
                                    <View key={filter.id} style={styles.filterSection}>
                                        <Text style={styles.sectionLabel}>{filter.name}</Text>
                                        <View style={styles.rangeRow}>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={t('filter.min', 'Min')}
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#9E9E9E"
                                                    value={currentRange.gte !== undefined ? String(currentRange.gte) : ''}
                                                    onChangeText={(val) => updateRange(filter.attribute, 'gte', val)}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={t('filter.max', 'Max')}
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#9E9E9E"
                                                    value={currentRange.lte !== undefined ? String(currentRange.lte) : ''}
                                                    onChangeText={(val) => updateRange(filter.attribute, 'lte', val)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                );
                            }

                            if (filter.filterType === 'multiple_choice') {
                                const currentSelection = Array.isArray(selectedFilters[filter.attribute]) ? selectedFilters[filter.attribute] : [];

                                // If many choices, render as list item (e.g., Brand, Payment Options)
                                if (filter.choices && filter.choices.length > 5) {
                                    const selectedCount = currentSelection.length;
                                    const selectedChoice = filter.choices.find(c => currentSelection.includes(c.value));

                                    let displayValue = t('filter.any', 'Any');
                                    if (selectedCount === 1 && selectedChoice) {
                                        displayValue = selectedChoice.label;
                                    } else if (selectedCount > 1) {
                                        displayValue = `${selectedCount} ${t('filter.selected', 'Selected')}`;
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={filter.id}
                                            style={styles.listItem}
                                            onPress={() => setActiveFilterModal(filter)}
                                        >
                                            <Text style={styles.listLabel}>{filter.name}</Text>
                                            <View style={styles.listAction}>
                                                <Text style={styles.listValue}>{displayValue}</Text>
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
                                            <TouchableOpacity
                                                style={[styles.pill, currentSelection.length === 0 && styles.pillActive]}
                                                onPress={() => updateFilter(filter.attribute, undefined)}
                                            >
                                                <Text style={[styles.pillText, currentSelection.length === 0 && styles.pillTextActive]}>{t('filter.any', 'Any')}</Text>
                                            </TouchableOpacity>
                                            {filter.choices?.map((choice) => {
                                                const isActive = currentSelection.includes(choice.value);
                                                return (
                                                    <TouchableOpacity
                                                        key={choice.id}
                                                        style={[styles.pill, isActive && styles.pillActive]}
                                                        onPress={() => toggleMultipleChoice(filter.attribute, choice.value)}
                                                    >
                                                        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{choice.label}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            }

                            if (filter.filterType === 'boolean') {
                                const isActive = selectedFilters[filter.attribute] === 'yes';
                                return (
                                    <View key={filter.id} style={styles.filterSection}>
                                        <Text style={styles.sectionLabel}>{filter.name}</Text>
                                        <View style={styles.pillsContainer}>
                                            <TouchableOpacity
                                                style={[styles.pill, !isActive && styles.pillActive]}
                                                onPress={() => updateFilter(filter.attribute, undefined)}
                                            >
                                                <Text style={[styles.pillText, !isActive && styles.pillTextActive]}>{t('filter.any', 'Any')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.pill, isActive && styles.pillActive]}
                                                onPress={() => updateFilter(filter.attribute, 'yes')}
                                            >
                                                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{t('filter.yes', 'Yes')}</Text>
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
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyText}>{t('filter.apply', 'See Results')}</Text>
                </TouchableOpacity>
            </View>

            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onSelect={(loc) => {
                    setLocation(loc);
                    setLocationModalVisible(false);
                }}
            />

            {/* Generic Multiple Choice Modal */}
            <Modal
                visible={!!activeFilterModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setActiveFilterModal(null)}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setActiveFilterModal(null)} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color="#212121" />
                        </TouchableOpacity>
                        <Text style={styles.title}>{activeFilterModal?.name}</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <FlatList
                        data={activeFilterModal?.choices || []}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            const isSelected = !!(activeFilterModal &&
                                Array.isArray(selectedFilters[activeFilterModal.attribute]) &&
                                selectedFilters[activeFilterModal.attribute].includes(item.value));

                            return (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => activeFilterModal && toggleMultipleChoice(activeFilterModal.attribute, item.value)}
                                >
                                    <Text style={[styles.listLabel, isSelected && { color: '#00BCD4', fontWeight: 'bold' }]}>
                                        {item.label}
                                    </Text>
                                    {isSelected && <Ionicons name="checkmark" size={24} color="#00BCD4" />}
                                </TouchableOpacity>
                            );
                        }}
                    />
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.applyButton} onPress={() => setActiveFilterModal(null)}>
                            <Text style={styles.applyText}>{t('filter.done', 'Done')}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
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
