import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../utils/globalColors';
import Icon2 from 'react-native-vector-icons/Feather';
import paddingHelper from '../utils/paddingHelper';
import {useState} from 'react';

const Dropdown = ({
  options = ['Male', 'Female', 'Other'],
  placeholder = 'Search Your City Here',
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.inputContainer2}>
      <TouchableOpacity style={styles.dropdownHeader} onPress={toggleDropdown}>
        <Text style={styles.textInput2}>{selectedOption || placeholder}</Text>
        <Icon2
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#505050"
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
export default Dropdown;
const styles = StyleSheet.create({
  textInput2: {
    fontFamily: colors.fontMedium,
    color: '#9D9393',
    paddingLeft: 10,
    fontSize: 14,
  },
  inputContainer2: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: '10%',
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: paddingHelper(),
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    marginTop: 5,
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 12,
    paddingRight: 20,
    paddingLeft: 10,
    paddingVertical: 10,
    marginBottom: '10%',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 5,
    fontFamily: colors.fontRegular,
    color: colors.black,
    fontSize: 14,
  },
  textb: {
    fontSize: 24,
    fontFamily: colors.fontBold,
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.black,
  },

  backgroundImage: {
    width: (colors.width * 25) / 100,
    height: (colors.width * 25) / 100,
    alignSelf: 'center',
    borderRadius: (colors.width * 30) / 100,
    resizeMode: 'cover', // Ensures the image covers the screen
  },
});
