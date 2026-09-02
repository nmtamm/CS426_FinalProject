import { Pressable, View } from "react-native";

import { Icon, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

export default function ScreenHeader({
  title,
  onBack,
  iconName = "arrow-left",
  iconSize = 24,
  variant = "titleLarge",
  titleClassName,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        marginBottom: 4,
        paddingHorizontal: 4,
      }}
    >
      <Pressable
        hitSlop={8}
        onPress={onBack}
        className="shadow-sm"
        style={{
          width: 40,
          height: 40,
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.secondary,
        }}
      >
        <Icon source={iconName} size={iconSize} color={COLORS.primary} />
      </Pressable>

      <Text
        variant={variant}
        className={titleClassName}
        style={{ color: COLORS.secondary, fontSize: 25, fontFamily: "Nunito_900Black" }}
      >
        {title}
      </Text>

      <View style={{ width: 40 }} />
    </View>
  );
}
