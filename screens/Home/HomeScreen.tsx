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
import CityDriver from '../../assets/images/Welcome.png';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';

const HomeScreen = (props: any) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar hidden={true} />

      <Text style={styles.text}>QUICKTAXI</Text>

      <ImageBackground source={CityDriver} style={styles.backgroundImage} />

      <Text style={styles.text3}>
        We're thrilled to have you join our team. Get ready to drive, earn, and
        make every ride a fantastic experience for our passengers. Let's hit the
        road together!"
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate('DashBoard')}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginVertical: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.textb}>Get Started</Text>
          <Icon
            name="arrowright"
            color={'black'}
            size={25}
            style={{marginTop: 3, marginLeft: 5}}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
    marginTop: '3%',
    fontSize: 18,
    fontFamily: colors.fontSemiBold,
    alignSelf: 'center',
    textAlign: 'center',
    width: '80%',
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
    width: (colors.width * 100) / 100,
    height: (colors.height * 40) / 100,
    resizeMode: 'cover', // Ensures the image covers the screen
  },
});
