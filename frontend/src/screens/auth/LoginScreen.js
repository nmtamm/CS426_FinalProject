import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function LoginScreen({ navigation }) {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text variant="headlineMedium">Login</Text>

      {/* Login inputs */}

      <Button
        mode="contained"
        onPress={() => navigation.replace("MainTabs")}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Button>
    </View>
  );
}