import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Width of your Dashboard design
const DESIGN_WIDTH = 700;

export const scale = (size) => {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
};