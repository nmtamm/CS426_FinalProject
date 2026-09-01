import { View } from "react-native";

import { Button, Icon, Text } from "react-native-paper";

import { ROUTES } from "../../navigation/routes";

import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_BACK_LABEL = "Quay lại trang chủ";

export default function SaveSuccessfullyScreen({ navigation, route }) {
  const { backLabel = DEFAULT_BACK_LABEL, backToTab = ROUTES.DASHBOARD } =
    route.params ?? {};

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.MAIN_TABS,
          state: {
            routes: [{ name: backToTab }],
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: "#a3b18a" }}
    >
      <View className="flex-1 items-center justify-center px-8">
        <View
          className="items-center justify-center mb-8"
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            borderWidth: 4,
            borderColor: "#c65d42",
            backgroundColor: "#f6f2e8",
          }}
        >
          <Icon source="check-bold" size={56} color="#c65d42" />
        </View>

        <Text
          variant="headlineMedium"
          className="font-extrabold text-center mb-3"
          style={{ color: "#f6f2e8" }}
        >
          Lưu thành công
        </Text>

        <Text
          className="text-center mb-10"
          style={{ color: "#f6f2e8", fontSize: 16 }}
        >
          Công thức của bạn đã được lưu!
        </Text>

        <Button
          mode="contained"
          onPress={handleBack}
          labelStyle={{ color: "black", fontSize: 15, fontWeight: "700" }}
          style={{
            backgroundColor: "#f6f2e8",
            borderRadius: 999,
            borderWidth: 2,
            borderColor: "black",
            paddingHorizontal: 8,
          }}
        >
          {backLabel}
        </Button>
      </View>
    </SafeAreaView>
  );
}
