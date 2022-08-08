import React, { useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Alert,
  Linking,
} from 'react-native'



// [New Record Screen]
export default function NewRecordScreen( {route, navigation} ) {

    console.log('\n[Open] New Record Screen');
  
    // get parms from HomeScreen
    let { leftTotalMoney, list_nowMoney } = route.params;
    console.log('@Total: ', leftTotalMoney);
    console.log('@NowList: ', list_nowMoney);
  
    const [recordType, setrecordType] = useState('unchanged');
    const [number, onChangeNumber] = useState(null);
    let [note, onChangeNote] = useState(null);
  
    let [btnColor, set_btnColor] = useState([ //預設背景顏色
      '#F5F5F5', // 新增收入
      '#F5F5F5', // 投資
      '#F5F5F5', // 學習
      '#F5F5F5', // 生活
      '#F5F5F5', // 玩樂
      '#F5F5F5', // 長線
      '#F5F5F5'  // 給予
    ]);
  
    let [btnTextColor, set_btnTextColor] = useState([ //預設文字顏色
      '#88c1b8', // 新增收入
      'black', // 投資
      'black', // 學習
      'black', // 生活
      'black', // 玩樂
      'black', // 長線
      'black'  // 給予
    ]);
  
    const _onPress = (Index) => {
  
      btnColor = [ //預設背景顏色
        '#F5F5F5', // 新增收入
        '#F5F5F5', // 投資
        '#F5F5F5', // 學習
        '#F5F5F5', // 生活
        '#F5F5F5', // 玩樂
        '#F5F5F5', // 長線
        '#F5F5F5'  // 給予
      ];
  
      btnTextColor = [ //預設文字顏色
        '#88c1b8', // 新增收入
        'black', // 投資
        'black', // 學習
        'black', // 生活
        'black', // 玩樂
        'black', // 長線
        'black'  // 給予
      ];
  
      btnColor[Index] = '#88c1b8'; // 按下後背景顏色
      btnTextColor[Index] = 'white'; // 按下後文字顏色
  
      set_btnColor(btnColor);
      set_btnTextColor(btnTextColor);
  
      if (Index == 0) setrecordType("新增收入");
      else if (Index == 1) setrecordType("投資");
      else if (Index == 2) setrecordType("學習");
      else if (Index == 3) setrecordType("生活");
      else if (Index == 4) setrecordType("玩樂");
      else if (Index == 5) setrecordType("長線");
      else if (Index == 6) setrecordType("給予");
    };
  
    // DEBUG
    const DEBUGgetData = async () => {
      try {
        let temp = await AsyncStorage.getItem('@Total');
        let temp2 = await AsyncStorage.getItem('@NowList');
  
        console.log('@Total', temp);
        console.log('@NowList', temp2);
      } catch (error) {
        console.log(error);
      }
    };
  
    const _checkInput = () => {
      if (recordType == 'unchanged') Alert.alert("類別錯誤！", "請選擇其中一種收入／支出類別");
      else if (number == null) Alert.alert("：）", "您沒有填東西ㄛ：）");
      else if (number.match(/[^\d]/)) Alert.alert("輸入錯誤！", "只能填入半形數字ㄛ：）\n\n(不能有空格、逗點、全形數字...等)");
      else _addRecord();
    };
  
    const _addRecord = () => {
      if (recordType == "新增收入") leftTotalMoney = leftTotalMoney + parseInt(number)
      else if (recordType == "投資") list_nowMoney[0] = list_nowMoney[0] + parseInt(number)
      else if (recordType == "學習") list_nowMoney[1] = list_nowMoney[1] + parseInt(number)
      else if (recordType == "生活") list_nowMoney[2] = list_nowMoney[2] + parseInt(number)
      else if (recordType == "玩樂") list_nowMoney[3] = list_nowMoney[3] + parseInt(number)
      else if (recordType == "長線") list_nowMoney[4] = list_nowMoney[4] + parseInt(number)
      else if (recordType == "給予") list_nowMoney[5] = list_nowMoney[5] + parseInt(number)
  
      if (note == null) note = "：ｘ";
      onChangeNote(note);
  
      saveData();
      //DEBUGgetData();
  
      console.log('Total: ', leftTotalMoney);
      console.log('NowList: ', list_nowMoney);
    };
  
    const saveData = async () => {
      try {
        let temp = leftTotalMoney + '';
        let temp2 = list_nowMoney.toString();
  
        await AsyncStorage.setItem('@Total', temp);
        await AsyncStorage.setItem('@NowList', temp2);
  
        let temp3 = await AsyncStorage.getItem('@Record');
        console.log('@Record', temp3);
  
        if (temp3 == null) temp3 = [getCurrentDate(), recordType, number, note];
        else {
          temp3 = temp3.split(",");
  
          temp3.push(getCurrentDate());
          temp3.push(recordType);
          temp3.push(number);
          temp3.push(note);
        }
        temp3 = temp3.toString();
        AsyncStorage.setItem('@Record', temp3);
        console.log('@Record (added)\n', temp3);
  
        REFRESH_HOME = 'DO';
        navigation.navigate('Home', {})
  
      } catch (error) {
        console.log(error);
      }
    };
  
    const getCurrentDate = () => {
  
      let date = new Date().getDate();
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
  
      // Alert.alert(date + '-' + month + '-' + year);
      // You can turn it in to your desired format
      return year + '.' + month + '.' + date; //format: yyyy.mm.dd;
    };
  
  
  
    return (
      <SafeAreaView style={styles.container}>
  
        <TouchableOpacity
          style={{ backgroundColor: btnColor[0], width: '90%', padding: 25, alignItems: "center", borderRadius: 10, marginTop: 50, marginBottom: 20 }}
          onPress={() => _onPress(0)}
        >
          <Text style={{ color: btnTextColor[0], fontWeight: 'bold', fontSize: 25 }}>新的收入？</Text>
        </TouchableOpacity>
  
        <View style={styles.box_button}>
          <TouchableOpacity
            style={{ backgroundColor: btnColor[1], width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => _onPress(1)}
          >
            <Text style={{ color: btnTextColor[1], fontWeight: 'bold' }}>投資</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{ backgroundColor: btnColor[2], width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => _onPress(2)}
          >
            <Text style={{ color: btnTextColor[2], fontWeight: 'bold' }}>學習</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{ backgroundColor: btnColor[3], width: '30%', padding: 15, alignItems: "center", borderRadius: 10 }}
            onPress={() => _onPress(3)}
          >
            <Text style={{ color: btnTextColor[3], fontWeight: 'bold' }}>生活</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.box_button}>
          <TouchableOpacity
            style={{ backgroundColor: btnColor[4], width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => _onPress(4)}
          >
            <Text style={{ color: btnTextColor[4], fontWeight: 'bold' }}>玩樂</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{ backgroundColor: btnColor[5], width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => _onPress(5)}
          >
            <Text style={{ color: btnTextColor[5], fontWeight: 'bold' }}>長線</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{ backgroundColor: btnColor[6], width: '30%', padding: 15, alignItems: "center", borderRadius: 10 }}
            onPress={() => _onPress(6)}
          >
            <Text style={{ color: btnTextColor[6], fontWeight: 'bold' }}>給予</Text>
          </TouchableOpacity>
        </View>
  
  
        <View style={{ marginTop: 50 }}></View>
  
  
        <TextInput
          style={styles.input_money}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="點這裡輸入金額"
          keyboardType="numeric"
          required
        />
  
        <TextInput
          style={styles.input_note}
          onChangeText={onChangeNote}
          value={note}
          placeholder="輸入備註... (打工、咖哩飯...)"
          keyboardType="default"
        />
  
  
        <View style={{ marginTop: 50 }}></View>
  
  
        <View style={styles.box_button}>
          <TouchableOpacity
            style={{ backgroundColor: '#F5F5F5', width: '75%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => _checkInput()}
          >
            <Image source={require('../common/disk.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 1 }} />
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{ backgroundColor: '#F5F5F5', width: '15%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => navigation.navigate('Home')}
          >
            <Image source={require('../common/cross.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 0 }} />
          </TouchableOpacity>
        </View>
  
        <View style={styles.box_button}>
          <TouchableOpacity
            style={{ backgroundColor: '#F5F5F5', width: '93%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => Linking.openURL('https://hackmd.io/@miffy2022/SJbsjMG59')}
          >
            <Text>查看隱私權政策</Text>
          </TouchableOpacity>
        </View>
  
      </SafeAreaView>
    );
}