import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import paddingHelper from '../../utils/paddingHelper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import shadowProp from '../../utils/shadowProp';
import Icon2 from 'react-native-vector-icons/AntDesign';
import colors from '../../utils/globalColors';
import YellowButton from '../../components/YellowButton';
import Sentmessage from '../../assets/images/Sentmessage.png';
import Completed from '../../assets/images/Completed.png';

const Submitted = (props: any) => {
  const [finished, setFinished] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%']);
  const snapPoint = useMemo(() => ['40%']);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // console.log(initialLocation, 'it');
  }, []);
  return (
    <GestureHandlerRootView style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />
      <Image
        source={!finished ? Sentmessage : Completed}
        style={[
          {
            alignSelf: 'center',
            marginTop: (colors.width * 8) / 100,
            resizeMode: 'cover',
          },
          finished ? {width: '80%'} : {width: '70%'},
        ]}
      />
      {finished && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: colors.fontBold,
            width: '60%',
            marginTop: '5%',
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          Congratulations! All your information is now complete. You're ready to
          hit the road with Quicktaxi. Drive safe and earn well!
        </Text>
      )}
      <BottomSheet
        // detached
        ref={bottomSheetRef}
        index={1}
        snapPoints={finished ? snapPoints : snapPoint}
        style={[{backgroundColor: '#F8F9FA', borderRadius: 20}, shadowProp(3)]}
        // handleComponent={() => (
        //   <Image
        //     source={Scroll}
        //     style={[{alignSelf: 'center', marginVertical: 5}]}
        //   />
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
          //   shadowProp(3, colors.black),
        ]}
        onChange={handleSheetChanges}>
        <BottomSheetView style={{padding: 0}}>
          {!finished ? (
            <View
              style={{alignItems: 'center', width: '80%', alignSelf: 'center'}}>
              <Icon2
                name="checkcircle"
                color={colors.primary}
                size={70}
                style={{marginVertical: 18}}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: colors.fontSemiBold,
                  width: (colors.width * 60) / 100,
                  marginBottom: '1%',
                  textAlign: 'center',
                }}>
                Application Submitted For Verifications
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: colors.fontMedium,
                  color: '#9D9393',
                  width: (colors.width * 65) / 100,
                  textAlign: 'center',
                }}>
                We will get in touch with you in 48 working hours . Be ready for
                your rides!
              </Text>
              <YellowButton
                title="Got It"
                hideIcon={false}
                onPress={() => setFinished(true)}
              />
            </View>
          ) : (
            <YellowButton
              title="Finish and Start Drivings"
              hideIcon={false}
              addStyle={{marginHorizontal: '10%'}}
              onPress={() => props.navigation.navigate('LocationAcess')}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default Submitted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
});
