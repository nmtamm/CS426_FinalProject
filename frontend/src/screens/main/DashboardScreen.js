import { View } from "react-native";

import { Button, Text } from "react-native-paper";

export default function DashboardScreen({ navigation }) {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text variant="headlineMedium">
        Dashboard
      </Text>

      <Button
        onPress={() => navigation.navigate("Profile")}
      >
        Profile
      </Button>

      <Button
        onPress={() => navigation.navigate("SearchIngredient")}
      >
        Search Ingredient
      </Button>

      <Button
        onPress={() => navigation.navigate("SearchRecipeByName")}
      >
        Search Recipe
      </Button>
    </View>
  );
}