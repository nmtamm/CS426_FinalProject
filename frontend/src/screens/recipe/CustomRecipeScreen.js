import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

import BackIcon from "../../../assets/icons/back-icon.svg"
import SaveIcon from "../../../assets/icons/save-icon.svg"
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import EditableIngredientCard from "../../components/EditableIngredientCard";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import SaveConfirmModal from "../../components/SaveConfirmModal";
import { api } from "../../services/api";

export default function CustomRecipeScreen({ navigation, route }) {
  const {
    recipeId,
    draftRecipe,
    returnedIngredients,
    returnedDraftRecipe,
    returnedFromSearch,
  } = route.params ?? {};

  const [recipeName, setRecipeName] = useState("");

  const [recipeImage, setRecipeImage] = useState(null);

  const [instruction, setInstruction] = useState("");

  const [ingredients, setIngredients] = useState([]);

  const [loading, setLoading] = useState(Boolean(recipeId));

  const [error, setError] = useState("");

  const [pendingDeleteIngredientId, setPendingDeleteIngredientId] = useState(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    if (!recipeId) return;
    if (returnedFromSearch) return;
    
    const loadRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const recipe =
          await api.getCustomizedRecipeById(
            recipeId
          );

        setRecipeName(recipe.title ?? "");
        setRecipeImage(recipe.image ?? null);
        setInstruction(
          recipe.instructions ?? ""
        );

        setIngredients(
          (recipe.ingredients ?? []).map(
            (ingredient) => ({
              ...ingredient,

              id: ingredient.id ?? ingredient.ingredientId,

              quantity: String(ingredient.quantity ?? ingredient.default_quantity ?? ""),

              unit: ingredient.unit ?? ingredient.default_unit ?? "",

            }

            )
          )
        );
      } catch (error) {
        console.error(
          "Failed to load customized recipe:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId, returnedFromSearch]);


  useEffect(() => {
    if (recipeId) return;
    if (!draftRecipe) return;
    if (returnedFromSearch) return;

    setRecipeName(draftRecipe.name ?? "");
    setRecipeImage(draftRecipe.image ?? null);
    setInstruction(draftRecipe.instruction ?? "");
    setIngredients(draftRecipe.ingredients ?? []);
  }, [recipeId, draftRecipe, returnedFromSearch]);

  useEffect(() => {
    if (!returnedFromSearch) return;

    setIngredients(returnedIngredients ?? []);

    if (returnedDraftRecipe) {
      setRecipeName(returnedDraftRecipe.name ?? "");
      setRecipeImage(returnedDraftRecipe.image ?? null);
      setInstruction(returnedDraftRecipe.instruction ?? "");
    }
  }, [returnedFromSearch, returnedIngredients, returnedDraftRecipe]);

  // =====================================================
  // Image picker
  // =====================================================

  const handleChangeImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Không có quyền truy cập",
        "Vui lòng cho phép ứng dụng truy cập thư viện ảnh."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

    if (!result.canceled) {
      setRecipeImage(result.assets[0].uri);
    }
  };

  // =====================================================
  // Ingredient quantity
  // =====================================================

  const handleQuantityChange = (
    ingredientId,
    value
  ) => {
    // Only allow numbers and decimal point.
    const numericValue = value.replace(
      /[^0-9.]/g,
      ""
    );

    setIngredients((currentIngredients) =>
      currentIngredients.map((ingredient) =>
        ingredient.id === ingredientId
          ? {
            ...ingredient,
            quantity: numericValue,
          }
          : ingredient
      )
    );
  };

  // =====================================================
  // Delete ingredient
  // =====================================================

  const requestDeleteIngredient = (id) => {
    setPendingDeleteIngredientId(id);
  };

  const handleDeleteIngredient = () => {
    if (pendingDeleteIngredientId === null) return;

    setIngredients((prev) =>
      prev.filter(
        (item) => item.id !== pendingDeleteIngredientId
      )
    );

    setPendingDeleteIngredientId(null);
  };

  // =====================================================
  // Add ingredient
  // =====================================================

  const handleAddIngredient = () => {
    navigation.navigate(
      "SearchIngredient",
      {
        from: "CustomRecipe",
        recipeId,
        initialSelectedIngredients: ingredients,
        draftRecipe: {
          name: recipeName,
          image: recipeImage,
          instruction,
          ingredients,
        },
      }
    );
  };

  // =====================================================
  // Save recipe
  // =====================================================

  const requestSaveRecipe = () => {
    if (!recipeName.trim()) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập tên món ăn."
      );
      return;
    }

    if (ingredients.length === 0) {
      Alert.alert(
        "Thiếu nguyên liệu",
        "Vui lòng thêm ít nhất một nguyên liệu."
      );
      return;
    }

    setShowSaveConfirm(true);
  };

  const handleSaveRecipe = async () => {
    setShowSaveConfirm(false);

    const recipeData = {
      title: recipeName.trim(),
      id: recipeId,
      ingredients: ingredients.map(
        (ingredient) => ({
          id: ingredient.id,
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit,
        })
      ),

      instructions: instruction.trim(),
      image: recipeImage,
    };

    try {
      if (recipeId) {
        await api.updateCustomizedRecipe(recipeId, recipeData);
      } else {
        await api.createCustomizedRecipe(recipeData);
      }

      navigation.navigate("SaveSuccessfully");
    } catch (error) {
      console.error("Failed to save customized recipe:", error);

      Alert.alert("Lỗi", error.message);
    }
  };

  const renderIngredient = ({ item }) => {
    return (
      <EditableIngredientCard
        ingredient={item}
        onQuantityChange={(value) =>
          handleQuantityChange(item.id, value)
        }
        onDelete={() => requestDeleteIngredient(item.id)
        }
      />
    );
  };

  return (
    <ScreenContainer
      contentStyle={styles.content}
    >

      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={renderIngredient}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* =====================
                Header
            ====================== */}

            <ScreenHeader
              title="Tùy chỉnh công thức"
              variant="displaySmall"
              onLeftPress={() => navigation.goBack()}
              LeftIconSvg={BackIcon}
              LeftIconSize="24"

              onRightPress={() => requestSaveRecipe()}
              RightIconSvg={SaveIcon}
              RightIconSize="24"
            />

            {/* =====================
                Recipe image
            ====================== */}

            <Pressable
              onPress={handleChangeImage}
              style={styles.imageCard}
              hitSlop={8}
              className="active:opacity-60"
            >
              {recipeImage ? (
                <Image
                  source={{
                    uri: recipeImage,
                  }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={
                    styles.imagePlaceholder
                  }
                >
                  <MaterialCommunityIcons
                    name="image-plus-outline"
                    size={scale(70)}
                    color={COLORS.disabled}
                  />

                  <Text
                    style={
                      styles.imagePlaceholderText
                    }
                  >
                    Chọn hình ảnh
                  </Text>
                </View>
              )}

              <View
                style={styles.imageEditButton}
              >
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={scale(32)}
                  color={COLORS.secondary}
                />
              </View>
            </Pressable>

            {/* =====================
                Recipe name
            ====================== */}

            <TextInput
              style={styles.recipeNameInput}
              value={recipeName}
              onChangeText={setRecipeName}
              placeholder="Tên món ăn"
              placeholderTextColor={
                COLORS.disabled
              }
              textAlign="center"
              maxLength={80}
              multiline
            />

            {/* Divider */}
            <View
              style={{
                height: 1.5,
                backgroundColor: COLORS.secondary,
                opacity: 0.7,
                marginTop: 10,
                marginHorizontal: 16,
                borderRadius:999,
              }}
            />

            {/* =====================
                Ingredient title
            ====================== */}

            <View
              style={
                styles.sectionTitleContainer
              }
            >
              <Text
                style={styles.sectionTitle}
              >
                Nguyên liệu:
              </Text>

              <Pressable
                onPress={handleAddIngredient}
                style={styles.addIngredientButton}
                hitSlop={8}
                className="active:opacity-60"
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={scale(35)}
                  color={COLORS.primary}
                />
              </Pressable>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {/* =====================
                Instruction
            ====================== */}

            <Text
              style={
                styles.instructionTitle
              }
            >
              Hướng dẫn:
            </Text>

            <TextInput
              style={
                styles.instructionInput
              }
              value={instruction}
              onChangeText={setInstruction}
              placeholder="Nhập hướng dẫn chế biến..."
              placeholderTextColor={
                COLORS.disabled
              }
              multiline
              textAlignVertical="top"
            />
          </View>
        }
      />

      <DeleteConfirmModal
        visible={pendingDeleteIngredientId !== null}
        message={
          "Bạn có chắc chắn muốn xoá nguyên liệu này không?\nHành động này không thể hoàn tác."
        }
        onCancel={() => setPendingDeleteIngredientId(null)}
        onConfirm={handleDeleteIngredient}
      />

      <SaveConfirmModal
        visible={showSaveConfirm}
        onCancel={() => setShowSaveConfirm(false)}
        onConfirm={handleSaveRecipe}
      />
    </ScreenContainer>
  );
}


