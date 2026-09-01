import { useState } from "react";

import { Alert, Pressable, View } from "react-native";

import { Button, Icon, Surface, Text, TextInput } from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
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
      Alert.alert("Thành công", `Đăng nhập tài khoản: ${username}`);
      // Reset form
      setUsername("");
      setPassword("");
      setErrors({
        username: "",
        password: "",
        general: "",
      });
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#afc490" }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 640,
          alignSelf: "center",
          paddingHorizontal: 16,
          justifyContent: "center",
        }}
      >
        {/* Header */}
        <Text
          variant="displaySmall"
          className="text-white font-extrabold text-center mb-12"
        >
          Đăng nhập
        </Text>

        {/* Username Field */}
        <View className="mb-6">
          <Surface
            elevation={1}
            style={{
              backgroundColor: "#f5f0eb",
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: "#2d2d2d",
            }}
          >
            <View className="flex-row items-center px-4 py-1">
              <Icon source="information-outline" size={24} color="#c65d42" />
              <TextInput
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  paddingHorizontal: 8,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
                placeholderTextColor="#aaa"
              />
            </View>
          </Surface>
          {errors.username && (
            <Text style={{ color: "#c65d42", marginTop: 4, fontSize: 12 }}>
              {errors.username}
            </Text>
          )}
        </View>

        {/* Password Field */}
        <View className="mb-6">
          <Surface
            elevation={1}
            style={{
              backgroundColor: "#f5f0eb",
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: "#2d2d2d",
            }}
          >
            <View className="flex-row items-center px-4 py-1">
              <Icon source="lock-outline" size={24} color="#c65d42" />
              <TextInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  paddingHorizontal: 8,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
                placeholderTextColor="#aaa"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  source={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#c65d42"
                />
              </Pressable>
            </View>
          </Surface>
          {errors.password && (
            <Text style={{ color: "#c65d42", marginTop: 4, fontSize: 12 }}>
              {errors.password}
            </Text>
          )}
        </View>

        {/* Forgot Password Link */}
        <Pressable className="mb-6">
          <Text style={{ color: "#c65d42", textAlign: "right", fontSize: 12 }}>
            Quên mật khẩu?
          </Text>
        </Pressable>

        {/* General Error Message */}
        {errors.general && (
          <Text style={{ color: "#c65d42", marginBottom: 12, fontSize: 12 }}>
            {errors.general}
          </Text>
        )}

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          style={{
            paddingVertical: 8,
            backgroundColor: "#f5f0eb",
          }}
          labelStyle={{ color: "#2d2d2d", fontSize: 16, fontWeight: "bold" }}
        >
          Đăng nhập
        </Button>
      </View>
    </SafeAreaView>
  );
}
