import { View } from "react-native";

import { COLORS } from "../theme/colors";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreenContainer({
  children,
  edges = ["top", "bottom", "left", "right"],
  style,
  contentStyle,
}) {
  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: COLORS.background }, style]}
    >
      <View
        style={[
          { flex: 1, width: "100%", maxWidth: 640, alignSelf: "center" },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
