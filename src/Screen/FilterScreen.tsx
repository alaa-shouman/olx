import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { getCategoryFields, mapCategoryFieldsToFilters } from '../services/categories';
import { DynamicFilter } from '../validation';
import { useTranslation } from 'react-i18next';

const FilterScreen = ({ navigation, route }: any) => {
    const categoryId = route.params?.categoryId || '23'; // Defaults to Vehicles -> Cars (23) testing spec
    const { t } = useTranslation();
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity>
                    <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#333" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Category</Text>
                        <Text style={styles.value}>Vehicles - Cars for Sale</Text>
                    </View>

                    {filters.map((filter) => (
                        <View key={filter.id} style={styles.filterSection}>
                            <Text style={styles.label}>{filter.name}</Text>
                            {filter.filterType === 'range' ? (
                                <View style={styles.rangeRow}>
                                    <TextInput style={styles.input} placeholder="Min" keyboardType="numeric" />
                                    <TextInput style={styles.input} placeholder="Max" keyboardType="numeric" />
                                </View>
                            ) : filter.filterType === 'multiple_choice' ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
                                    {filter.choices?.slice(0, 5).map((choice) => (
                                        <TouchableOpacity key={choice.id} style={styles.chip}>
                                            <Text style={styles.chipText}>{choice.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <TouchableOpacity style={styles.selectRow}>
                                    <Text style={styles.value}>Any</Text>
                                    <Text>{'>'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}

            <View style={styles.footer}>
                <TouchableOpacity style={styles.applyButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.applyText}>See Results</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#EEE' },
    closeIcon: { fontSize: 20, color: '#333' },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    clearText: { fontSize: 14, color: '#00BCD4', fontWeight: 'bold' },
    scroll: { paddingBottom: 100 },
    row: { padding: 16, borderBottomWidth: 1, borderColor: '#EEE' },
    filterSection: { padding: 16, borderBottomWidth: 1, borderColor: '#EEE' },
    label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    value: { fontSize: 14, color: '#777' },
    rangeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    input: { flex: 1, borderWidth: 1, borderColor: '#CCC', padding: 10, marginHorizontal: 4, borderRadius: 4 },
    chips: { flexDirection: 'row' },
    chip: { borderWidth: 1, borderColor: '#CCC', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, marginEnd: 8 },
    chipText: { fontSize: 13, color: '#333' },
    selectRow: { flexDirection: 'row', justifyContent: 'space-between' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
    applyButton: { backgroundColor: '#333', padding: 16, borderRadius: 4, alignItems: 'center' },
    applyText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default FilterScreen;
