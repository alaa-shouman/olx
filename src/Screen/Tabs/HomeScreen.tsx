import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBar from '../../components/atoms/AppBar';
import SearchField from '../../components/atoms/SearchField';
import SectionHeader from '../../components/atoms/SectionHeader';
import CategoryItem, { CategoryData } from '../../components/molecules/CategoryItem';
import ListingCard, { ListingData } from '../../components/molecules/ListingCard';
import ImageBanner from '../../components/organisms/ImageBanner';
import LocationModal from '../../components/molecules/LocationModal';

import { getCategories } from '../../services/categories';
import { fetchAds } from '../../services/ads';
import { extractAdMeta } from '../../utils/adFormatUtils';

// Define the shape for a Category Section on the Home Screen
interface CategorySection {
    id: string;
    name: string;
    ads: ListingData[];
    loading: boolean;
}

const FALLBACK_CATEGORIES_KEYS: any[] = [
    { id: '1', nameKey: 'mockCategories.vehicles', icon: 'car-sport-outline' },
    { id: '16', nameKey: 'mockCategories.properties', icon: 'business-outline' },
    { id: '4', nameKey: 'mockCategories.electronics', icon: 'laptop-outline' },
    { id: '7', nameKey: 'mockCategories.jobs', icon: 'briefcase-outline' },
    { id: '6', nameKey: 'mockCategories.furniture', icon: 'bed-outline' },
    { id: '402', nameKey: 'mockCategories.mobiles', icon: 'phone-portrait-outline' },
];

const mapCategoryIcon = (id: string | number): string => {
    const iconMap: Record<string, string> = {
        '1': 'car-sport-outline',     // Vehicles
        '16': 'business-outline',     // Properties
        '4': 'laptop-outline',       // Electronics
        '7': 'briefcase-outline',    // Jobs
        '6': 'bed-outline',          // Furniture
        '402': 'phone-portrait-outline' // Mobiles
    };
    return iconMap[String(id)] || 'grid-outline';
};

