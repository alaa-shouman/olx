import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, I18nManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface MetaItemData {
    key: string;
    value: string | number;
    icon: string;
}

export interface SearchListingData {
    id: string;
    title: string;
    price: string;
    currency: string;
    imageUrl: string;
    location: string;
    timestamp: string;
    isElite?: boolean;
    meta?: MetaItemData[];
    isFavorite?: boolean;
}

interface SearchListingCardProps {
    item: SearchListingData;
    onPress: () => void;
    onFavoritePress: () => void;
    onWhatsAppPress: () => void;
    onCallPress: () => void;
}

const SearchListingCard: React.FC<SearchListingCardProps> = ({ item, onPress, onFavoritePress, onWhatsAppPress, onCallPress }) => {
    return (
        <TouchableOpacity style={[styles.container, item.isElite && styles.eliteContainer]} onPress={onPress} activeOpacity={0.9}>
            {item.isElite && (
                <View style={styles.eliteHeader}>
                    <Ionicons name="star" size={12} color="#FFFFFF" style={styles.eliteIcon} />
                    <Text style={styles.eliteText}>ELITE</Text>
                </View>
            )}
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image' }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity style={styles.favoriteBtn} onPress={onFavoritePress}>
                    <Ionicons
                        name={item.isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={item.isFavorite ? "#E53935" : "#FFFFFF"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.price}>{item.currency} {item.price}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                {item.meta && item.meta.length > 0 ? (
                    <View style={styles.metaRow}>
                        {item.meta.slice(0, 6).map((m, index) => (
                            <View key={`${m.key}-${index}`} style={styles.metaItem}>
                                <Ionicons name={m.icon} size={14} color="#757575" />
                                <Text style={styles.metaText}>{m.value}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                <View style={styles.locationTimeRow}>
                    <Ionicons name="location-outline" size={14} color="#757575" />
                    <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
                    <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.callButton} onPress={onCallPress}>
                    <Ionicons name="call-outline" size={18} color="#3B3B3B" />
                    <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.whatsappButton} onPress={onWhatsAppPress}>
                    <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                    <Text style={styles.whatsappText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
        overflow: 'hidden',
    },
    eliteContainer: {
        borderColor: '#D4AF37', // Gold border
        borderWidth: 2,
    },
    eliteHeader: {
        backgroundColor: '#D4AF37',
        paddingVertical: 4,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    eliteIcon: {
        marginEnd: 4,
    },
    eliteText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    imageContainer: {
        height: 200,
        width: '100%',
        backgroundColor: '#E0E0E0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteBtn: {
        position: 'absolute',
        top: 12,
        end: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        padding: 6,
    },
    detailsContainer: {
        padding: 12,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E53935', // Bold red
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        color: '#212121',
        marginBottom: 12,
        lineHeight: 22,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginEnd: 16,
        marginBottom: 8,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#424242',
        marginStart: 4,
        fontWeight: '500',
    },
    locationTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 12,
        color: '#757575',
        flex: 1,
        marginStart: 4,
        marginEnd: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#757575',
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#EEEEEE',
        backgroundColor: '#FAFAFA',
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#3B3B3B',
        borderRadius: 4,
        paddingVertical: 10,
        marginEnd: 8,
        backgroundColor: '#FFFFFF',
    },
    callText: {
        color: '#3B3B3B',
        fontSize: 14,
        fontWeight: 'bold',
        marginStart: 6,
    },
    whatsappButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366', // WhatsApp Green
        borderRadius: 4,
        paddingVertical: 10,
        marginStart: 8,
    },
    whatsappText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginStart: 6,
    },
});

export default SearchListingCard;
