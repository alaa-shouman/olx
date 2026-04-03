import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fetchAds } from '../services/ads';
import ListingCard, { ListingData } from '../components/molecules/ListingCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation, route }: any) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const initialQuery = route.params?.query || '';
    const initialCategory = route.params?.categoryId || null;

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [ads, setAds] = useState<ListingData[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalHits, setTotalHits] = useState(0);

    const loadFilteredAds = async () => {
        setLoading(true);
        try {
            const data = await fetchAds({
                searchTerm: searchQuery,
                categoryId: initialCategory,
                language: isArabic ? 'ar' : 'en',
                size: 20
            } as any);
            const hits = data.responses?.[0]?.hits?.hits || [];
            setTotalHits(data.responses?.[0]?.hits?.total?.value || 0);

            setAds(hits.map((h: any) => ({
                id: String(h._source.id),
                title: h._source.title,
                price: h._source.price?.value?.toLocaleString() || '0',
                currency: h._source.price?.currency?.isoCode || '$',
                imageUrl: h._source.mainImage?.url,
                location: h._source.location?.name || '',
                timestamp: new Date(h._source.created_at || Date.now()).toLocaleDateString(),
                meta: {}
            })));
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFilteredAds();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.iconText}>{'<'}</Text>
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={loadFilteredAds}
                        placeholder={t('search.placeholder', 'What are you looking for?')}
                    />
                </View>
            </View>

            {/* Sub Filter Row */}
            <View style={styles.filterRow}>
                <TouchableOpacity style={styles.pillActive} onPress={() => navigation.navigate('FilterScreen', { categoryId: initialCategory })}>
                    <Text style={styles.pillTextActive}>Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pill}>
                    <Text style={styles.pillText}>All country ⌄</Text>
                </TouchableOpacity>
                {initialCategory && (
                    <TouchableOpacity style={styles.pill}>
                        <Text style={styles.pillText}>Cars For Sale</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Results Count & Sorting */}
            <View style={styles.resultsInfoRow}>
                <Text style={styles.resultsText}>Showing: {totalHits} Results</Text>
                <TouchableOpacity>
                    <Text style={styles.sortText}>Sort By ↑↓</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={ads}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        // Re-using your generic ListingCard component here
                        <ListingCard item={item} onPress={() => { }} onFavoritePress={() => { }} />
                    )}
                    contentContainerStyle={styles.listPadding}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EAEAEA' },
    backButton: { marginEnd: 12 },
    iconText: { fontSize: 24, color: '#333' },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 4, paddingHorizontal: 10, height: 40 },
    searchIcon: { marginEnd: 8, fontSize: 16 },
    searchInput: { flex: 1, height: '100%', color: '#333' },
    filterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 },
    pill: { borderWidth: 1, borderColor: '#CCC', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginEnd: 8 },
    pillActive: { backgroundColor: '#E0F7FA', borderWidth: 1, borderColor: '#00BCD4', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginEnd: 8 },
    pillText: { color: '#333', fontSize: 13 },
    pillTextActive: { color: '#00BCD4', fontSize: 13, fontWeight: 'bold' },
    resultsInfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
    resultsText: { fontSize: 13, color: '#555', fontWeight: 'bold' },
    sortText: { fontSize: 13, color: '#00BCD4' },
    listPadding: { padding: 16 }
});

export default SearchScreen;
