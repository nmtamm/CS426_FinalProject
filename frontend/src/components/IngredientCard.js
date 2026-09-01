import { useState } from "react";

import { Image, Pressable, View } from "react-native";

import { Icon, Surface, Text } from "react-native-paper";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function IngredientCard({
  ingredient,
  isSelected,
  onToggleSelect,
}) {
  const [imageError, setImageError] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Surface
        elevation={isSelected ? 2 : 0}
        className={`rounded-2xl border-2 mb-2.5 overflow-hidden ${
          isSelected
            ? "bg-emerald-50/80 border-emerald-500"
            : "bg-white border-slate-200"
        }`}
      >
        <Pressable
          onPress={() => onToggleSelect(ingredient)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="flex-row items-center justify-between p-3"
        >
          <View className="flex-row items-center flex-1 gap-3">
            {/* Thumbnail Image with Fallback */}
            <View className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 items-center justify-center overflow-hidden">
              {ingredient.image && !imageError ? (
                <Image
                  source={{ uri: ingredient.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Icon source="food-apple" size={28} color="#94a3b8" />
              )}
            </View>

            {/* Info */}
            <View className="flex-1 pr-2">
              <Text
                variant="titleMedium"
                numberOfLines={1}
                className={`font-bold ${
                  isSelected ? "text-emerald-950" : "text-slate-800"
                }`}
              >
                {ingredient.name}
              </Text>
              <Text
                variant="bodySmall"
                numberOfLines={1}
                className="text-slate-500 mt-0.5"
              >
                {ingredient.category}
                {ingredient.caloriesPer100g
                  ? ` • ${ingredient.caloriesPer100g} kcal/100g`
                  : ""}
              </Text>
            </View>
          </View>

          {/* Toggle Action Button */}
          <View
            className={`w-9 h-9 rounded-full items-center justify-center border ${
              isSelected
                ? "bg-[#a84f2a] border-[#a84f2a]"
                : "bg-[#f8f2f2] border-slate-300"
            }`}
          >
            <Icon
              source={isSelected ? "check" : "plus"}
              size={20}
              color={isSelected ? "#ffffff" : "#475569"}
            />
          </View>
        </Pressable>
      </Surface>
    </Animated.View>
  );
}
