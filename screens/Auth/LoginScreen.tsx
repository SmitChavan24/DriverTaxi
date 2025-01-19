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

const LoginScreen = (props: any) => {
  const RegEmail = props.route.params?.email;

  const [data, setdata] = useState({email: '', password: ''});
  const [isChecked, setIsChecked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const {user, signUp, logIn, signInWithOAuth} = useAuth();
  const [watch, setWatch] = useState(true);

  useEffect(() => {
    const GetLocal = async () => {
      const userData = await AsyncStorage.getItem(
        'sb-fwuywhqbwsgphzdknhin-auth-token',
      );
      console.log(userData);
    };
    GetLocal();
    // const parseUserData = JSON.parse(userData);
    // const customer_id = parseUserData.user.id;
    // setCustomerId(customer_id);
  }, []);

  const handleSendOtp = async () => {
    setError(''); // Clear previous error before new request

    // if (phoneNumber.length !== 10) {
    //   setError("Please enter a valid 10-digit phone number");
    //   return;
    // }

    try {
      const response = await axios.post('/api/auth/send-otp', {
        userId: customerId,
        userType: 'Customer',
      });
      console.log(response);
      if (response.status === 200) {
        // setOtpSent(true);
        // setIsOtpValid(true); // Mark OTP as valid
        setCountdown(60); // Start the countdown
        showToast('Successfully sent OTP to your email!');
      } else {
        showToast(`Failed to send OTP: ${response.data.error}`);
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred while sending OTP');
    }
  };
  const onChange = (name: any, text: any) => {
    // if (name === 'password' && !watch) {
    //   console.log('2');
    //   setWatch(true);
    // }
    setdata({
      ...data,
      [name]: text,
    });
  };
  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />

      <NavigationBackComponent onPress={() => props.navigation.goBack()} />
      <View style={{width: '80%', alignSelf: 'center'}}>
        <ImageBackground source={Signup} style={styles.backgroundImage} />
        <Text style={styles.textt}>Login to your Account </Text>
        {/* <View style={styles.inputContainer}>
          <Image source={Contact} style={{marginRight: 10}}></Image>
          <Icon1 name="person" color={'#9D9393'} size={25} />
          <TextInput
            style={styles.textInput}
            maxLength={50}
            value={RegEmail ? RegEmail : data.email}
            placeholder="Type your email here"
            placeholderTextColor="#9D9393"
            cursorColor="transparent"
            onChangeText={text => onChange('email', text)}
          />
        </View> */}
        {/* <View style={styles.inputContainer}>
          <Image source={Contact} style={{marginRight: 10}}></Image>
          <Icon1
            name="key"
            color={'#9D9393'}
            size={25}
            onPress={() => console.log('first')}
          />
          <TextInput
            style={styles.textInput}
            maxLength={10}
            value={data.password}
            secureTextEntry={watch}
            placeholder="Type your password here"
            placeholderTextColor="#9D9393"
            cursorColor="transparent"
            // keyboardType="phone-pad"
            onChangeText={text => onChange('password', text)}
          />
          <Icon1
            name="remove-red-eye"
            color={'#9D9393'}
            size={25}
            onPress={() => setWatch(!watch)}
          />
        </View> */}
        <View style={styles.inputContainer}>
          <Image source={Contact} style={{marginRight: 10}}></Image>
          <TextInput
            keyboardType="numeric"
            style={styles.textInput}
            maxLength={10}
            placeholder="Type your phone number"
            placeholderTextColor="#9D9393"
            cursorColor="transparent"
            // keyboardType="phone-pad"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '2%',
            //   marginLeft: '20%',
          }}>
          <Icon name="checkcircleo" color={colors.blue} size={15} />
          <Text style={styles.text}>Remember Me</Text>
        </View>
        <YellowButton
          title="Sign In"
          onPress={() => props.navigation.navigate('OtpScreen')}
        />
        <Text style={styles.textf}>
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
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

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
