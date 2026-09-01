import { View } from "react-native";

import { Button, Text } from "react-native-paper";

export default function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
  onPrevPage,
  onNextPage,
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
      <Button
        mode="text"
        compact
        disabled={currentPage <= 1}
        onPress={onPrevPage}
        className="rounded-lg border-slate-300"
        textColor="#334155"
      >
        ‹ Trang trước
      </Button>

      <Text variant="labelLarge" className="font-bold text-slate-700">
        Trang {currentPage} / {totalPages}
        {totalCount > 0 ? ` (${totalCount})` : ""}
      </Text>

      <Button
        mode="text"
        compact
        disabled={currentPage >= totalPages}
        onPress={onNextPage}
        className="rounded-lg border-slate-300"
        textColor="#334155"
      >
        Trang sau ›
      </Button>
    </View>
  );
}
