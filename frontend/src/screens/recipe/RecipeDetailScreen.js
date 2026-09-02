import { View } from "react-native";

import { Button, Text } from "react-native-paper";

export default function RecipeDetailScreen({
  navigation,
  route,
}) {
  const { recipeId } = route.params ?? {};

  return (
    <View>
      <Text variant="headlineMedium">
        Recipe Detail
      </Text>

      <Text>
        Recipe ID: {recipeId ?? "No recipe selected"}
      </Text>

      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate("SaveSuccessfully")
        }
      >
        Save
      </Button>

      <Button onPress={() => navigation.goBack()}>
        Back
      </Button>
    </View>
  );
}