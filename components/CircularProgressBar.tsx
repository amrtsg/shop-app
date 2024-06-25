/* 
Animated circular bar 

NOTE: This does not work on web due to:
react-native-svg

*/

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '@/components/Colors';

const CircularProgressBar = ({ size, width, progress, backFill, children }) => {
  const radius = (size - width) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress, animValue]);

  const animatedStrokeDashoffset = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const getColor = () => {
    const red = Math.min(255, Math.round(255 * (100 - progress) / 50));
    const green = Math.min(255, Math.round(255 * progress / 50));
    return `rgb(${red}, ${green}, 0)`;
  };

  const stroke = backFill || Colors.textlight;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          stroke={stroke}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={width}
        />
        <AnimatedCircle
          stroke={getColor()}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={width}
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          transform={`scale(1, -1) translate(0, -${size})`}
        />
      </Svg>
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  childrenContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgressBar;
