import Toast from 'react-native-toast-message';
export const showToast = (title = '', type = 'error', time = 1000) => {
  Toast.show({
    type: type,
    position: 'top',
    topOffset: 80,
    visibilityTime: time,
    text1: title,
    text2: '',
  });
};
