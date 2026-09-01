import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import DashboardScreen from "../screens/main/DashboardScreen";
import CustomizedRecipesScreen from "../screens/main/CustomizedRecipesScreen";
import FavouriteRecipesScreen from "../screens/main/FavouriteRecipesScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home";
          }

          if (route.name === "CustomizedRecipes") {
            iconName = "book-edit";
          }

          if (route.name === "FavouriteRecipes") {
            iconName = "heart";
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="CustomizedRecipes"
        component={CustomizedRecipesScreen}
        options={{
          title: "My Recipes",
        }}
      />

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Home",
        }}
      />

      <Tab.Screen
        name="FavouriteRecipes"
        component={FavouriteRecipesScreen}
        options={{
          title: "Favourite",
        }}
      />
    </Tab.Navigator>
  );
}