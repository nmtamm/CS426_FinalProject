import { useState } from "react";

import { Image, Pressable, View } from "react-native";

import { Icon, Surface, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

export default function IngredientCard({
  ingredient,
  isSelected,
  onToggleSelect,
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <Surface elevation={isSelected ? 2 : 0} className="overflow-hidden">
      <Pressable
        onPress={() => onToggleSelect(ingredient)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          backgroundColor: isSelected ? COLORS.secondary : COLORS.third,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            gap: 12,
          }}
        >
          {/* Thumbnail Image with Fallback */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {ingredient.image && !imageError ? (
              <Image
                source={{ uri: ingredient.image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon source="food-apple" size={28} color="#94a3b8" />
            )}
          </View>

          {/* Info */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={{
                fontFamily: "Nunito_700Bold",
                color: "black",
              }}
            >
              {ingredient.name}
            </Text>
            <Text
              variant="bodySmall"
              style={{
                color: COLORS.textSecondary,
                marginTop: 2,
              }}
            >
              {ingredient.category}
              {ingredient.calories !== undefined
                ? ` • ${ingredient.calories} kcal/100g`
                : ""}
            </Text>
          </View>
        </View>

        {/* Toggle Action Button */}
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            backgroundColor: isSelected ? COLORS.primary : COLORS.third,
            borderColor: isSelected ? COLORS.primary : COLORS.textSecondary,
          }}
        >
          <Icon
            source={isSelected ? "check" : "plus"}
            size={20}
            color={isSelected ? "#ffffff" : "#475569"}
          />
        </View>
      </Pressable>
    </Surface>
  );
}
