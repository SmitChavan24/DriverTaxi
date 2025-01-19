import {Dimensions, Platform, StatusBar} from 'react-native';

const compareDeviceHeight = () => {
  const SCREEN_HEIGHT = Dimensions.get('screen').height;
  const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
  const WINDOW_HEIGHT = Dimensions.get('window').height;
  const PADDING = 20;

  if (Platform.OS === 'ios') {
    return '0%';
  } else {
    if (SCREEN_HEIGHT - WINDOW_HEIGHT - STATUS_BAR_HEIGHT - PADDING > 0) {
      return '8%';
    } else {
      return '0%';
    }
  }
};

export default compareDeviceHeight;
