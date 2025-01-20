import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import paddingHelper from '../../utils/paddingHelper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import YellowButton from '../../components/YellowButton';
import shadowProp from '../../utils/shadowProp';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Sentmessage from '../../assets/images/Address.png';
import colors from '../../utils/globalColors';

const LocationAccess = (props: any) => {
  const [finished, setFinished] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%']);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // console.log(initialLocation, 'it');
  }, []);
  return (
    <GestureHandlerRootView style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />

      <Image
        source={Sentmessage}
        style={[
          {
            alignSelf: 'center',
            marginTop: (colors.width * 8) / 100,
            resizeMode: 'cover',
            width: '70%',
          },
        ]}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: colors.fontSemiBold,
          width: '50%',
          marginBottom: '1%',
          alignSelf: 'center',
          textAlign: 'center',
        }}>
        Enable Location Access
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: colors.fontMedium,
          color: '#9D9393',
          width: '60%',
          alignSelf: 'center',
          textAlign: 'center',
        }}>
        To ensure a seamless and efficient experience, allow us access your
        location
      </Text>
      <BottomSheet
        // detached
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        style={[{backgroundColor: '#F8F9FA', borderRadius: 20}, shadowProp(3)]}
        // handleComponent={() => (
        //     <Image
        //       source={Scroll}
        //       style={[{alignSelf: 'center', marginVertical: 5}]}
        //     />
        //   <View
        //     style={[
        //       {borderRadius: 100, borderWidth: 1, borderColor: '#D9D9D9'},
        //       shadowProp(1),
        //     ]}></View>
        // )}
        handleStyle={[
          {
            backgroundColor: colors.white,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            borderWidth: 2,
            borderBottomWidth: 0,
            borderColor: '#D9D9D9',
            // flexGrow: 1,
            // display: 'flex',
          },
        ]}
        onChange={handleSheetChanges}>
        <BottomSheetView style={{padding: 0}}>
          <View
            style={{
              alignItems: 'center',
              width: '80%',
              alignSelf: 'center',
              marginTop: '3%',
            }}>
            <YellowButton
              title="Got It"
              hideIcon={false}
              onPress={() => props.navigation.navigate('DashBoard')}
            />
            <YellowButton
              title="Maybe Later"
              hideIcon={false}
              addStyle={{
                backgroundColor: '#F8F9FA',
                borderWidth: 1,
                borderColor: '#C9C2C2',
              }}
              onPress={() => props.navigation.navigate('DashBoard')}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default LocationAccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
});
