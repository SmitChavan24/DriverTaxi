import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '../../utils/globalColors';
import Icon from 'react-native-vector-icons/AntDesign';
import shadowProp from '../../utils/shadowProp';

type Props = {onPress: () => void; title: string};

const YellowButton = (props: Props) => {
  const {onPress, title = '', addStyle, hideIcon = true} = props;
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, addStyle, shadowProp(2)]}
      onPress={() => onPress()}>
      <Text style={[styles.buttonLabel, props.color]}>{title}</Text>
      {hideIcon && (
        <View style={styles.iconContainer}>
          <Icon name="arrowright" color={'#000000'} size={25} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default YellowButton;

const styles = StyleSheet.create({
  buttonLabel: {
    fontSize: 18,
    marginVertical: 15,
    fontFamily: colors.fontBold,
    color: '#0A0A0A',
    letterSpacing: 0.048,
    textAlign: 'center', // Centers the text
    flex: 1, // Ensures the text stays in the center
  },
  buttonStyle: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: colors.primary,
    marginVertical: '4%',
    // width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between', // Distributes text and icon correctly
    alignItems: 'center',
    paddingHorizontal: 10, // Adds padding around content
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    position: 'absolute',
    right: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 8, // Adjusts spacing inside the icon container
    marginLeft: 10, // Space between the label and the icon
  },
});
