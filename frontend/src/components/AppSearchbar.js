import { Searchbar } from "react-native-paper";

import { COLORS } from "../theme/colors";

export default function AppSearchbar({
  placeholder,
  value,
  onChangeText,
  borderRadius = 15,
  borderWidth = 1,
  height = 52,
  fontSize = 15,
}) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      elevation={1}
      style={{
        backgroundColor: COLORS.secondary,
        borderRadius,
        borderWidth,
        height,
      }}
      inputStyle={{
        minHeight: 0,
        alignSelf: "center",
        fontSize,
        fontFamily: "Nunito_700Bold",
        color: COLORS.primary,
      }}
      iconColor={COLORS.primary}
      placeholderTextColor={COLORS.placeholder}
    />
  );
}
