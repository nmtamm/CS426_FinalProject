import { View } from "react-native";
import { Button } from "react-native-paper";

export default function SearchRecipesByIngredientsScreen({
  navigation,
}) {
  return (
    <View>
      {/* Recipe card */}
      <Button
        onPress={() =>
          navigation.navigate("RecipeDetail", {
            recipeId: 1,
          })
        }
      >
        Open Recipe
      </Button>

      <Button
        onPress={() => navigation.navigate("IngredientList")}
      >
        Ingredient List
      </Button>

      <Button onPress={() => navigation.goBack()}>
        Back
      </Button>
    </View>
  );
}