import React, { useState, useEffect, useRef } from "react";
import { LayoutRectangle, LayoutChangeEvent, Dimensions } from "react-native";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export type RouteProps = {
  id: number;
  name: string;
  [key: string]: any;
};

export type NavigationTabsProps = {
  id: number;
  name: string;
  [key: string]: any;
};

export type HorizontalScrollMenu = {
  items: Array<NavigationTabsProps>;
  onPress: (route: RouteProps) => void;
  upperCase?: boolean;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  activeButtonStyle?: StyleProp<ViewStyle>;
  selected: number;
  scrollAreaStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled";
  itemWidth?: number;
};

const HorizontalScrollMenu: React.FC<HorizontalScrollMenu> = ({
  items,
  onPress,
  upperCase = false,
  textStyle,
  buttonStyle,
  activeTextStyle,
  activeButtonStyle,
  selected = 0,
  scrollAreaStyle,
  keyboardShouldPersistTaps = "always",
  itemWidth = 100,
}) => {
  const [index, setIndex] = useState<number>(selected);
  const [cords, setCords] = useState<LayoutRectangle>();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (selected != index) {
      setIndex(selected);
      scrollToPosition();
    }

    if (selected) {
      setIndex(selected);
      scrollToPosition();
    }
  }, [selected]);

  const scrollToDefaultIndex = () => {
    let x =
      (itemWidth + 10) * selected - (screenWidth - 20) / 2 + itemWidth / 2;
    if (scrollViewRef.current !== null) {
      scrollViewRef.current.scrollTo({
        x: x,
        y: 0,
        animated: true,
      });
    }
  };

  const scrollToPosition = () => {
    let x =
      (itemWidth + 10) * selected - (screenWidth - 20) / 2 + itemWidth / 2;
    if (cords !== undefined && scrollViewRef.current !== null) {
      scrollViewRef.current.scrollTo({
        x: x,
        y: 0,
        animated: true,
      });
    }
  };

  const onLayoutScrollView = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;

    setTimeout(scrollToDefaultIndex, 0);
    setCords(layout);
  };

  const centerPadding = 0;

  return (
    <View style={[scrollAreaStyle, styles.scrollAreaStyle]}>
      <ScrollView
        ref={scrollViewRef}
        bounces={true}
        horizontal={true}
        pagingEnabled={false}
        contentContainerStyle={[
          styles.contentContainerStyle,
          { paddingHorizontal: 5 },
        ]}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={200}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {items.map((route, i) => (
          <Pressable
            style={[
              styles.tabItem,
              { width: itemWidth },
              index === route.id && styles.tabItemFocused,
              buttonStyle ? buttonStyle : styles.buttonStyles,
              index === route.id && activeButtonStyle
                ? activeButtonStyle
                : false,
            ]}
            key={(route.id ? route.id : i).toString()}
            onPress={() => {
              scrollToPosition();
              return onPress(route);
            }}
            onLayout={onLayoutScrollView}
          >
            <Text
              style={[
                textStyle ? textStyle : styles.tabItemText,
                index == route.id && styles.tabItemTextFocused,
                index == route.id && activeTextStyle ? activeTextStyle : false,
              ]}
              numberOfLines={1}
            >
              {upperCase ? route.name.toUpperCase() : route.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  tabItemText: {
    color: "#8C8C8C",
  },
  tabItemFocused: {
    borderWidth: 0,
  },
  tabItemTextFocused: {
    color: "#FFFFFF",
  },
  buttonStyles: {
    marginHorizontal: 5,
  },
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollAreaStyle: {
    height: 50,
  },
});

export default HorizontalScrollMenu;
