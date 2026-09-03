import { ActivityIndicator, FlatList, View } from "react-native";

import { Icon, Surface, Text, Divider } from "react-native-paper";

import { COLORS } from "../theme/colors";

import PaginationControls from "./PaginationControls";

import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";

const DEFAULT_EMPTY_SUBTITLE =
  "Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác";

export default function PaginatedListPanel({
  currentPage,
  totalPages,
  totalCount,
  onPrevPage,
  onNextPage,
  pageDirection,
  data,
  keyExtractor,
  renderItem,
  contentContainerStyle,
  emptyTitle,
  emptySubtitle = DEFAULT_EMPTY_SUBTITLE,
  surfaceClassName,
  isLoading = false,
  error = "",
}) {
  return (
    <View style={{ flex: 1}}>
      <Surface
        elevation={0}
        style={{ flex: 1, marginBottom:10, borderWidth: 1, borderRadius: 15, overflow: "hidden", backgroundColor: COLORS.secondary }}
        className={surfaceClassName}
      >
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
        />

        <View
          style={{
            flex: 1,
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          <Animated.View
            key={`page-${currentPage}`}
            entering={
              pageDirection === 1
                ? FadeInRight.duration(220)
                : FadeInLeft.duration(220)
            }
            style={{ flex: 1 }}
          >
            <FlatList
              data={isLoading || error ? [] : data}
              keyExtractor={keyExtractor}
              style={{ flex: 1 }}
              contentContainerStyle={contentContainerStyle}
              ItemSeparatorComponent={() => <Divider />}
              ListEmptyComponent={() => (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  ) : (
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 9999,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Icon
                        source="food-off"
                        size={32}
                        color={COLORS.textSecondary}
                      />
                    </View>
                  )}
                  <Text
                    style={{
                      color: COLORS.textDark,
                      fontFamily: "Nunito_700Bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {isLoading ? "Đang tải..." : error || emptyTitle}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    {isLoading
                      ? "Vui lòng chờ trong giây lát"
                      : error
                        ? "Kiểm tra kết nối API và thử lại"
                        : emptySubtitle}
                  </Text>
                </Animated.View>
              )}
              renderItem={renderItem}
            />
          </Animated.View>
        </View>
      </Surface>
    </View>
  );
}
