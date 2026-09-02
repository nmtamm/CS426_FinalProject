 import { FlatList, View } from "react-native";

import { Card, Text } from "react-native-paper";

export default function FavouriteRecipesScreen({ navigation }) {
  const recipes = [
    { id: "1", name: "Favourite Recipe 1" },
    { id: "2", name: "Favourite Recipe 2" },
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <Text variant="headlineMedium" className="mb-4">
        My Favourite Recipes
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            className="mb-3"
            onPress={() =>
              navigation.navigate("RecipeDetail", {
                recipeId: item.id,
              })
            }
          >
            <Card.Title title={item.name} />
          </Card>
        )}
      />
    </View>
  );
}