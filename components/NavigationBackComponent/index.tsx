import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import globalColors from '../../utils/globalColors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const {width} = Dimensions.get('window');

const NavigationBackComponent = (props: any) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={{flexDirection: 'row', width: '90%', alignItems: 'center'}}>
        <TouchableOpacity
          style={[
            {flexDirection: 'row', alignItems: 'center'},
            props.innerContainerStyle,
          ]}
          onPress={() => props?.onPress()}>
          <Icon
            name="arrowleft"
            color={props.color ? props.color : 'black'}
            size={40}
            style={{marginTop: 3}}
          />
          <Text numberOfLines={2} style={[styles.text, props.style]}>
            {props.name}
          </Text>
        </TouchableOpacity>
      </View>

      {props.bbpsLogo && (
        <View
          style={{
            width: (width * 20) / 100,
            height: (width * 20 * (19 / 57.29)) / 100,
            marginLeft: (-width * 5) / 100,
            marginTop: '2%',
          }}></View>
      )}

      {/* {props?.fav && (
        <>
          {props?.favCheck ? (
            <View
              style={{
                width: '10%',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity onPress={() => props.rightNavHandle()}>
                <AntDesign name="heart" color={'#F6462D'} size={22} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                width: '10%',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity onPress={() => props.rightNavHandle()}>
                <AntDesign name="hearto" color={'#0E0E0E'} size={22} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )} */}
      {props?.fav && (
        <View
          style={{
            width: '10%',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity onPress={() => props.rightNavHandle()}>
            <AntDesign
              name={props?.favCheck ? 'heart' : 'hearto'}
              color={props?.favCheck ? '#F6462D' : '#0E0E0E'}
              size={22}
            />
          </TouchableOpacity>
        </View>
      )}

      {props.shareButton && (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={props.shareButton}
              style={{marginRight: 0}}>
              <Ionicons name="share-social-outline" color="black" size={24} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {props.questionButton && (
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={props.questionButton}
            style={{marginRight: 0}}>
            <Ionicons name="help-circle-outline" color="black" size={28} />
          </TouchableOpacity>
        </View>
      )}

      {props.actionButton && (
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={props.actionButton}
            style={{marginRight: 0}}>
            <Entypo name="dots-three-vertical" color="black" size={16} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    // marginBottom: '2%',
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  text: {
    fontFamily: globalColors.fontSemiBold,
    fontSize: 20,
    color: 'black',
    marginLeft: '5%',
    width: '82%',
  },
});

export default NavigationBackComponent;
