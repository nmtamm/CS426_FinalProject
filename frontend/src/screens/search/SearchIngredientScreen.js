import { useEffect, useState } from "react";

import { Alert, View, StyleSheet } from "react-native";

import AppSearchbar from "../../components/AppSearchbar";
import CategorySelectModal from "../../components/CategorySelectModal";
import CategorySelectorField from "../../components/CategorySelectorField";
import IngredientCard from "../../components/IngredientCard";
import PaginatedListPanel from "../../components/PaginatedListPanel";
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import SelectedIngredientsDock from "../../components/SelectedIngredientsDock";
import { api } from "../../services/api";
import { CATEGORIES, INGREDIENTS } from "../../data/mockIngredients";
import { getIngredients, getIngredientCategories } from "../../services/ingredientApi";

import { scale } from "../../utils/responsive";
import HomeIcon from "../../../assets/icons/home-icon.svg"

const ITEMS_PER_PAGE = 10;

export default function SearchIngredientScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState(["Tất cả"]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getIngredientCategories()
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
        const result = await api.getIngredients({
          search: searchQuery.trim(),
          category: selectedCategory,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
        if (!ignore) {
          setIngredients(result.items);
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

  const handleToggleSelect = (ingredient) => {
    setSelectedIngredients((prev) => {
      const exists = prev.some((item) => item.id === ingredient.id);
      if (exists) {
        return prev.filter((item) => item.id !== ingredient.id);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleRemoveIngredient = (id) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
  };

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

  const handleFindRecipes = (ingredients) => {
    if (ingredients.length > 0) {
      navigation.navigate("SearchRecipesByIngredients", {
        selectedIngredients: ingredients,
      });
    } else {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một nguyên liệu");
    }
  };

  const handleCreateRecipe = (ingredients) => {
    const names = ingredients.map((i) => i.name).join(", ");
    Alert.alert(
      "Tạo món ăn",
      `Đang tạo công thức mới với nguyên liệu: ${names}`
    );
  };

  return (
    <ScreenContainer style={{paddingHorizontal: scale(65), paddingTop: scale(55), paddingBottom: scale(130)}}>
      <View>
        <ScreenHeader
          title="Tìm nguyên liệu"
          variant="displaySmall"
          onLeftPress={() => navigation.navigate("MainTabs", { screen: "Dashboard" })}
          LeftIconSvg={HomeIcon}
          LeftIconSize={30}
          titleClassName="tracking-tight"
        />

        <View style={{ gap: 10, marginTop: 20, marginBottom: 10 }}>
          <AppSearchbar
            placeholder="Nhập tên nguyên liệu..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          <CategorySelectorField
            selectedCategory={selectedCategory}
            onPress={() => setIsCategoryModalOpen(true)}
            labelClassName="text-black font-semibold"
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
        data={ingredients}
        isLoading={isLoading}
        error={error}
        keyExtractor={(item) => item.id}
        paddingBottom={selectedIngredients.length > 0 ? 4 : 12}
        surfaceClassName="border rounded-3xl"
        emptyTitle="Không tìm thấy nguyên liệu"
        renderItem={({ item }) => {
          const isSelected = selectedIngredients.some((i) => i.id === item.id);
          return (
            <IngredientCard
              ingredient={item}
              isSelected={isSelected}
              onToggleSelect={handleToggleSelect}
            />
          );
        }}
      />

      <CategorySelectModal
        visible={isCategoryModalOpen}
        onDismiss={() => setIsCategoryModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      <SelectedIngredientsDock
        selectedIngredients={selectedIngredients}
        onRemoveIngredient={handleRemoveIngredient}
        onClearAll={handleClearAll}
        onFindRecipes={handleFindRecipes}
        onCreateRecipe={handleCreateRecipe}
      />
    </ScreenContainer>
  );
}