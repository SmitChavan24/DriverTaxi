import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/AntDesign';
import NavigationBackComponent from '../../components/NavigationBackComponent';
import colors from '../../utils/globalColors';
import Contact from '../../assets/images/uploadf.png';
import Contact2 from '../../assets/images/prof.png';
import DocumentPicker from 'react-native-document-picker';
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';
import Dropdown from '../../modules/DropDown';

const UploadDocs = (props: any) => {
  const [selectedGender, setSelectedGender] = useState('Male');
  const [auth, setAuth] = useState([
    {step: 'Profile picture'},
    {step: 'Bank Account Details'},
    {step: 'Driving Details'},
    {step: 'Taxi Details'},
  ]);
  const terms = [
    {term: 'Please Upload a Clear Selfie'},
    {term: 'The Selfie Should have the applicants Face Alone'},
    {term: 'Upload PDF / JPEG / PNG'},
  ];
  const [pickedFile, setPickedFile] = useState(null);

  const pickDocument = async () => {
    const FILE_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    try {
      const result = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: [DocumentPicker.types.images],
      });
      if (result) {
        console.log('Picked document:0', result);

        const {name, size, type, uri} = result[0];
        setPickedFile(null);
        if (size > FILE_MAX_SIZE) {
          Alert.alert(
            'File Size Limit Exceeded',
            'Please select a file up to 2 MB.',
          );
        } else {
          console.log('Picked document:2', result);
          setPickedFile({name, size, type, uri});
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
        console.log('Document picker cancelled by user');
      } else {
        // Handle other errors
        console.log('Error picking document:', err);
      }
      return null;
    }
  };
  const pickDocuments = async () => {
    const FILE_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true, // Enable multi-selection
        type: [DocumentPicker.types.images],
      });

      if (results.length !== 3) {
        Alert.alert('Selection Limit', 'You can have to select 3 files.');
        return;
      }

      const validFiles = results.filter(file => file.size <= FILE_MAX_SIZE);

      if (validFiles.length < results.length) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Some files exceed the 2 MB limit and were not added.',
        );
      }

      // Update state with the selected files
      setPickedFile(validFiles); // Assuming pickedFiles is an array state
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picker cancelled by user');
      } else {
        console.log('Error picking documents:', err);
      }
    }
  };
  const handleRemoveFile = indexToRemove => {
    setPickedFile(prevFiles =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };
  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />
      <NavigationBackComponent onPress={() => props.navigation.goBack()} />

      <View style={{width: '80%', alignSelf: 'center'}}>
        <Text style={styles.text}>Profile Picture</Text>
        {terms.map((data, index) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '5%',
            }}
            key={index}>
            <Icon2 name="checkcircle" color={'#777777'} size={20} />
            <Text style={styles.text2}>{data.term}</Text>
          </View>
        ))}
        <View
          style={{
            backgroundColor: '#777777',
            height: 1,
            width: '100%',
            marginVertical: 10,
          }}
        />
        <Text style={styles.textt}>Profile Picture</Text>

        <TouchableOpacity style={styles.upload} onPress={pickDocuments}>
          <Image source={Contact} style={{marginRight: 10}}></Image>
          <Text
            style={{
              fontSize: 16,
              fontFamily: colors.fontBold,
              marginTop: '1%',
              color: '#777777',
            }}>
            Upload Documents
          </Text>
        </TouchableOpacity>
        {/* {pickedFile?.uri && (
          <View style={{marginTop: 30}}>
            <Icon
              name="circle-with-cross"
              color={'#777777'}
              size={20}
              style={{
                position: 'absolute',
                top: -8,
                left: -8,
                zIndex: 99,
              }}
              onPress={() => setPickedFile(null)}
            />
            <Image
              source={{uri: pickedFile?.uri}}
              resizeMode="cover"
              style={{
                overflow: 'hidden',
                marginBottom: 5,
                height: 90,
                width: 90,
                backgroundColor: '#D9D9D9',
                borderRadius: 15,
                alignItems: 'flex-end',
              }}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: colors.fontMedium,
                color: colors.black,
                marginLeft: 6,
              }}>
              Profile
            </Text>
            <Text
              style={{
                fontSize: 8,
                fontFamily: colors.fontMedium,
                color: '#777777',
                marginLeft: 6,
              }}>
              JPG .250 kb
            </Text>
          </View>
        )} */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {pickedFile?.map((data, index) => (
            <View style={{marginTop: 30, marginRight: 25}} key={index}>
              <Icon
                name="circle-with-cross"
                color={'#777777'}
                size={20}
                style={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  zIndex: 99,
                }}
                onPress={() => handleRemoveFile(index)}
              />
              <Image
                source={{uri: data?.uri}}
                resizeMode="cover"
                style={{
                  overflow: 'hidden',
                  marginBottom: 5,
                  height: 90,
                  width: 90,
                  backgroundColor: '#D9D9D9',
                  borderRadius: 15,
                  alignItems: 'flex-end',
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: colors.fontMedium,
                  color: colors.black,
                  marginLeft: 6,
                }}>
                Profile
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: colors.fontMedium,
                  color: '#777777',
                  marginLeft: 6,
                }}>
                JPG .250 kb
              </Text>
            </View>
          ))}
        </View>
        <YellowButton
          title="Next"
          onPress={() => props.navigation.navigate('CompleteAuth')}
        />
      </View>
    </View>
  );
};

export default UploadDocs;

const styles = StyleSheet.create({
  upload: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#777777',
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
  textt: {
    fontSize: 16,
    fontFamily: colors.fontBold,
    marginBottom: 12,
    marginTop: '5%',
    color: colors.black,
    // textDecorationLine: 'underline',
  },
  text2: {
    fontSize: 14,
    fontFamily: colors.fontMedium,
    color: '#9D9393',
    marginLeft: 15,
    // textDecorationLine: 'underline',
  },
  text: {
    fontSize: 17,
    fontFamily: colors.fontBold,
    textAlign: 'center',
    marginRight: 15,
    marginBottom: '7%',
    color: colors.black,
    marginTop: (colors.height * 1) / 100,
    // textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 1,
    padding: 10,
    width: '100%',
    marginBottom: '2%',
    backgroundColor: '#FFFFFF',
  },

  textInput: {
    flex: 1,
    fontFamily: colors.fontRegular,
    marginHorizontal: 5,
    color: '#000000',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary, // Gold color for selected
    borderColor: colors.black,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: colors.fontSemiBold,
    color: '#000',
  },
});
