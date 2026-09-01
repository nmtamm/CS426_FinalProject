import { useMemo, useState } from "react";

import { Alert, FlatList, Pressable, View } from "react-native";

import { Icon, Searchbar, Surface, Text } from "react-native-paper";

import CategorySelectModal from "../components/CategorySelectModal";
import PaginationControls from "../components/PaginationControls";
import RecipeCard from "../components/RecipeCard";
import { RECIPE_CATEGORIES, RECIPES } from "../data/mockRecipes";

import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 10;

export default function FindRecipesScreen({ selectedIngredients, onBack }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);

  // Filter recipes by selected ingredients, name, and category
  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      // If no ingredients selected, show all recipes
      if (selectedIngredients.length === 0) {
        return true;
      }

      // Check if recipe title includes any of the search terms
      const matchesName = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());

      // Check if recipe category matches
      const matchesCategory =
        selectedCategory === "Tất cả" || recipe.category === selectedCategory;

      // For now, show all recipes as matches (in real app, this would check recipe ingredients)
      return matchesName && matchesCategory;
    });
  }, [searchQuery, selectedCategory, selectedIngredients]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecipes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  // Handlers
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

  const handleCookRecipe = (recipe) => {
    Alert.alert("Nấu món ăn", `Chuẩn bị nấu: ${recipe.title}`);
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#afc490" }}
    >
      <View
        style={{ flex: 1, width: "100%", maxWidth: 640, alignSelf: "center" }}
      >
        {/* Header Section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {/* Back Button & Title */}
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              hitSlop={8}
              onPress={onBack}
              className="w-10 h-10 rounded-full bg-white items-center justify-center border border-slate-200 shadow-sm active:bg-slate-50"
            >
              <Icon source="arrow-left" size={24} color="#c65d42" />
            </Pressable>

            <Text
              variant="displaySmall"
              className="text-white font-extrabold text-center flex-1"
            >
              Tìm công thức
            </Text>

            <View className="w-10" />
          </View>

          {/* Search and Filters */}
          <View className="flex-row gap-2 mb-3">
            <View style={{ flex: 1 }}>
              <Searchbar
                placeholder="Name of ingredient"
                onChangeText={handleSearchChange}
                value={searchQuery}
                elevation={1}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  height: 48,
                  borderWidth: 1.5,
                  borderColor: "#2d2d2d",
                }}
                inputStyle={{
                  minHeight: 0,
                  alignSelf: "center",
                  fontSize: 14,
                  color: "#1e293b",
                }}
                iconColor="#c65d42"
              />
            </View>
            <Pressable className="w-12 h-12 rounded-2xl bg-white items-center justify-center border-2 border-slate-300 active:bg-slate-50">
              <Icon source="magnify" size={24} color="#c65d42" />
            </Pressable>
          </View>

          {/* Category Dropdown Picker - Matched to Searchbar visual styling */}
          <Surface
            elevation={1}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 24,
              height: 52,
              borderWidth: 1.5,
              borderColor: "#e2e8f0",
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={() => setIsCategoryModalOpen(true)}
              className="flex-1 flex-row items-center justify-between px-4 active:bg-slate-50"
            >
              <View className="flex-row items-center gap-3">
                <Icon source="shape-outline" size={24} color="#64748b" />
                <Text className="text-slate-800 font-medium text-[15px]">
                  Danh mục:{" "}
                  <Text className="text-emerald-700 font-bold">
                    {selectedCategory}
                  </Text>
                </Text>
              </View>
              <Icon source="chevron-down" size={24} color="#64748b" />
            </Pressable>
          </Surface>

          {/* Selected Ingredients Chips */}
          {selectedIngredients.length > 0 && (
            <View
              style={{
                marginTop: 8,
                marginBottom: 12,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {selectedIngredients.map((ingredient) => (
                <Surface
                  key={ingredient.id}
                  elevation={1}
                  style={{
                    backgroundColor: "#f5f0eb",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1.5,
                    borderColor: "#2d2d2d",
                  }}
                >
                  <Text className="text-slate-800 font-medium text-xs">
                    {ingredient.name}
                  </Text>
                </Surface>
              ))}
            </View>
          )}
        </View>

        {/* Results Container */}
        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 12 }}>
          <Surface
            elevation={1}
            style={{ flex: 1, overflow: "hidden" }}
            className="bg-slate-200/70 border border-slate-300 rounded-3xl"
          >
            {/* Pagination Navigation Bar */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={filteredRecipes.length}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />

            {/* Paginated Results List */}
            <View style={{ flex: 1, overflow: "hidden" }}>
              <Animated.View
                key={`page-${currentPage}`}
                entering={
                  pageDirection === 1
                    ? FadeInRight.duration(220)
                    : FadeInLeft.duration(220)
                }
                style={{ flex: 1 }}
              >
                <FlatList
                  data={paginatedRecipes}
                  keyExtractor={(item) => item.id}
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    padding: 12,
                    paddingBottom: 24,
                  }}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={() => (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      className="items-center justify-center py-20 px-4"
                    >
                      <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
                        <Icon source="food-off" size={32} color="#94a3b8" />
                      </View>
                      <Text className="text-slate-600 font-bold text-base text-center">
                        Không tìm thấy công thức
                      </Text>
                      <Text className="text-slate-400 text-xs text-center mt-1">
                        Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục
                        khác
                      </Text>
                    </Animated.View>
                  )}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handleCookRecipe(item)}
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      <RecipeCard
                        recipe={item}
                        isSelected={false}
                        onToggleSelect={() => handleCookRecipe(item)}
                      />
                    </Pressable>
                  )}
                />
              </Animated.View>
            </View>
          </Surface>
        </View>

        {/* Category Selection Modal */}
        <CategorySelectModal
          visible={isCategoryModalOpen}
          onDismiss={() => setIsCategoryModalOpen(false)}
          categories={RECIPE_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </View>
    </SafeAreaView>
  );
}
