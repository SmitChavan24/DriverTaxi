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
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Signup from '../../assets/images/Citydriver.png';
// import Contact from '../../assets/images/contact.png';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';
import {supabase} from '../../utils/supabase';
import axios from 'axios';
import useAuth from '../../utils/useAuth';
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';
import {showToast} from '../../modules/Toast';

const SignUpScreen = (props: any) => {
  const [data, setdata] = useState({email: '', password: ''});
  const [isChecked, setIsChecked] = useState(false);
  const {user, signUp, logIn, signInWithOAuth} = useAuth();
  const [watch, setWatch] = useState(true);

  const handleUserCreation = async (userId: any) => {
    try {
      const endpoint = `${API_URL}/api/drivers/driver-profile`;
      const idField = 'driver_id';

      // to ensure player ID is fetched before storing
      // const newPlayerId = await getPlayerId();
      const payload = {
        [idField]: userId,
        email: data.email,
        password: data.password,
      };

      // if (newPlayerId) {
      //   payload.player_id = newPlayerId;
      // }

      const response = await axios.post(endpoint, payload);
      console.log(`Created ${response ? 'driver' : 'customer'} profile`);

      // if (newPlayerId) {
      //   await axios.put('/api/store-player-id', {
      //     [idField]: userId,
      //     player_id: newPlayerId,
      //   });
      // }
    } catch (error) {
      // console.error("Error creating user profile:", error);
      // toast.error('Failed to create user profile');
    }
  };

  const handleSubmit = async () => {
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
      const response = await signUp(data.email, data.password);

      if (response.error) {
        if (response.error.message === 'User already registered') {
          setdata({email: '', password: ''});
          props.navigation.navigate('LoginScreen', {email: data.email});
        } else {
          showToast(response.error.message);
        }
      }
      if (response?.data?.user?.id) {
        await handleUserCreation(response.data.user.id);
      }
      showToast('Sign Up successful', 'success');
      props.navigation.navigate('LoginScreen', {
        email: data.email,
        password: data.password,
      });

      console.log(response, 'Got this');

      // toast.success(`${isSignUp ? 'Sign Up' : 'Log In'} successful!`);

      // toast.dismiss(loadingToast);
    } catch (error) {
      // toast.dismiss(loadingToast);
      // console.log("5"+error);
      // toast.error(`Error: ${error.message}`);
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
        <Text style={styles.textt}>Create an Account </Text>
        <View style={styles.inputContainer}>
          {/* <Image source={Contact} style={{marginRight: 10}}></Image> */}
          <Icon1 name="person" color={'#9D9393'} size={25} />
          <TextInput
            style={styles.textInput}
            maxLength={50}
            value={data.email}
            placeholder="Type your email here"
            placeholderTextColor="#9D9393"
            cursorColor="black"
            onChangeText={text => onChange('email', text)}
            // keyboardType="phone-pad"
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
            maxLength={10}
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
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.cursor}></View>
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
          onPress={() => setIsChecked(!isChecked)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '2%',
            //   marginLeft: '20%',
          }}>
          <Icon name="checkcircleo" color={colors.blue} size={15} />
          <Text style={styles.text}>Agree to Terms & Conditions</Text>
        </TouchableOpacity>
        <YellowButton
          title="Sign Up"
          onPress={handleSubmit}
          // onPress={showToast}
        />
        <Text style={styles.textf}>
          Already have an account?
          <Text
            style={{
              color: '#000000',
              fontSize: 16,
              fontFamily: colors.fontBold,
              textAlign: 'center',
            }}
            onPress={() => props.navigation.navigate('LoginScreen')}>
            {' Login'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
    color: '#000000',
    fontFamily: colors.fontRegular,
    fontSize: 16,
  },
});
