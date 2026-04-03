import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBar from '../../components/atoms/AppBar';
import SearchField from '../../components/atoms/SearchField';
import SectionHeader from '../../components/atoms/SectionHeader';
import CategoryItem, { CategoryData } from '../../components/molecules/CategoryItem';
import ListingCard, { ListingData } from '../../components/molecules/ListingCard';
import ImageBanner from '../../components/organisms/ImageBanner';

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

const HomeScreen = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<any>();
    const isArabic = i18n.language === 'ar';

    const [categories, setCategories] = useState<CategoryData[]>(FALLBACK_CATEGORIES);
    const [freshAds, setFreshAds] = useState<ListingData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                // 1. Fetch Categories
                const catsResponse = await getCategories();
                const fetchedCats = catsResponse.data
                    ?.filter((c: any) => c.parent_id === null)
                    .map((c: any) => ({
                        id: String(c.id),
                        name: c.name,
                        icon: mapCategoryIcon(c.id)
                    }));
                
                if (fetchedCats && fetchedCats.length > 0) {
                    setCategories(fetchedCats.slice(0, 6)); // Show top 6
                }

                // 2. Fetch Initial "Fresh" Ads
                const adsResponse = await fetchAds({
                    language: isArabic ? 'ar' : 'en',
                    size: 10
                } as any);

                const hits = adsResponse.responses?.[0]?.hits?.hits || [];
                const formattedAds = hits.map((h: any) => ({
                    id: String(h._source.id),
                    title: h._source.title,
                    price: h._source.price?.value?.display || (h._source.price?.value?.amount ? h._source.price.value.amount.toLocaleString() : '0'),
                    currency: h._source.price?.currency?.isoCode || 'USD',
                    imageUrl: h._source.mainImage?.url || h._source.images?.[0]?.url || 'https://via.placeholder.com/300x200.png?text=No+Image',
                    location: h._source.location?.name || h._source.location?.pathName || '',
                    timestamp: new Date(h._source.created_at || Date.now()).toLocaleDateString(),
                    isFavorite: false,
                    meta: {
                        beds: h._source.parameters?.find((p: any) => p.key === 'rooms')?.value,
                        baths: h._source.parameters?.find((p: any) => p.key === 'bathrooms')?.value,
                        area: h._source.parameters?.find((p: any) => p.key === 'area')?.value,
                    }
                }));

                setFreshAds(formattedAds);

            } catch (error) {
                console.log('Error loading home data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, [isArabic]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <AppBar 
                location="Lebanon" 
                onLocationPress={() => {}} 
                onNotificationPress={() => {}} 
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
                    onActionPress={() => {}} 
                />
                
                {loading && categories === FALLBACK_CATEGORIES ? (
                    <ActivityIndicator size="small" color="#F5C518" style={{marginVertical: 20}} />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                        {categories.map((item) => (
                            <CategoryItem 
                                key={item.id} 
                                item={item} 
                                onPress={() => navigation.navigate('SearchScreen', { categoryId: item.id })} 
                            />
                        ))}
                    </ScrollView>
                )}
                
                <SectionHeader 
                    title={t('home.freshRecommendations', 'Fresh recommendations')} 
                />
                
                {loading && freshAds.length === 0 ? (
                    <ActivityIndicator size="large" color="#F5C518" style={{marginTop: 40}} />
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                        {freshAds.map((item) => (
                            <ListingCard 
                                key={item.id}
                                item={item} 
                                onPress={() => {}} 
                                onFavoritePress={() => {}} 
                            />
                        ))}
                    </ScrollView>
                )}
                
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
    horizontalListPadding: {
        paddingHorizontal: 16,
    },
    bottomSpacer: {
        height: 80, 
    }
});

export default HomeScreen;
