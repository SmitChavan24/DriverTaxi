import {View, Text, TouchableOpacity, StatusBar, TextInput} from 'react-native';
import React, {useState} from 'react';
import {Modal} from 'react-native';
import CheckBox from 'react-native-check-box';
import Icon2 from 'react-native-vector-icons/Ionicons';
import colors from '../utils/globalColors';
import {API_URL, DEV_URL} from '@env';
import YellowButton from '../components/YellowButton';
import {showToast} from './Toast';
import axios from 'axios';

const OtpModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [];

  const validateOTP = async otpString => {
    // console.log('Entered OTP: ', otpString.trim());
    // console.log(tripId);
    if (otp.join('').length !== 4) {
      showToast('OTP Incorrect');
      return;
    }
    setLoading(true);

    try {
      console.log('Calling verify otp');
      const response = await axios.post(`${DEV_URL}/api/trips/validate-otp`, {
        trip_id: props?.tripdata?.trip_id,
        otp: otp.join(''),
      });
      console.log(response, 'Tis is respo');
      if (response.data.success) {
        console.log(response.data.success);
        showToast('OTP VERIFIED', 'success', 8000);
        props.onPress();
      }
    } catch (error) {
      console.log(error, 'tidss ');
      showToast(error.response?.data?.error || 'Failed to validate OTP');
      // Clear OTP inputs on error
    } finally {
      setLoading(false);
    }
  };
  const handleChangeText = (text: any, index: any) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus the next input field
    if (text && index < otp.length - 1) {
      inputRefs[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].focus();
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={props?.visible}
      statusBarTranslucent
      transparent={true}>
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000060',
        }}>
        <View
          style={{
            width: '90%',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            alignItems: 'center',
            // zIndex: 1,
          }}>
          <Text
            style={{
              width: '90%',
              alignSelf: 'center',
              textAlign: 'center',
              color: colors.black,
              fontSize: 20,
              fontFamily: colors.fontBold,
              marginTop: '17%',
              lineHeight: 26,
            }}>
            Confirm OTP to Start Ride
          </Text>
          <Text
            style={{
              width: '85%',
              alignSelf: 'center',
              textAlign: 'left',
              color: colors.grey,
              fontSize: 18,
              fontFamily: colors.fontRegular,
              marginTop: '10%',
              marginBottom: '5%',
              lineHeight: 26,
            }}>
            Please enter the OTP provided by the customer to confirm the ride.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
              alignSelf: 'center',
              marginVertical: '5%',
              marginBottom: '8%',
            }}>
            {otp?.map((_, index) => (
              <TextInput
                key={index}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#000000',
                  width: '15%',
                  textAlign: 'center',
                  fontFamily: colors.fontRegular,
                  fontSize: 18,
                  padding: 5,
                }}
                value={otp[index]}
                onChangeText={text => handleChangeText(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="numeric"
                ref={ref => (inputRefs[index] = ref)}
              />
            ))}
          </View>

          <Text
            style={{
              alignSelf: 'flex-end',
              marginRight: '11%',
              marginBottom: '7%',
            }}>
            Resend OTP ?
          </Text>
          <YellowButton
            title="Confirm OTP"
            // hideIcon={false}
            addStyle={{marginHorizontal: 20, marginBottom: '10%'}}
            // color={{marginVertical: 10}}
            onPress={validateOTP}
          />
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;
