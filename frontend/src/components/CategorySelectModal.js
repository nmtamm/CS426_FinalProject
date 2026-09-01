import { useState } from "react";

import { FlatList, Pressable, View } from "react-native";

import {
  Button,
  Divider,
  Icon,
  Modal,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";

export default function CategorySelectModal({
  visible,
  onDismiss,
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  const [filterText, setFilterText] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(filterText.toLowerCase().trim())
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: "transparent",
          marginHorizontal: 20,
          marginVertical: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {visible && (
          <Animated.View
            entering={FadeInDown.springify().damping(18).stiffness(200)}
            exiting={FadeOutDown.duration(150)}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 24,
              width: "100%",
              maxHeight: 520,
              overflow: "hidden",
              borderWidth: 1.5,
              borderColor: "#e2e8f0",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            {/* Modal Header */}
            <View className="px-5 pt-4 pb-3 border-b border-slate-100 flex-row items-center justify-between">
              <Text
                variant="titleMedium"
                className="font-extrabold text-slate-900 text-base"
              >
                Chọn danh mục
              </Text>
              <Button
                compact
                mode="text"
                onPress={onDismiss}
                textColor="#64748b"
                labelStyle={{ fontWeight: "bold" }}
              >
                Đóng
              </Button>
            </View>

            {/* Modal Search Bar */}
            <View className="p-3 pb-2">
              <Searchbar
                placeholder="Tìm kiếm danh mục..."
                onChangeText={setFilterText}
                value={filterText}
                elevation={1}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 20,
                  height: 48,
                  borderWidth: 1.5,
                  borderColor: "#e2e8f0",
                }}
                inputStyle={{
                  minHeight: 0,
                  alignSelf: "center",
                  fontSize: 14,
                  color: "#1e293b",
                }}
                iconColor="#64748b"
              />
            </View>

            {/* Category Items List */}
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <Divider />}
              contentContainerStyle={{ paddingBottom: 12 }}
              renderItem={({ item, index }) => {
                const isSelected = item === selectedCategory;
                return (
                  <Animated.View
                    entering={FadeIn.delay(Math.min(index * 25, 200))}
                    layout={LinearTransition.springify()}
                  >
                    <Pressable
                      onPress={() => {
                        onSelectCategory(item);
                        onDismiss();
                      }}
                      className={`flex-row items-center justify-between px-5 py-3.5 ${
                        isSelected ? "bg-emerald-50" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          isSelected
                            ? "font-bold text-emerald-700"
                            : "text-slate-700 font-medium"
                        }`}
                      >
                        {item}
                      </Text>
                      {isSelected && (
                        <Icon source="check" size={20} color="#059669" />
                      )}
                    </Pressable>
                  </Animated.View>
                );
              }}
            />
          </Animated.View>
        )}
      </Modal>
    </Portal>
  );
}
