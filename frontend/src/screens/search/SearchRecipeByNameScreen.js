 import React from "react";

import { FlatList, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function SearchRecipeByNameScreen({ navigation }) {
  const [searchText, setSearchText] = React.useState("");

  const recipes = [
    { id: "1", name: "Chicken Salad" },
    { id: "2", name: "Beef Noodles" },
    { id: "3", name: "Vegetable Soup" },
  ];

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-white p-4">
      <Text variant="headlineMedium" className="mb-4">
        Search Recipe By Name
      </Text>

      <TextInput
        label="Recipe name"
        mode="outlined"
        value={searchText}
        onChangeText={setSearchText}
        className="mb-4"
      />

      <FlatList
        data={filteredRecipes}
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

      <Button
        mode="contained"
        icon="home"
        onPress={() =>
          navigation.navigate("MainTabs", {
            screen: "Dashboard",
          })
        }
      >
        Home
      </Button>
    </View>
  );
}