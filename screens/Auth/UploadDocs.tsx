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
import {API_URL, DEV_URL} from '@env';
import Contact from '../../assets/images/uploadf.png';
import Contact2 from '../../assets/images/prof.png';
import DocumentPicker from 'react-native-document-picker';
import YellowButton from '../../components/YellowButton';
import paddingHelper from '../../utils/paddingHelper';
import Dropdown from '../../modules/DropDown';
import {showToast} from '../../modules/Toast';
import axios from 'axios';
import SuccessModal from '../../modules/SuccessModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadDocs = (props: any) => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fileError, setFileError] = useState('');
  const [popupDetails, setPopupDetails] = useState([
    {
      name: 'Profile Picture',
      imageSrc: require('../../assets/images/ProfileInt.png'),
      text: 'Great job! Your profile is complete. Now, lets move on to secure your payments by adding your bank details.',
    },
    {
      name: 'Bank Account Details',
      imageSrc: require('../../assets/images/Creditcard.png'),
      text: 'Awesome! Your bank details are all set.Next, lets make sure we have your driving details to eep you on the road safely.',
    },
    {
      name: 'Driving License',
      imageSrc: require('../../assets/images/drivings.png'),
      text: 'Well done! Your driving details are updated. Finally, lets add your taxi information to complete your profile.',
    },
  ]);
  let completed = [
    ...(props?.route?.params?.params || []),
    props?.route?.params?.data?.step,
  ].filter(Boolean);

  const [auth, setAuth] = useState([
    {step: 'Profile picture'},
    {step: 'Bank Account Details'},
    {step: 'Driving Details'},
    {step: 'Taxi Details'},
  ]);
  const Profterms = [
    {term: 'Please Upload a Clear Selfie'},
    {term: 'The Selfie Should have the applicants Face Alone'},
    {term: 'Upload PDF / JPEG / PNG'},
  ];
  const Bankterms = [
    {
      term: 'Upload Bank Document (Passbook , Cancelled Cheque, Bank Statement, or Digital Account Screenshot)',
    },
    {term: 'Upload PDF / JPEG / PNG'},
  ];
  const Drivingterms = [
    {term: 'Photocopies and printouts of documents will not be accepted'},
    {
      term: 'Only documents that are less than 10MB in size and in JPG, JPEG, PNG, or PDF format will beaccepted ',
    },
    {term: 'The photos and all details must be clearly visible'},
  ];
  const Taxiterms = [
    {term: 'Photocopies and printouts of documents will not be accepted'},
    {
      term: 'Only documents that are less than 10MB in size and in JPG, JPEG, PNG, or PDF format will beaccepted ',
    },
    {term: 'The photos and all details must be clearly visible'},
  ];

  const termsMapping = {
    'Profile Picture': Profterms,
    'Bank Account Details': Bankterms,
    'Driving License': Drivingterms,
    'Taxi Details': Taxiterms,
  };

  const selectedTerms = termsMapping[props?.route?.params?.data?.step] || [];
  const selectedPopupDetail = popupDetails.find(
    item => item.name === props?.route?.params?.data?.step,
  );
  const [pickedFile, setPickedFile] = useState(null);

  const getMaxFiles = title => {
    switch (title) {
      case 'Profile Picture':
      case 'Bank Account Details':
        return 1;
      case 'Driving License':
        return 2;
      case 'Taxi Details':
        return 3;
      default:
        return 1; // Default case
    }
  };

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
        type: [DocumentPicker.types.images, DocumentPicker.types.allFiles],
      });
      const maxFiles = getMaxFiles(props?.route?.params?.data?.step);
      const existingFiles = pickedFile ?? [];
      const totalFiles = existingFiles.length + results.length;
      console.log(maxFiles, 'max files');
      if (totalFiles !== maxFiles) {
        showToast(
          `You need to select exactly ${maxFiles} files. Currently selected: ${totalFiles}.`,
        );
        return;
      }

      const validFiles = results.filter(file => file.size <= FILE_MAX_SIZE);

      if (validFiles.length < results.length) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Some files exceed the 2 MB limit and were not added.',
        );
      }
      const finalFiles = [...existingFiles, ...validFiles];
      // Update state with the selected files
      setPickedFile(finalFiles); // Assuming pickedFiles is an array state
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

  const performApiCall = async title => {
    console.log(`Perform API call with ${pickedFile.length} files`);
    let driverId = await AsyncStorage.getItem('auth-token');
    driverId = JSON.parse(driverId);
    driverId = driverId?.user?.id;

    const maxFiles = getMaxFiles(props?.route?.params?.data?.step);
    // Check if the number of uploaded files matches the required number
    if (pickedFile.length < maxFiles) {
      showToast(`You must upload ${maxFiles} file(s) for ${title}.`);
      // setPickedFile([]);
      return {status: 404};
    }

    try {
      const formData = new FormData();
      let apiEndpoint;
      console.log(pickedFile, 'pickedFile');
      switch (title) {
        case 'Profile Picture':
          apiEndpoint = 'api/drivers/upload-profile';
          formData.append('profile_pic', pickedFile[0]);
          formData.append('driverId', driverId);
          console.log(formData, 'data');
          break;
        case 'Bank Account Details':
          apiEndpoint = 'api/drivers/upload-bank-details';
          formData.append('bank-document', pickedFile[0]);
          formData.append('driverId', driverId);

          break;
        case 'Driving License':
          apiEndpoint = 'api/drivers/upload-driving-license';
          formData.append('license_front', pickedFile[0]);
          formData.append('license_back', pickedFile[1]);
          formData.append('driverId', driverId);

          break;
        case 'Taxi Details':
          apiEndpoint = 'api/drivers/upload-taxi-images';
          formData.append('photo_front', pickedFile[0]);
          formData.append('photo_back', pickedFile[1]);
          formData.append('photo_inside', pickedFile[2]);
          formData.append('driverId', driverId);
          break;
        default:
          showToast('Invalid upload type');
      }
      console.log(`${DEV_URL}${apiEndpoint}`);
      const response = await axios.put(`${DEV_URL}${apiEndpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        showToast('Uploaded successfully', 'success');
        if (props?.route?.params?.data?.step === 'Taxi Details') {
          props.navigation.navigate('CompleteAuth', {completed});
        } else {
          setShowModal(!showModal);
        }
        setTimeout(() => {}, 1000);
        setPickedFile([]);
      }
      console.log(
        `Returning with ${response?.status} status & data`,
        response.data,
      );

      return {status: response?.status, data: response?.data};
    } catch (error) {
      showToast('Uploading failed, try again...');
      console.error(`Error uploading ${title}:`, error);
      showToast(`Error uploading ${title}: ${error.message}`);
      return {
        status: error?.response ? error?.response?.status : 500,
        error: error?.message,
      };
    }
  };
  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   const validFiles = [];
  //   let hasError = false;

  //   selectedFiles.forEach((file) => {
  //     // Check for file size
  //     if (file.size > MAX_FILE_SIZE) {
  //       setFileError(`File "${file.name}" exceeds the 10MB size limit.`);
  //       hasError = true;
  //     }
  //     // Check for file type
  //     else if (!ALLOWED_FILE_TYPES.includes(file.type)) {
  //       setFileError(
  //         `File "${file.name}" is not a valid type. Only PDF, JPEG, and PNG files are allowed.`
  //       );
  //       hasError = true;
  //     } else {
  //       validFiles.push(file);
  //     }
  //   });

  //   if (!hasError) {
  //     setFileError("");
  //   }

  //   setFiles((prevFiles) => {
  //     const newFiles = [...prevFiles, ...validFiles].slice(0, maxFiles);
  //     return newFiles;
  //   });
  // };
  const handleSubmit = async () => {
    const {status, data} = await performApiCall(title, files, driverId);
    if (status === 200) {
      // onButtonClick(status, data);
    }
  };
  return (
    <View style={[styles.container]}>
      <StatusBar hidden={true} />
      {/* <NavigationBackComponent onPress={() => props.navigation.goBack()} /> */}

      <View style={{width: '80%', alignSelf: 'center', marginTop: '20%'}}>
        <Text style={styles.text}>{props?.route?.params?.data?.step}</Text>
        {selectedTerms.map((data, index) => (
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
        <Text
          style={
            styles.textt
          }>{`Attach ${props?.route?.params?.data?.step}`}</Text>

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
        <SuccessModal
          visible={showModal}
          modalPress={() => {
            setShowModal(!showModal);
            props.navigation.navigate('CompleteAuth', {
              completed,
            });
          }}
          popupDetail={selectedPopupDetail} // Pass the selected popup details
        />
        <YellowButton
          title="Continue"
          // onPress={() => props.navigation.navigate('Submitted')}
          onPress={() => performApiCall(props?.route?.params?.data?.step)}
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
