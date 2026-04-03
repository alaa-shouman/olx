import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ImageBanner: React.FC = () => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{t('banner.title', 'Everything you need')}</Text>
                    <Text style={styles.subtitle}>{t('banner.subtitle', 'in one place')}</Text>
                </View>
                {/* Placeholder for the cyan blob and family photo */}
                <View style={styles.imageWrapper}>
                    <View style={styles.cyanBlob} />
                    <Image
                        source={{ uri: 'https://via.placeholder.com/150x150.png?text=Family' }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Pagination dots implied */}
            <View style={styles.pagination}>
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 140,
        backgroundColor: '#F5F6F8',
        marginTop: 8,
        overflow: 'hidden',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212121',
    },
    subtitle: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
    imageWrapper: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cyanBlob: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00BCD4', // Cyan
        opacity: 0.2,
    },
    image: {
        width: 90,
        height: 90,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#212121',
        width: 16,
    }
});

export default ImageBanner;
