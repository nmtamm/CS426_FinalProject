import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback, useEffect } from "react";

import * as SplashScreen from "expo-splash-screen";
import {
  PatrickHand_400Regular,
  useFonts,
} from "@expo-google-fonts/patrick-hand";

import {
  configureFonts,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import "./global.css";

import RootNavigator from "./src/navigation/RootNavigator";


SplashScreen.preventAutoHideAsync();

const fontConfig = {
  fontFamily: "PatrickHand_400Regular",
};

const theme = {
  ...MD3LightTheme,

  colors: {
    ...MD3LightTheme.colors,
    primary: "#6366f1",
    secondary: "#ec4899",
  },
  fonts: configureFonts({ config: fontConfig }),
};

export default function App() {
  const [fontsLoaded] = useFonts({
    PatrickHand_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
