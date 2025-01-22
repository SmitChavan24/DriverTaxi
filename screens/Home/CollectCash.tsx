import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import Prof from '../../assets/images/prof.png';
import paddingHelper from '../../utils/paddingHelper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../utils/globalColors';
import Pay from '../../assets/images/CashPayment.png';
import shadowProp from '../../utils/shadowProp';
import YellowButton from '../../components/YellowButton';

const CollectCash = (props: any) => {
  const snapPoints = useMemo(() => ['17%', '50%']);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // console.log(initialLocation, 'i');
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden={true} />
      <NavigationBackComponent />
      <Text style={styles.text}>Collect Cash</Text>

      <View
        style={{
          alignSelf: 'center',
          width: '90%',
          borderWidth: 1,
          borderColor: '#A0A0A0',
          backgroundColor: colors.white,
          borderRadius: 30,
          marginTop: '7%',
        }}>
        <Image
          source={Pay}
          style={{alignSelf: 'center', marginVertical: '5%'}}
        />

        <View style={styles.container3}>
          <View style={styles.locationRow2}>
            <TouchableOpacity>
              <FontAwesome5
                name="dot-circle"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              // maxLength={50}
              numberOfLines={1}
              // value={initialLocation?.place_name}
              placeholder="Location..."
              placeholderTextColor="#B4BDC4"
              cursorColor={colors.black}
              // onChangeText={text => fetchLocations(text)}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
          </View>

          <View style={styles.locationRow2}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#299B56E5" />
            <TextInput
              style={styles.textInput}
              numberOfLines={1}
              // value={destinationLocation?.place_name}
              placeholder="Enter Destination"
              placeholderTextColor="#B4BDC4"
              cursorColor={colors.black}
              // onChangeText={text => fetchDestination(text)}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '80%',
            marginTop: '4%',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: colors.fontMedium,
              fontSize: 14,
              color: colors.black,
            }}>
            Total Distance
          </Text>
          <Text
            style={{
              fontFamily: colors.fontMedium,
              fontSize: 14,
              color: colors.black,
            }}>
            8.04 km
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '80%',
            marginTop: '3%',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: colors.fontMedium,
              fontSize: 14,
              color: colors.black,
            }}>
            Total Duration
          </Text>
          <Text
            style={{
              fontFamily: colors.fontMedium,
              fontSize: 14,
              color: colors.black,
            }}>
            27 mins
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginBottom: '3%',
            justifyContent: 'space-between',
            width: '90%',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: '7%',
            }}>
            <Image source={Prof} />

            <Text
              style={{
                color: '#0A0A0A',
                fontFamily: colors.fontSemiBold,
                fontSize: 18,
                marginLeft: 5,
              }}>
              Mark Smith
            </Text>
          </View>
          <Text
            style={{
              color: '#0A0A0A',
              fontFamily: colors.fontRegular,
              fontSize: 12,
            }}>
            Cash Payment
          </Text>
        </View>

        <View
          style={{
            alignSelf: 'flex-end',
            backgroundColor: colors.primary,
            width: '100%',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomRightRadius: 30,
            paddingHorizontal: '5%',
            justifyContent: 'space-between',
            borderBottomLeftRadius: 30,
          }}>
          <Text
            style={{
              color: '#0A0A0A',
              fontFamily: colors.fontBold,
              fontSize: 14,
            }}>
            Total Amount
          </Text>
          <Text
            style={{
              color: '#0A0A0A',
              fontFamily: colors.fontBold,
              fontSize: 14,
            }}>
            ₹289.00
          </Text>
        </View>
      </View>
      <BottomSheet
        // detached
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        style={[
          {backgroundColor: colors.white, borderRadius: 20},
          shadowProp(3),
        ]}
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
          <YellowButton
            title="Collected Cash"
            addStyle={{marginHorizontal: '5%'}}
            hideIcon={false}
            onPress={() => props.navigation.navigate('CollectCash')}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default CollectCash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: paddingHelper(),
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    color: '#000000',
    fontFamily: colors.fontBold,
    fontSize: 16,
  },
  text: {
    paddingTop: paddingHelper(),
    marginTop: '7%',
    position: 'absolute',
    fontFamily: colors.fontSemiBold,
    fontSize: 20,
    color: '#0A0A0A',
    alignSelf: 'center',

    // width: '82%',
  },
  container3: {
    marginVertical: 10,
    // bottom: 0,
    // position: 'absolute',
    zIndex: 999,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9C1C1',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  locationRow2: {
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
    paddingLeft: 15,
    alignItems: 'center',
    // marginBottom: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#C9C1C1',
  },
});
