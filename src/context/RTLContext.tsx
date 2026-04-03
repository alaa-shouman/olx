import { createContext, useState, useContext, useEffect } from "react";
import { AppState, AppStateStatus, I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../i18n";

interface RTLContextType {
    isRTL: boolean;
    setRTL: (isRTL: boolean) => Promise<void>;
    ensureRTLState: () => Promise<void>;
}

const RTLContext = createContext<RTLContextType>({
    isRTL: false,
    setRTL: async () => { },
    ensureRTLState: async () => { },
});

export const useRTL = () => useContext(RTLContext);

export const RTLProvider = ({ children }: { children: React.ReactNode }) => {
    const [isRTL, setIsRTLState] = useState(I18nManager.isRTL);

    useEffect(() => {
        ensureRTLState();
    }, [isRTL]);

    useEffect(() => {
        const handleLanguageChange = () => {
            const newRTL = i18n.language === "ar";
            if (newRTL !== isRTL) {
                setRTL(newRTL);
            }
        };

        i18n.on("languageChanged", handleLanguageChange);
        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [isRTL]);

    const ensureRTLState = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem("user-language");
            const shouldBeRTL = savedLanguage === "ar";

            if (I18nManager.isRTL !== shouldBeRTL) {
                I18nManager.allowRTL(shouldBeRTL);
                I18nManager.forceRTL(shouldBeRTL);
                setIsRTLState(shouldBeRTL);
            } else {
                setIsRTLState(I18nManager.isRTL);
            }
        } catch (error) {
            console.error("Error ensuring RTL state:", error);
        }
    };

    const setRTL = async (newRTL: boolean) => {
        try {
            if (I18nManager.isRTL !== newRTL) {
                I18nManager.allowRTL(newRTL);
                I18nManager.forceRTL(newRTL);
            }
            setIsRTLState(newRTL);
        } catch (error) {
            console.error("Error setting RTL:", error);
        }
    };

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                ensureRTLState();
            }
        };

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <RTLContext.Provider
            value={{
                isRTL,
                setRTL,
                ensureRTLState,
            }}
        >
            {children}
        </RTLContext.Provider>
    );
};
