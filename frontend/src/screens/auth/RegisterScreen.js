import { useState } from "react";

import { Pressable, View } from "react-native";

import { Button, Icon, Surface, Text, TextInput } from "react-native-paper";

import ScreenContainer from "../../components/ScreenContainer";
import { COLORS } from "../../theme/colors";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập không được trống";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);

    return (
      !newErrors.username && !newErrors.password && !newErrors.confirmPassword
    );
  };

  const handleSignup = () => {
    if (validateForm()) {
      navigation.replace("MainTabs");
    }
  };

  return (
    <ScreenContainer
      contentStyle={{ paddingHorizontal: 16, justifyContent: "center" }}
    >
      {/* Header */}
      <Text
        variant="displaySmall"
        style={{
          color: "white",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        Đăng ký
      </Text>

      {/* Username Field */}
      <View style={{ marginBottom: 24 }}>
        <Surface
          elevation={1}
          style={{
            backgroundColor: COLORS.secondary,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
          >
            <Icon
              source="information-outline"
              size={24}
              color={COLORS.primary}
            />
            <TextInput
              placeholder="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              placeholderTextColor={COLORS.placeholder}
              textColor={COLORS.primary}
              activeUnderlineColor={COLORS.primary}
            />
          </View>
        </Surface>
        {errors.username ? (
          <Text style={{ color: COLORS.primary, marginTop: 4, fontSize: 12 }}>
            {errors.username}
          </Text>
        ) : null}
      </View>

      {/* Password Field */}
      <View style={{ marginBottom: 24 }}>
        <Surface
          elevation={1}
          style={{
            backgroundColor: COLORS.secondary,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
          >
            <Icon source="lock-outline" size={24} color={COLORS.primary} />
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              placeholderTextColor={COLORS.placeholder}
              textColor={COLORS.primary}
              activeUnderlineColor={COLORS.primary}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={6}
            >
              <Icon
                source={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={COLORS.primary}
              />
            </Pressable>
          </View>
        </Surface>
        {errors.password ? (
          <Text style={{ color: COLORS.primary, marginTop: 4, fontSize: 12 }}>
            {errors.password}
          </Text>
        ) : null}
      </View>

      {/* Confirm Password Field */}
      <View style={{ marginBottom: 32 }}>
        <Surface
          elevation={1}
          style={{
            backgroundColor: COLORS.secondary,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
          >
            <Icon source="lock-outline" size={24} color={COLORS.primary} />
            <TextInput
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              placeholderTextColor={COLORS.placeholder}
              textColor={COLORS.primary}
              activeUnderlineColor={COLORS.primary}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              hitSlop={6}
            >
              <Icon
                source={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={COLORS.primary}
              />
            </Pressable>
          </View>
        </Surface>
        {errors.confirmPassword ? (
          <Text style={{ color: COLORS.primary, marginTop: 4, fontSize: 12 }}>
            {errors.confirmPassword}
          </Text>
        ) : null}
      </View>

      {/* Sign Up Button */}
      <Button
        mode="contained"
        onPress={handleSignup}
        labelStyle={{
          color: COLORS.background,
          fontSize: 24,
          fontWeight: "700",
        }}
        style={{
          backgroundColor: COLORS.secondary,
          paddingVertical: 8,
          marginBottom: 16,
          borderRadius: 16,
        }}
      >
        Đăng ký
      </Button>

      {/* Login Link */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: COLORS.secondary, fontSize: 16 }}>
          Đã có tài khoản?{" "}
        </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              color: COLORS.primary,
              fontWeight: "bold",
              fontSize: 16,
              textDecorationLine: "underline",
            }}
          >
            Đăng nhập
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
