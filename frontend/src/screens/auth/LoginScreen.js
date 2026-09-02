import { useState } from "react";

import { Pressable, View } from "react-native";

import { Button, Icon, Surface, Text, TextInput } from "react-native-paper";

import ScreenContainer from "../../components/ScreenContainer";
import { COLORS } from "../../theme/colors";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
      general: "",
    };

    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập không được trống";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được trống";
    }

    setErrors(newErrors);

    return !newErrors.username && !newErrors.password;
  };

  const handleLogin = () => {
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
        variant="displayMedium"
        style={{
          color: COLORS.secondary,
          fontFamily: "Nunito_900Black",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        Đăng nhập
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
              textColor={COLORS.primary}
              activeUnderlineColor={COLORS.primary}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingHorizontal: 8,
              }}
              contentStyle={{
                fontFamily: "Nunito_700Bold",
                fontSize: 16,
              }}
              placeholderTextColor={COLORS.placeholder}
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
              textColor={COLORS.primary}
              activeUnderlineColor={COLORS.primary}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                paddingHorizontal: 8,
              }}
              contentStyle={{
                fontFamily: "Nunito_700Bold",
                fontSize: 16,
              }}
              placeholderTextColor="#aaa"
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

      {/* Forgot Password Link */}
      <Text
        style={{
          color: COLORS.primary,
          fontSize: 14,
          fontFamily: "Nunito_700Bold",
          textAlign: "right",
          marginBottom: 32,
          textDecorationLine: "underline",
        }}
      >
        Quên mật khẩu?
      </Text>

      {/* Login Button */}
      <Button
        mode="contained"
        onPress={handleLogin}
        labelStyle={{
          color: COLORS.background,
          fontSize: 24,
          fontFamily: "Nunito_800ExtraBold",
        }}
        style={{
          backgroundColor: COLORS.secondary,
          paddingVertical: 8,
          marginBottom: 16,
          borderRadius: 16,
        }}
      >
        Đăng nhập
      </Button>

      {/* Sign Up Link */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: COLORS.secondary, fontSize: 16 }}>
          Chưa có tài khoản?{" "}
        </Text>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: "Nunito_700Bold",
              fontSize: 16,
              textDecorationLine: "underline",
            }}
          >
            Đăng ký
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
