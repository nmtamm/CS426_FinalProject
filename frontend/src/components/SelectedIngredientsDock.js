import { useEffect, useState } from "react";

import { Image, Pressable, ScrollView, View } from "react-native";

import { Button, Icon, Surface, Text } from "react-native-paper";

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
      duration: 380,
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
          paddingBottom: Math.max(insets.bottom, 8),
        }}
      >
        <Surface
          elevation={3}
          style={{ padding: 16 }}
          className="bg-white border-2 border-emerald-200 rounded-3xl shadow-xl"
        >
          {/* Dock Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Text
                variant="labelLarge"
                className="font-bold text-emerald-950 uppercase tracking-wider text-xs"
              >
                Nguyên liệu đã chọn
              </Text>
              <Animated.View
                entering={FadeIn}
                className="bg-emerald-100 px-2 py-0.5 rounded-full"
              >
                <Text className="text-emerald-800 text-sm font-bold">
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
                className="text-emerald-700 font-bold"
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
              paddingTop: 6,
              paddingBottom: 4,
              gap: 8,
            }}
            className="mb-3"
          >
            {itemsToDisplay.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(index * 40).springify()}
                exiting={FadeOutRight.duration(150)}
                layout={LinearTransition.springify()}
                className="items-center relative bg-slate-50 border border-emerald-300 rounded-2xl p-2 w-[76px] shadow-sm"
              >
                {/* Image Thumbnail */}
                <View className="w-12 h-12 rounded-xl bg-white overflow-hidden items-center justify-center border border-slate-200 mb-1.5">
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-full"
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
                  style={{ width: 62 }}
                  className="text-[11px] font-semibold text-slate-800 text-center"
                >
                  {item.name}
                </Text>

                {/* Remove Badge Button */}
                <Pressable
                  onPress={() => onRemoveIngredient(item.id)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center border-2 border-white shadow-md active:bg-red-600"
                  hitSlop={8}
                >
                  <Icon source="close" size={11} color="#ffffff" />
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
                textColor="#059669"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#34d399",
                }}
                contentStyle={{ height: 44 }}
                labelStyle={{ fontWeight: "bold", fontSize: 13 }}
              >
                Tạo món ăn
              </Button>
            </View>

            <View style={{ flex: 1 }}>
              <Button
                mode="contained"
                icon="magnify"
                onPress={() => onFindRecipes(itemsToDisplay)}
                buttonColor="#059669"
                style={{ width: "100%", borderRadius: 12 }}
                contentStyle={{ height: 44 }}
                labelStyle={{ fontWeight: "bold", fontSize: 13 }}
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
