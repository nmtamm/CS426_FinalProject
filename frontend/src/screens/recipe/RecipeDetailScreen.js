import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

import BackIcon from "../../../assets/icons/back-icon.svg"
import SaveIcon from "../../../assets/icons/save-icon.svg"

export default function RecipeDetailScreen({
  navigation,
  route,
}) {
  const { recipeId } = route.params ?? {};

  const recipe = {
    id: recipeId ?? "1",
    name: "Noodle soup",

    image:
      "https://example.com/images/noodle-soup.png",

    instructionUrl:
      "https://www.recipetineats.com/",

    ingredients: [
      {
        id: "1",
        name: "Beef",
        quantity: "100g",
        calories: "1500cal",
        image:
          "https://example.com/images/beef.png",
      },
      {
        id: "2",
        name: "Noodle",
        quantity: "200g",
        calories: "1000cal",
        image:
          "https://example.com/images/noodle.png",
      },
      {
        id: "3",
        name: "Vegetable",
        quantity: "300g",
        calories: "300cal",
        image:
          "https://example.com/images/vegetable.png",
      },
    ],
  };

  const handleSaveRecipe = () => {
    navigation.navigate("SaveSuccessfully");
  };

  const handleOpenInstruction = async () => {
    if (!recipe.instructionUrl) return;

    const supported = await Linking.canOpenURL(
      recipe.instructionUrl
    );

    if (supported) {
      await Linking.openURL(recipe.instructionUrl);
    }
  };

  const renderIngredient = ({ item }) => {
    return <IngredientCard ingredient={item} />;
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />

      <FlatList
        data={recipe.ingredients}
        keyExtractor={(item) => item.id}
        renderItem={renderIngredient}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => navigation.goBack()}
              >
                <BackIcon
                  width={scale(48)}
                  height={scale(48)}
                  color={COLORS.accent}
                />
              </Pressable>

              <Text
                style={styles.title}
                numberOfLines={1}
              >
                Công thức chi tiết
              </Text>

              <Pressable
                onPress={handleSaveRecipe}
              >
                <SaveIcon
                  width={scale(48)}
                  height={scale(48)}
                  color={COLORS.accent}
                />
              </Pressable>
            </View>

            {/* Recipe image */}
            <View style={styles.imageCard}>
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
                resizeMode="contain"
              />
            </View>

            {/* Recipe name */}
            <Text style={styles.recipeName}>
              {recipe.name}
            </Text>

            {/* Ingredient title */}
            <Text style={styles.sectionTitle}>
              Nguyên liệu:
            </Text>
          </>
        }

        ListFooterComponent={
          <>
            <Text style={styles.sectionTitle}>
              Hướng dẫn:
            </Text>

            <Pressable
              onPress={handleOpenInstruction}
              style={({ pressed }) => [
                styles.urlContainer,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.url}>
                {recipe.instructionUrl}
              </Text>
            </Pressable>
          </>
        }
      />
    </SafeAreaView>
  );
}

// =======================================================
// Ingredient card
// =======================================================

function IngredientCard({ ingredient }) {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.ingredientCard}>
      <View style={styles.ingredientIconBox}>
        <Image
          source={
            imageError
              ? require("../../../assets/icons/ingredient-icon.png")
              : { uri: ingredient.image }
          }
          style={styles.ingredientImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      </View>

      <View style={styles.ingredientNameBox}>
        <Text
          style={styles.ingredientName}
          numberOfLines={2}
        >
          {ingredient.name}
        </Text>
      </View>

      <View style={styles.ingredientInfoBox}>
        <Text style={styles.ingredientInfo}>
          Định lượng: {ingredient.quantity}
        </Text>

        <Text style={styles.ingredientInfo}>
          Calories: {ingredient.calories}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // =====================================================
  // Screen
  // =====================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  listContent: {
    paddingHorizontal: scale(52),
    paddingTop: scale(35),
    paddingBottom: scale(100),
  },

  // =====================================================
  // Header
  // =====================================================

  header: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: scale(62),
    height: scale(62),

    borderRadius: scale(31),

    backgroundColor: COLORS.secondary,

    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    flex: 1,

    marginHorizontal: scale(15),

    color: COLORS.secondary,

    fontSize: scale(40),
    fontWeight: "700",

    textAlign: "center",
  },

  // =====================================================
  // Recipe image
  // =====================================================

  imageCard: {
    width: "100%",
    height: scale(335),

    marginTop: scale(45),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(28),

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },

  recipeImage: {
    width: scale(285),
    height: scale(285),
  },

  recipeName: {
    marginTop: scale(12),

    color: COLORS.secondary,

    fontSize: scale(40),
    fontWeight: "700",

    textAlign: "center",
  },

  // =====================================================
  // Sections
  // =====================================================

  sectionTitle: {
    marginTop: scale(22),
    marginBottom: scale(17),

    color: COLORS.secondary,

    fontSize: scale(30),
    fontWeight: "700",
  },

  ingredientsContainer: {
    width: "100%",
  },

  // =====================================================
  // Ingredient card
  // =====================================================

  ingredientCard: {
    width: "100%",
    height: scale(135),

    marginBottom: scale(15),

    flexDirection: "row",

    backgroundColor: COLORS.secondary,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(26),

    overflow: "hidden",
  },

  ingredientIconBox: {
    width: "23%",

    justifyContent: "center",
    alignItems: "center",

    borderRightWidth: scale(2),
    borderRightColor: COLORS.black,
  },

  ingredientImage: {
    width: scale(85),
    height: scale(85),
  },

  ingredientNameBox: {
    width: "36%",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: scale(10),

    borderRightWidth: scale(2),
    borderRightColor: COLORS.black,
  },

  ingredientName: {
    color: COLORS.black,

    fontSize: scale(25),
    fontWeight: "400",

    textAlign: "center",
  },

  ingredientInfoBox: {
    flex: 1,

    justifyContent: "space-evenly",

    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },

  ingredientInfo: {
    color: COLORS.black,

    fontSize: scale(22),
    fontWeight: "400",
  },

  // =====================================================
  // Instruction
  // =====================================================

  urlContainer: {
    alignSelf: "flex-start",
  },

  url: {
    color: COLORS.secondary,

    fontSize: scale(25),
    fontWeight: "400",

    textDecorationLine: "none",
  },

  // =====================================================
  // Press effect
  // =====================================================

  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.96 }],
  },
});