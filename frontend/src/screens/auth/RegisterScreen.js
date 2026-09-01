import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function RegisterScreen({ navigation }) {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text variant="headlineMedium">Register</Text>

      {/* Your registration inputs go here */}

      <Button
        mode="contained"
        onPress={() => navigation.navigate("Login")}
      >
        Register
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Button>
    </View>
  );
}