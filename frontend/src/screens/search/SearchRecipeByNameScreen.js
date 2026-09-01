import { useMemo, useState } from "react";

import { FlatList, Pressable, View } from "react-native";

import { Icon, Searchbar, Surface, Text } from "react-native-paper";

import CategorySelectModal from "../../components/CategorySelectModal";
import PaginationControls from "../../components/PaginationControls";
import RecipeCard from "../../components/RecipeCard";
import { RECIPE_CATEGORIES, RECIPES } from "../../data/mockRecipes";

import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS_PER_PAGE = 10;

export default function SearchRecipeByNameScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((item) => {
      const matchesName = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "Tất cả" || item.category === selectedCategory;
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
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#f1f5f9" }}
    >
      <View
        style={{ flex: 1, width: "100%", maxWidth: 640, alignSelf: "center" }}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <View className="flex-row items-center justify-between py-2 mb-1 px-1">
            <Pressable
              hitSlop={8}
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-white items-center justify-center border border-slate-200 shadow-sm active:bg-slate-50"
            >
              <Icon source="arrow-left" size={22} color="#334155" />
            </Pressable>

            <Text
              variant="titleLarge"
              className="font-extrabold text-slate-900 text-lg tracking-tight"
            >
              Tìm kiếm công thức
            </Text>

            <View className="w-10" />
          </View>

          <View className="gap-2.5 mb-3">
            <Searchbar
              placeholder="Nhập tên công thức..."
              onChangeText={handleSearchChange}
              value={searchQuery}
              elevation={1}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 24,
                height: 52,
                borderWidth: 1.5,
                borderColor: "#e2e8f0",
              }}
              inputStyle={{
                minHeight: 0,
                alignSelf: "center",
                fontSize: 15,
                color: "#1e293b",
              }}
              iconColor="#64748b"
            />

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
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 12 }}>
          <Surface
            elevation={1}
            style={{ flex: 1, overflow: "hidden" }}
            className="bg-slate-200/70 border border-slate-300 rounded-3xl"
          >
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={filteredRecipes.length}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />

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
                    <RecipeCard
                      recipe={item}
                      onToggleSelect={handleRecipePress}
                    />
                  )}
                />
              </Animated.View>
            </View>
          </Surface>
        </View>

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
