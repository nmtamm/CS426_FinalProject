import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

import BackIcon from "../../../assets/icons/back-icon.svg"
import SaveIcon from "../../../assets/icons/save-icon.svg"
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import ReadOnlyIngredientCard from "../../components/ReadOnlyIngredientCard";
import SaveConfirmModal from "../../components/SaveConfirmModal";
import { api } from "../../services/api";

export default function RecipeDetailScreen({
  navigation,
  route,
}) {
  const { recipeId } = route.params ?? {};

  const [recipe, setRecipe] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadRecipe = async () => {
        if (!recipeId) return;
        try {
          setLoading(true);
          setError("");
          setRecipe(null); // Clear old data

          // 1. Fetch recipe data safely
          try {
            const recipeData = await api.getRecipeById(recipeId);
            setRecipe(recipeData);
          } catch (recipeError) {
            console.error("Error fetching recipe description (404):", recipeError);
            setError("Không tìm thấy dữ liệu công thức này.");
          }

        } catch (error) {
          console.error("General loading exception:", error);
        } finally {
          setLoading(false);
        }

      };

      loadRecipe();

      // Optional clean-up when leaving the screen
      return () => {
        // You can reset states here if you want to avoid seeing old data briefly next time
        // setRecipe(null); 
      };
    }, [recipeId]) // Triggered whenever the screen gains focus OR recipeId changes
  );


  const handleSaveRecipe = async () => {
    if (!recipe || isFavourite) return;

    try {
      await api.saveFavouriteRecipe(recipe.id);

      // If successful:
      setIsFavourite(true);
      setShowSaveConfirm(false);

      Alert.alert(
        "Thành công", // Title
        "Đã lưu công thức này vào danh sách yêu thích của bạn!", // Message
        [{ text: "OK", style: "default" }] // Button
      );

    } catch (error) {
      console.error("Failed to save favourite recipe:", error);

      // First, close the initial confirmation modal
      setShowSaveConfirm(false);

      // Show the error popup to the user
      Alert.alert(
        "Lỗi hệ thống", // Title
        "Không thể lưu công thức này lúc này. Vui lòng thử lại sau.", // Message
        [
          { text: "OK", style: "default" } // Action Button
        ]
      );
    }
  };


  const handleOpenInstruction = async () => {
    if (!recipe?.instructionUrl) return;

    const supported = await Linking.canOpenURL(
      recipe.instructionUrl
    );

    if (supported) {
      await Linking.openURL(recipe.instructionUrl);
    }
  };

  const renderIngredient = ({ item }) => {
    return <ReadOnlyIngredientCard ingredient={item} />;
  };

  const showIngredients = () => {
    if (!recipe) return "";

    let mainIngredients = recipe.main_ingredients
    let supplementIngredients = recipe.supplements
    let allIngredients = [...mainIngredients, ...supplementIngredients]
    return allIngredients
  }

  return (
    <ScreenContainer
      contentStyle={styles.content}
    >

      <FlatList
        data={recipe?.ingredients ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderIngredient}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={
          <>
            {/* Header */}
            <ScreenHeader
              title="Công thức chi tiết"
              variant="displaySmall"
              onLeftPress={() => navigation.goBack()}
              LeftIconSvg={BackIcon}
              LeftIconSize="24"

              onRightPress={isFavourite ? undefined : () => setShowSaveConfirm(true)}
              rightDisabled={isFavourite}
              RightIconSvg={SaveIcon}
              RightIconSize="24"
            />

            {/* Recipe image */}
            <View style={styles.imageCard}>
              {recipe?.image && (
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Recipe name */}
            <Text style={styles.recipeName}>
              {recipe?.name ?? ""}
            </Text>

            {/* Ingredient title */}
            <Text style={styles.sectionTitle}>
              Nguyên liệu:
            </Text>

            {showIngredients().length === 0 ? (
              <Text style={styles.ingredientInfo}>
                Không có nguyên liệu nào được liệt kê.
              </Text>
            ) : (
              <View style={styles.ingredientsContainer}>
                {showIngredients().map((ingredient) => (
                  <ReadOnlyIngredientCard
                    key={ingredient.id}
                    ingredient={ingredient}
                  />
                ))}
              </View>
            )}
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
                {recipe?.instructions ?? ""}
              </Text>
            </Pressable>
          </>
        }
      />

      <SaveConfirmModal
        visible={showSaveConfirm}
        message="Bạn có chắc chắn muốn lưu công thức này không?"
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={handleSaveRecipe}
      />
    </ScreenContainer>
  );
}


const styles = StyleSheet.create({
  // =====================================================
  // Screen
  // =====================================================

  content: {
    flex: 1,
    paddingHorizontal: scale(65),
    paddingTop: scale(55),
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
    fontFamily: "Nunito_800ExtraBold",

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
    fontFamily: "Nunito_700Bold",
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