import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import CheckBox from 'react-native-check-box';
import Icon2 from 'react-native-vector-icons/Ionicons';
import colors from '../utils/globalColors';
import {showToast} from './Toast';
import axios from 'axios';

const SuccessModal = (props: any) => {
  return (
    <Modal
      animationType="slide"
      visible={props?.visible}
      statusBarTranslucent
      transparent={true}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: '#00000060',
        }}
        onPress={props.modalPress}
      />
      <View
        style={{
          width: '90%',
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          alignItems: 'center',
          borderColor: '#887F7F99',
          borderWidth: 1,
          alignSelf: 'center',
          marginTop: '40%',
          // zIndex: 1,
        }}>
        <Image
          source={props?.popupDetail?.imageSrc}
          style={{marginTop: '10%'}}></Image>
        <Text
          style={{
            width: '85%',
            alignSelf: 'center',
            textAlign: 'center',
            color: colors.black,
            fontSize: 18,
            fontFamily: colors.fontSemiBold,
            marginTop: '10%',
            marginBottom: '10%',
            lineHeight: 26,
          }}>
          {props?.popupDetail?.text}
        </Text>
      </View>
    </Modal>
  );
};

export default SuccessModal;
