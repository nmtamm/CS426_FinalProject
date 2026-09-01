import { useState } from "react";

import { Pressable, View } from "react-native";

import { Button, Icon, Surface, Text, TextInput } from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#a3b18a" }}
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
          style={{color: '#f6f2e8'}}
          className="font-extrabold text-center mb-12"
        >
          Đăng nhập
        </Text>

        {/* Username Field */}
        <View className="mb-6">
          <Surface
            elevation={1}
            style={{
              backgroundColor: "#f6f2e8",
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
                  fontSize: 16,
                }}
                placeholderTextColor="#bebebe"
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
              backgroundColor: "#f6f2e8",
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
        <Text className="text-red-500 text-sm text-right mb-8 underline">
          Quên mật khẩu?
        </Text>

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          labelStyle={{ color: "#a3b18a", fontSize: 16, fontWeight: "700" }}
          style={{
            backgroundColor: "#f6f2e8",
            paddingVertical: 8,
            marginBottom: 16,
            borderRadius: 16,
          }}
        >
          Đăng nhập
        </Button>

        {/* Sign Up Link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-white text-base">Chưa có tài khoản? </Text>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text className="text-red-500 font-bold text-base underline">
              Đăng ký
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
