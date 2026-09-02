import { View } from "react-native";

import { Button } from "react-native-paper";

export default function CustomRecipeScreen({ navigation }) {
  return (
    <View>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("SaveSuccessfully")}
      >
        Save
      </Button>

      <Button onPress={() => navigation.navigate("SearchIngredient")}>
        Add Ingredient
      </Button>
    </View>
  );
}
