import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function SaveSuccessfullyScreen({
  navigation,
}) {
  const backToDashboard = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainTabs",
          state: {
            routes: [{ name: "Dashboard" }],
          },
        },
      ],
    });
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text variant="headlineMedium">
        Saved Successfully!
      </Text>

      <Button
        mode="contained"
        onPress={backToDashboard}
      >
        Back to Dashboard
      </Button>
    </View>
  );
}