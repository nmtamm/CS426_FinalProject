import { useEffect, useState } from "react";

import { Image, Pressable, ScrollView, View } from "react-native";

import { Button, Icon, Surface, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

import Animated, {
  Easing,
  FadeIn,
  FadeInRight,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SelectedIngredientsDock({
  selectedIngredients,
  onRemoveIngredient,
  onClearAll,
  onFindRecipes,
  onCreateRecipe,
}) {
  const insets = useSafeAreaInsets();
  const hasItems = Boolean(
    selectedIngredients && selectedIngredients.length > 0
  );

  // Cache last non-empty ingredients so content doesn't vanish during exit animation
  const [cachedIngredients, setCachedIngredients] = useState(
    selectedIngredients || []
  );

  useEffect(() => {
    if (selectedIngredients && selectedIngredients.length > 0) {
      setCachedIngredients(selectedIngredients);
    }
  }, [selectedIngredients]);

  const itemsToDisplay = hasItems ? selectedIngredients : cachedIngredients;

  // Measure content height and smoothly animate height in Flexbox
  const measuredHeight = useSharedValue(230);
  const expandProgress = useSharedValue(0);

  useEffect(() => {
    expandProgress.value = withTiming(hasItems ? 1 : 0, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [hasItems, expandProgress]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: expandProgress.value * measuredHeight.value,
      opacity: expandProgress.value,
      overflow: "hidden",
    };
  });

  if (!hasItems && cachedIngredients.length === 0) {
    return null;
  }

  return (
    <Animated.View style={animatedContainerStyle}>
      <View
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0) {
            measuredHeight.value = h;
          }
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 4,
          paddingbottom: 4,
        }}
      >
        <Surface
          elevation={0}
          style={{ padding: 16, borderWidth: 1, borderRadius: 15, backgroundColor: COLORS.secondary }}
        >
          {/* Dock Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                variant="labelLarge"
                style={{
                  fontFamily: "Nunito_800ExtraBold",
                  color: "black",
                  textTransform: "uppercase",
                }}
              >
                Nguyên liệu đã chọn
              </Text>
              <Animated.View
                entering={FadeIn}
                style={{
                  backgroundColor: "#d1fae5",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 9999,
                }}
              >
                <Text
                  style={{ color: "#065f46", fontSize: 14, fontFamily: "Nunito_800ExtraBold" }}
                >
                  {itemsToDisplay.length}
                </Text>
              </Animated.View>
            </View>

            <Pressable
              onPress={onClearAll}
              hitSlop={8}
              className="active:opacity-60"
            >
              <Text
                variant="labelMedium"
                style={{
                  fontFamily: "Nunito_800ExtraBold",
                  fontSize: 14,
                  color: COLORS.warning,
                }}
              >
                Xóa tất cả
              </Text>
            </Pressable>
          </View>

          {/* Horizontal Scroll of Selected Items */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 8,
              gap: 8,
            }}
          >
            {itemsToDisplay.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(index * 40).springify()}
                exiting={FadeOutRight.duration(150)}
                layout={LinearTransition.springify()}
                className="items-center relative rounded-2xl p-2 w-[76px] shadow-sm"
              >
                {/* Image Thumbnail */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "white",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 6,
                  }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icon source="food-apple" size={24} color="#059669" />
                  )}
                </View>

                {/* Name Label with Ellipsis */}
                <Text
                  variant="labelSmall"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    width: 62,
                    fontSize: 11,
                    color: COLORS.textDark,
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </Text>

                {/* Remove Badge Button */}
                <Pressable
                  onPress={() => onRemoveIngredient(item.id)}
                  className="absolute -top-2 -right-1.5 rounded-full w-5 h-5 items-center justify-center shadow-md"
                  style={{ backgroundColor: COLORS.warning }}
                  hitSlop={8}
                >
                  <Icon source="close" size={10} color="#ffffff" />
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>

          {/* Action Buttons: Full width balanced grid */}
          <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button
                mode="outlined"
                icon="plus-box"
                onPress={() => onCreateRecipe(itemsToDisplay)}
                textColor={COLORS.primary}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
                contentStyle={{ height: 44 }}
                labelStyle={{ fontFamily: "Nunito_800ExtraBold", fontSize: 13 }}
              >
                Tạo món ăn
              </Button>
            </View>

            <View style={{ flex: 1 }}>
              <Button
                mode="contained"
                icon="magnify"
                onPress={() => onFindRecipes(itemsToDisplay)}
                buttonColor={COLORS.primary}
                style={{ width: "100%", borderRadius: 12 }}
                contentStyle={{ height: 44 }}
                labelStyle={{ fontFamily: "Nunito_800ExtraBold", fontSize: 13 }}
              >
                Tìm món
              </Button>
            </View>
          </View>
        </Surface>
      </View>
    </Animated.View>
  );
}
