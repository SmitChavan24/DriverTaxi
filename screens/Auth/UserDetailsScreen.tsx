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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';
import {Picker} from '@react-native-picker/picker';
import {NEXT_PUBLIC_X_RAPIDAPI_KEY, API_URL, DEV_URL} from '@env';
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';
import Dropdown from '../../modules/DropDown';
import {showToast} from '../../modules/Toast';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetailsScreen = (props: any) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [typeOfModel, setTypeOfModel] = useState('');

  const geoDbApiKey = NEXT_PUBLIC_X_RAPIDAPI_KEY;
  const geoDbBaseUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
  const nameRegex = /^[a-zA-Z\s]+$/;

  // Define carModelOptions
  const carModelOptions = [
    'Just Go',
    'Luxury',
    'Electric Car',
    'Taxi 4 Seat',
    'Taxi 7 Seat',
  ];

  const validateForm = () => {
    let isValid = true;
    console.log(name, gender, city, typeOfModel);
    // Name validation
    if (!name) {
      showToast('Name is required.');
      isValid = false;
    } else if (!nameRegex.test(name)) {
      showToast('Invalid name. Only letters and spaces are allowed.');
      isValid = false;
    }

    // Gender validation
    if (!gender) {
      showToast('Gender is required.');
      isValid = false;
    }

    // City validation
    if (!city) {
      showToast('City is required.');
      isValid = false;
    }
    // Model validation
    if (!typeOfModel) {
      showToast('Car model is required.');
      isValid = false;
    }
    // Terms & Conditions validation
    if (!agreed) {
      showToast('You must agree to the terms & conditions.');
      isValid = false;
    }

    return isValid;
  };

  const fetchCitySuggestions = async input => {
    console.log(input);
    if (input.length < 2) {
      setCitySuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`${geoDbBaseUrl}`, {
        headers: {
          'x-rapidapi-key': geoDbApiKey,
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        },
        params: {
          namePrefix: input,
          limit: 10,
        },
      });

      const cities = response.data.data.map(
        city => `${city.city}, ${city.countryCode}`,
      );
      setCitySuggestions(cities);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const performApiCall = async () => {
    if (!validateForm()) {
      return; // Prevent API call if validation fails
    }

    try {
      let userData = await AsyncStorage.getItem('auth-token');
      userData = JSON.parse(userData);
      console.log(userData.user.id, 'driver_id');
      const response = await axios.put(`${API_URL}/api/drivers/upload-basic`, {
        driver_id: userData?.user?.id,
        name,
        gender,
        city,
        ride_type: typeOfModel,
      });
      console.log(response.status, 'Upload Basic');
      if (response.status === 200) {
        props.navigation.navigate('CompleteAuth');
        showToast('Profile Details Uploaded');
      }
      // onButtonClick(response); // Trigger the parent function on success
    } catch (error) {
      console.error('Error in API call:', error);
    }
  };

  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />

      <View style={{width: '80%', alignSelf: 'center'}}>
        <Text style={styles.text}>Complete Your Profile</Text>

        <Text style={styles.textt}>Your Name</Text>

        <View style={styles.inputContainer}>
          {/* <Image source={Contact} style={{marginRight: 10}}></Image> */}
          <Icon name="person" color={'#9D9393'} size={25} />
          <TextInput
            style={styles.textInput}
            maxLength={10}
            placeholder="Type your name here"
            placeholderTextColor="#9D9393"
            cursorColor="transparent"
            // keyboardType="phone-pad"
            onChangeText={text => setName(text)}
          />
        </View>
        <Text style={styles.textt}>Gender</Text>
        <View style={styles.buttonContainer}>
          {['Male', 'Female', 'Other'].map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.button, gender === opt && styles.selectedButton]}
              onPress={() => setGender(opt)}>
              <Text style={[styles.buttonText]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.textt}>Select a Vehicle</Text>
        <View
          style={{
            borderColor: colors.black,
            borderWidth: 1,
            borderRadius: 1,
            width: '100%',
            alignSelf: 'center',
          }}>
          <Picker
            selectedValue={typeOfModel}
            style={{
              color: colors.black,
              fontFamily: colors.fontSemiBold,
              paddingVertical: 3,
              backgroundColor: colors.white,
            }}
            selectionColor={colors.black}
            mode={'dropdown'}
            prompt="Select One"
            itemStyle={{
              backgroundColor: colors.white,
              fontFamily: colors.fontSemiBold,
            }}
            dropdownIconColor={colors.black}
            onValueChange={itemValue => setTypeOfModel(itemValue)}>
            <Picker.Item
              label="Select a Vehicle"
              value=""
              color={colors.grey}
            />
            {carModelOptions.map((item, index) => (
              <Picker.Item
                label={`${item}`}
                value={`${item}`}
                color={colors.white}
                fontFamily={colors.fontSemiBold}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.textt}>City You Drive In</Text>
        <Dropdown
          onPress={fetchCitySuggestions}
          city={citySuggestions}
          onSelect={text => setCity(text)}
          textinput={true}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderRadius: 20,
            marginBottom: '2%',
          }}
          onPress={() => setAgreed(!agreed)}>
          <Icon2
            name="checkcircleo"
            color={colors.blue}
            size={15}
            style={{marginTop: '1%'}}
          />
          <Text style={styles.text2}>
            By Accept , you agree to Company Term’s & Conditions
          </Text>
        </TouchableOpacity>
        <YellowButton title="Next" onPress={performApiCall} />
      </View>
    </View>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
  textt: {
    fontSize: 16,
    fontFamily: colors.fontBold,
    marginBottom: 17,
    marginTop: '5%',
    // textDecorationLine: 'underline',
  },
  text2: {
    fontSize: 14,
    fontFamily: colors.fontBold,
    // textAlign: 'center',
    marginLeft: 7,
    // textDecorationLine: 'underline',
  },
  text: {
    fontSize: 16,
    fontFamily: colors.fontBold,
    textAlign: 'center',
    marginRight: 15,
    marginBottom: '5%',
    color: colors.black,
    marginTop: (colors.height * 1) / 100,
    // textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 1,
    padding: 10,
    width: '100%',
    marginBottom: '2%',
    backgroundColor: '#FFFFFF',
  },

  textInput: {
    flex: 1,
    fontFamily: colors.fontRegular,
    marginHorizontal: 5,
    color: '#000000',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary, // Gold color for selected
    borderColor: colors.black,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: colors.fontSemiBold,
    color: '#000',
  },
});
