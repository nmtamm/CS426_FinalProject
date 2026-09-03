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

import { COLORS } from "../theme/colors";

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
          elevation: 0,
          shadowOpacity: 0,
        }}
      >
        {visible && (
          <Animated.View
            entering={FadeInDown.springify().damping(18).stiffness(200)}
            exiting={FadeOutDown.duration(150)}
            style={{
              backgroundColor: COLORS.background,
              borderRadius: 20,
              width: "100%",
              height: 520,
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  color: COLORS.secondary,
                  fontFamily: "Nunito_800ExtraBold",
                  fontSize: 20,
                }}
              >
                Chọn danh mục
              </Text>
              <Button
                compact
                mode="text"
                onPress={onDismiss}
                textColor={COLORS.primary}
                labelStyle={{ fontFamily: "Nunito_800ExtraBold" }}
              >
                Đóng
              </Button>
            </View>

            {/* Modal Search Bar */}
            <View style={{ paddingHorizontal: 15, paddingBottom: 15 }}>
              <Searchbar
                placeholder="Tìm kiếm danh mục..."
                onChangeText={setFilterText}
                value={filterText}
                elevation={1}
                style={{
                  backgroundColor: COLORS.secondary,
                  borderRadius: 15,
                  height: 48,
                }}
                inputStyle={{
                  minHeight: 0,
                  alignSelf: "center",
                  fontSize: 14,
                  fontFamily: "Nunito_700Bold",
                  color: COLORS.primary,
                }}
                iconColor={COLORS.primary}
                placeholderTextColor={COLORS.placeholder}
              />
            </View>

            {/* Category Items List */}
            <FlatList
              data={filteredCategories}
              style={{ flex: 1 }}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <Divider />}
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
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                        backgroundColor: isSelected
                          ? COLORS.secondary
                          : COLORS.third,
                        borderWidth: 0.1
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: isSelected ? "Nunito_700Bold" : "Nunito_600Regular",
                          color: isSelected ? COLORS.primary : COLORS.textDark,
                        }}
                      >
                        {item}
                      </Text>
                      {isSelected && (
                        <Icon source="check" size={20} color={COLORS.primary} />
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
