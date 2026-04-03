import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../../i18n';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountScreen = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        await changeAppLanguage(newLang);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

                {/* Header Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={50} color="#0A2C2A" style={styles.avatarIcon} />
                    </View>
                    <View style={styles.profileTexts}>
                        <Text style={styles.loginTitle}>{t('account.login', 'Log in')}</Text>
                        <TouchableOpacity>
                            <Text style={styles.loginSubtitle}>{t('account.loginToYourAccount', 'Log in to your account')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="chatbubbles-outline" size={24} color="#1E2329" style={styles.menuIcon} />
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>{t('account.blog', 'Blog')}</Text>
                        </View>
                        <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#1E2329" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.customIconContainer}>
                            <Text style={styles.customIconText}>olx</Text>
                        </View>
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>{t('account.helpAndSupport', 'Help & Support')}</Text>
                            <Text style={styles.menuSubtitle}>{t('account.helpCenter', 'Help center and legal terms')}</Text>
                        </View>
                        <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#1E2329" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1E2329" style={styles.menuIcon} />
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>{t('account.customerSupport', 'Customer Support')}</Text>
                            <Text style={styles.menuSubtitle}>{t('account.getAssistance', 'Get assistance from our support team')}</Text>
                        </View>
                        <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#1E2329" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
                        <Ionicons name="globe-outline" size={24} color="#1E2329" style={styles.menuIcon} />
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>{t('account.changeLanguageTitle', 'العربية')}</Text>
                            <Text style={styles.menuSubtitle}>{t('account.changeLanguage', 'Change language')}</Text>
                        </View>
                        <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#1E2329" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={24} color="#1E2329" style={styles.menuIcon} />
                        <View style={styles.menuTexts}>
                            <Text style={styles.menuTitle}>{t('account.settings', 'Settings')}</Text>
                        </View>
                        <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#1E2329" />
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>{t('account.logInBtn', 'Log In')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>{t('account.createNewAccount', 'Create a new account')}</Text>
                    </TouchableOpacity>
                </View>

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
        paddingBottom: 40,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFCE32',
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 16,
        overflow: 'hidden',
    },
    avatarIcon: {
        marginTop: 10,
    },
    profileTexts: {
        flex: 1,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E2329',
        marginBottom: 4,
    },
    loginSubtitle: {
        fontSize: 14,
        color: '#1E2329',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    menuContainer: {
        borderTopWidth: 1,
        borderTopColor: '#EAEBEF',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEBEF',
    },
    menuIcon: {
        width: 32,
    },
    customIconContainer: {
        width: 32,
        justifyContent: 'center',
    },
    customIconText: {
        color: '#1E2329',
        fontWeight: 'bold',
        fontSize: 16,
    },
    menuTexts: {
        flex: 1,
        justifyContent: 'center',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E2329',
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#757575',
        marginTop: 2,
    },
    actionsContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    primaryButton: {
        backgroundColor: '#1E2329',
        borderRadius: 4,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderRadius: 4,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E2329',
    },
    secondaryButtonText: {
        color: '#1E2329',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccountScreen;
