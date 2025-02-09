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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import OtpModal from '../../modules/OtpModal';

const DashBoard = (props: any) => {
  const [initialLocation, setInitialLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [moveToDestination, setMoveToDestination] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [arrivedDest, setArrivedDest] = useState(false);
  const [route, setRoute] = useState(null);
  const [toggle, setToggle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [driverId, setDriverId] = useState('');
  const [rideRequests, setRideRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [otpmvisible, setOtpmvisible] = useState(false);
  // const snapPoints = useMemo(() => ['17%', '50%']);
  const [tripData, setTripData] = useState(null);
  const [time, settime] = useState(false);
  const inputs = useRef([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  // const snapPoints = ['25%', '50%', '75%']; // Define your snap points
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  // Track bottom sheet height
  const bottomSheetHeight = useSharedValue(200); // Default height

  // Update height dynamically when BottomSheet changes
  const handleSheetChanges = useCallback(index => {
    const heightMap = [200, 350, 300]; // Example heights corresponding to snapPoints
    bottomSheetHeight.value = withTiming(heightMap[index]); // Animate change
  }, []);

  // Animated style for floating View
  const floatingViewStyle = useAnimatedStyle(() => ({
    bottom: bottomSheetHeight.value, // Adjust dynamically
  }));

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
    // bottomSheetRef.current?.snapToIndex(0);
    setUpdatedRequests(prevRequests =>
      prevRequests.filter(request => request.trip_id !== requestId),
    );
  };
  const EndTrip = async () => {
    const response = await axios.put(`${API_URL}/api/trips/complete-trip`, {
      trip_id: tripData?.trip_id,
      driver_id: driverId,
    });
    console.log(response);
    if (response.status === 200) {
      props.navigation.navigate('CollectCash', {tripData});
    }
  };
  const getDirection = async data => {
    console.log('first get direction', tripData);
    const res = await fetch(
      'https://api.mapbox.com/directions/v5/mapbox/driving/' +
        tripData?.source_lng +
        ',' +
        tripData?.source_lat +
        ';' +
        tripData?.destination_lng +
        ',' +
        tripData?.destination_lat +
        '?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoicGF3YW4tc2luZ2giLCJhIjoiY2x5OG04czlhMGs3MzJqczdqZTQxdzdkMCJ9.9hJYde5isDb9oy7qQbI62g',
      {
        headers: {
          'Content-Type': 'application/json()',
        },
      },
    );
    const result = await res.json();

    setRoute(result?.routes[0]?.geometry?.coordinates);
  };

  const handleFindRide = async () => {
    if (!toggle) {
      showToast('Switch back to Online!');
      return;
    }
    snapTo25Percent();
    settime(false);
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
  const snapTo25Percent = () => {
    bottomSheetRef.current?.snapToIndex(0); // Index 0 corresponds to '25%'
  };
  const handleAccept = async trip => {
    setLoading(true);
    settime(true);
    // bottomSheetRef.current?.snapToIndex(0);
    console.log('request ', trip, 'request ', driverId);
    try {
      const response = await axios.put(`${API_URL}/api/trips/accept-trip`, {
        trip_id: trip,
        driver_id: driverId,
      });

      console.log('Trip accepted response:', response);

      if (response.status === 200) {
        setAccepted(true);
        snapTo25Percent();
        fetchTripDataWithDelay(trip);
        // fetchDriverDetails(trip);
      }
    } catch (error) {
      console.log('error ', error);
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchTripDataWithDelay = trip => {
    setTimeout(async () => {
      try {
        const res = await axios.post(`${API_URL}/api/trips/trip`, {
          trip_id: trip,
        });

        if (res && res.data) {
          console.log('Trip Data:', res.data);
          setTripData(res.data);
          // getDirection(res.data);
        } else {
          console.error(
            'Trip data is missing required location properties:',
            res,
          );
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    }, 1000);
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
        {tripData?.source_lat && (
          <Mapbox.Camera
            zoomLevel={15}
            centerCoordinate={[tripData?.source_lng, tripData?.source_lat]}
            animationMode="flyTo"
            animationDuration={2000}
          />
        )}

        {tripData?.source_lat && (
          <Mapbox.PointAnnotation
            id="pointAnnotation"
            coordinate={
              tripData?.source_lat
                ? [tripData?.source_lng, tripData?.source_lat]
                : [-5, 55]
            }
          />
        )}
        {tripData?.destination_lat && (
          <Mapbox.PointAnnotation
            id="pointAnnotation"
            coordinate={
              tripData?.destination_lat
                ? [tripData?.destination_lng, tripData?.destination_lat]
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
              0
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
              ₹00.00
            </Text>
          </View>
        </View>
      </View>

      {loading && (
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
          {time && (
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
      )}
      {!time && loading && (
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
      {tripData && (!route || moveToDestination) && (
        <Animated.View
          style={[
            {
              width: '90%',
              alignSelf: 'center',
              position: 'absolute',
              padding: 20,
              borderRadius: 10,
              backgroundColor: 'white',
              elevation: 1,
              zIndex: 99,
            },
            floatingViewStyle,
          ]}>
          <Text
            style={{
              color: colors.black,
              fontFamily: colors.fontMedium,
              fontSize: 14,
              textAlign: 'center',
            }}>
            {tripData?.end_location}
          </Text>
        </Animated.View>
      )}
      {}
      <View>
        <OtpModal
          visible={otpmvisible}
          tripdata={tripData}
          onPress={() => {
            console.log('first is this called');
            snapTo25Percent();
            setMoveToDestination(true);
            setOtpmvisible(!otpmvisible);
          }}
        />
      </View>
      <BottomSheet
        // detached
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
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
            {!tripData && !loading && !accepted && (
              <RideRequests
                updatedRequests={updatedRequests}
                handleAccept={handleAccept}
                handleDeclineRequest={handleDeclineRequest}
              />
            )}

            {!tripData && !accepted && (
              <YellowButton
                title="Find Ride"
                disabled={loading}
                hideIcon={false}
                addStyle={{marginHorizontal: '10%', marginBottom: '10%'}}
                onPress={handleFindRide}
              />
            )}

            {tripData && !route && (
              <YellowButton
                title="Navigate To Customer Location"
                hideIcon={false}
                addStyle={{marginHorizontal: '10%', marginBottom: '10%'}}
                onPress={getDirection}
              />
            )}
            {route && (!moveToDestination || arrivedDest) && (
              <View>
                <AntDesign
                  name="checkcircle"
                  color={colors.primary}
                  size={70}
                  style={{marginVertical: 10, alignSelf: 'center'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: colors.fontMedium,
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {arrivedDest
                    ? 'Arrived At Destination'
                    : 'Arrived At Customer Location'}
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: colors.fontMedium,
                    fontSize: 16,
                    textAlign: 'center',
                    width: '80%',
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}>
                  {tripData?.end_location}
                </Text>

                {arrivedDest ? (
                  <YellowButton
                    title="Collect Cash"
                    hideIcon={false}
                    addStyle={{marginHorizontal: '10%', marginBottom: '10%'}}
                    onPress={EndTrip}
                  />
                ) : (
                  <YellowButton
                    title="Ask for OTP"
                    hideIcon={false}
                    addStyle={{marginHorizontal: '10%', marginBottom: '10%'}}
                    onPress={() => setOtpmvisible(!otpmvisible)}
                  />
                )}
              </View>
            )}
            {moveToDestination && (
              <YellowButton
                title="Navigate To Destination"
                hideIcon={false}
                addStyle={{marginHorizontal: '10%', marginBottom: '10%'}}
                onPress={() => {
                  setMoveToDestination(false);
                  setArrivedDest(true);
                }}
              />
            )}
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
