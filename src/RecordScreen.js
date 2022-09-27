import SectionList from './data/Sectionlist'

import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native'

// [Setting Screen]
export default function SettingScreen({ route, navigation }) {

    console.log('[Open] Setting Screen');
    let { leftBudget, list_obj_Category, list_usedMoney } = route.params;
  
    const _backToHome = () => {
      props.navigation.navigate('Home');
    };
  
    return (
      <View style={styles.listContainer}>
  
        <SectionList/>

        <View style={styles.box_menuButton}>
          <TouchableOpacity style={styles.button_center} onPress={() => navigation.navigate("NewRecord", { leftBudget, list_obj_Category, list_usedMoney })}>
            <Image source={require('../common/plus.png')} resizeMode='center' style={{ width: 25, height: 25, }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button_right} onPress={() => navigation.navigate("Home", {})}>
            <Image source={require('../common/cross.png')} resizeMode='center' style={{ width: 20, height: 20, }} />
          </TouchableOpacity>
        </View>
  
      </View>
    );
  
}

// [Styling]
const styles = StyleSheet.create({

  listContainer: {
    backgroundColor: '#727272',
    flex: 1,
    paddingTop: 43,
  },

  box_menuButton: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#A9A598',
    Height: 85,
    width: Dimensions.get('screen').width,
    paddingLeft: 18,
    paddingRight: 18,
  },
  button_center: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#F7F8DF',
    width: '80%',
    height: 53,
    borderRadius: 15,
  },
  button_right: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#F7F8DF',
    width: 57,
    height: 53,
    borderRadius: 15,
  },
});