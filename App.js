/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { ImageSlider } from './src/ImageSlider';
import { sliderData } from './src/data';

const App: () => React$Node = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageSlider {...sliderData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default App;
