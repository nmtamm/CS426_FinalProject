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
import { RECIPE_CATEGORIES, RECIPES } from "../../data/mockRecipes";
import { getRecipes, getRecipeCategories } from "../../services/recipeApi";

import { scale } from "../../utils/responsive";
import HomeIcon from "../../../assets/icons/home-icon.svg"

const ITEMS_PER_PAGE = 10;

export default function SearchRecipeByNameScreen({ navigation }) {
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

  useEffect(() => {
    api
      .getRecipeCategories()
      .then((result) => {
        // Safely check and map fields to ensure everything follows the object structure
        const mapped = [
          { id: 0, name: "Tất cả" },
          ...result.map((cat) => ({ id: cat.id, name: cat.name }))
        ];
        setCategories(mapped);
      })
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
          category: selectedCategory?.id || 0, // 🌟 Pass the ID number here
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
    // 🌟 Watch the primitive numeric ID here instead of the whole object
  }, [currentPage, searchQuery, selectedCategory?.id]);

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
    <ScreenContainer style={{ paddingHorizontal: scale(65), paddingTop: scale(55), paddingBottom: scale(130) }}>
      <View>
        <ScreenHeader
          title="Tìm công thức"
          variant="displaySmall"
          onLeftPress={() => navigation.navigate("MainTabs", { screen: "Dashboard" })}
          LeftIconSvg={HomeIcon}
          LeftIconSize={30}
          titleClassName="tracking-tight"
        />

        <View style={{ gap: 10, marginTop: 20, marginBottom: 12 }}>
          <AppSearchbar
            placeholder="Nhập tên công thức..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          <CategorySelectorField
            selectedCategory={selectedCategory.name}
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
