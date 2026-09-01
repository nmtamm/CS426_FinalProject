import { View } from "react-native";
import { Button } from "react-native-paper";

export default function IngredientListScreen({ navigation }) {
  return (
    <View>
      {/* Ingredient list */}

      <Button onPress={() => navigation.goBack()}>
        Back
      </Button>
    </View>
  );
}