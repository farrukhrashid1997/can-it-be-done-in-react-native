import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  add,
  and,
  clockRunning,
  cond,
  debug,
  divide,
  eq,
  floor,
  not,
  set,
  useCode,
} from "react-native-reanimated";
import {
  snapPoint,
  timing,
  useClock,
  usePanGestureHandler,
  useValue,
} from "react-native-redash";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import ImageViewer, { CANVAS } from "./ImageViewer";

export const assets = [
  require("./assets/3.jpg"),
  require("./assets/2.jpg"),
  require("./assets/4.jpg"),
  require("./assets/5.jpg"),
  require("./assets/1.jpg"),
];

const { x: width, y: height } = CANVAS;
const snapPoints = assets.map((_, i) => -width * i);
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  pictures: {
    flexDirection: "row",
    height,
    width: width * assets.length,
  },
});

const WhatsApp = () => {
  const clock = useClock();
  const index = useValue(0);
  const offsetX = useValue(0);
  const translateX = useValue(0);
  const {
    gestureHandler,
    translation,
    velocity,
    state,
  } = usePanGestureHandler();
  const snapTo = snapPoint(translateX, velocity.x, snapPoints);
  useCode(
    () => [
      cond(eq(state, State.END), [
        set(translateX, timing({ clock, from: translateX, to: snapTo })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          set(index, floor(divide(translateX, -width))),
        ]),
      ]),
    ],
    []
  );
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View style={styles.container}>
        <Animated.View
          style={[styles.pictures, { transform: [{ translateX }] }]}
        >
          {assets.map((source, i) => (
            <ImageViewer
              key={source}
              isActive={and(eq(index, i), eq(state, State.ACTIVE))}
              translationX={add(offsetX, translation.x)}
              {...{ source, translateX }}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default WhatsApp;