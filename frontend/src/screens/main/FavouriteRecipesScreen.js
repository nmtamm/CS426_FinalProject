import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

export default function CustomizedRecipesScreen({ navigation }) {
  // Temporary frontend data.
  // Later, replace this with data returned from backend.
  const [recipes, setRecipes] = useState([
    {
      id: "1",
      name: "Món ăn",
      image: require("../../../assets/icons/dish-icon.png"),
    },
    {
      id: "2",
      name: "Món ăn",
      image: require("../../../assets/icons/dish-icon.png"),
    },
    {
      id: "3",
      name: "Món ăn",
      image: require("../../../assets/icons/dish-icon.png"),
    },
    {
      id: "4",
      name: "Món ăn",
      image: require("../../../assets/icons/dish-icon.png"),
    },
    {
      id: "5",
      name: "Món ăn",
      image: require("../../../assets/icons/dish-icon.png"),
    },
    {
      id: "7",
      name: "Món ăn",
      image: require("../../../assets/icons/dish-icon.png"),
    },
  ]);

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", {
      recipeId: recipe.id,
    });
  };

  const handleDelete = (recipeId) => {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.id !== recipeId)
    );

    // Later, your backend partner can replace/add:
    // await deleteCustomizedRecipe(recipeId);
  };

  const renderRecipe = ({ item }) => {
    const renderRightActions = () => {
      return (
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
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
        <Pressable
          style={styles.recipeCard}
          onPress={() => handleRecipePress(item)}
        >
          <View style={styles.imageBox}>
            {item.image && (
              <Image
                source={item.image}
                style={styles.recipeImage}
                resizeMode="contain"
              />
            )}
          </View>

          <View style={styles.recipeNameBox}>
            <Text
              style={styles.recipeName}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* Title */}
      <Text style={styles.title}>
        Công thức yêu thích
      </Text>

      {/* Recipe list container */}
      <View style={styles.listContainer}>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipe}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // =========================
  // Title
  // =========================

  title: {
    marginTop: scale(40),
    paddingHorizontal: scale(30),

    color: COLORS.secondary,

    fontSize: scale(45),
    fontFamily: "Nunito_900Black",

    textAlign: "center",
  },

  // =========================
  // Main list
  // =========================

  listContainer: {
    flex: 1,

    marginTop: scale(55),
    marginHorizontal: scale(60),

    // Leave room for your absolute bottom tab bar
    marginBottom: scale(330),

    backgroundColor: COLORS.secondary,

    borderRadius: scale(35),

    overflow: "hidden",
  },

  listContent: {
    paddingHorizontal: scale(45),
    paddingTop: scale(45),
    paddingBottom: scale(45),
  },

  // =========================
  // Recipe row
  // =========================

  recipeRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: scale(25),
  },

  recipeCard: {
    flex: 1,

    height: scale(165),

    flexDirection: "row",

    backgroundColor: COLORS.surface,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(26),

    marginBottom: 20,

    overflow: "hidden",
  },

  // =========================
  // Image
  // =========================

  imageBox: {
    width: scale(165),
    height: "100%",

    justifyContent: "center",
    alignItems: "center",

    borderRightWidth: scale(2),
    borderRightColor: COLORS.black,

    borderRadius: scale(26),
  },

  recipeImage: {
    width: scale(135),
    height: scale(135),
  },

  // =========================
  // Recipe name
  // =========================

  recipeNameBox: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: scale(15),
  },

  recipeName: {
    color: COLORS.black,

    fontSize: scale(32),
    fontFamily: "Nunito_700Bold",

    textAlign: "center",
  },

  // =========================
  // Delete
  // =========================

  deleteButton: {
    width: scale(95),

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
    marginLeft: 10,

    backgroundColor: COLORS.lightRed,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(26),
  },

  // =========================
  // Press effect
  // =========================

  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  },
});