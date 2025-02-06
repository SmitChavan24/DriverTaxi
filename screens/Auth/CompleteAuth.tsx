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

const CompleteAuth = (props: any) => {
  const params = props?.route?.params?.completed;
  console.log(props?.route?.params?.completed);
  const [selectedGender, setSelectedGender] = useState('Male');
  const [auth, setAuth] = useState([
    {step: 'Profile Picture'},
    {step: 'Bank Account Details'},
    {step: 'Driving License'},
    {step: 'Taxi Details'},
  ]);

  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />

      <View style={{width: '80%', alignSelf: 'center'}}>
        <Text style={styles.text}>Welcome! , Mark</Text>

        <Text style={styles.textt}>Require Steps</Text>
        {auth
          .filter(data => !params?.includes(data.step))
          .map((data, index) => (
            <TouchableOpacity
              style={styles.box}
              key={index}
              onPress={() =>
                props.navigation.navigate('UploadDocs', {data, index, params})
              }>
              <Text style={{fontSize: 14, fontFamily: colors.fontMedium}}>
                {data.step}
              </Text>
              <Icon name="keyboard-arrow-right" color={'#9D9393'} size={35} />
            </TouchableOpacity>
          ))}

        <Text style={styles.textt}>Submitted Steps</Text>
        {auth
          .filter(data => params?.includes(data.step))
          .map((data, index) => (
            <TouchableOpacity
              style={styles.box}
              key={index}
              disabled={true}
              onPress={() =>
                props.navigation.navigate('UploadDocs', {data, index})
              }>
              <Text style={{fontSize: 14, fontFamily: colors.fontMedium}}>
                {data.step}
              </Text>
              <Icon name="check-circle-outline" color={'#9D9'} size={30} />
            </TouchableOpacity>
          ))}
        <YellowButton
          title="Next"
          onPress={() => props.navigation.navigate('UploadDocs')}
        />
      </View>
    </View>
  );
};

export default CompleteAuth;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
  },
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
