import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Modal,
  Portal,
  Text,
} from "react-native-paper";

import Animated, {
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";

import { COLORS } from "../theme/colors";
import { scale } from "../utils/responsive";

export default function SaveConfirmModal({
  visible,
  onCancel,
  onConfirm,
  message = "Bạn có chắc chắn muốn lưu mục này không?",
}) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modalContainer}
      >
        {visible && (
          <Animated.View
            entering={FadeInDown.springify()
              .damping(18)
              .stiffness(200)}
            exiting={FadeOutDown.duration(150)}
            style={styles.modal}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Xác nhận lưu
              </Text>

              <Pressable
                onPress={onCancel}
                style={styles.closeButton}
                hitSlop={8}
                className="active:opacity-60"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={scale(35)}
                  color={COLORS.black}
                />
              </Pressable>
            </View>

            {/* Body */}
            <View style={styles.body}>
              <MaterialCommunityIcons
                name="alert"
                size={scale(82)}
                color={"#FFB400"}
              />

              <Text style={styles.message}>
                {message}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  onPress={onCancel}
                  style={styles.cancelButton}
                  hitSlop={8}
                  className="active:opacity-60"
                >
                  <Text style={styles.cancelText}>
                    Huỷ
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  style={styles.saveButton}
                  hitSlop={8}
                  className="active:opacity-60"
                >
                  <Text style={styles.confirmText}>
                    Lưu
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "transparent",

    alignItems: "center",
    justifyContent: "center",

    elevation: 0,
    shadowOpacity: 0,
  },

  modal: {
    width: scale(595),
    height: scale(330),

    borderRadius: scale(20),

    overflow: "hidden",

    backgroundColor: COLORS.white,
  },

  header: {
    height: scale(67),
    paddingLeft: scale(50),
    paddingRight: scale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.lightGreen,
  },

  title: {
    color: COLORS.black,
    fontSize: scale(28),
    lineHeight: scale(35),
    fontFamily: "Nunito_800ExtraBold",
  },

  closeButton: {
    width: scale(42),
    height: scale(42),
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.third,
    paddingTop: scale(22),
    paddingHorizontal: scale(32),
  },

  message: {
    marginTop: scale(4),
    color: COLORS.black,
    fontSize: scale(20),
    lineHeight: scale(25),
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },

  actions: {
    width: scale(298),
    marginTop: scale(20),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    backgroundColor: COLORS.disabled,
    width: scale(121),
    height: scale(38),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    backgroundColor: COLORS.green,
    width: scale(121),
    height: scale(38),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: COLORS.black,
    fontSize: scale(20),
    lineHeight: scale(24),
    fontFamily: "Nunito_700Bold",
  },

  confirmText: {
    color: COLORS.third,
    fontSize: scale(20),
    lineHeight: scale(24),
    fontFamily: "Nunito_700Bold",
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
});