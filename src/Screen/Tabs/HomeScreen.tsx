import React from 'react';
import { StyleSheet, View, ScrollView, FlatList, StatusBar } from 'react-native';

import AppBar from '../../components/atoms/AppBar';
import SearchField from '../../components/atoms/SearchField';
import SectionHeader from '../../components/atoms/SectionHeader';
import CategoryItem, { CategoryData } from '../../components/molecules/CategoryItem';
import ListingCard, { ListingData } from '../../components/molecules/ListingCard';
import ImageBanner from '../../components/organisms/ImageBanner';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const CATEGORIES: CategoryData[] = [
    { id: '1', name: 'Motors', icon: 'car-sport-outline' },
    { id: '2', name: 'Property', icon: 'business-outline' },
    { id: '3', name: 'Jobs', icon: 'briefcase-outline' },
    { id: '4', name: 'Electronics', icon: 'laptop-outline' },
    { id: '5', name: 'Furniture', icon: 'bed-outline' },
    { id: '6', name: 'More', icon: 'grid-outline' },
];

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
        meta: { area: 0 }, // Using area just as an example to test fallback
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
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
                <SearchField />
                
                <ImageBanner />
                
                <SectionHeader 
                    title="All categories" 
                    actionLabel="See all" 
                    onActionPress={() => {}} 
                />
                
                <FlatList
                    horizontal
                    data={CATEGORIES}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CategoryItem item={item} onPress={() => {}} />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListPadding}
                />
                
                <SectionHeader 
                    title="Fresh recommendations" 
                />
                
                <FlatList
                    horizontal
                    data={LISTINGS}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ListingCard 
                            item={item} 
                            onPress={() => {}} 
                            onFavoritePress={() => {}} 
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListPadding}
                />
                
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
    horizontalListPadding: {
        paddingHorizontal: 16,
    },
    bottomSpacer: {
        height: 80, 
    }
});

export default HomeScreen;
