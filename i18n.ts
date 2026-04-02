import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from 'react-native-restart';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DevSettings, I18nManager, Platform } from "react-native";
import ar from "./public/locales/ar/translation.json";
import en from "./public/locales/en/translation.json";
const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default, will be overridden by initializeLanguage
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Apply RTL settings to the app
const applyRTL = (isRTL: boolean) => {
  const currentRTL = I18nManager.isRTL;

  if (currentRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    return true; // Indicates restart is needed
  }
  return false; // No restart needed
};

// Reload app
const reloadApp = async () => {
  if (__DEV__) {
    DevSettings.reload();
  } else {
    try {
      RNRestart.restart();
    } catch (e) {
      console.warn("Failed to reload app:", e);
    }
  }
};

// Initialize language on app startup
export const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("user-language");
    const targetLanguage = savedLanguage || "en";
    const finalLanguage = targetLanguage in resources ? targetLanguage : "en";

    // Set language in i18n
    await i18n.changeLanguage(finalLanguage);

    // Apply RTL if needed
    const isRTL = finalLanguage === "ar";
    const needsRestart = applyRTL(isRTL);

    // Save if it's the first time
    if (!savedLanguage) {
      await AsyncStorage.setItem("user-language", finalLanguage);
    }

    // Restart if RTL state changed, even on refresh
    if (needsRestart && !(Platform.OS === "ios" && __DEV__)) {
      setTimeout(() => reloadApp(), 100);
    }
  } catch (error) {
    console.error("❌ Error initializing language:", error);
  }
};

// Change language dynamically
export const changeAppLanguage = async (language: string) => {
  try {
    const currentLanguage = i18n.language;

    if (currentLanguage === language) {
      return true;
    }

    // Save preference
    await AsyncStorage.setItem("user-language", language);

    // Change language
    await i18n.changeLanguage(language);

    // Apply RTL
    const isRTL = language === "ar";
    const needsRestart = applyRTL(isRTL);

    // Restart app if RTL changed
    if (needsRestart) {
      setTimeout(() => reloadApp(), 100);
    }

    return true;
  } catch (error) {
    console.error("❌ Error changing language:", error);
    return false;
  }
};

export const handleApiError = (error: any, defaultErrorKey: string) => {
  const t = i18n.t;

  let errorMessage = "";

  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error.message) {
    if (error.message.includes("Network Error")) {
      errorMessage = t("errors.network");
    } else {
      errorMessage = error.message;
    }
  } else {
    errorMessage = t(defaultErrorKey);
  }

  return {
    userMessage: errorMessage,
    originalError: error,
  };
};

export default i18n;
