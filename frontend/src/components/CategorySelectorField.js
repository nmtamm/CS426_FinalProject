import { Pressable, View } from "react-native";

import { Icon, Surface, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

export default function CategorySelectorField({ selectedCategory, onPress }) {
  return (
    <Surface
      elevation={1}
      style={{
        backgroundColor: COLORS.secondary,
        borderRadius: 24,
        height: 52,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Icon source="shape-outline" size={24} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontFamily: "Nunito_700Bold" }}>
            {selectedCategory}
          </Text>
        </View>
        <Icon source="chevron-down" size={24} color={COLORS.primary} />
      </Pressable>
    </Surface>
  );
}
