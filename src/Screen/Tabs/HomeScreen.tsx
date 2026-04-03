import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, ActivityIndicator, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import AppBar from '../../components/atoms/AppBar';
import SearchField from '../../components/atoms/SearchField';
import SectionHeader from '../../components/atoms/SectionHeader';
import CategoryItem, { CategoryData } from '../../components/molecules/CategoryItem';
import ListingCard, { ListingData } from '../../components/molecules/ListingCard';
import ImageBanner from '../../components/organisms/ImageBanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCategories } from '../../services/categories';
import { fetchAds, fetchLocations } from '../../services/ads';

// Mock Data
const FALLBACK_CATEGORIES: CategoryData[] = [
    { id: '1', name: 'Motors', icon: 'car-sport-outline' },
    { id: '2', name: 'Property', icon: 'business-outline' },
    { id: '3', name: 'Jobs', icon: 'briefcase-outline' },
    { id: '4', name: 'Electronics', icon: 'laptop-outline' },
    { id: '5', name: 'Furniture', icon: 'bed-outline' },
    { id: '6', name: 'More', icon: 'grid-outline' },
];

const mapCategoryIcon = (id: string | number): string => {
    const iconMap: Record<string, string> = {
        '1': 'car-sport-outline', // Vehicles
        '16': 'business-outline', // Properties
        '4': 'laptop-outline', // Electronics
        '7': 'briefcase-outline', // Jobs
        '6': 'bed-outline', // Furniture
    };
    return iconMap[String(id)] || 'grid-outline';
};

const LISTINGS: ListingData[] = [
    {
        id: '1',
        title: 'Luxury Apartment in Beirut',
        price: '150,000',
        currency: '$',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Apartment',
        location: 'Achrafieh, Beirut',
        timestamp: '2 hours ago',
        meta: { beds: 3, baths: 2, area: 150 },
        isFavorite: false,
    },
    {
        id: '2',
        title: 'Toyota Camry 2021',
        price: '18,500',
        currency: '$',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Car',
        location: 'Tripoli, North',
        timestamp: '5 hours ago',
        meta: { area: 0 },
        isFavorite: true,
    },
    {
        id: '3',
        title: 'iPhone 13 Pro Max - 256GB',
        price: '850',
        currency: '$',
        imageUrl: 'https://via.placeholder.com/300x200.png?text=Phone',
        location: 'Saida, South',
        timestamp: '1 day ago',
    }
];

