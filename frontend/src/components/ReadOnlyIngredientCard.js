import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text, Icon } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { COLORS } from "../theme/colors";
import { scale } from "../utils/responsive";

export default function ReadOnlyIngredientCard({
  ingredient,
}) {
  const [imageError, setImageError] = useState(false);

  const quantity = ingredient.quantity ? Number(ingredient.quantity) : 0;
  const unit = ingredient.unit || "";

  return (
    <View style={styles.card}>
      {/* Ingredient image */}
      <View style={styles.imageContainer}>
        {!imageError && ingredient.image ? (
          <Image
            source={{ uri: ingredient.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon source="food-variant" size={32} color={COLORS.textSecondary} />
        )}
      </View>

      {/* Ingredient information */}
      <View
        style={{
          flex: 1,
          marginLeft: scale(12),
          marginRight: scale(10),
          justifyContent: "center",
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.name}
        >
          {ingredient.name}
        </Text>

        <Text
          variant="bodySmall"
          numberOfLines={1}
          style={{ color: COLORS.textSecondary, marginTop: 2 }}
        >
          {ingredient.category}
          {ingredient.quantity && ingredient.unit
            ? ` • ${quantity} ${unit}`
            : ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: scale(130),

    flexDirection: "row",
    alignItems: "center",

    marginBottom: scale(14),

    paddingHorizontal: scale(16),
    paddingVertical: scale(14),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(26),
  },

  // ============================
  // Image
  // ============================

  imageContainer: {
    width: scale(92),
    height: scale(92),

    borderRadius: scale(20),

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.third,

    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  // ============================
  // Ingredient information
  // ============================

  infoContainer: {
    flex: 1,

    marginLeft: scale(16),
    marginRight: scale(10),

    justifyContent: "center",
  },

  name: {
    color: COLORS.black,

    fontSize: scale(28),
    fontFamily: "Nunito_800ExtraBold",
  },

  category: {
    color: COLORS.textSecondary,

    fontSize: scale(22),
    fontFamily: "Nunito_600Regular",
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: scale(8),
    gap: scale(4),
  },

  calories: {
    color: COLORS.primary,

    fontSize: scale(18),
    fontFamily: "Nunito_600SemiBold",
  },

  // ============================
  // Quantity
  // ============================

  quantitySection: {
    alignItems: "center",
    justifyContent: "center",
  },

  quantityLabel: {
    marginBottom: scale(6),

    color: COLORS.black,

    fontSize: scale(16),
    fontFamily: "Nunito_600SemiBold",
  },

  quantityBox: {
    minWidth: scale(100),
    height: scale(52),

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: scale(10),

    backgroundColor: COLORS.background,

    borderWidth: scale(2),
    borderColor: COLORS.primary,
    borderRadius: scale(15),
  },

  quantityInput: {
    minWidth: scale(45),

    paddingVertical: 0,
    paddingHorizontal: scale(2),

    color: COLORS.primary,

    fontSize: scale(21),
    fontFamily: "Nunito_800ExtraBold",

    textAlign: "center",
  },

  unit: {
    marginLeft: scale(3),

    color: COLORS.primary,

    fontSize: scale(18),
    fontFamily: "Nunito_700Bold",
  },

  // ============================
  // Delete
  // ============================

  deleteButton: {
    width: scale(90),

    marginLeft: scale(10),
    marginBottom: scale(14),

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.lightRed,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(26),
  },
});