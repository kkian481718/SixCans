import SectionList from './Sectionlist'

import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'

// [Setting Screen]
export default function SettingScreen(props) {

    console.log('[Open] Setting Screen');
  
    const _backToHome = () => {
      //REFRESH_HOME = 'DO';
      props.navigation.navigate('Home', {});
    };
  
    return (
      <View style={styles.listContainer}>
  
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <TouchableOpacity style={styles.button} onPress={() => _backToHome()}>
            <Image source={require('../common/cross.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 0 }} />
          </TouchableOpacity>
        </View>
  
        <SectionList/>
  
      </View>
    );
  
}

// [Styling]
const styles = StyleSheet.create({

  listContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  
  button: {
    backgroundColor: '#F5F5F5',
    width: '90%',
    height: 50,

    marginLeft:10,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },

});