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
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {API_URL, DEV_URL} from '@env';
import Signup from '../../assets/images/LoginLock.png';
import Contact from '../../assets/images/contact.png';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';
import useAuth from '../../utils/useAuth';
import axios from 'axios';
import {showToast} from '../../modules/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhoneVerify = (props: any) => {
  const RegEmail = props.route.params.user.id;
  console.log(RegEmail, 'draiiai');
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const {user, signUp, logIn, signInWithOAuth} = useAuth();
  const [watch, setWatch] = useState(true);

  useEffect(() => {
    const GetLocal = async () => {
      const userData = await AsyncStorage.getItem('auth-token');

      console.log(userData, 'session');
      // setCustomerId(userData);
    };
    GetLocal();
    // const parseUserData = JSON.parse(userData);
    // const customer_id = parseUserData.user.id;
    // setCustomerId(customer_id);
  }, []);

  const handleSendOtp = async () => {
    setError(''); // Clear previous error before new request

    if (phone.length !== 10) {
      showToast('Please enter a valid 10-digit phone number');
      return;
    }
    // props.navigation.navigate('VerifyScreen');

    try {
      const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
        userId: RegEmail,
        userType: 'Driver',
      });
      console.log(response.data.otp);
      if (response.status === 200) {
        // setOtpSent(true);
        // setIsOtpValid(true); // Mark OTP as valid
        setCountdown(60); // Start the countdown
        showToast('Successfully sent OTP to your email!');
        props.navigation.navigate('OtpScreen', {data: response.data, phone});
      } else {
        showToast(`Failed to send OTP: ${response.data.error}`);
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred while sending OTP');
    }
  };

  const onChange = (text: any) => {
    // if (name === 'password' && !watch) {
    //   console.log('2');
    //   setWatch(true);
    // }
    setPhone(text);
  };
  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />

      <NavigationBackComponent onPress={() => props.navigation.goBack()} />
      <View style={{width: '80%', alignSelf: 'center'}}>
        <ImageBackground source={Signup} style={styles.backgroundImage} />
        <Text style={styles.textt}>Let's Sign In </Text>

        <View style={styles.inputContainer}>
          <Image source={Contact} style={{marginRight: 10}}></Image>

          <TextInput
            keyboardType="numeric"
            style={styles.textInput}
            maxLength={10}
            placeholder="Type your phone number"
            placeholderTextColor="#9D9393"
            cursorColor="black"
            onChangeText={text => onChange(text)}
            // keyboardType="phone-pad"
          />
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '2%',
            //   marginLeft: '20%',
          }}
          onPress={() => setIsChecked(!isChecked)}>
          <Icon name="checkcircleo" color={colors.blue} size={15} />
          <Text style={styles.text}>Remember Me</Text>
        </TouchableOpacity>
        <YellowButton title="Sign In" onPress={handleSendOtp} />
        {/* <Text style={styles.textf}>
          Don’t have an account?
          <Text
            style={{
              color: '#000000',
              fontSize: 16,
              fontFamily: colors.fontBold,
              textAlign: 'center',
            }}
            onPress={() => console.log('first')}>
            {' Sign up'}
          </Text>
        </Text> */}
      </View>
    </View>
  );
};

export default PhoneVerify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
  cursor: {
    width: 1, // Thin vertical line
    height: 25, // Adjust height for the desired size
    backgroundColor: '#B7AAAA', // Cursor color
  },
  textf: {
    fontSize: 16,
    fontFamily: colors.fontBold,
    marginBottom: 10,
    color: '#494949',
    textAlign: 'center',
    // textDecorationLine: 'underline',
  },
  textt: {
    fontSize: 16,
    fontFamily: colors.fontBold,
    marginBottom: 17,
    // textDecorationLine: 'underline',
  },
  text: {
    fontSize: 14,
    fontFamily: colors.fontBold,
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 7,
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
  countryCode: {
    fontSize: 14,
    fontFamily: colors.fontRegular,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 5,
    fontFamily: colors.fontRegular,
    color: '#000000',
    fontSize: 16,
  },
});
