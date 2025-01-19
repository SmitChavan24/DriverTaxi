import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const paddingHelper = (positionType: string = 'TOP') => {
  if (positionType === 'TOP') {
    if (Platform.OS === 'ios') {
      if (DeviceInfo?.hasNotch()) {
        return '8%';
      } else {
        return '2%';
      }
    } else {
      if (DeviceInfo?.hasNotch()) {
        return '8%';
      } else {
        return '8%';
      }
    }
  } else {
    if (Platform.OS === 'android') {
      return '8%';
    } else {
      return '0%';
    }
  }
};

export default paddingHelper;
