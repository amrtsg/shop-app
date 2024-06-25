import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

const rad = deg => deg * (Math.PI / 180);

class SineWave extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.ctx = null;
  }
  
  shouldComponentUpdate(nextProps) {
    const { width, height, start, offset } = this.props;
    return nextProps.width !== width || nextProps.height !== height || nextProps.start !== start || nextProps.offset !== offset;
  }

  componentDidMount() {
    this.ctx = this.canvas.current.getContext('2d');
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    const { start, width, height, amplitude, frequency, topColor, bottomColor, offset } = this.props;
    this.ctx.clearRect(0, 0, width, height);

    const mid = height / 2 + offset; // Adjust the middle line by the offset
    const y = d => amplitude * Math.sin(rad(frequency * d));

    // Draw the sine wave
    this.ctx.beginPath();
    this.ctx.moveTo(0, mid - y(start));
    for (let x = 0; x <= width; x += 1) {
      this.ctx.lineTo(x, mid - y(start + x));
    }
    this.ctx.lineTo(width, 0);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    
    // Fill the area above the sine wave with bottomColor
    this.ctx.fillStyle = topColor;
    this.ctx.fill();

    // Draw the sine wave again for the clipping path
    this.ctx.beginPath();
    this.ctx.moveTo(0, mid - y(start));
    for (let x = 0; x <= width; x += 1) {
      this.ctx.lineTo(x, mid - y(start + x));
    }
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();

    // Fill the area below the sine wave with topColor
    this.ctx.save();
    this.ctx.clip();
    this.ctx.fillStyle = bottomColor;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }

  render() {
    const { width, height } = this.props;
    return (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <canvas ref={this.canvas} width={width} height={height} />
      </View>
    );
  }
}

const AnimatedSineWave = ({ speed, ...props }) => {
  const [start, setStart] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStart(prevStart => (prevStart + speed) % (360 / props.frequency));
    }, 16);

    return () => clearInterval(interval);
  }, [speed, props.frequency]);

  return <SineWave start={start} {...props} />;
};

const { width, height } = Dimensions.get('window');

const SineCurveOverlay = ({ topColor, bottomColor, offset }) => {
  const config = {
    width: width,
    height: height,
    amplitude: 10,
    frequency: 1,
    topColor: topColor,
    bottomColor: bottomColor,
    offset: offset || 0, // Default offset to 0 if not provided
  };

  return (
    <View style={styles.container}>
      <AnimatedSineWave speed={1} {...config} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SineCurveOverlay;
