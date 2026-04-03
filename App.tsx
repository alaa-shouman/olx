import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppStack from './src/Navigation/AppStack';
import './i18n';
import { RTLProvider } from './src/context/RTLContext';
import { useEffect, useState } from 'react';
import { initializeLanguage } from './i18n';

function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    const setupApp = async () => {
      await initializeLanguage();
      setI18nInitialized(true);
    };

    setupApp();
  }, []);



  if ( !i18nInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RTLProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <AppStack />
        </NavigationContainer>
        </RTLProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