const HomeScreen = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<any>();
    const isArabic = i18n.language === 'ar';

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [sections, setSections] = useState<CategorySection[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Location state
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        name: isArabic ? 'كل لبنان' : 'All Lebanon',
        id: '1',
        externalID: '0-1'
    });

    const formatAd = (h: any): ListingData => {
        const source = h._source;
        const title = isArabic ? (source.title_l1 || source.title) : source.title;

        // Safely parse location
        const locArray = Array.isArray(source.location) ? source.location : [];
        const locObj = locArray.length > 0 ? locArray[locArray.length - 1] : (source.location || {});
        const locName = isArabic ? (locObj?.name_l1 || locObj?.name) : (locObj?.name || locObj?.name_l1 || locObj?.pathName);

        const extraFields = source.formattedExtraFields || [];
        const priceField = extraFields.find((f: any) => f.attribute === 'price' || f.name === 'Price') || {};
        let price = isArabic ? (priceField.formattedValue_l1 || priceField.formattedValue) : (priceField.formattedValue || priceField.formattedValue_l1);

        if (!price) {
            price = source.extraFields?.price?.toLocaleString() || source.price?.toString() || '0';
        }

        return {
            id: String(source.id),
            title: title,
            price: price,
            currency: source.price?.currency?.isoCode || 'USD',
            imageUrl: source.mainImage?.url || source.images?.[0]?.url || 'https://via.placeholder.com/300x200.png?text=No+Image',
            location: locName || '',
            timestamp: new Date(source.created_at || Date.now()).toLocaleDateString(),
            isFavorite: false,
            meta: extractAdMeta(source.parameters || [], isArabic)
        };
    };

    const loadCategoryAds = async (categoryId: string, language: string, locationId: string) => {
        try {
            const adsResponse = await fetchAds({
                categoryId,
                locationId,
                language: language as any,
                size: 10
            } as any);
            const hits = adsResponse.responses?.[0]?.hits?.hits || [];
            return hits.map(formatAd);
        } catch (error) {
            console.log(`Error fetching ads for category ${categoryId}:`, error);
            return [];
        }
    };

    const loadHomeData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch Categories
            const catsResponse: any = await getCategories();
            const categoriesArray = Array.isArray(catsResponse) ? catsResponse : (catsResponse?.data || []);
            const allCats = categoriesArray.filter((c: any) => !c.parent_id);
            const topCategories = allCats
                .slice(0, 6)
                .map((c: any) => ({
                    id: String(c.id),
                    name: c.name, 
                    icon: mapCategoryIcon(c.id),
                    _raw: c
                }));

            if (topCategories && topCategories.length > 0) {
                setCategories(topCategories);
            }

            // 2. Fetch Ads for categories in parallel
            const fallbackCategories = FALLBACK_CATEGORIES_KEYS.map(c => ({ id: c.id, name: t(c.nameKey), icon: c.icon }));
            const categoriesToFetch = (topCategories && topCategories.length > 0)
                ? topCategories
                : fallbackCategories;

            if (!topCategories || topCategories.length === 0) {
                setCategories(fallbackCategories);
            }

            const language = i18n.language;
            const locationId = selectedLocation.externalID;

            const sectionsData = await Promise.all(
                categoriesToFetch.map(async (cat: CategoryData) => {
                    const ads = await loadCategoryAds(cat.id, language, locationId);
                    return {
                        id: cat.id,
                        name: cat.name,
                        ads,
                        loading: false,
                    };
                })
            );

            setSections(sectionsData.filter((s: any) => s.ads.length > 0));

        } catch (error) {
            console.log('Error loading home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [i18n.language, selectedLocation.externalID]);

    useEffect(() => {
        loadHomeData();
    }, [loadHomeData]);

    const onRefresh = () => {
        setRefreshing(true);
        loadHomeData();
    };

    const handleLocationSelect = (location: any) => {
        setSelectedLocation(location);
        setLocationModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <AppBar
                location={selectedLocation.name}
                onLocationPress={() => setLocationModalVisible(true)}
                onNotificationPress={() => { }}
            />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F5C518']} />
                }
            >
                <SearchField onPress={() => navigation.navigate('CategoryListScreen')} />

                <ImageBanner />

                <SectionHeader
                    title={t('home.allCategories', 'All categories')}
                    actionLabel={t('home.seeAll', 'See all')}
                    onActionPress={() => navigation.navigate('CategoryListScreen')}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                    {categories.map((item) => (
                        <CategoryItem
                            key={item.id}
                            item={item}
                            onPress={() => item._raw
                                ? navigation.navigate('CategoryListScreen', { category: item._raw })
                                : navigation.navigate('SearchScreen', { categoryId: item.id })
                            }
                        />
                    ))}
                </ScrollView>

                {loading && sections.length === 0 ? (
                    <View style={styles.sectionLoader}>
                        <ActivityIndicator size="large" color="#F5C518" />
                    </View>
                ) : (
                    sections.map((section) => (
                        <View key={section.id}>
                            <SectionHeader
                                title={section.name}
                                actionLabel={t('home.seeAll', 'See all')}
                                onActionPress={() => {
                                    const rawCategory = categories.find(c => c.id === section.id)?._raw;
                                    if (rawCategory) {
                                        navigation.navigate('CategoryListScreen', { category: rawCategory });
                                    } else {
                                        navigation.navigate('SearchScreen', { categoryId: section.id });
                                    }
                                }}
                            />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                                {section.ads.map((item) => (
                                    <ListingCard
                                        key={item.id}
                                        item={item}
                                        onPress={() => { }}
                                        onFavoritePress={() => { }}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    ))
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>

            <LocationModal
                visible={locationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onSelect={handleLocationSelect}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    horizontalListPadding: {
        paddingHorizontal: 16,
    },
    bottomSpacer: {
        height: 80,
    },
    sectionLoader: {
        paddingVertical: 40,
        alignItems: 'center',
    },
});

export default HomeScreen;
