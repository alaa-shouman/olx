import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, I18nManager, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.48; // ~48vw

export interface MetaItemData {
    key: string;
    value: string | number;
    icon: string;
}

export interface ListingData {
    id: string;
    title: string;
    price: string;
    currency: string;
    imageUrl: string;
    location: string;
    timestamp: string;
    meta?: MetaItemData[];
    isFavorite?: boolean;
}

interface ListingCardProps {
    item: ListingData;
    onPress: () => void;
    onFavoritePress: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ item, onPress, onFavoritePress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity style={styles.favoriteBtn} onPress={onFavoritePress}>
                    <Ionicons
                        name={item.isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={item.isFavorite ? "#E53935" : "#FFFFFF"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={[styles.price, { textAlign: 'left', alignSelf: 'flex-start' }]} numberOfLines={1}>{item.currency} {item.price}</Text>
                <Text style={[styles.title, { textAlign: 'left', alignSelf: 'flex-start' }]} numberOfLines={1}>{item.title}</Text>

                {item.meta && item.meta.length > 0 ? (
                    <View style={styles.metaRow}>
                        {item.meta.slice(0, 3).map((m, index) => (
                            <View key={`${m.key}-${index}`} style={styles.metaItem}>
                                <Ionicons name={m.icon} size={12} color="#757575" />
                                <Text style={styles.metaText}>{m.value}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                <View style={styles.footerRow}>
                    <Text style={[styles.locationText, { textAlign: 'left' }]} numberOfLines={1}>{item.location}</Text>
                    <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginEnd: 12, // RTL safe
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 120,
        width: '100%',
        backgroundColor: '#E0E0E0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteBtn: {
        position: 'absolute',
        top: 8,
        end: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        padding: 4,
    },
    detailsContainer: {
        padding: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E53935', // Danger/Price
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        color: '#212121',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginEnd: 8,
    },
    metaText: {
        fontSize: 12,
        color: '#757575',
        marginStart: 4,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 10,
        color: '#757575',
        flex: 1,
        marginEnd: 8,
    },
    timeText: {
        fontSize: 10,
        color: '#757575',
    }
});

export default ListingCard;
