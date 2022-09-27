import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native'

import { Overlay, Slider } from "@rneui/themed";



// [Home Screen]
export default function HomeScreen({ route, navigation }) {

  console.log('[Open] Detail Screen');

  // Variables Setting
  let [leftBudget, set_leftBudget] = useState(0);
  let [list_usedMoney, set_list_usedMoney] = useState([0, 0, 0, 0, 0, 0]);
  let [list_obj_Category, set_list_obj_Category] = useState([
    {
      "name": ""
    },
    {
      "name": ""
    },
    {
      "name": ""
    },
    {
      "name": ""
    },
    {
      "name": ""
    },
    {
      "name": ""
    }
  ]);

  let [list_progress_origin, set_list_progress_origin] = useState([0, 0, 0, 0, 0, 0]);
  let [list_goal, set_list_goal] = useState([0, 0, 0, 0, 0, 0]);


  // 1. render things
  const _refreshPage = () => {
    set_leftBudget(leftBudget);
    set_list_usedMoney(list_usedMoney);
    set_list_obj_Category(list_obj_Category);

    set_list_progress_origin(list_progress_origin);
    set_list_goal(list_goal);
  };

  // sub: warning before reset anything
  const _checkReset = () => {
    Alert.alert(
      "確定要重置所有紀錄嗎？",
      "包含預算、進度、記帳紀錄都會被清除。",
      [
        {
          text: "算了不要",
          onPress: () => Alert.alert("看起來甚麼也沒發生。"),
          style: "cancel",
        },
        {
          text: "清除！",
          onPress: _reset,
          style: "destructive",
        },
      ],
    );
  };

  // sub: reset anything
  const _reset = async () => {

    console.log('=== 清除中 ===');

    await AsyncStorage.removeItem('@leftBudget');
    await AsyncStorage.removeItem('@SpendingRecord');
    await AsyncStorage.removeItem('@Category')
    await AsyncStorage.removeItem('@Category.usedMoney');
    await AsyncStorage.removeItem('@lastYearAndMonth');
    await AsyncStorage.removeItem('@usedMoneyMonthlyRecord');

    console.log('清除 @leftBudget');
    console.log('清除 @SpendingRecord');
    console.log('清除 @Category');
    console.log('清除 @Category.usedMoney');
    console.log('清除 @lastYearAndMonth');
    console.log('清除 @usedMoneyMonthlyRecord');

    leftBudget = 0;
    list_usedMoney = [0, 0, 0, 0, 0, 0];

    navigation.navigate('Home', { leftBudget, list_obj_Category, list_usedMoney });
    Alert.alert("資料已成功清除！");
  };

  // sub: shows the hint of total
  const totalInfo = () => {
    Alert.alert(
      "本月預算",
      "\n這是你這個月的「所有收入」\n\n剩餘可用金額請參考首頁旁邊的橘字"
    )
  };

  // sub:
  const _editButton = (Index) => {
    const [visible, setVisible] = useState(false);

    // name
    let [category_name, set_category_name] = useState();
    const default_name = list_obj_Category[Index].name;

    // percentage
    let [category_percentage, set_category_percentage] = useState(list_obj_Category[Index].percentage);
    //const default_percentage = list_obj_Category[Index].percentage;

    // note
    let [category_note, set_category_note] = useState(undefined);
    const default_note = list_obj_Category[Index].description;

    const toggleOverlay = () => {
      setVisible(!visible);

      category_name = undefined;
      category_percentage = list_obj_Category[Index].percentage;
      category_note = undefined;
      set_category_name(category_name);
      set_category_percentage(category_percentage);
      set_category_note(category_note);
    };

    const _checkDetailInput = () => {

      console.log('--_checkDetailInput');
      console.log('category_name: ', category_name);
      console.log('category_percentage: ',category_percentage);
      console.log('category_note: ',category_note);

      if (category_name != "") {
        _saveDetail();
      }
      else {
        Alert.alert("沒名稱！", "請輸入名稱：3");
      }
    };

    
    const _saveDetail = async () => {

      console.log('--_saveDetail');

      if (category_name != undefined) 
        list_obj_Category[Index].name = category_name;

      list_obj_Category[Index].percentage = category_percentage;

      if (category_note != undefined)
        list_obj_Category[Index].description = category_note;
  
      let list_Category = [];
      let temp_count = 0;
      for(let i=0; i<=5; i++) {
        list_Category[temp_count] = list_obj_Category[i].name;
        list_Category[temp_count + 1] = list_obj_Category[i].percentage;
        list_Category[temp_count + 2] = list_obj_Category[i].description;
  
        temp_count += 3;
        console.log('list_Category: ', list_Category);
        console.log('list_obj_Category[i].note: ', list_obj_Category[i].note);
      };
  
      await AsyncStorage.setItem('@Category', list_Category.toString());
      toggleOverlay();
    };

    return (
      <View>

        <TouchableOpacity onPress={toggleOverlay}>
          <Image source={require('../common/edit.png')} resizeMode='center' style={{ width: 30, height: 30, }} />
        </TouchableOpacity>

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay}>

          <View style={styles.box_edit}>
           <Text style={styles.label_editTitle}>名稱</Text>
           <TextInput
              style={styles.input_name}
              selectionColor={'#F7F8DF'}
              onChangeText={set_category_name}
              value={category_name}
              defaultValue={default_name}
              placeholder="輸入名稱"
              keyboardType="default"
              required
            />
          </View>
          
          <View style={styles.box_edit}>
           <Text style={styles.label_editTitle}>占比</Text>
            <Slider
              value={category_percentage}
              onValueChange={set_category_percentage}
              maximumValue={100}
              minimumValue={0}
              step={5}
              allowTouchTrack
              
              //containerStyle={{ marginBottom: 100, backgroundColor: '#F7F8DF' }}
              trackStyle={{ marginLeft: 18, height: 20, width: Dimensions.get('screen').width-210, borderRadius: 10,  }}
              thumbStyle={{ marginLeft: 14, height: 22, width: 22, backgroundColor: '#F7F8DF', }}
              thumbProps={{}}
            />
            <Text style={styles.label_editPercentage}>{category_percentage}%</Text>
          </View>
          <Text style={{ marginLeft: 80, marginBottom: 15, color: '#F79C30', fontWeight: 'bold' }}>（代表這個月有 {Math.round(category_percentage * 0.01 * leftBudget)} NTD. 可以用）</Text>
          
          
          <View style={styles.box_edit}>
           <Text style={styles.label_editTitle}>備註</Text>
           <TextInput
              style={styles.input_note}
              selectionColor={'#F7F8DF'}
              onChangeText={set_category_note}
              value={category_note}
              defaultValue={default_note}
              placeholder="輸入備註"
              keyboardType="default"
            />
          </View>

          <View style={styles.box_editButton}>
            <TouchableOpacity style={styles.button_editLeft} onPress={_checkDetailInput}>
              <Image source={require('../common/disk.png')} resizeMode='center' style={{ width: 25, height: 25, }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button_editRight} onPress={toggleOverlay}>
              <Image source={require('../common/cross.png')} resizeMode='center' style={{ width: 20, height: 20, }} />
            </TouchableOpacity>
          </View>

        </Overlay>
      </View>
    );
  };

  // >>> Entering point <<<
  if (route.params != undefined) {
    leftBudget = route.params.leftBudget;
    list_obj_Category = route.params.list_obj_Category;
    list_usedMoney = route.params.list_usedMoney;
    list_progress_origin = route.params.list_progress_origin;

    console.log('list_progress_origin: ', list_progress_origin);
    console.log('list_obj_Category: ', list_obj_Category);

    list_goal = [
      Math.round(leftBudget * (list_obj_Category[0].percentage * 0.01)), // 投資
      Math.round(leftBudget * (list_obj_Category[1].percentage * 0.01)), // 學習
      Math.round(leftBudget * (list_obj_Category[2].percentage * 0.01)), // 生活
      Math.round(leftBudget * (list_obj_Category[3].percentage * 0.01)), // 玩樂
      Math.round(leftBudget * (list_obj_Category[4].percentage * 0.01)), // 長線
      Math.round(leftBudget * (list_obj_Category[5].percentage * 0.01)), // 給予
    ];

    route.params = undefined;
    _refreshPage();
  }

  return (

    <View style={styles.backgroundView}>

      <StatusBar backgroundColor="#A9A598" />

      <TouchableOpacity style={styles.box_total} onPress={totalInfo}>
        <Text style={styles.label_leftMoney}>{leftBudget} NTD.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box_reset} onPress={_checkReset}>
        <Text style={styles.label_reset}>重設所有資料</Text>
      </TouchableOpacity>



      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>

          {/*1 投資*/}
          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>

              <View style={{ flexDirection: 'row', }}>
                <Text style={styles.label_boxBeforeTitle}>▌</Text>
                <Text style={styles.label_title}>{list_obj_Category[0].name}</Text>
              </View>
              <Text style={styles.label_percentage}>| 占預算 {list_obj_Category[0].percentage}%</Text>

              {_editButton(0)}

            </View>

            <View style={styles.box_content}>
              <Text style={styles.label_progress}>已使用 {list_progress_origin[0]}%  ( {list_usedMoney[0]} / {list_goal[0]} NTD. ) </Text>

              <View style={styles.box_describtion}>
                <Text style={styles.label_describtionTitle}>說明 |  </Text>
                <Text style={styles.label_describtion}>{list_obj_Category[0].description}</Text>
              </View>

            </View>

          </View>


          {/*2 學習*/}
          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <View style={{ flexDirection: 'row', }}>
                <Text style={styles.label_boxBeforeTitle}>▌</Text>
                <Text style={styles.label_title}>{list_obj_Category[1].name}</Text>
              </View>
              <Text style={styles.label_percentage}>| 占預算 {list_obj_Category[1].percentage}%</Text>

              {_editButton(1)}

            </View>

            <View style={styles.box_content}>
              <Text style={styles.label_progress}>已使用 {list_progress_origin[1]}%  ( {list_usedMoney[1]} / {list_goal[1]} NTD. ) </Text>

              <View style={styles.box_describtion}>
                <Text style={styles.label_describtionTitle}>說明 |  </Text>
                <Text style={styles.label_describtion}>{list_obj_Category[1].description}</Text>
              </View>

            </View>

          </View>


          {/*3 生活*/}
          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <View style={{ flexDirection: 'row', }}>
                <Text style={styles.label_boxBeforeTitle}>▌</Text>
                <Text style={styles.label_title}>{list_obj_Category[2].name}</Text>
              </View>
              <Text style={styles.label_percentage}>| 占預算 {list_obj_Category[2].percentage}%</Text>

              {_editButton(2)}

            </View>

            <View style={styles.box_content}>
              <Text style={styles.label_progress}>已使用 {list_progress_origin[2]}%  ( {list_usedMoney[2]} / {list_goal[2]} NTD. ) </Text>

              <View style={styles.box_describtion}>
                <Text style={styles.label_describtionTitle}>說明 |  </Text>
                <Text style={styles.label_describtion}>{list_obj_Category[2].description}</Text>
              </View>

            </View>

          </View>


          {/*4 玩樂*/}
          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <View style={{ flexDirection: 'row', }}>
                <Text style={styles.label_boxBeforeTitle}>▌</Text>
                <Text style={styles.label_title}>{list_obj_Category[3].name}</Text>
              </View>
              <Text style={styles.label_percentage}>| 占預算 {list_obj_Category[3].percentage}%</Text>

              {_editButton(3)}

            </View>

            <View style={styles.box_content}>
              <Text style={styles.label_progress}>已使用 {list_progress_origin[3]}%  ( {list_usedMoney[3]} / {list_goal[3]} NTD. ) </Text>

              <View style={styles.box_describtion}>
                <Text style={styles.label_describtionTitle}>說明 |  </Text>
                <Text style={styles.label_describtion}>{list_obj_Category[3].description}</Text>
              </View>

            </View>

          </View>


          {/*5 長線*/}
          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <View style={{ flexDirection: 'row', }}>
                <Text style={styles.label_boxBeforeTitle}>▌</Text>
                <Text style={styles.label_title}>{list_obj_Category[4].name}</Text>
              </View>
              <Text style={styles.label_percentage}>| 占預算 {list_obj_Category[4].percentage}%</Text>

              {_editButton(4)}

            </View>

            <View style={styles.box_content}>
              <Text style={styles.label_progress}>已使用 {list_progress_origin[4]}%  ( {list_usedMoney[4]} / {list_goal[4]} NTD. ) </Text>

              <View style={styles.box_describtion}>
                <Text style={styles.label_describtionTitle}>說明 |  </Text>
                <Text style={styles.label_describtion}>{list_obj_Category[4].description}</Text>
              </View>

            </View>

          </View>


          {/*6 給予*/}
          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <View style={{ flexDirection: 'row', }}>
                <Text style={styles.label_boxBeforeTitle}>▌</Text>
                <Text style={styles.label_title}>{list_obj_Category[5].name}</Text>
              </View>
              <Text style={styles.label_percentage}>| 占預算 {list_obj_Category[5].percentage}%</Text>

              {_editButton(5)}

            </View>

            <View style={styles.box_content}>
              <Text style={styles.label_progress}>已使用 {list_progress_origin[5]}%  ( {list_usedMoney[5]} / {list_goal[5]} NTD. ) </Text>

              <View style={styles.box_describtion}>
                <Text style={styles.label_describtionTitle}>說明 |  </Text>
                <Text style={styles.label_describtion}>{list_obj_Category[5].description}</Text>
              </View>

            </View>

          </View>

        </View>
      </ScrollView >


      <View style={styles.box_button}>

        <TouchableOpacity
          style={styles.button_left}
          onPress={() => navigation.navigate('BarChart', { leftBudget, list_obj_Category, list_usedMoney, list_progress_origin })}
        >
          <Image source={require('../common/changePage.png')} resizeMode='center' style={{ width: 30, height: 30, }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button_center}
          onPress={() => navigation.navigate('NewRecord', { leftBudget, list_obj_Category, list_usedMoney })}
        >
          <Image source={require('../common/plus.png')} resizeMode='center' style={{ width: 25, height: 25, }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button_right}
          onPress={() => navigation.navigate("Record", { leftBudget, list_obj_Category, list_usedMoney })}
        >
          <Image source={require('../common/list.png')} resizeMode='center' style={{ width: 30, height: 30, }} />
        </TouchableOpacity>

      </View>

    </View>
  );
};



