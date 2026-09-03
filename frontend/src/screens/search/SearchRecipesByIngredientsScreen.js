import { useMemo, useState } from "react";

import { ScrollView, View } from "react-native";

import { Surface, Text } from "react-native-paper";

import AppSearchbar from "../../components/AppSearchbar";
import CategorySelectModal from "../../components/CategorySelectModal";
import CategorySelectorField from "../../components/CategorySelectorField";
import PaginatedListPanel from "../../components/PaginatedListPanel";
import RecipeCard from "../../components/RecipeCard";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import { RECIPE_CATEGORIES, RECIPES } from "../../data/mockRecipes";
import { COLORS } from "../../theme/colors";
import { searchRecipesByIngredients, getRecipeCategories } from "../../services/recipeApi";

import { scale } from "../../utils/responsive";
import BackIcon from "../../../assets/icons/back-icon.svg"

const ITEMS_PER_PAGE = 10;

export default function SearchRecipesByIngredientsScreen({
  navigation,
  route,
}) {
  const selectedIngredients = route.params?.selectedIngredients || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);

  // Backend integration later:
  //
  // const ingredientIds = selectedIngredients.map(
  //   (ingredient) => ingredient.id
  // );
  //
  // const result = await searchRecipesByIngredients(
  //   ingredientIds,
  //   {
  //     search: searchQuery,
  //     category:
  //       selectedCategory === "Tất cả"
  //         ? ""
  //         : selectedCategory,
  //     page: currentPage,
  //     limit: ITEMS_PER_PAGE,
  //   }
  // );

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      const matchesName = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      const matchesCategory =
        selectedCategory === "Tất cả" || recipe.category === selectedCategory;

      return matchesName && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setPageDirection(-1);
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const handleNextPage = () => {
    setPageDirection(1);
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate("RecipeDetail", { recipeId: recipe.id });
  };

  return (
    <ScreenContainer style={{paddingHorizontal: scale(65), paddingTop: scale(55), paddingBottom: scale(130)}}>
      <View>
        <ScreenHeader
          title="Tìm công thức"
          variant="displaySmall"
          onBack={() => navigation.goBack()}
          onLeftPress={() => navigation.goBack()}
          LeftIconSvg={BackIcon}
          LeftIconSize="24"
        />

        <View style={{gap: 10, marginTop: 20, marginBottom: 10 }}>
          <AppSearchbar
            placeholder="Nhập tên công thức"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        
          <CategorySelectorField
            selectedCategory={selectedCategory}
            onPress={() => setIsCategoryModalOpen(true)}
          />
        </View>

        {selectedIngredients.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              marginBottom: 10,
              gap: 8,
            }}
          >
            {selectedIngredients.map((ingredient) => (
              <Surface
                key={ingredient.id}
                elevation={1}
                style={{
                  backgroundColor: COLORS.secondary,
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: "Nunito_700Bold" ,color: COLORS.primary }}>
                  {ingredient.name}
                </Text>
              </Surface>
            ))}
          </ScrollView>
        )}
      </View>

      <PaginatedListPanel
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={filteredRecipes.length}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        pageDirection={pageDirection}
        data={paginatedRecipes}
        keyExtractor={(item) => item.id}
        emptyTitle="Không tìm thấy công thức"
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onToggleSelect={handleRecipePress} />
        )}
      />

      <CategorySelectModal
        visible={isCategoryModalOpen}
        onDismiss={() => setIsCategoryModalOpen(false)}
        categories={RECIPE_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
    </ScreenContainer>
  );
}
