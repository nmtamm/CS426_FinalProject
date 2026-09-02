import { Pressable, View } from "react-native";

import { Icon, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

export default function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
  onPrevPage,
  onNextPage,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "transparent",
      }}
    >
      <Pressable onPress={onPrevPage} disabled={currentPage <= 1} hitSlop={8}>
        <Icon
          source="chevron-left"
          size={32}
          color={currentPage <= 1 ? COLORS.placeholder : COLORS.primary}
        />
      </Pressable>

      <Text
        variant="labelLarge"
        style={{ fontWeight: "bold", fontSize: 16, color: COLORS.secondary }}
      >
        Trang {currentPage} / {totalPages}
        {totalCount > 0 ? ` (${totalCount})` : ""}
      </Text>

      <Pressable
        onPress={onNextPage}
        disabled={currentPage >= totalPages}
        hitSlop={8}
      >
        <Icon
          source="chevron-right"
          size={32}
          color={
            currentPage >= totalPages ? COLORS.placeholder : COLORS.primary
          }
        />
      </Pressable>
    </View>
  );
}
