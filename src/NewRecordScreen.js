import React, { useState } from 'react'
import ProgressBarAnimated from 'react-native-progress-bar-animated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Alert,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const box_width = Dimensions.get('screen').width - 52;



// [New Record Screen]
export default function NewRecordScreen({ route, navigation }) {

  console.log('[Open] New Record Screen');

  // get parms from HomeScreen
  let { leftBudget, list_obj_Category, list_usedMoney } = route.params;
  console.log("leftBudget: ", leftBudget);
  console.log("list_usedMoney: ", list_usedMoney);

  // define initial vars
  const [recordTypeIndex, set_recordTypeIndex] = useState("undefined");
  const [number, set_Number] = useState(null);
  let [note, set_Note] = useState(null);

  const [progressBarValue, set_progressBarValue] = useState(0);


  // define initial button color
  let [btnColor, set_btnColor] = useState([ //預設背景顏色
    '#F7F8DF', // 新增收入
    '#F7F8DF', // 投資
    '#F7F8DF', // 學習
    '#F7F8DF', // 生活
    '#F7F8DF', // 玩樂
    '#F7F8DF', // 長線
    '#F7F8DF'  // 給予
  ]);
  let [btnTextColor, set_btnTextColor] = useState([ //預設文字顏色
    '#202020', // 新增收入
    '#202020', // 投資
    '#202020', // 學習
    '#202020', // 生活
    '#202020', // 玩樂
    '#202020', // 長線
    '#202020'  // 給予
  ]);


  // sub: set type, change button color
  const _typeButtonPress = (Index) => {

    btnColor = [ //預設背景顏色
      '#F7F8DF', // 新增收入
      '#F7F8DF', // 投資
      '#F7F8DF', // 學習
      '#F7F8DF', // 生活
      '#F7F8DF', // 玩樂
      '#F7F8DF', // 長線
      '#F7F8DF'  // 給予
    ];

    btnTextColor = [ //預設文字顏色
    '#202020', // 新增收入
    '#202020', // 投資
    '#202020', // 學習
    '#202020', // 生活
    '#202020', // 玩樂
    '#202020', // 長線
    '#202020'  // 給予
    ];

    btnColor[Index] = '#E4CE94'; // 按下後背景顏色
    btnTextColor[Index] = 'white'; // 按下後文字顏色
    set_btnColor(btnColor);
    set_btnTextColor(btnTextColor);


    // setting RecordType
    if (Index === 0) {
      set_recordTypeIndex("add"); // 選擇"新的收入"按鈕時

      let temp_totalUsedMoney = 0;
      for (let i = 0; i <= 5; i++) temp_totalUsedMoney += list_usedMoney[i];

      set_progressBarValue(Math.round((temp_totalUsedMoney / leftBudget) * 100));
    }
    else {
      set_recordTypeIndex(Index - 1); // 選擇其他按鈕時 (減一是為了要跟prop.json的資料id相符)

      // progressBar Value
      let temp_progressBarValue = Math.round((list_usedMoney[Index - 1] / (leftBudget * list_obj_Category[Index - 1].percentage * 0.01)) * 100) // 目前使用金額 / 目標金額 (0~100)
      if (temp_progressBarValue > 100) temp_progressBarValue = 100;
      set_progressBarValue(temp_progressBarValue)
    }


    console.log("recordTypeIndex:", recordTypeIndex);
    console.log(recordTypeIndex === "undefined");
  };

  // sub:
  const _getCurrentDate = () => {

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    // Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return year + '.' + month + '.' + date; //format: yyyy.mm.dd;
  };

  // 1. check if there is any invaild value
  const _checkInput = () => {

    if (recordTypeIndex === "undefined")
      Alert.alert("類別錯誤！", "請選擇其中一種收入／支出類別");

    else if (number == null)
      Alert.alert("：）", "您沒有填東西ㄛ：）");

    else if (number.match(/[^\d]/))
      Alert.alert("輸入錯誤！", "只能填入半形數字ㄛ：）\n\n(不能有空格、逗點、全形數字...等)");

    else
      _updateBudget();

  };

  // 2. 
  const _updateBudget = () => {

    if (recordTypeIndex == "add") {
      leftBudget = leftBudget + parseInt(number);
    }
    else {
      list_usedMoney[recordTypeIndex] = list_usedMoney[recordTypeIndex] + parseInt(number);
    }


    if (note === null) {
      note = "：Ｘ";
      set_Note(note);
      console.log(note);
    }

    _saveDataToLocalStorage();

  };

  // 3.
  const _saveDataToLocalStorage = async () => {
    try {

      // 1. Collect values into an new list
      // (It's more convenient for us to save in localStorage as well as decode it to an object later)
      const list_newRecord = [
        _getCurrentDate(),
        recordTypeIndex,
        parseInt(number),
        note
      ];

      /*
      const obj_newRecord = {
        "date": _getCurrentDate(),
        "type": recordTypeIndex,
        "moneyAmont": parseInt(number),
        "note": note
      };
      */

      // 2. Download "Spending Record" and ""
      let string_SpendingRecord = await AsyncStorage.getItem('@SpendingRecord');
      let list_SpendingRecord = [];
      if (string_SpendingRecord != null) {
        list_SpendingRecord = string_SpendingRecord.split(",");
      }

      // 3. Push new object onto Spending Record
      list_SpendingRecord = list_newRecord.concat(list_SpendingRecord);

      // 4. Save it back.
      await AsyncStorage.setItem('@SpendingRecord', list_SpendingRecord.toString());

      // 5. Save Budget and list_usedMoney
      await AsyncStorage.setItem('@leftBudget', JSON.stringify(leftBudget));
      await AsyncStorage.setItem('@Category.usedMoney', list_usedMoney.toString())

      // 6. return HomeScreen
      navigation.navigate('Home', {})

    } catch (error) {
      console.log(error);
    }
  };



  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>

        <TouchableOpacity
          style={{ backgroundColor: btnColor[0], width: box_width, padding: 25, alignItems: "center", borderRadius: 15, marginTop: 20, marginBottom: 10, height: 90, marginHorizontal: 52 }}
          onPress={() => _typeButtonPress(0)}
        >
          <Text style={{ color: btnTextColor[0], fontWeight: 'bold', fontSize: 25 }}>新增收入</Text>
        </TouchableOpacity>

        <View style={styles.box_button}>
          <TouchableOpacity
            style={{ backgroundColor: btnColor[1], width: (box_width - 20) / 3, padding: 15, alignItems: "center", borderRadius: 15, marginRight: 10 }}
            onPress={() => _typeButtonPress(1)}
          >
            <Text style={{ color: btnTextColor[1], fontWeight: 'bold' }}>{list_obj_Category[0].name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: btnColor[2], width: (box_width - 20) / 3, padding: 15, alignItems: "center", borderRadius: 15, marginRight: 10 }}
            onPress={() => _typeButtonPress(2)}
          >
            <Text style={{ color: btnTextColor[2], fontWeight: 'bold' }}>{list_obj_Category[1].name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: btnColor[3], width: (box_width - 20) / 3, padding: 15, alignItems: "center", borderRadius: 15 }}
            onPress={() => _typeButtonPress(3)}
          >
            <Text style={{ color: btnTextColor[3], fontWeight: 'bold' }}>{list_obj_Category[2].name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box_button}>
          <TouchableOpacity
            style={{ backgroundColor: btnColor[4], width: (box_width - 20) / 3, padding: 15, alignItems: "center", borderRadius: 15, marginRight: 10 }}
            onPress={() => _typeButtonPress(4)}
          >
            <Text style={{ color: btnTextColor[4], fontWeight: 'bold' }}>{list_obj_Category[3].name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: btnColor[5], width: (box_width - 20) / 3, padding: 15, alignItems: "center", borderRadius: 15, marginRight: 10 }}
            onPress={() => _typeButtonPress(5)}
          >
            <Text style={{ color: btnTextColor[5], fontWeight: 'bold' }}>{list_obj_Category[4].name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: btnColor[6], width: (box_width - 20) / 3, padding: 15, alignItems: "center", borderRadius: 15 }}
            onPress={() => _typeButtonPress(6)}
          >
            <Text style={{ color: btnTextColor[6], fontWeight: 'bold' }}>{list_obj_Category[5].name}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box_progress}>

          <ProgressBarAnimated
            width={box_width - 130}
            height={20}
            borderWidth={0}
            borderRadius={50}
            backgroundColor={'#F7F8DF'} // 進度條(前面) 顏色
            underlyingColor={'#A9A598'} // 背景條(底) 顏色

            value={progressBarValue}
            maxValue={100}
          />
          <Text style={styles.label_percentage}>已使用 {progressBarValue}%</Text>

        </View>

        <View style={styles.box_input}>

          <Text style={styles.label_inputTitle}>金額</Text>
          <TextInput
            style={styles.input_money}
            selectionColor={'#F7F8DF'}
            onChangeText={set_Number}
            value={number}
            placeholder="點這裡輸入金額"
            keyboardType="numeric"
            required
          />


          <Text style={styles.label_inputTitle}>備註</Text>
          <TextInput
            style={styles.input_note}
            selectionColor={'#F7F8DF'}
            onChangeText={set_Note}
            value={note}
            placeholder="輸入備註... (打工、咖哩飯...)"
            keyboardType="default"
          />


        </View>


        <View style={styles.box_menuButton}>
          <TouchableOpacity style={styles.button_center} onPress={() => _checkInput()}>
            <Image source={require('../common/disk.png')} resizeMode='center' style={{ width: 25, height: 25, }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button_right} onPress={() => navigation.navigate("Home")}>
            <Image source={require('../common/cross.png')} resizeMode='center' style={{ width: 20, height: 20, }} />
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAwareScrollView>
  );
};

