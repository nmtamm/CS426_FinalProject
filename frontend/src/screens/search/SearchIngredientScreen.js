import { View } from "react-native";
import { Button } from "react-native-paper";

export default function SearchIngredientScreen({ navigation }) {
  return (
    <View>
      <Button
        onPress={() => navigation.navigate("IngredientList")}
      >
        Current Ingredient List
      </Button>

      <Button
        onPress={() =>
          navigation.navigate("SearchRecipesByIngredients")
        }
      >
        Search Recipe
      </Button>

      <Button
        onPress={() => navigation.navigate("CustomRecipe")}
      >
        Custom Recipe
      </Button>

      <Button
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