// [Styling]
const styles = StyleSheet.create({
  backgroundView: {
    alignItems: 'center',
    backgroundColor: '#727272',
    flex: 1,
    paddingTop: 43,
  },
  scrollView: {
    

  },
  scrollViewContainer: {
    marginLeft: 25,
    marginRight: 25,
    width: Dimensions.get('screen').width-40,
    alignItems: 'flex-start', // 垂直
  },
  overlay: {
    backgroundColor: '#727272',
    width: Dimensions.get('screen').width-20,
    height: 340,
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 30,
    borderRadius: 10,
    justifyContent: 'flex-start', // 水平
    alignItems: 'flex-start',
  },
  

  // Boxes
  box_total: {
    marginBottom: 15,
    justifyContent: 'center', // 水平
    alignItems: 'center', // 垂直
    height: 100,
    width: '90%',
    backgroundColor: '#F7F8DF',
    borderRadius: 15,
  },
  box_reset: {
    marginBottom: 10,
    justifyContent: 'center', // 水平
    alignItems: 'center', // 垂直
    height: 50,
    width: '90%',
    //backgroundColor: '#F7F8DF',
    borderColor: '#F7F8DF',
    borderRadius: 15,
    borderWidth: 2,
  },
  box_progressInfo: {
    marginBottom: 40,
  },
  box_title: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // 水平
    alignItems: 'flex-end', // 垂直
    marginBottom: 6,
  },
  box_content: {

  },
  box_describtion: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // 水平
    alignItems: 'flex-start', // 垂直
    width: '90%',
    marginTop: 3,
  },
  box_edit: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // 水平
    alignItems: 'center', // 垂直
    paddingLeft: 26,
    marginBottom: 5,
  },
  box_editButton: {
    marginTop: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#A9A598',
    Height: 85,
    width: Dimensions.get('screen').width-20,
    paddingLeft: 18,
    paddingRight: 18,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  box_button: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#A9A598',
    Height: 85,
    width: Dimensions.get('screen').width,
    paddingLeft: 18,
    paddingRight: 18,
    //Width: '100%',
  },

  // Buttons
  button_left: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#F7F8DF',
    width: 57,
    height: 53,
    borderRadius: 15,
  },
  button_center: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#F7F8DF',
    width: '60%',
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
  button_editLeft: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#F7F8DF',
    width: Dimensions.get('screen').width-140,
    height: 53,
    borderRadius: 15,
  },
  button_editRight: {
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: '#F7F8DF',
    width: 57,
    height: 53,
    borderRadius: 15,
  },

  // Labels
  label_leftMoney: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 35,
    alignItems: 'center',
  },
  label_reset: {
    color: '#F7F8DF',
    fontWeight: 'bold',
    fontSize: 18,
  },

  label_boxBeforeTitle: {
    color: '#F7F8DF',
    fontSize: 18,
  },
  label_title: {
    color: 'rgba(211,196,167, 1)',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  label_percentage: {
    color: '#F7F8DF',
    fontWeight: 'normal',
    fontSize: 12,
    marginRight: 15,
    marginBottom: 2,
  },
  label_progress: {
    color: '#F79C30',
  },
  label_describtionTitle: {
    color: '#E5E2D7',
    fontWeight: 'bold',
  },
  label_describtion: {
    color: '#E5E2D7',
  },
  label_editTitle: {
    color: '#DBD6C7',
    fontWeight: 'bold',
    fontSize: 20,
  },
  label_editPercentage: {
    color: '#DBD6C7',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 20,
  },

  // inputs
  input_name: {
    marginLeft: 18,
    color: '#202020',
    backgroundColor: '#F7F8DF',
    height: 40,
    width: Dimensions.get('screen').width - 140,
    paddingLeft: 10,
    borderRadius: 10,
    fontWeight: 'bold'
  },
  input_note: {
    marginLeft: 18,
    color: '#202020',
    backgroundColor: '#F7F8DF',
    height: 120,
    width: Dimensions.get('screen').width - 140,
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 10,
    borderRadius: 10,

    textAlign: 'left',
    textAlignVertical: 'top',
  },
});