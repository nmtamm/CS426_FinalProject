import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { COLORS } from "../theme/colors";
import { scale } from "../utils/responsive";

import CustomizedRecipesScreen from "../screens/main/CustomizedRecipesScreen";
import DashboardScreen from "../screens/main/DashboardScreen";
import FavouriteRecipesScreen from "../screens/main/FavouriteRecipesScreen";

import HomeIcon from "../../assets/icons/home-icon.svg";
import FavouriteIcon from "../../assets/icons/favourite-icon.svg";
import CustomizedRecipeIcon from "../../assets/icons/customize-icon.svg";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,

        // Hide text under icons
        tabBarShowLabel: false,

        // Icon colors
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.disabled,

        // Bottom bar
        tabBarStyle: {
          position: "absolute",

          left: scale(55),
          right: scale(55),
          bottom: scale(150),

          height: scale(110),

          backgroundColor: COLORS.secondary,

          borderWidth: scale(2),
          borderColor: COLORS.black,

          borderRadius: scale(30),

          // Remove default top border
          borderTopWidth: scale(2),

          // Remove shadow
          elevation: 0,
          shadowOpacity: 0,

          paddingTop: scale(12),
          paddingBottom: scale(12),
          marginHorizontal: scale(60)
        },

        tabBarItemStyle: {
          height: scale(100),
          justifyContent: "center",
          alignItems: "center",
          marginTop: 3
        },

        tabBarIcon: ({ focused }) => {
          const iconColor = focused
            ? COLORS.accent
            : COLORS.disabled;

          if (route.name === "CustomizedRecipes") {
            return (
              <CustomizedRecipeIcon
                width={scale(48)}
                height={scale(48)}
                color={iconColor}
              />
            );
          }

          if (route.name === "Dashboard") {
            return (
              <HomeIcon
                width={scale(65)}
                height={scale(65)}
                color={iconColor}
              />
            );
          }

          if (route.name === "FavouriteRecipes") {
            return (
              <FavouriteIcon
                width={scale(48)}
                height={scale(48)}
                color={iconColor}
              />
            );
          }

          return null;
        },
      })}
    >
      <Tab.Screen
        name="CustomizedRecipes"
        component={CustomizedRecipesScreen}
      />

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="FavouriteRecipes"
        component={FavouriteRecipesScreen}
      />
    </Tab.Navigator>
  );
}