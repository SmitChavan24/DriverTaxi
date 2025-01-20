import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import paddingHelper from '../../utils/paddingHelper';
import Switch from 'react-native-switch-toggles';
import Mapbox from '@rnmapbox/maps';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import colors from '../../utils/globalColors';
import shadowProp from '../../utils/shadowProp';
import YellowButton from '../../components/YellowButton';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DashBoard = (props: any) => {
  const [initialLocation, setInitialLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [route, setRoute] = useState(null);
  const snapPoints = useMemo(() => ['17%']);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // console.log(initialLocation, 'it');
  }, []);
  return (
    <GestureHandlerRootView style={[styles.container]}>
      <StatusBar hidden={true} />

      <NavigationBackComponent
        onPress={() => props.navigation.goBack()}
        color={colors.black}
        containerStyle={{}}
      />
      <Mapbox.MapView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        {initialLocation?.geometry?.coordinates && (
          <Mapbox.Camera
            zoomLevel={15}
            centerCoordinate={initialLocation?.geometry?.coordinates}
            animationMode="flyTo"
            animationDuration={2000}
          />
        )}

        {initialLocation?.geometry?.coordinates && (
          <Mapbox.PointAnnotation
            id="pointAnnotation"
            coordinate={
              initialLocation?.geometry?.coordinates
                ? initialLocation?.geometry?.coordinates
                : [-5, 55]
            }
          />
        )}
        {destinationLocation?.geometry?.coordinates && (
          <Mapbox.PointAnnotation
            id="pointAnnotation"
            coordinate={
              destinationLocation?.geometry?.coordinates
                ? destinationLocation?.geometry?.coordinates
                : [-5, 55]
            }
          />
        )}

        {route?.length > 0 && (
          <Mapbox.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: route,
              },
            }}>
            <Mapbox.LineLayer
              id="routeLayer"
              style={{
                lineColor: colors.black,
                lineWidth: 5,
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>
      <View style={styles.container2}>
        <View style={styles.locationRow}>
          <TouchableOpacity onPress={() => console.log('first')}>
            <Ionicons name="person" size={20} color={'#9D9393'} />
          </TouchableOpacity>
          <Switch
            size={30}
            value={true}
            onChange={value => console.log(value)}
            activeTrackColor={'#D9D9D9'}
            activeThumbColor={colors.primary}
            renderOffIndicator={() => (
              <Text style={{fontSize: 14, color: colors.black}}>Offline</Text>
            )}
            renderOnIndicator={() => (
              <Text style={{fontSize: 14, color: colors.black}}>Online</Text>
            )}
          />
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
            title="Find Ride"
            hideIcon={false}
            addStyle={{marginHorizontal: '10%'}}
            onPress={() => props.navigation.navigate('LocationAcess')}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
  container2: {
    marginTop: 10,
    // bottom: 0,
    // position: 'absolute',
    zIndex: 999,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    paddingLeft: 15,
    alignItems: 'center',
    // marginBottom: 10,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    color: '#000000',
    fontFamily: colors.fontBold,
    fontSize: 16,
  },
});
