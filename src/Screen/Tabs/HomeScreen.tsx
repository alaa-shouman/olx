import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, ActivityIndicator, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import AppBar from '../../components/atoms/AppBar';
import SearchField from '../../components/atoms/SearchField';
import SectionHeader from '../../components/atoms/SectionHeader';
import CategoryItem, { CategoryData } from '../../components/molecules/CategoryItem';
import ListingCard, { ListingData } from '../../components/molecules/ListingCard';
import ImageBanner from '../../components/organisms/ImageBanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCategories } from '../../services/categories';

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
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRemoteCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories() as any;
                if (Array.isArray(data)) {
                    const rootCats = data.filter((c: any) => c.parentID === null);
                    const mapped = rootCats.map((c: any) => ({
                        id: String(c.id),
                        name: c.name || c.name_l1,
                        icon: mapCategoryIcon(c.id),
                    }));
                    setCategories(mapped.length > 0 ? mapped : FALLBACK_CATEGORIES);
                }
            } catch (error) {
                console.log('Failed to fetch categories, using fallback', error);
                setCategories(FALLBACK_CATEGORIES);
            } finally {
                setLoading(false);
            }
        };

        fetchRemoteCategories();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <AppBar
                location="Lebanon"
                onLocationPress={() => { }}
                onNotificationPress={() => { }}
            />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <SearchField />

                <ImageBanner />

                <SectionHeader
                    title="All categories"
                    actionLabel="See all"
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

                <SectionHeader
                    title="Fresh recommendations"
                />

                <View style={styles.listingsContainer}>
                    <FlashList<ListingData>
                        horizontal
                        data={LISTINGS}
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
    bottomSpacer: {
        height: 80,
    }
});

export default HomeScreen;
