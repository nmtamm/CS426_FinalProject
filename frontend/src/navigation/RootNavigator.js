import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

import CustomRecipeScreen from "../screens/recipe/CustomRecipeScreen";
import RecipeDetailScreen from "../screens/recipe/RecipeDetailScreen";
import SaveSuccessfullyScreen from "../screens/recipe/SaveSuccessfullyScreen";
import SearchIngredientScreen from "../screens/search/SearchIngredientScreen";
import SearchRecipeByNameScreen from "../screens/search/SearchRecipeByNameScreen";
import SearchRecipesByIngredientsScreen from "../screens/search/SearchRecipesByIngredientsScreen";

import MainTabNavigator from "./MainTabNavigator";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="SearchIngredient"
        component={SearchIngredientScreen}
      />

      <Stack.Screen
        name="SearchRecipesByIngredients"
        component={SearchRecipesByIngredientsScreen}
      />

      <Stack.Screen
        name="SearchRecipeByName"
        component={SearchRecipeByNameScreen}
      />
      
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
      />

      <Stack.Screen
        name="CustomRecipe"
        component={CustomRecipeScreen}
      />

      <Stack.Screen
        name="SaveSuccessfully"
        component={SaveSuccessfullyScreen}
      />
    </Stack.Navigator>
  );
}