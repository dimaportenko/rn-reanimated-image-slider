/**
 * @flow
 * Created by Dima Portenko on 07.06.2020
 */
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';

import Animated, { Easing} from 'react-native-reanimated';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const PATTERN = require('../assets/images/pattern.png');

const ROTATE_DEGREE = Math.PI / 60;

const {
  Value,
  Clock,
  useCode,
  block,
  set,
  startClock,
  clockRunning,
  timing,
  cond,
  stopClock,
  call,
  interpolate,
  Extrapolate,
} = Animated;

const runTiming = (clock, opacities, index, callback, scales, rotates, translations, titleOpacities) => {
  const prevIndex = index > 0 ? index - 1 : opacities.length - 1;
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 8000,
    toValue: new Value(8),
    easing: Easing.linear,
  };

  return block([
    cond(
      clockRunning(clock),
      [
        timing(clock, state, config),
      ],
      startClock(clock),
    ),
    // we run the step here that is going to update position
    // if the animation is over we stop the clock
    cond(state.finished, [
        stopClock(clock),
        call([], callback)
      ], [
        set(opacities[index], interpolate(state.position, {
          inputRange: [0, 3],
          outputRange: [0, 1],
        })),
        set(scales[index], interpolate(state.position, {
          inputRange: [0, 3, 6],
          outputRange: [1, 1.05, 1.1],
          extrapolate: Extrapolate.CLAMP,
        })),
        set(rotates[index], interpolate(state.position, {
          inputRange: [3, 6],
          outputRange: [0, ROTATE_DEGREE],
          extrapolate: Extrapolate.CLAMP,
        })),
        set(opacities[prevIndex], interpolate(state.position, {
          inputRange: [0, 3],
          outputRange: [1, 0],
        })),
        set(titleOpacities[index], interpolate(state.position, {
          inputRange: [0, 2, 6, 7],
          outputRange: [0, 1, 1, 0],
          extrapolate: Extrapolate.CLAMP,
        })),
        set(translations[index], interpolate(state.position, {
          inputRange: [0, 2, 6, 7],
          outputRange: [200, 0, 0, -400],
          extrapolate: Extrapolate.CLAMP,
        })),
      ]
    ),
    // we made the block return the updated position
    state.position,
  ]);
}


export const ImageSlider = ({ title, slides }) => {
  const [index, setIndex] = useState(0);
  const { opacities, clock, scales, rotates, translations, titleOpacities } = useMemo(() => ({
    opacities: slides.map(() => (new Value(0))),
    scales: slides.map(() => (new Value(0))),
    rotates: slides.map(() => (new Value(0))),
    clock: new Clock(),
    titleOpacities: slides.map(() => (new Value(0))),
    translations: slides.map(() => (new Value(0))),
  }), []);

  const next = () => {
    setIndex((index + 1) % slides.length);
  }

  useCode(() => block([
    runTiming(clock, opacities, index, next, scales, rotates, translations, titleOpacities)
  ]), [index]);

  const renderSlides = () => slides.map((slide, i) => {
    return (
      <View style={styles.slide} key={i}>
        <Animated.View
          style={{
            opacity: opacities[i],
            transform: [{
              scale: scales[i],
              rotate: rotates[i],
            }]
          }}
        >
          <Image
            style={styles.imageStyle}
            resizeMode="cover"
            source={slide.image}
          />
        </Animated.View>

        <Animated.View style={{
          ...StyleSheet.absoluteFillObject,
          opacity: opacities[i],
        }}>
          <Image
            style={{
              width: WINDOW_WIDTH,
              height: WINDOW_HEIGHT,
            }}
            width={WINDOW_WIDTH}
            height={WINDOW_HEIGHT}
            source={PATTERN}
            resizeMode="repeat"
          />
        </Animated.View>

        <Animated.View style={[
          styles.slideTitleWrap, {
            opacity: titleOpacities[i],
            transform: [{
              translateX: translations[i],
            }]
          }
        ]}>
          <Text style={styles.slideTitle}>{slide.title?.toUpperCase()}</Text>
        </Animated.View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      {renderSlides()}
      <Text style={styles.title}>{title?.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    position: 'absolute',
  },
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    marginTop: WINDOW_HEIGHT * 0.02,
    marginHorizontal: WINDOW_WIDTH * 0.15,
    fontSize: 35,
    color: 'white',
    textAlign: 'center',
    position: 'absolute'
  },
  slideTitleWrap: {
    marginLeft: WINDOW_WIDTH * 0.1,
    right: WINDOW_HEIGHT * 0.02,
    bottom: WINDOW_HEIGHT * 0.05,
    position: 'absolute',
  },
  slideTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 40,
    color: 'white',
    textAlign: 'right',
  },
  imageStyle: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    top: 0,
  },
});
