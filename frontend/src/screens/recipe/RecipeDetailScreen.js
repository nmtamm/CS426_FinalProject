import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

import BackIcon from "../../../assets/icons/back-icon.svg"
import SaveIcon from "../../../assets/icons/save-icon.svg"
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import ReadOnlyIngredientCard from "../../components/ReadOnlyIngredientCard";
import SaveConfirmModal from "../../components/SaveConfirmModal";


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

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const handleSaveRecipe = async () => {
    setShowSaveConfirm(false);

    // Backend later:
    // await saveFavouriteRecipe(recipe.id);

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
    return <ReadOnlyIngredientCard ingredient={item} />;
  };

  return (
    <ScreenContainer
      contentStyle={styles.content}
    >

      <FlatList
        data={recipe.ingredients}
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

              onRightPress={() => setShowSaveConfirm(true)}
              RightIconSvg={SaveIcon}
              RightIconSize="24"
            />

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