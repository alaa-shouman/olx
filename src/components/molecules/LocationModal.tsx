import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, ActivityIndicator, I18nManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchLocations } from '../../services/ads';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LocationItem {
    id: string;
    name: string;
    externalID: string;
}

interface LocationModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: LocationItem) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ visible, onClose, onSelect }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            loadLocations();
        }
    }, [visible, isArabic]);

    const loadLocations = async () => {
        setLoading(true);
        try {
            // Fetch level 2 locations (Cities/Areas in Lebanon context)
            const response = await fetchLocations({
                level: 2,
                language: isArabic ? 'ar' : 'en'
            } as any);

            const hits = response.responses?.[0]?.hits?.hits || [];
            const mapped = hits.map((h: any) => ({
                id: String(h._source.id),
                name: isArabic ? (h._source.name_l1 || h._source.name) : h._source.name,
                externalID: h._source.externalID || String(h._source.id),
            }));

            // Add "All Lebanon" option
            setLocations([{ id: '1', name: isArabic ? 'كل لبنان' : 'All Lebanon', externalID: '0-1' }, ...mapped]);
        } catch (error) {
            console.log('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={28} color="#212121" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{t('locationModal.title', 'Select Location')}</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#F5C518" />
                    </View>
                ) : (
                    <FlatList
                        data={locations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#E0E0E0" />
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
    },
    closeBtn: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    itemText: {
        fontSize: 16,
        color: '#212121',
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginHorizontal: 16,
    },
});

export default LocationModal;
