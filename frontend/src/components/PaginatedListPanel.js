import { FlatList, View } from "react-native";

import { Icon, Surface, Text } from "react-native-paper";

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
}) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 12 }}>
      <Surface
        elevation={0}
        style={{ flex: 1, overflow: "hidden", backgroundColor: "transparent" }}
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
            backgroundColor: COLORS.secondary,
            borderRadius: 24,
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
              data={data}
              keyExtractor={keyExtractor}
              style={{ flex: 1 }}
              contentContainerStyle={contentContainerStyle}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
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
                  <Text
                    style={{
                      color: COLORS.textDark,
                      fontFamily: "Nunito_700Bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {emptyTitle}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    {emptySubtitle}
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
