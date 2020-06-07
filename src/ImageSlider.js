/**
 * @flow
 * Created by Dima Portenko on 07.06.2020
 */
import React from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const PATTERN = require('../assets/images/pattern.png');

export const ImageSlider = ({ title, slides }) => {

  const renderSlides = () => slides.map((slide, i) => {
    return (
      <View style={styles.slide} key={i}>
        <View>
          <Image
            style={styles.imageStyle}
            resizeMode="cover"
            source={slide.image}
          />
        </View>

        <View style={{
          ...StyleSheet.absoluteFillObject,
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
        </View>


        <View style={[styles.slideTitleWrap]}>
          <Text style={styles.slideTitle}>{slide.title?.toUpperCase()}</Text>
        </View>
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
