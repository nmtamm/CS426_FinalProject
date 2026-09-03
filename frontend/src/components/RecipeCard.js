import { useState } from "react";

import { Image, Pressable, View } from "react-native";

import { Icon, Surface, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

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
        style={{
          overflow: "hidden",
        }}
      >
        <Pressable
          onPress={() => onToggleSelect(recipe)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            backgroundColor: COLORS.third,
            padding: 12,
          }}
        >
          {/* Recipe Image */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {!imageError && recipe.image ? (
              <Image
                source={{ uri: recipe.image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon source="food" size={32} color={COLORS.textSecondary} />
            )}
          </View>

          {/* Recipe Info */}
          <View
            style={{ flex: 1, justifyContent: "center", alignSelf: "stretch" }}
          >
            {/* Recipe Title */}
            <Text
              style={{
                fontFamily: "Nunito_800ExtraBold",
                color: COLORS.textDark,
                fontSize: 16,
                marginBottom: 6,
              }}
            >
              {recipe.title}
            </Text>

            {/* Ingredients Text */}
            <Text
              numberOfLines={1}
              style={{ fontSize: 12, color: COLORS.textSecondary }}
            >
              {ingredientText}
            </Text>
          </View>
        </Pressable>
      </Surface>
    </Animated.View>
  );
}
