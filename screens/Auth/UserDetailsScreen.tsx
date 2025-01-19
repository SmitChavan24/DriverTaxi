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
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';
import Dropdown from '../../modules/DropDown';

const UserDetailsScreen = (props: any) => {
  const [selectedGender, setSelectedGender] = useState('Male');

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
          />
        </View>
        <Text style={styles.textt}>Gender</Text>
        <View style={styles.buttonContainer}>
          {['Male', 'Female', 'Other'].map(gender => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.button,
                selectedGender === gender && styles.selectedButton,
              ]}
              onPress={() => setSelectedGender(gender)}>
              <Text style={[styles.buttonText]}>{gender}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.textt}>City You Drive In</Text>
        <Dropdown />
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 20,
            marginBottom: '2%',
          }}>
          <Icon2
            name="checkcircleo"
            color={colors.blue}
            size={15}
            style={{marginTop: '1%'}}
          />
          <Text style={styles.text2}>
            By Accept , you agree to Company Term’s & Conditions
          </Text>
        </View>
        <YellowButton
          title="Next"
          onPress={() => props.navigation.navigate('SetLocationScreen')}
        />
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
