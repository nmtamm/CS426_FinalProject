import { Pressable, View } from "react-native";

import { Icon, Text } from "react-native-paper";

import { COLORS } from "../theme/colors";

export default function ScreenHeader({
  title,

  onLeftPress,
  leftIconName,
  LeftIconSvg,
  LeftIconSize = 24,

  onRightPress,
  rightIconName,
  RightIconSvg,
  RightIconSize = 24,

  variant = "titleLarge",
  titleClassName,
}) {
  const renderButton = ({ onPress, iconName, SvgIcon, iconSize }) => {
    if (!onPress || (!iconName && !SvgIcon)) {
      return <View style={{ width: 40, height: 40 }} />;
    }

    return (
      <Pressable
        hitSlop={8}
        className="active:opacity-60"
        onPress={onPress}
        style={{
          width: 40,
          height: 40,
          borderRadius: 9999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.secondary,
        }}
      >
        {SvgIcon ? (
          <SvgIcon
            width={iconSize}
            height={iconSize}
            color={COLORS.primary}
          />
        ) : (
          <Icon
            source={iconName}
            size={iconSize}
            color={COLORS.primary}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {renderButton({
        onPress: onLeftPress,
        iconName: leftIconName,
        SvgIcon: LeftIconSvg,
        iconSize: LeftIconSize
      })}

      <Text
        variant={variant}
        className={titleClassName}
        numberOfLines={1}
        style={{
          flex: 1,
          textAlign: "center",
          color: COLORS.secondary,
          fontSize: 25,
          fontFamily: "Nunito_900Black",
        }}
      >
        {title}
      </Text>

      {renderButton({
        onPress: onRightPress,
        iconName: rightIconName,
        SvgIcon: RightIconSvg,
        iconSize: RightIconSize
      })}
    </View>
  );
}
