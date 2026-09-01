import { Pressable, View } from "react-native";

import { Icon, Text } from "react-native-paper";

export default function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
  onPrevPage,
  onNextPage,
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-2.5 bg-transparent">
      <Pressable onPress={onPrevPage} disabled={currentPage <= 1} hitSlop={8}>
        <Icon
          source="chevron-left"
          size={32}
          color={currentPage <= 1 ? "#bebebe" : "#a84f2a"}
        />
      </Pressable>

      <Text
        variant="labelLarge"
        style={{ fontWeight: "bold", fontSize: 16, color: "#f6f2e8" }}
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
          color={currentPage >= totalPages ? "#bebebe" : "#a84f2a"}
        />
      </Pressable>
    </View>
  );
}