// =======================================================
// Styles
// =======================================================

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
  // Image
  // =====================================================

  imageCard: {
    width: "100%",
    height: scale(335),

    marginTop: scale(45),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(3),
    borderColor: COLORS.black,
    borderRadius: scale(28),

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },

  recipeImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    marginTop: scale(12),

    color: COLORS.disabled,

    fontSize: scale(27),
    fontFamily: "Nunito_700Bold",
  },

  imageEditButton: {
    position: "absolute",

    right: scale(18),
    bottom: scale(18),

    width: scale(58),
    height: scale(58),

    borderRadius: scale(29),

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  // =====================================================
  // Recipe name
  // =====================================================

  recipeNameInput: {
    width: "100%",

    marginTop: scale(12),
    paddingVertical: scale(5),
    paddingHorizontal: scale(20),

    color: COLORS.secondary,

    fontSize: scale(40),
    fontFamily: "Nunito_800ExtraBold",

    textAlign: "center",
  },

  // =====================================================
  // Ingredient title
  // =====================================================

  sectionTitleContainer: {
    marginTop: scale(22),
    marginBottom: scale(17),

    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    color: COLORS.secondary,

    fontSize: scale(30),
    fontFamily: "Nunito_700Bold",
  },

  addIngredientButton: {
    width: scale(45),
    height: scale(45),

    marginLeft: scale(12),

    borderWidth: scale(3),
    borderColor: COLORS.primary,
    borderRadius: scale(23),

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.secondary,
  },

  // =====================================================
  // Ingredient
  // =====================================================

  ingredientCard: {
    width: "100%",
    height: scale(135),

    flexDirection: "row",

    marginBottom: 10,

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
    width: scale(78),
    height: scale(78),
  },

  ingredientNameBox: {
    width: "35%",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: scale(8),

    borderRightWidth: scale(2),
    borderRightColor: COLORS.black,
  },

  ingredientName: {
    color: COLORS.black,

    fontSize: scale(23),
    fontFamily: "Nunito_700Bold",

    textAlign: "center",
  },

  ingredientInfoBox: {
    flex: 1,

    justifyContent: "space-evenly",

    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ingredientInfoLabel: {
    color: COLORS.black,

    fontSize: scale(22),
  },

  quantityInput: {
    minWidth: scale(55),

    marginLeft: scale(5),

    paddingHorizontal: scale(3),
    paddingVertical: 0,

    color: COLORS.black,

    fontSize: scale(22),
    fontWeight: "600",

    textAlign: "center",

    borderBottomWidth: scale(1.5),
    borderBottomColor: COLORS.primary,
  },

  unitText: {
    marginLeft: scale(3),

    color: COLORS.black,

    fontSize: scale(22),
  },

  ingredientInfo: {
    color: COLORS.black,

    fontSize: scale(22),
  },

  // =====================================================
  // Delete
  // =====================================================

  deleteButton: {
    width: scale(95),

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 10,
    marginLeft: 10,

    backgroundColor: COLORS.lightRed,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(26),
  },

  // =====================================================
  // Instruction
  // =====================================================

  footer: {
    width: "100%",
  },

  instructionTitle: {
    marginTop: scale(25),
    marginBottom: scale(15),

    color: COLORS.secondary,

    fontSize: scale(30),
    fontFamily: "Nunito_700Bold",
  },

  instructionInput: {
    width: "100%",
    minHeight: scale(180),

    paddingHorizontal: scale(20),
    paddingVertical: scale(18),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(22),

    color: COLORS.black,

    fontSize: scale(22),
    lineHeight: scale(31),
  },

  // =====================================================
  // Click effect
  // =====================================================

  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.96 }],
  },

  imagePressed: {
    opacity: 0.85,
  },
});
