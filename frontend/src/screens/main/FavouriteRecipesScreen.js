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
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

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

  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", {
      recipeId: recipe.id,
    });
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
  };

  const handleDelete = () => {
    if (pendingDeleteId === null) return;

    setRecipes((prev) =>
      prev.filter((recipe) => recipe.id !== pendingDeleteId)
    );

    // Later, your backend partner can replace/add:
    // await deleteCustomizedRecipe(recipeId);

    setPendingDeleteId(null);
  };

  const renderRecipe = ({ item }) => {
    const renderRightActions = () => {
      return (
        <Pressable
          style={styles.deleteButton}
          onPress={() => requestDelete(item.id)}
          hitSlop={8}
          className="active:opacity-60"
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
          hitSlop={8}
          className="active:scale-105"
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
    <ScreenContainer
      contentStyle={styles.content}
    >

      {/* Title */}
      <ScreenHeader
        title="Công thức yêu thích"
        variant="displaySmall"
        titleClassName="tracking-tight"
      />

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

      <DeleteConfirmModal
        visible={pendingDeleteId !== null}
        message={
          "Bạn có chắc chắn muốn xoá công thức này không?\nHành động này không thể hoàn tác."
        }
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: scale(65),
    paddingTop: scale(55),
  },

  // =========================
  // Main list
  // =========================

  listContainer: {
    flex: 1,

    marginTop: scale(30),

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

    backgroundColor: COLORS.third,

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