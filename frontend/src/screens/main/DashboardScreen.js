import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  Image
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../theme/colors";
import { scale } from "../../utils/responsive";

import ProfileIcon from "../../../assets/icons/profile-icon.svg";


export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.primary}
      />

      <View style={styles.content}>
        {/* Welcome */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.greeting}>
              {getGreeting()}
            </Text>

            <Text
              style={styles.username}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              TTH
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={({ pressed }) => [
              styles.profileButton            ]}
          >
            <ProfileIcon
              width={scale(62)}
              height={scale(62)}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        {/* Question */}
        <Text style={styles.question}>
          Ăn món gì đây ta?
        </Text>

        {/* Choices */}
        <View style={styles.choiceRow}>
          {/* Recipe */}
          <Pressable
            style={styles.choice}
            onPress={() =>
              navigation.navigate("SearchRecipeByName")
            }
          >
            <View style={styles.choiceBox}>
              <Image
                source={require("../../../assets/icons/dish-icon.png")}
                style={styles.choiceImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.choiceText}>
              Công thức
            </Text>
          </Pressable>

          {/* Ingredient */}
          <Pressable
            style={styles.choice}
            onPress={() =>
              navigation.navigate("SearchIngredient")
            }
          >
            <View style={styles.choiceBox}>
              <Image
                source={require("../../../assets/icons/ingredient-icon.png")}
                style={styles.choiceImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.choiceText}>
              Nguyên liệu
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: scale(60),
    paddingTop: scale(55),
  },

  // =========================
  // Welcome
  // =========================

  welcomeCard: {
    height: scale(130),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(2),
    borderColor: COLORS.black,
    borderRadius: scale(30),

    paddingHorizontal: scale(50),

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcomeTextContainer: {
    flex: 1,
    minWidth: 0,

    marginRight: scale(20),
  },

  greeting: {
    color: COLORS.black,
    fontSize: scale(30),
  },

  username: {
    marginTop: scale(4),

    color: COLORS.black,
    fontSize: scale(32),
    fontFamily: "Nunito_800ExtraBold",
  },

  profileButton: {
    width: scale(80),
    height: scale(80),

    justifyContent: "center",
    alignItems: "center",
  },

  // =========================
  // Question
  // =========================

  question: {
    marginTop: scale(220),

    color: COLORS.secondary,
    fontSize: scale(50),
    fontFamily: "Nunito_900Black",

    textAlign: "center",
  },

  // =========================
  // Choices
  // =========================

  choiceRow: {
    marginTop: scale(90),
    paddingHorizontal: scale(20),

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  choice: {
    width: scale(235),
    alignItems: "center",
  },

  choiceBox: {
    width: scale(230),
    height: scale(230),

    backgroundColor: COLORS.secondary,

    borderWidth: scale(4),
    borderColor: COLORS.black,
    borderRadius: scale(55),

    justifyContent: "center",
    alignItems: "center",
  },

  choiceImage: {
    width: scale(150),
    height: scale(150),
  },

  choiceText: {
    marginTop: scale(24),

    color: COLORS.secondary,
    fontSize: scale(40),
    fontFamily: "Nunito_800ExtraBold",

    textAlign: "center",
  },
});


const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return "Chào buổi sáng!";
  }

  if (hour >= 11 && hour < 13) {
    return "Chào buổi trưa!";
  }

  if (hour >= 13 && hour < 18) {
    return "Chào buổi chiều!";
  }

  return "Chào buổi tối!";
};