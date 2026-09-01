import { useState } from "react";

import { Image, Pressable, View } from "react-native";

import { Icon, Surface, Text } from "react-native-paper";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function RecipeCard({ recipe, onToggleSelect }) {
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

  // Join all ingredients for display
  const ingredientText = recipe.ingredients
    ? recipe.ingredients.join(", ")
    : "";

  return (
    <Animated.View style={animatedStyle}>
      <Surface
        elevation={0}
        className="rounded-2xl border-2 mb-2.5 overflow-hidden bg-white border-slate-200"
      >
        <Pressable
          onPress={() => onToggleSelect(recipe)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="flex-row items-start gap-3 p-3"
        >
          {/* Recipe Image */}
          <View className="rounded-xl overflow-hidden w-20 h-20 bg-slate-100 flex-shrink-0">
            {!imageError && recipe.image ? (
              <Image
                source={{ uri: recipe.image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View className="flex-1 items-center justify-center bg-slate-200">
                <Icon source="food" size={32} color="#94a3b8" />
              </View>
            )}
          </View>

          {/* Recipe Info */}
          <View className="flex-1 justify-center self-stretch">
            {/* Recipe Title */}
            <Text className="font-bold text-slate-900 text-base mb-1.5">
              {recipe.title}
            </Text>

            {/* Ingredients Text */}
            <Text numberOfLines={1} className="text-xs text-slate-600">
              {ingredientText}
            </Text>
          </View>
        </Pressable>
      </Surface>
    </Animated.View>
  );
}
