import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
// require('dotenv').config();
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import CityDriver from '../../assets/images/Formse.png';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';
import YellowButton from '../../components/YellowButton';

const StartAuth = (props: any) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />
      <View style={{width: '80%', alignSelf: 'center'}}>
        <ImageBackground source={CityDriver} style={styles.backgroundImage} />

        <Text style={styles.text3}>
          Welcome! To get you on the road quickly, please fill out your personal
          details. This helps us ensure a smooth and safe experience for both
          you and your passengers.
        </Text>
        <YellowButton
          title="Let's Roll"
          onPress={() => props.navigation.navigate('UserDetailsScreen')}
        />
      </View>
    </SafeAreaView>
  );
};

export default StartAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  textb: {
    fontSize: 18,
    fontFamily: colors.fontRegular,
    alignSelf: 'center',
    textAlign: 'center',
  },
  text: {
    marginTop: (colors.height * 8) / 100,
    marginBottom: (colors.height * 7) / 100,
    fontSize: 40,
    fontFamily: colors.fontExtraBold,
    alignSelf: 'center',
    textAlign: 'center',
    // textDecorationLine: 'underline',
  },
  text2: {
    marginTop: '4%',
    fontSize: 30,
    fontFamily: colors.fontSemiBold,
    alignSelf: 'center',
    textAlign: 'center',
    // textDecorationLine: 'underline',
  },
  text3: {
    marginTop: '8%',
    marginBottom: '10%',
    fontSize: 14,
    fontFamily: colors.fontSemiBold,
    alignSelf: 'center',
    textAlign: 'center',
    width: '85%',
    // textDecorationLine: 'underline',
  },
  button: {
    marginRight: '10%',
    marginTop: '8%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    alignSelf: 'flex-end',
  },
  backgroundImage: {
    width: (colors.width * 80) / 100,
    height: (colors.height * 40) / 100,
    alignSelf: 'center',
    resizeMode: 'cover', // Ensures the image covers the screen
  },
});
