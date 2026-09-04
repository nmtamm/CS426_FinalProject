import { useEffect, useMemo, useState } from "react";

import { ScrollView, View } from "react-native";

import { Surface, Text } from "react-native-paper";

import AppSearchbar from "../../components/AppSearchbar";
import CategorySelectModal from "../../components/CategorySelectModal";
import CategorySelectorField from "../../components/CategorySelectorField";
import PaginatedListPanel from "../../components/PaginatedListPanel";
import RecipeCard from "../../components/RecipeCard";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import { api } from "../../services/api";
import { COLORS } from "../../theme/colors";
import { searchRecipesByIngredients, getRecipeCategories } from "../../services/recipeApi";

import { scale } from "../../utils/responsive";
import BackIcon from "../../../assets/icons/back-icon.svg"

const ITEMS_PER_PAGE = 10;

export default function SearchRecipesByIngredientsScreen({
  navigation,
  route,
}) {
  const selectedIngredients = useMemo(
    () => route.params?.selectedIngredients || [],
    [route.params?.selectedIngredients]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({ id: 0, name: "Tất cả" });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, name: "Tất cả" }]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const ingredientIds = useMemo(
    () => selectedIngredients.map((ingredient) => ingredient.id),
    [selectedIngredients]
  );

  useEffect(() => {
    let ignore = false;
    const timeout = setTimeout(async () => {
      if (!ingredientIds.length) {
        setRecipes([]);
        setTotalCount(0);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const result = await api.searchRecipesByIngredients(
          ingredientIds,
          {
            search: searchQuery.trim(),
            category: selectedCategory?.id || 0, // 🌟 Clean numeric parameter
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          }
        );

        if (!ignore) {
          setRecipes(result.items);
          setTotalCount(result.total);
          setTotalPages(result.totalPages);
        }
      } catch (requestError) {
        if (!ignore) setError(requestError.message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }, 250);
    return () => {
      ignore = true;
      clearTimeout(timeout);
    };

    // 🌟 FIXED: Change selectedCategory here to selectedCategory?.id
  }, [currentPage, ingredientIds, searchQuery, selectedCategory?.id]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    // If a string slips through somehow, default to it, otherwise save the whole object
    setSelectedCategory(category && typeof category === 'object' ? category : { id: 0, name: "Tất cả" });
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
    <ScreenContainer style={{ paddingHorizontal: scale(65), paddingTop: scale(55), paddingBottom: scale(130) }}>
      <View>
        <ScreenHeader
          title="Tìm công thức"
          variant="displaySmall"
          onBack={() => navigation.goBack()}
          onLeftPress={() => navigation.goBack()}
          LeftIconSvg={BackIcon}
          LeftIconSize="24"
        />

        <View style={{ gap: 10, marginTop: 20, marginBottom: 10 }}>
          <AppSearchbar
            placeholder="Nhập tên công thức"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          <CategorySelectorField
            selectedCategory={selectedCategory.name}
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
                <Text style={{ fontSize: 14, fontFamily: "Nunito_700Bold", color: COLORS.primary }}>
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
        totalCount={totalCount}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        pageDirection={pageDirection}
        data={recipes}
        isLoading={isLoading}
        error={error}
        keyExtractor={(item) => item.id}
        emptyTitle="Không tìm thấy công thức"
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onToggleSelect={handleRecipePress} />
        )}
      />

      <CategorySelectModal
        visible={isCategoryModalOpen}
        onDismiss={() => setIsCategoryModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory} // Pass the whole object
        onSelectCategory={handleCategorySelect}
      />
    </ScreenContainer>
  );
}
