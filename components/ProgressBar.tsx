import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Colors from '@/components/Colors';

export const ProgressBar = ({ progress }) => {
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const getColor = () => {
    // Calculate color based on progress percentage
    const red = Math.min(255, Math.round(255 * (100 - progress) / 50));
    const green = Math.min(255, Math.round(255 * progress / 50));

    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <View style={styles.progressBarBackground}>
      <Animated.View style={[
        styles.progressBar,
        { backgroundColor: getColor(), width: progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%']
        })}
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarBackground: {
    height: 15,
    borderRadius: 5,
    width: '100%',
    backgroundColor: Colors.transdark3, // Background color of the progress bar
    overflow: 'hidden', // Ensures the progress bar stays within the background container
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
});
