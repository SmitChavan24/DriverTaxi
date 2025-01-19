import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Signup from '../../assets/images/EnterOTP.png';
import Contact from '../../assets/images/contact.png';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';

const OtpScreen = (props: any) => {
  const [otp, setOtp] = useState(['', '', '', '']);

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

  const inputRefs = [];

  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />

      <View style={{width: '80%', alignSelf: 'center'}}>
        <ImageBackground source={Signup} style={styles.backgroundImage} />
        <Text style={styles.textt}>OTP</Text>
        <View style={styles.otpContainer}>
          {otp.map((_, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={otp[index]}
              onChangeText={text => handleChangeText(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              maxLength={1}
              keyboardType="numeric"
              ref={ref => (inputRefs[index] = ref)}
            />
          ))}
        </View>

        <YellowButton
          title="Verify"
          onPress={() => props.navigation.navigate('StartAuth')}
        />
      </View>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginVertical: '5%',
    marginBottom: '8%',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    width: '15%',
    textAlign: 'center',
    fontFamily: colors.fontRegular,
    fontSize: 18,
    padding: 5,
  },

  textt: {
    fontSize: 16,
    fontFamily: colors.fontBold,
    marginTop: 10,
    marginBottom: 17,
    // textDecorationLine: 'underline',
  },
  text: {
    fontSize: 14,
    fontFamily: colors.fontBold,
    alignSelf: 'flex-end',
    textAlign: 'center',
    marginRight: 15,
    marginBottom: '5%',
    color: '#545454',
    // textDecorationLine: 'underline',
  },

  backgroundImage: {
    width: (colors.width * 80) / 100,
    height: (colors.height * 35) / 100,
    resizeMode: 'cover', // Ensures the image covers the screen
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 1,
    padding: 10,
    width: '100%',
    marginBottom: '5%',
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
});
