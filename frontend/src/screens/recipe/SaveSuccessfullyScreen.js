import { View } from "react-native";

import { Button, Icon, Text } from "react-native-paper";

import ScreenContainer from "../../components/ScreenContainer";
import { ROUTES } from "../../navigation/routes";
import { COLORS } from "../../theme/colors";

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
    <ScreenContainer
      edges={["top", "left", "right", "bottom"]}
      contentStyle={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          width: 120,
          height: 120,
          borderRadius: 28,
          borderWidth: 4,
          borderColor: COLORS.primary,
          backgroundColor: COLORS.secondary,
        }}
      >
        <Icon source="check-bold" size={56} color={COLORS.primary} />
      </View>

      <Text
        variant="headlineMedium"
        style={{
          color: COLORS.secondary,
          fontFamily: "Nunito_900Black",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Lưu thành công
      </Text>

      <Text
        style={{
          color: COLORS.secondary,
          fontSize: 18,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        Công thức của bạn đã được lưu!
      </Text>

      <Button
        mode="contained"
        onPress={handleBack}
        labelStyle={{ color: COLORS.primary, fontSize: 15, fontFamily: "Nunito_800ExtraBold" }}
        style={{
          backgroundColor: COLORS.secondary,
          borderRadius: 12,
          paddingHorizontal: 8,
        }}
      >
        {backLabel}
      </Button>
    </ScreenContainer>
  );
}
