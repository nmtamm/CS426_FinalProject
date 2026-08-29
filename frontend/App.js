import React from "react";

import { ScrollView, View } from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  Appbar,
  Button,
  Card,
  Chip,
  MD3LightTheme,
  Provider as PaperProvider,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";

import "./global.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6366f1",
    secondary: "#ec4899",
  },
};

export default function App() {
  const [text, setText] = React.useState("");
  const [count, setCount] = React.useState(0);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <SafeAreaView className="flex-1 bg-slate-50">
          <StatusBar style="dark" />

          {/* Header */}
          <Appbar.Header className="bg-indigo-600 elevation-2">
            <Appbar.Content
              title="Recipe App"
              titleStyle={{ color: "white", fontWeight: "bold" }}
            />
            <Appbar.Action icon="magnify" color="white" onPress={() => {}} />
          </Appbar.Header>

          <ScrollView
            className="flex-1 px-4 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Hero / Welcome Card using Tailwind + Material Surface */}
            <Surface className="p-6 mb-6 rounded-2xl bg-white elevation-1 border border-slate-100">
              <Text
                variant="headlineSmall"
                className="font-bold text-slate-800 mb-1"
              >
                Welcome to Mobile Frontend! 👋
              </Text>
              <Text variant="bodyMedium" className="text-slate-500 mb-4">
                Powered by React Native, JavaScript, Tailwind CSS (NativeWind) &
                Material Design (React Native Paper).
              </Text>

              <View className="flex-row flex-wrap gap-2 mb-4">
                <Chip icon="check-circle" className="bg-indigo-50">
                  Tailwind CSS
                </Chip>
                <Chip icon="palette" className="bg-pink-50">
                  Material 3 UI
                </Chip>
                <Chip icon="android" className="bg-green-50">
                  Android Studio Ready
                </Chip>
                <Chip icon="code-braces" className="bg-amber-50">
                  JavaScript
                </Chip>
              </View>

              <View className="flex-row items-center justify-between pt-2 border-t border-slate-100">
                <Text
                  variant="labelLarge"
                  className="text-slate-700 font-semibold"
                >
                  Likes: {count}
                </Text>
                <Button
                  mode="contained"
                  icon="thumb-up"
                  onPress={() => setCount(count + 1)}
                  buttonColor="#6366f1"
                >
                  Like App
                </Button>
              </View>
            </Surface>

            {/* Material Form Input Section */}
            <Card className="mb-6 bg-white border border-slate-100 rounded-2xl overflow-hidden elevation-1">
              <Card.Title
                title="Interactive Demo"
                subtitle="Input & State management"
              />
              <Card.Content>
                <TextInput
                  label="Enter recipe keyword..."
                  value={text}
                  onChangeText={setText}
                  mode="outlined"
                  outlineColor="#cbd5e1"
                  activeOutlineColor="#6366f1"
                  className="bg-white mb-3"
                />
                {text.length > 0 && (
                  <Text
                    variant="bodyMedium"
                    className="text-indigo-600 font-medium italic"
                  >
                    Searching for: "{text}"
                  </Text>
                )}
              </Card.Content>
            </Card>

            {/* Sample Recipe Card */}
            <Card className="mb-8 bg-white border border-slate-100 rounded-2xl overflow-hidden elevation-1">
              <Card.Cover
                source={{
                  uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
                }}
              />
              <Card.Title
                title="Vietnamese Fresh Salad Bowl"
                subtitle="Healthy & Delicious • 25 mins"
              />
              <Card.Content>
                <Text variant="bodyMedium" className="text-slate-600">
                  Crisp vegetables, fresh herbs, and homemade dipping sauce.
                  Perfect for a quick and refreshing meal.
                </Text>
              </Card.Content>
              <Card.Actions className="pt-3">
                <Button textColor="#64748b">Save</Button>
                <Button mode="contained" buttonColor="#6366f1">
                  View Recipe
                </Button>
              </Card.Actions>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
