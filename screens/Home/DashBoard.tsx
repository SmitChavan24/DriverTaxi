import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import paddingHelper from '../../utils/paddingHelper';
import Switch from 'react-native-switch-toggles';
import Mapbox from '@rnmapbox/maps';
import {API_URL, DEV_URL} from '@env';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import colors from '../../utils/globalColors';
import shadowProp from '../../utils/shadowProp';
import YellowButton from '../../components/YellowButton';
import Prof from '../../assets/images/prof.png';
import Feather from 'react-native-vector-icons/Feather';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RideRequests from '../../components/RideRequests';
import axios from 'axios';
import {showToast} from '../../modules/Toast';
import getDistanceAndETA from '../../utils/distanceCalculation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashBoard = (props: any) => {
  const [initialLocation, setInitialLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [route, setRoute] = useState(null);
  const [toggle, setToggle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [driverId, setDriverId] = useState('');
  const [rideRequests, setRideRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [dailyFares, setDailyFares] = useState({});
  const [prebookings, setPrebookings] = useState({});
  const [showPrebookings, setShowPrebookings] = useState(false);
  const snapPoints = useMemo(() => ['17%', '50%']);
  const [time, settime] = useState(false);
  const inputs = useRef([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    // console.log(initialLocation, 'it');
  }, []);

  useEffect(() => {
    if (rideRequests?.length) {
      const updatedDetails = rideRequests.map(item => {
        const response = getDistanceAndETA(
          item.source_lat,
          item.source_lng,
          item.destination_lat,
          item.destination_lng,
        );

        return {
          ...item,
          distance: response.distance,
          duration: response.eta,
        };
      });
      console.log(updatedDetails, 'updated');
      setUpdatedRequests(updatedDetails);
    }
  }, [rideRequests]);

  const handleDeclineRequest = requestId => {
    setUpdatedRequests(prevRequests =>
      prevRequests.filter(request => request.trip_id !== requestId),
    );
  };

  const handleFindRide = async () => {
    if (!toggle) {
      showToast('Switch back to Online!');
      return;
    }
    setLoading(true);
    try {
      const uniqueId = Date.now();

      // First, revalidate the tag
      const res = await axios.get(`${API_URL}api/revalidate`, {
        params: {tag: 'ready-trips'},
      });
      // console.log(API_URL, 'whta ', res);
      let driverId = await AsyncStorage.getItem('auth-token');
      driverId = JSON.parse(driverId);
      driverId = driverId?.user?.id;
      setDriverId(driverId);
      console.log(driverId, 'driver_id', uniqueId);
      // Then, fetch the data
      const response = await axios.get(`${API_URL}/api/trips/ready-trips`, {
        params: {uniqueId, driverId},
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
        },
      });

      const data = response.data;
      console.log('data ', data);

      if (Array.isArray(data)) {
        setRideRequests(data);
      } else {
        console.error('Error: Fetched data is not an array', data);
        setRideRequests([]);
      }
    } catch (error) {
      console.error('Error fetching ready trips:', error);
      setRideRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async trip => {
    setLoading(true);

    console.log('request ', request);
    try {
      const response = await axios.put(`${API_URL}/api/trips/accept-trip`, {
        trip_id: trip,
        driver_id: driverId,
      });
      if (response.status === 200) {
      } else {
        const res = await axios.post(`${API_URL}/api/trips/trip`, {
          trip,
        });
        fetchDriverDetails(trip);
        throw new Error('Failed to accept the trip');
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverDetails = async tripId => {
    try {
      const response = await axios.post(
        `${API_URL}/api/customers/driver-details`,
        {
          trip_id: tripId,
          isDriver: false, // Driver specific
        },
      );

      setCustomerData(response.data);
      console.log(customerData);
    } catch (error) {
      console.error('Failed to fetch driver details:', error);
    }
  };

  const validateOTP = async otpString => {
    console.log('Entered OTP: ', otpString.trim());
    console.log(tripId);
    setLoading(true);

    try {
      console.log('Calling verify otp');
      const response = await axios.post(`${API_URL}/api/trips/validate-otp`, {
        trip_id: tripId,
        otp: otpString,
      });

      if (response.data.success) {
        showToast('OTP VERIFIED');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to validate OTP');
      // Clear OTP inputs on error
      setOtp(['', '', '', '']);
      inputs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };
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
            value={toggle}
            onChange={value => setToggle(value)}
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '5%',
          marginHorizontal: '10%',
        }}>
        <View
          style={{
            backgroundColor: '#F8F9FA',
            alignSelf: 'center',
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderWidth: 1,
            borderColor: '#D9D9D9',
            justifyContent: 'space-around',
          }}>
          <FontAwesome5 name="calendar-alt" size={30} color={'#777777'} />
          <View style={{alignItems: 'center', marginHorizontal: '2%'}}>
            <Text
              style={{
                color: '#777777',
                fontSize: 10,
                fontFamily: colors.fontSemiBold,
              }}>
              Pre - Booked
            </Text>
            <Text
              style={{
                color: colors.black,
                fontFamily: colors.fontBold,
                fontSize: 12,
              }}>
              9
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#F8F9FA',
            alignSelf: 'center',
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderWidth: 1,
            borderColor: '#D9D9D9',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: '#777777',
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}>
            <FontAwesome5 name="rupee-sign" size={20} color={colors.white} />
          </View>
          <View style={{alignItems: 'center', marginHorizontal: '2%'}}>
            <Text
              style={{
                color: '#777777',
                fontSize: 10,
                fontFamily: colors.fontSemiBold,
              }}>
              Today Earned
            </Text>
            <Text
              style={{
                color: colors.black,
                fontFamily: colors.fontBold,
                fontSize: 10,
              }}>
              ₹1400.00
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#F8F9FA',
          borderWidth: 3,
          borderColor: '#CECDCD',
          borderRadius: 100,
          padding: 30,
          // paddingHorizontal: 50,
          marginTop: '25%',
          alignSelf: 'center',
        }}>
        <FontAwesome5
          name={!time ? 'search' : 'hourglass-start'}
          size={!time ? 50 : 23}
          color={'#777777'}
          style={{alignSelf: 'center'}}
        />
        {!time && (
          <View style={{marginHorizontal: '6%'}}>
            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                color: '#777777',
                marginTop: 5,
                backgroundColor: '#F8F9FA',
                fontFamily: colors.fontMedium,
                fontSize: 22,
              }}>
              32
            </Text>
            <Text
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                color: '#777777',
                // marginTop: 5,
                backgroundColor: '#F8F9FA',
                fontFamily: colors.fontMedium,
                fontSize: 14,
              }}>
              Seconds
            </Text>
          </View>
        )}
      </View>
      {time && (
        <View>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: colors.black,
              marginTop: 5,
              backgroundColor: '#F8F9FA',
              fontFamily: colors.fontSemiBold,
              fontSize: 22,
            }}>
            Finding Rides
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              color: colors.black,
              backgroundColor: '#F8F9FA',
              fontFamily: colors.fontExtraIBold,
              fontSize: 14,
            }}>
            Please wait...
          </Text>
        </View>
      )}
      <BottomSheet
        // detached
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        style={[
          {
            backgroundColor: colors.white,
            borderRadius: 20,
          },
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
          <View style={{}}>
            <RideRequests
              updatedRequests={updatedRequests}
              handleAccept={handleAccept}
              handleDeclineRequest={handleDeclineRequest}
            />

            <YellowButton
              title="Find Ride"
              hideIcon={false}
              addStyle={{marginHorizontal: '10%', marginBottom: '10%'}}
              onPress={handleFindRide}
            />
          </View>
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
  locationRow: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    paddingLeft: 15,
    alignItems: 'center',
    // marginBottom: 10,
  },
  locationRow2: {
    flexDirection: 'row',
    padding: 1,
    justifyContent: 'space-between',
    paddingLeft: 15,
    alignItems: 'center',
    // marginBottom: 10,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    color: '#000000',
    fontFamily: colors.fontSemiBold,
    fontSize: 16,
  },
});
