import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

import BackIcon from "../../../assets/icons/back-icon.svg"
import SaveIcon from "../../../assets/icons/save-icon.svg"


export default function CustomRecipeScreen({
  navigation,
  route,
}) {
  const { recipeId } = route.params ?? {};

  // =====================================================
  // Temporary frontend data
  // Later replace with data returned from backend.
  // =====================================================

  const [recipeName, setRecipeName] =
    useState("Tên món ăn");

  const [recipeImage, setRecipeImage] =
    useState(null);

  const [instruction, setInstruction] =
    useState("");

  const [ingredients, setIngredients] = useState([
    {
      id: "1",
      name: "Thịt bò",

      // Amount currently selected by user
      quantity: "100",

      unit: "g",

      // Calories stored/calculated from DB.
      // Example:
      // 250 calories / 100 g
      caloriesPer100: 250,

      image:
        "https://example.com/images/beef.png",
    },
    {
      id: "2",
      name: "Phô mai",
      quantity: "100",
      unit: "g",
      caloriesPer100: 402,
      image:
        "https://example.com/images/cheese.png",
    },
  ]);

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

  const handleDeleteIngredient = (
    ingredientId
  ) => {
    setIngredients((currentIngredients) =>
      currentIngredients.filter(
        (ingredient) =>
          ingredient.id !== ingredientId
      )
    );
  };

  // =====================================================
  // Add ingredient
  // =====================================================

  const handleAddIngredient = () => {
    navigation.navigate("SearchIngredient", {
      from: "CustomRecipe",
    });
  };

  // =====================================================
  // Save recipe
  // =====================================================

  const handleSaveRecipe = async () => {
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

    const customRecipe = {
      id: recipeId,
      name: recipeName.trim(),
      image: recipeImage,
      instruction: instruction.trim(),

      ingredients: ingredients.map(
        (ingredient) => ({
          id: ingredient.id,
          quantity: Number(
            ingredient.quantity || 0
          ),
          unit: ingredient.unit,
        })
      ),
    };

    console.log(
      "Recipe sent to backend:",
      customRecipe
    );

    // =================================================
    // BACKEND CONNECTION LATER
    // =================================================
    //
    // Your backend partner can later replace this with:
    //
    // await updateCustomRecipe(
    //   recipeId,
    //   customRecipe
    // );
    //
    // Or:
    //
    // await createCustomRecipe(customRecipe);
    //
    // Image can later be uploaded separately and
    // backend returns image URL.
    // =================================================

    navigation.navigate("SaveSuccessfully");
  };

  const renderIngredient = ({ item }) => {
    return (
      <EditableIngredientCard
        ingredient={item}
        onQuantityChange={(value) =>
          handleQuantityChange(
            item.id,
            value
          )
        }
        onDelete={() =>
          handleDeleteIngredient(item.id)
        }
      />
    );
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
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={renderIngredient}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            {/* =====================
                Header
            ====================== */}

            <View style={styles.header}>
              <Pressable
                onPress={() =>
                  navigation.goBack()
                }
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.pressed,
                ]}
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
                Tùy chỉnh công thức
              </Text>

              <Pressable
                onPress={handleSaveRecipe}
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.pressed,
                ]}
              >
                <SaveIcon
                  width={scale(48)}
                  height={scale(48)}
                  color={COLORS.accent}
                />
              </Pressable>
            </View>

            {/* =====================
                Recipe image
            ====================== */}

            <Pressable
              onPress={handleChangeImage}
              style={styles.imageCard}
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
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={scale(35)}
                  color={COLORS.accent}
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
    </SafeAreaView>
  );
}

// =======================================================
// Editable Ingredient Card
// =======================================================

function EditableIngredientCard({
  ingredient,
  onQuantityChange,
  onDelete,
}) {
  const [imageError, setImageError] = useState(false);

  const calories = useMemo(() => {
    const quantity = Number(ingredient.quantity) || 0;

    return Math.round(
      (ingredient.caloriesPer100 * quantity) / 100
    );
  }, [
    ingredient.quantity,
    ingredient.caloriesPer100,
  ]);

  const renderRightActions = () => {
    return (
      <Pressable
        onPress={onDelete}
        style={styles.deleteButton}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={scale(50)}
          color={COLORS.red}
        />
      </Pressable>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={true}
      friction={2}
      rightThreshold={scale(40)}
    >
      <View style={styles.ingredientCard}>
        {/* Ingredient image */}
        <View style={styles.ingredientIconBox}>
          <Image
            source={
              imageError
                ? require("../../../assets/icons/ingredient-icon.png")
                : {
                    uri: ingredient.image,
                  }
            }
            style={styles.ingredientImage}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        </View>

        {/* Ingredient name */}
        <View style={styles.ingredientNameBox}>
          <Text
            style={styles.ingredientName}
            numberOfLines={2}
          >
            {ingredient.name}
          </Text>
        </View>

        {/* Quantity + Calories */}
        <View style={styles.ingredientInfoBox}>
          <View style={styles.quantityRow}>
            <Text style={styles.ingredientInfoLabel}>
              Định lượng:
            </Text>

            <TextInput
              style={styles.quantityInput}
              value={ingredient.quantity}
              onChangeText={onQuantityChange}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />

            <Text style={styles.unitText}>
              {ingredient.unit}
            </Text>
          </View>

          <Text style={styles.ingredientInfo}>
            Calories: {calories} cal
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

// =======================================================
// Styles
// =======================================================

const styles = StyleSheet.create({
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
  // Image
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
    fontWeight: "600",
  },

  imageEditButton: {
    position: "absolute",

    right: scale(18),
    bottom: scale(18),

    width: scale(58),
    height: scale(58),

    borderRadius: scale(29),

    backgroundColor: COLORS.accent,

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

    fontSize: scale(38),
    fontWeight: "700",

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
    fontWeight: "700",
  },

  addIngredientButton: {
    width: scale(45),
    height: scale(45),

    marginLeft: scale(12),

    borderWidth: scale(3),
    borderColor: COLORS.accent,
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
    fontWeight: "500",

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
    borderBottomColor: COLORS.accent,
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
    fontWeight: "700",
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