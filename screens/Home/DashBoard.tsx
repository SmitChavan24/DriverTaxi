import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
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
import Prof from '../../assets/images/prof.png';
import Feather from 'react-native-vector-icons/Feather';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DashBoard = (props: any) => {
  const [initialLocation, setInitialLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [route, setRoute] = useState(null);
  const snapPoints = useMemo(() => ['17%', '50%']);
  const [time, settime] = useState(true);
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
        {time && (
          <View style={{marginHorizontal: '4%'}}>
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
      {!time && (
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
          {!time ? (
            <YellowButton
              title="Find Ride"
              hideIcon={false}
              addStyle={{marginHorizontal: '10%'}}
              onPress={() => props.navigation.navigate('LocationAcess')}
            />
          ) : (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: '3%',
                }}>
                <Text
                  style={{
                    color: '#0A0A0A',
                    fontFamily: colors.fontSemiBold,
                    fontSize: 18,
                  }}>
                  Ride Request
                </Text>
                <Text
                  style={{
                    color: '#0A0A0A',
                    fontFamily: colors.fontMedium,
                    fontSize: 12,
                  }}>
                  6 mins Away
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: '#D9D9D9',
                  width: '90%',
                  alignSelf: 'center',
                }}></View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginVertical: '2%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: '3%',
                  }}>
                  <Image source={Prof} />
                  <View style={{marginLeft: 10}}>
                    <Text
                      style={{
                        color: '#0A0A0A',
                        fontFamily: colors.fontSemiBold,
                        fontSize: 18,
                      }}>
                      Mark Smith
                    </Text>
                    <Text
                      style={{
                        color: '#0A0A0A',
                        fontFamily: colors.fontRegular,
                        fontSize: 12,
                      }}>
                      Cash Payment
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      borderColor: '#D9D9D9',
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                    }}>
                    <FontAwesome5
                      name="phone-alt"
                      size={20}
                      color={'#545454'}
                    />
                  </View>
                  <View
                    style={{
                      borderColor: '#D9D9D9',
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginLeft: 10,
                    }}>
                    <AntDesign name="message1" size={20} color={'#545454'} />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '75%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginVertical: '2%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name="location-on"
                    size={20}
                    color={colors.black}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: colors.fontRegular,
                      color: colors.black,
                      marginLeft: 5,
                    }}>
                    34 Km
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name="access-time"
                    size={20}
                    color={colors.black}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: colors.fontRegular,
                      color: colors.black,
                      marginLeft: 5,
                    }}>
                    1h30m
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <FontAwesome6
                    name="hand-holding-dollar"
                    size={20}
                    color={colors.black}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: colors.fontRegular,
                      color: colors.black,
                      marginLeft: 5,
                    }}>
                    ₹289.00
                  </Text>
                </View>
              </View>
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
                  <FontAwesome5
                    name="map-marker-alt"
                    size={20}
                    color="#299B56E5"
                  />
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
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                  width: '85%',
                }}>
                <View
                  style={{
                    width: '45%',
                  }}>
                  <YellowButton
                    title="Decline"
                    hideIcon={false}
                    addStyle={{
                      backgroundColor: '#F8F9FA',
                      borderWidth: 1,
                      borderColor: '#C9C2C2',
                    }}
                    // onPress={() => props.navigation.navigate('DashBoard')}
                  />
                </View>
                <View
                  style={{
                    width: '45%',
                  }}>
                  <YellowButton
                    title="Accept"
                    hideIcon={false}
                    onPress={() => props.navigation.navigate('CollectCash')}
                  />
                </View>
              </View>
            </View>
          )}
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
    fontFamily: colors.fontBold,
    fontSize: 16,
  },
});
