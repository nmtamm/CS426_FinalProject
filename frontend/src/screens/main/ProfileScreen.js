import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function ProfileScreen({ navigation }) {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text variant="headlineMedium">Profile</Text>

      <Button
        onPress={() => navigation.goBack()}
      >
        Back
      </Button>

      <Button
        mode="contained"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        }
      >
        Logout
      </Button>
    </View>
  );
}