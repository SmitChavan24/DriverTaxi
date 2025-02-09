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
import {API_URL, DEV_URL} from '@env';
import useAuth from '../../utils/useAuth';
import axios from 'axios';
import {showToast} from '../../modules/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = (props: any) => {
  const RegEmail = props.route.params?.email;
  const RegPass = props.route.params?.password;

  const [data, setdata] = useState({email: '', password: ''});
  const [isChecked, setIsChecked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const {user, signUp, logIn, signInWithOAuth} = useAuth();
  const [watch, setWatch] = useState(true);

  const handleSubmit = async () => {
    // props.navigation.navigate('PhoneVerify');
    if (!isChecked) {
      showToast('Please Agree to Terms & Conditions');
      return;
    }

    if (!data.email || !data.password) {
      showToast('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showToast('Please enter a valid email address');
      return;
    }

    if (data.password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    // const loadingToast = toast.loading(
    //   `${isSignUp ? "Creating your account..." : "Logging you in...."}`,
    //   { id: "loading-toast" }
    // );

    try {
      const response = await logIn(data.email, data.password);

      if (response.error) {
        showToast(response.error.message);
      } else {
        showToast('Sign Up successful', 'success');
        // await handleUserCreation(response.data.user.id);
        props.navigation.navigate('DashBoard');
      }

      // toast.success(`${isSignUp ? 'Sign Up' : 'Log In'} successful!`);

      // toast.dismiss(loadingToast);
    } catch (error) {
      // toast.dismiss(loadingToast);
      // console.log("5"+error);
      showToast(`Error: ${error.message}`);
    } finally {
      // setLoading(false);
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
        <View style={styles.inputContainer}>
          {/* <Image source={Contact} style={{marginRight: 10}}></Image> */}
          <Icon1 name="person" color={'#9D9393'} size={25} />
          <TextInput
            style={styles.textInput}
            maxLength={50}
            value={RegEmail ? RegEmail : data.email}
            placeholder="Type your email here"
            placeholderTextColor="#9D9393"
            cursorColor="black"
            onChangeText={text => onChange('email', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          {/* <Image source={Contact} style={{marginRight: 10}}></Image> */}
          <Icon1
            name="key"
            color={'#9D9393'}
            size={25}
            onPress={() => console.log('first')}
          />
          <TextInput
            style={styles.textInput}
            maxLength={20}
            value={data.password}
            secureTextEntry={watch}
            placeholder="Type your password here"
            placeholderTextColor="#9D9393"
            cursorColor="black"
            // keyboardType="phone-pad"
            onChangeText={text => onChange('password', text)}
          />
          <Icon1
            name="remove-red-eye"
            color={'#9D9393'}
            size={25}
            onPress={() => setWatch(!watch)}
          />
        </View>
        {/* <View style={styles.inputContainer}>
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
        </View> */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '2%',
            //   marginLeft: '20%',
          }}
          onPress={() => setIsChecked(!isChecked)}>
          <Icon
            name={isChecked ? 'checkcircle' : 'checkcircleo'}
            color={colors.blue}
            size={15}
          />
          <Text style={styles.text}>Remember Me</Text>
        </TouchableOpacity>
        <YellowButton title="Sign In" onPress={handleSubmit} />
        <Text style={styles.textf}>
          Don’t have an account?
          <Text
            style={{
              color: '#000000',
              fontSize: 16,
              fontFamily: colors.fontBold,
              textAlign: 'center',
            }}
            onPress={() => props.navigation.navigate('SignUpScreen')}>
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
