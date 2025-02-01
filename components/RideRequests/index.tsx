import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import YellowButton from '../YellowButton';
import colors from '../../utils/globalColors';
import {ScrollView} from 'react-native-gesture-handler';

const index = ({updatedRequests, handleDeclineRequest, handleAccept}) => {
  return (
    <FlatList
      data={updatedRequests}
      scrollEnabled={true}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item: request, index}) => (
        <View style={{flex: 1}}>
          <View style={[styles.header, index !== 0 && styles.flexEnd]}>
            {index === 0 && (
              <Text style={styles.rideRequestText}>Ride Request</Text>
            )}
            <Text style={styles.timeAwayText}>6 mins Away</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.customerInfoContainer}>
            <View style={styles.customerDetails}>
              <Image source={require('../../assets/images/prof.png')} />
              <View style={styles.customerTextContainer}>
                <Text style={styles.customerName}>
                  {request?.customer?.name || 'Mark Smith'}
                </Text>
                <Text style={styles.paymentMethod}>Cash Payment</Text>
              </View>
            </View>
            <View style={styles.contactIcons}>
              <TouchableOpacity style={styles.iconContainer}>
                <FontAwesome5 name="phone-alt" size={20} color={'#545454'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconContainer}>
                <AntDesign name="message1" size={20} color={'#545454'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rideDetails}>
            <View style={styles.rideDetailItem}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rideDetailText}>
                {request?.distance + ' Miles' || 'Loading...'}
              </Text>
            </View>
            <View style={styles.rideDetailItem}>
              <MaterialIcons
                name="access-time"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rideDetailText}>
                {request?.duration + ' Minutes' || 'Loading...'}
              </Text>
            </View>
            <View style={styles.rideDetailItem}>
              <FontAwesome6
                name="hand-holding-dollar"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rideDetailText}>₹{request?.fare}</Text>
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
                numberOfLines={1}
                editable={false}
                selection={{start: 0}}
                value={request.start_location}
                placeholder="Location..."
                placeholderTextColor="#B4BDC4"
                cursorColor={colors.black}
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
                editable={false}
                selection={{start: 0}}
                value={request.end_location}
                placeholder="Enter Destination"
                placeholderTextColor="#B4BDC4"
                cursorColor={colors.black}
              />
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <View style={styles.buttonWrapper}>
              <YellowButton
                title="Decline"
                hideIcon={false}
                addStyle={styles.declineButton}
                onPress={() => handleDeclineRequest(request.trip_id)}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <YellowButton
                title="Accept"
                hideIcon={false}
                onPress={() => handleAccept(request.trip_id)}
              />
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: '3%',
    marginTop: 5,
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  rideRequestText: {
    color: '#0A0A0A',
    fontFamily: colors.fontSemiBold,
    fontSize: 18,
  },
  timeAwayText: {
    color: '#0A0A0A',
    fontFamily: colors.fontMedium,
    fontSize: 12,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#D9D9D9',
    width: '90%',
    alignSelf: 'center',
  },
  customerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: '2%',
  },
  customerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  customerTextContainer: {
    marginLeft: 10,
  },
  customerName: {
    color: '#0A0A0A',
    fontFamily: colors.fontSemiBold,
    fontSize: 18,
  },
  paymentMethod: {
    color: '#0A0A0A',
    fontFamily: colors.fontRegular,
    fontSize: 12,
  },
  contactIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    borderColor: '#D9D9D9',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: '2%',
  },
  rideDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideDetailText: {
    fontSize: 17,
    fontFamily: colors.fontRegular,
    color: colors.black,
    marginLeft: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    alignSelf: 'center',
  },
  buttonWrapper: {
    width: '45%',
  },
  declineButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#C9C2C2',
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

export default index;
