import Toast from 'react-native-toast-message';
export const showToast = (title = '', type = 'error') => {
  Toast.show({
    type: type,
    position: 'top',
    topOffset: 80,
    visibilityTime: 1000,
    text1: title,
    text2: '',
  });
};
