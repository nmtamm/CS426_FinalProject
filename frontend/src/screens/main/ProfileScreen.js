import { Button, Text } from "react-native-paper";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";


import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";
import BackIcon from "../../../assets/icons/back-icon.svg"
import LogoutIcon from "../../../assets/icons/logout-icon.svg"
import ScreenContainer from "../../components/ScreenContainer";
import ScreenHeader from "../../components/ScreenHeader";
import { api } from "../../services/api";

export default function ProfileScreen({ navigation }) {
  // Backend later:

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profile = await api.getProfile();

        setFullName(profile.fullName ?? "");
        setUsername(profile.username ?? "");
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <ScreenHeader
        title="Cập nhật thông tin"
        variant="displaySmall"
        onLeftPress={() => navigation.goBack()}
        LeftIconSvg={BackIcon}
        LeftIconSize="24"

        onRightPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }], })}
        RightIconSvg={LogoutIcon}
        RightIconSize="24"
      />

      {/* =========================
          PROFILE INFORMATION
      ========================= */}
      <View style={styles.cardsContainer}>
        <ProfileItem
          icon="account-outline"
          label="Họ và tên"
          value={fullName}
          onSave={async (newValue) => {
            const updatedProfile =
              await api.updateFullName(newValue);

            setFullName(
              updatedProfile?.fullName ?? newValue
            );
          }}
        />

        <ProfileItem
          icon="information-outline"
          label="Tên đăng nhập"
          value={username}
          editable={false}
        />

        <ProfileItem
          icon="lock-outline"
          label="Mật khẩu"
          value={password}
          onSave={async (newValue) => {
            await api.updatePassword(newValue);

            setPassword("");
          }}
        />
      </View>
    </ScreenContainer>
  );
}

function ProfileItem({
  icon,
  label,
  value,
  onSave,
  editable = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleButtonPress = async () => {
    if (isEditing) {
      try {
        await onSave?.(inputValue);

        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save profile:", error);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.card}>
      {/* Left icon */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={scale(58)}
          color={COLORS.primary}
        />
      </View>

      {/* Text / Input */}
      <View style={styles.textContainer}>
        <Text style={styles.label}>
          {label}
        </Text>

        {isEditing && editable ? (
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleButtonPress}
          />
        ) : (
          <Text
            style={styles.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {inputValue}
          </Text>
        )}
      </View>

      {/* Edit / Complete button */}
      {editable && (
        <Pressable
          onPress={handleButtonPress}
          hitSlop={8}
          className="active:opacity-60"
          style={styles.editButton}
        >
          <MaterialCommunityIcons
            name={
              isEditing
                ? "check"
                : "pencil-outline"
            }
            size={scale(48)}
            color={COLORS.primary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: scale(65),
    paddingTop: scale(55),
  },

  // =========================
  // Cards
  // =========================

  cardsContainer: {
    marginTop: scale(68),
    gap: scale(45),
  },

  card: {
    minHeight: scale(92),

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: scale(25),
    paddingVertical: scale(15),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(25),
  },

  // =========================
  // Left icon
  // =========================

  iconContainer: {
    width: scale(72),

    justifyContent: "center",
    alignItems: "center",
  },

  // =========================
  // Text
  // =========================

  textContainer: {
    flex: 1,
    minWidth: 0,

    marginLeft: scale(18),
    marginRight: scale(15),
  },

  label: {
    color: COLORS.black,
    fontSize: scale(21),
  },

  value: {
    marginTop: scale(2),

    color: COLORS.black,
    fontSize: scale(27),
    fontFamily: "Nunito_700Bold",
  },

  // =========================
  // Edit button
  // =========================

  editButton: {
    width: scale(55),
    height: scale(55),

    justifyContent: "center",
    alignItems: "center",

    borderRadius: scale(15),
  },

  editPressed: {
    backgroundColor: "rgba(168, 79, 42, 0.12)",
    transform: [{ scale: 0.9 }],
  },

  input: {
    marginTop: scale(2),

    padding: 0,

    color: COLORS.black,
    fontSize: scale(27),
    fontFamily: "Nunito_700Bold",

    borderBottomWidth: scale(1.5),
    borderBottomColor: COLORS.primary,
  },
});