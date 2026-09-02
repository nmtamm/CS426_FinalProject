import { useEffect, useState } from "react";

import { View } from "react-native";

import AppSearchbar from "../../components/AppSearchbar";
import CategorySelectModal from "../../components/CategorySelectModal";
import CategorySelectorField from "../../components/CategorySelectorField";
import PaginatedListPanel from "../../components/PaginatedListPanel";
import RecipeCard from "../../components/RecipeCard";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import { api } from "../../services/api";

const ITEMS_PER_PAGE = 10;

export default function SearchRecipeByNameScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getRecipeCategories()
      .then(setCategories)
      .catch((requestError) => {
        setError(requestError.message);
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await api.getRecipes({
          search: searchQuery.trim(),
          category: selectedCategory,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
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
  }, [currentPage, searchQuery, selectedCategory]);

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
    <ScreenContainer>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <ScreenHeader
          title="Tìm kiếm công thức"
          iconSize={22}
          titleClassName="tracking-tight"
          onBack={() => navigation.goBack()}
        />

        <View style={{ gap: 10, marginBottom: 12 }}>
          <AppSearchbar
            placeholder="Nhập tên công thức..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          <CategorySelectorField
            selectedCategory={selectedCategory}
            onPress={() => setIsCategoryModalOpen(true)}
          />
        </View>
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
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
    </ScreenContainer>
  );
}
