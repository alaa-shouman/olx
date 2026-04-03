import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fetchAds } from '../services/ads';
import SearchListingCard, { SearchListingData } from '../components/molecules/SearchListingCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreen = ({ navigation, route }: any) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const initialQuery = route.params?.query || '';
    const initialCategory = route.params?.categoryId || null;

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [ads, setAds] = useState<SearchListingData[]>([]);
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

            setAds(hits.map((h: any, index: number) => {
                const source = h._source;
                const parameters = source.parameters || [];

                // Helper to extract dynamic field parameters safely
                const getParam = (key: string) => {
                    const param = parameters.find((p: any) => p.key === key);
                    return param ? param.value : undefined;
                };

                const title = isArabic ? (source.title_l1 || source.title) : source.title;
                const locName = isArabic ? (source.location?.name_l1 || source.location?.name) : (source.location?.name || source.location?.pathName);

                return {
                    id: String(source.id),
                    title: title,
                    price: source.price?.value?.display || (source.price?.value?.amount ? source.price.value.amount.toLocaleString() : '0'),
                    currency: source.price?.currency?.isoCode || 'USD',
                    imageUrl: source.mainImage?.url || source.images?.[0]?.url,
                    location: locName || '',
                    timestamp: new Date(source.created_at || Date.now()).toLocaleDateString(),
                    isElite: index === 0, // Mocking first item as Elite for UI demo
                    meta: {
                        year: getParam('year'),
                        mileage: getParam('mileage'),
                        fuel: getParam('fuel'),
                        beds: getParam('rooms'),
                        baths: getParam('bathrooms'),
                        area: getParam('area'),
                    }
                };
            }));
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
                    <Ionicons name={isArabic ? "arrow-forward" : "arrow-back"} size={24} color="#3B3B3B" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={loadFilteredAds}
                        placeholder={t('search.placeholder', 'What are you looking for?')}
                        placeholderTextColor="#757575"
                        textAlign={isArabic ? 'right' : 'left'}
                    />
                </View>
            </View>

            {/* Sub Filter Row */}
            <View style={styles.filterRowContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                    data={[
                        { id: 'filter', label: 'Filters', isIcon: true, icon: 'options-outline', active: true },
                        { id: 'location', label: 'All country', isIcon: true, icon: 'location-outline' },
                        { id: 'category', label: initialCategory === '23' ? 'Cars for sale' : 'Category' },
                    ]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.pill, item.active && styles.pillActive]}
                            onPress={() => item.id === 'filter' ? navigation.navigate('FilterScreen', { categoryId: initialCategory }) : null}
                        >
                            {item.isIcon && <Ionicons name={item.icon!} size={16} color={item.active ? '#00BCD4' : '#3B3B3B'} style={styles.pillIcon} />}
                            <Text style={[styles.pillText, item.active && styles.pillTextActive]}>
                                {item.label} {item.id === 'location' ? '⌄' : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Results Count & Sorting */}
            <View style={styles.resultsInfoRow}>
                <Text style={styles.resultsText}>Showing: {totalHits} Results</Text>
                <TouchableOpacity style={styles.sortToggle}>
                    <Text style={styles.sortText}>Sort By</Text>
                    <Ionicons name="swap-vertical" size={16} color="#00BCD4" style={{ marginStart: 4 }} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00BCD4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={ads}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SearchListingCard
                            item={item}
                            onPress={() => { }}
                            onFavoritePress={() => { }}
                            onCallPress={() => { }}
                            onWhatsAppPress={() => { }}
                        />
                    )}
                    contentContainerStyle={styles.listPadding}
                    ListHeaderComponent={() => {
                        if (ads.length > 0 && ads[0].isElite) {
                            return (
                                <View style={styles.eliteHeaderSection}>
                                    <Text style={styles.eliteSectionTitle}>Elite Ads</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.viewMoreText}>View more</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                        return null;
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        marginEnd: 12,
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        backgroundColor: '#FFFFFF',
    },
    searchIcon: {
        marginEnd: 8
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#212121',
        fontSize: 14,
        paddingVertical: 0,
    },
    filterRowContainer: {
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
    },
    filterRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginEnd: 8,
        backgroundColor: '#FFFFFF',
    },
    pillActive: {
        backgroundColor: '#E0F7FA',
        borderColor: '#00BCD4',
    },
    pillIcon: {
        marginEnd: 6,
    },
    pillText: {
        color: '#3B3B3B',
        fontSize: 14,
        fontWeight: '500',
    },
    pillTextActive: {
        color: '#00BCD4',
        fontWeight: 'bold',
    },
    resultsInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    resultsText: {
        fontSize: 14,
        color: '#212121',
        fontWeight: 'bold',
    },
    sortToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        fontSize: 14,
        color: '#00BCD4',
        fontWeight: '600',
    },
    eliteHeaderSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 4,
    },
    eliteSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
    },
    viewMoreText: {
        fontSize: 14,
        color: '#00BCD4',
        fontWeight: '600',
    },
    listPadding: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    }
});

export default SearchScreen;