// [Styling]
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#727272',
    flex: 1,
    paddingTop: 43,
  },

  // Boxes
  box_button: {
    marginBottom: 10,
    marginLeft: 26,
    marginRight: 26,
    flexDirection: 'row',
    height: 50,
    width: box_width,
  },
  box_progress: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 30,
    width: box_width,
    
    backgroundColor: '#E4CE94',
    borderRadius: 10,
    paddingLeft: 10,
  },
  box_input: {
    backgroundColor: '#F7F8DF',
    alignItems: 'center',
    width: box_width,
    height: Dimensions.get('screen').height - 538,
    borderRadius: 15,
    marginBottom: 30,
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

  // Buttons
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

  // Labels
  label_inputTitle: {
    marginTop: 30,
    fontSize: 25,
    fontWeight: 'bold',
  },
  label_percentage: {
    fontSize: 15,
    marginLeft: 10,
    color: '#202020',
    fontWeight: '600',
  },

  // Inputs
  input_money: {
    marginTop: 10,
    backgroundColor: '#A9A598',
    width: box_width - 60,
    height: 40,
    borderRadius: 15,

    textAlign: 'center',
    color: '#F7F8DF',
    fontSize: 16,
    //fontWeight: 'bold',
  },
  input_note: {
    marginTop: 10,
    backgroundColor: '#A9A598',
    width: box_width - 60,
    height: 130,
    borderRadius: 15,

    textAlign: 'center',
    textAlignVertical: 'top',
    paddingTop: 10,
    color: '#F7F8DF',
    fontSize: 16,
    //fontWeight: 'bold',
  },

});