const HomeScreen = () => {
    const navigation: any = useNavigation();
    const { i18n, t } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const langKey = isArabic ? 'ar' : 'en';

    const getLocalizedName = (name?: string, name_l1?: string): string => {
        if (isArabic) {
            return name_l1 || name || '';
        }
        return name || name_l1 || '';
    };

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [groupedAds, setGroupedAds] = useState<{ category: CategoryData; ads: ListingData[] }[]>([]);
    const [currentLocation, setCurrentLocation] = useState<string>('Lebanon');

    const [loading, setLoading] = useState(true);
    const [loadingAds, setLoadingAds] = useState(true);

    useEffect(() => {
        const initializeHomeData = async () => {
            try {
                setLoading(true);
                setLoadingAds(true);

                // 1. Fetch Location Filter mapping strictly
                try {
                    const locData = await fetchLocations({ language: langKey }) as any;
                    const locHits = locData.responses?.[0]?.hits?.hits || [];
                    if (locHits.length > 0) {
                        const firstChoice = locHits[0]._source;
                        setCurrentLocation(getLocalizedName(firstChoice.name, firstChoice.name_l1));
                    }
                } catch (err) {
                    console.log('Failed to fetch location text.');
                }

                // 2. Fetch Categories
                let rootCatsMapped: CategoryData[] = [];
                try {
                    const catData = await getCategories() as any;
                    if (Array.isArray(catData)) {
                        const rootCats = catData.filter((c: any) => c.parentID === null);
                        rootCatsMapped = rootCats.map((c: any) => ({
                            id: String(c.id),
                            name: getLocalizedName(c.name, c.name_l1),
                            icon: mapCategoryIcon(c.id),
                        }));
                    }
                } catch (catErr) {
                    console.log('Failed to check categories.');
                }

                const finalCategories = rootCatsMapped.length > 0 ? rootCatsMapped : FALLBACK_CATEGORIES;
                setCategories(finalCategories);
                setLoading(false); // Enable Categories UI right away

                // 3. Fetch Ads mapped iteratively for the top 3 visible categories
                const topCats = finalCategories.slice(0, 3);
                const groupedPromises = topCats.map(async (cat: CategoryData) => {
                    const adResp = await fetchAds({
                        categoryId: cat.id,
                        locationId: '1-30', // Default full scope fallback hierarchy
                        language: langKey,
                        size: 8,
                    }) as any;

                    const hits = adResp.responses?.[0]?.hits?.hits || [];

                    const formattedAds: ListingData[] = hits.map((h: any) => {
                        const src = h._source || {};
                        return {
                            id: String(src.id),
                            title: src.title,
                            // Convert safe elastic fallback checks on nested properties
                            price: src.price?.value?.toLocaleString() || '0',
                            currency: src.price?.currency?.isoCode || '$',
                            imageUrl: src.mainImage?.url || 'https://via.placeholder.com/300x200.png?text=No+Image',
                            location: getLocalizedName(src.location?.name, src.location?.name_l1) || 'Beirut',
                            timestamp: new Date(src.created_at || Date.now()).toLocaleDateString(),
                            meta: {
                                area: src.parameters?.find((p: any) => p.key === 'area')?.value,
                                beds: src.parameters?.find((p: any) => p.key === 'rooms')?.value,
                                baths: src.parameters?.find((p: any) => p.key === 'baths')?.value,
                            },
                        };
                    });

                    return { category: cat, ads: formattedAds }; // Pass the block over natively
                });

                const loadedAdsGroups = await Promise.all(groupedPromises);

                // Filter out empty results to prevent rendering empty lists
                setGroupedAds(loadedAdsGroups.filter(grouped => grouped.ads.length > 0));

            } catch (error) {
                console.log('Central home loading failed:', error);

                // Fallback rendering
                setCategories(FALLBACK_CATEGORIES);
                setGroupedAds([{ category: FALLBACK_CATEGORIES[0], ads: LISTINGS }]);
            } finally {
                setLoading(false);
                setLoadingAds(false);
            }
        };

        initializeHomeData();
    }, [isArabic, langKey]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <AppBar
                location={currentLocation}
                onLocationPress={() => { }}
                onNotificationPress={() => { }}
            />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <SearchField onPress={() => navigation.navigate('SearchScreen')} />

                <ImageBanner />

                <SectionHeader
                    title={t('home.allCategories', 'All categories')}
                    actionLabel={t('home.seeAll', 'See all')}
                    onActionPress={() => { }}
                />

                <View style={styles.categoriesContainer}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#F5C518" style={styles.loader} />
                    ) : (
                        <FlashList
                            horizontal
                            data={categories}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalListPadding}
                            renderItem={({ item }) => (
                                <CategoryItem item={item as CategoryData} onPress={() => { }} />
                            )}
                        />
                    )}
                </View>

                {loadingAds ? (
                    <ActivityIndicator size="large" color="#F5C518" style={styles.adsLoader} />
                ) : (
                    groupedAds.map((group) => (
                        <View key={group.category.id} style={styles.groupContainer}>
                            <SectionHeader
                                title={t('home.freshRecommendations', `Fresh ${group.category.name}`)}
                            />

                            <View style={styles.listingsContainer}>
                                <FlashList<ListingData>
                                    horizontal
                                    data={group.ads}
                                    keyExtractor={(item) => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalListPadding}
                                    renderItem={({ item }) => (
                                        <ListingCard
                                            item={item as ListingData}
                                            onPress={() => { }}
                                            onFavoritePress={() => { }}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                    ))
                )}

                {/* Spacer for bottom navigation bar */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
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
    categoriesContainer: {
        height: 100,
        width: '100%',
    },
    listingsContainer: {
        height: 260,
        width: '100%',
    },
    horizontalListPadding: {
        paddingHorizontal: 16,
    },
    loader: {
        marginTop: 20,
    },
    adsLoader: {
        marginTop: 40,
    },
    groupContainer: {
        marginBottom: 10,
    },
    bottomSpacer: {
        height: 80,
    }
});

export default HomeScreen;
