import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import SectionList from './src/sectionlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Alert,
} from 'react-native';



// [Pages Navigator]
let REFRESH_HOME = '';
const Stack = createNativeStackNavigator();
const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={() => ({ headerShown: false })} />
        <Stack.Screen name="NewRecord" component={NewRecordScreen} options={() => ({ headerShown: false })} />
        <Stack.Screen name="Setting" component={SettingScreen} options={() => ({ headerShown: false })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



// [Home Screen]
const HomeScreen = ({ navigation }) => {

  console.log('\n[Open] Home Screen');

  // Variables Setting
  const barWidth = Dimensions.get('screen').width - 30;
  const proportionList = [
    // total = 100
    15, // 投資 15%
    10, // 學習 10%
    55, // 生活 55%
    10, // 玩樂 10%
    10, // 長線 10%
    10, // 給予 10%
  ];

  let [leftTotalMoney, set_leftTotalMoney] = useState(0);
  let [list_nowMoney, set_list_nowMoney] = useState([0, 0, 0, 0, 0, 0]);
  let [list_progress, set_list_progress] = useState([0, 0, 0, 0, 0, 0]);
  let [goalList, set_goalList] = useState([0, 0, 0, 0, 0, 0]);

  const getData = async () => {

    console.log('--正在拿資料');

    REFRESH_HOME = '0';

    try {
      const S_Total = await AsyncStorage.getItem('@Total');
      const S_NowList = await AsyncStorage.getItem('@NowList');

      if (S_Total == null) leftTotalMoney = 0;
      else leftTotalMoney = parseInt(S_Total);

      if (S_NowList == null) list_nowMoney = [0, 0, 0, 0, 0, 0];
      else {
        const list_temp = S_NowList.split(",");
        for (let i = 0; i <= 5; i++) list_temp[i] = parseInt(list_temp[i]);
        list_nowMoney = list_temp;
      };

      console.log('@Total: ', S_Total);
      console.log('@NowList: ', S_NowList);
      console.log('Total: ', leftTotalMoney);
      console.log('NowList: ', list_nowMoney);

      checkProgressValue();

    } catch (error) {
      console.log(error);
    }
  };

  const checkProgressValue = () => {

    console.log('--正在整理資料');

    goalList = [
      Math.round(leftTotalMoney * (proportionList[0] * 0.01)), // 投資
      Math.round(leftTotalMoney * (proportionList[1] * 0.01)), // 學習
      Math.round(leftTotalMoney * (proportionList[2] * 0.01)), // 生活
      Math.round(leftTotalMoney * (proportionList[3] * 0.01)), // 玩樂
      Math.round(leftTotalMoney * (proportionList[4] * 0.01)), // 長線
      Math.round(leftTotalMoney * (proportionList[5] * 0.01)), // 給予
    ];

    list_progress = [
      (list_nowMoney[0] / goalList[0]) * 100,
      (list_nowMoney[1] / goalList[1]) * 100,
      (list_nowMoney[2] / goalList[2]) * 100,
      (list_nowMoney[3] / goalList[3]) * 100,
      (list_nowMoney[4] / goalList[4]) * 100,
      (list_nowMoney[5] / goalList[5]) * 100,
    ];

    // check the Value of ProgressBar < 100
    for (let i = 0; i <= 5; i++) {
      if (list_progress[i] > 100 || list_progress[i] < 0) list_progress[i] = 100;
      else if (isNaN(list_progress[i])) list_progress[i] = 0;
    }

    console.log('goalList: ', goalList);
    console.log('list_progress: ', list_progress);

    set_leftTotalMoney(leftTotalMoney);
    set_list_nowMoney(list_nowMoney);
    set_list_progress(list_progress);
    set_goalList(goalList);
  };

  const checkRemove = () => {
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
          onPress: Remove,
          style: "destructive",
        },
      ],
    );
  };

  const Remove = async () => {
    await AsyncStorage.removeItem('@Total');
    await AsyncStorage.removeItem('@NowList');
    await AsyncStorage.removeItem('@Record');

    console.log('=== 清除中 ===');
    getData();
    Alert.alert("資料已成功清除！");
  };

  // Entering point
  React.useEffect(() => {
    getData();
  }, []);

  // Re-Open
  if (REFRESH_HOME == 'DO') {
    console.log('Re-Freshing');
    getData();
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>

          <TouchableOpacity style={styles.box_top} onPress={checkRemove}>
            <Text style={styles.label_leftMoney}>{leftTotalMoney} NTD.</Text>
          </TouchableOpacity>

          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <Text style={styles.label_title}>▌投資 ({proportionList[0]}%)</Text>
              <Text style={styles.label_goal}>/ {goalList[0]} NTD.</Text>
            </View>

            <ProgressBarAnimated
              width={barWidth}
              height={20}
              borderWidth={1}
              borderRadius={50}
              value={list_progress[0]}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_nowMoney[0]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[0] - list_nowMoney[0])} NTD.</Text>
            </View>

          </View>

          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <Text style={styles.label_title}>▌學習 ({proportionList[1]}%)</Text>
              <Text style={styles.label_goal}>/ {goalList[1]} NTD.</Text>
            </View>

            <ProgressBarAnimated
              width={barWidth}
              height={20}
              borderWidth={1}
              borderRadius={50}
              value={list_progress[1]}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_nowMoney[1]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{goalList[1] - list_nowMoney[1]} NTD.</Text>
            </View>

          </View>

          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <Text style={styles.label_title}>▌生活 ({proportionList[2]}%)</Text>
              <Text style={styles.label_goal}>/ {goalList[2]} NTD.</Text>
            </View>

            <ProgressBarAnimated
              width={barWidth}
              height={20}
              borderWidth={1}
              borderRadius={50}
              value={list_progress[2]}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_nowMoney[2]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[2] - list_nowMoney[2])} NTD.</Text>
            </View>

          </View>

          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <Text style={styles.label_title}>▌玩樂 ({proportionList[3]}%)</Text>
              <Text style={styles.label_goal}>/ {goalList[3]} NTD.</Text>
            </View>

            <ProgressBarAnimated
              width={barWidth}
              height={20}
              borderWidth={1}
              borderRadius={50}
              value={list_progress[3]}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_nowMoney[3]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[3] - list_nowMoney[3])} NTD.</Text>
            </View>

          </View>

          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <Text style={styles.label_title}>▌長線 ({proportionList[4]}%)</Text>
              <Text style={styles.label_goal}>/ {goalList[4]} NTD.</Text>
            </View>

            <ProgressBarAnimated
              width={barWidth}
              height={20}
              borderWidth={1}
              borderRadius={50}
              value={list_progress[4]}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_nowMoney[4]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[4] - list_nowMoney[4])} NTD.</Text>
            </View>

          </View>

          <View style={styles.box_progressInfo}>

            <View style={styles.box_title}>
              <Text style={styles.label_title}>▌給予 ({proportionList[5]}%)</Text>
              <Text style={styles.label_goal}>/ {goalList[5]} NTD.</Text>
            </View>

            <ProgressBarAnimated
              width={barWidth}
              height={20}
              borderWidth={1}
              borderRadius={50}
              value={list_progress[5]}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_nowMoney[5]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[5] - list_nowMoney[5])} NTD.</Text>
            </View>

          </View>

        </View>
      </ScrollView>

      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '75%', alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => navigation.navigate('NewRecord', { leftTotalMoney: leftTotalMoney, list_nowMoney: list_nowMoney })}
        >
          <Image source={require('./common/plus.png')} resizeMode='center' style={{ maxHeight: 20, marginTop: 15, }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: 60, alignItems: "center", borderRadius: 10, }}
          onPress={() => navigation.navigate('Setting')}
        >
          <Image source={require('./common/list.png')} resizeMode='center' style={{ maxHeight: 20, marginTop: 15, }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};



// [New Record Screen]
const NewRecordScreen = ({ route, navigation }) => {

  console.log('\n[Open] New Record Screen');

  // get parms from HomeScreen
  let { leftTotalMoney, list_nowMoney } = route.params;
  console.log('@Total: ', leftTotalMoney);
  console.log('@NowList: ', list_nowMoney);

  const [recordType, setrecordType] = useState('unchanged');
  const [number, onChangeNumber] = useState(null);
  let [btnColor, set_btnColor] = useState([ //背景顏色
    '#F5F5F5', // 新增收入
    '#F5F5F5', // 投資
    '#F5F5F5', // 學習
    '#F5F5F5', // 生活
    '#F5F5F5', // 玩樂
    '#F5F5F5', // 長線
    '#F5F5F5'  // 給予
  ]);
  let [btnTextColor, set_btnTextColor] = useState([ //文字顏色
    '#28DBB0', // 新增收入
    'black', // 投資
    'black', // 學習
    'black', // 生活
    'black', // 玩樂
    'black', // 長線
    'black'  // 給予
  ]);

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

      if (temp3 == null) temp3 = [getCurrentDate(), recordType, number];
      else {
        temp3 = temp3.split(",");

        temp3.push(getCurrentDate());
        temp3.push(recordType);
        temp3.push(number);
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

  const _onPress = (Index) => {

    btnColor = [ //背景顏色
      '#F5F5F5', // 新增收入
      '#F5F5F5', // 投資
      '#F5F5F5', // 學習
      '#F5F5F5', // 生活
      '#F5F5F5', // 玩樂
      '#F5F5F5', // 長線
      '#F5F5F5'  // 給予
    ];

    btnTextColor = [ //文字顏色
      '#28DBB0', // 新增收入
      'black', // 投資
      'black', // 學習
      'black', // 生活
      'black', // 玩樂
      'black', // 長線
      'black'  // 給予
    ];

    btnColor[Index] = '#28DBB0';
    btnTextColor[Index] = 'white';

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


      {/* Space */}
      <View style={{ marginTop: 50 }}></View>
      {/* Space */}


      <TextInput
        style={styles.label_input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="點這裡輸入金額"
        keyboardType="numeric"
        required
      />


      {/* Space */}
      <View style={{ marginTop: 50 }}></View>
      {/* Space */}


      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '75%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => _checkInput()}
        >
          <Image source={require('./common/disk.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 1 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '20%', padding: 15, alignItems: "center", borderRadius: 10, }}
          onPress={() => navigation.navigate('Home')}
        >
          <Image source={require('./common/cross.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 0 }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};



// [Setting Screen]
const SettingScreen = ({ navigation }) => {

  console.log('');
  console.log('[Open] Setting Screen');

  const renderExample = () => {
    const Component = SectionList;
    return <Component />;
  };

  const _backToHome = () => {
    REFRESH_HOME = 'DO';
    navigation.navigate('Home', {});
  };

  return (
    <View style={styles.listContainer}>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '98%', height: 50, padding: 15, alignItems: "center", borderRadius: 10, }}
          onPress={() => _backToHome()}>
          <Image source={require('./common/cross.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 0 }} />
        </TouchableOpacity>
      </View>

      {renderExample()}

    </View>
  );

};



// [Styling]
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  listContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 15,
    paddingRight: 15,
  },

  // Boxes
  box_top: {
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: '100%',
    backgroundColor: '#28DBB0',
    borderRadius: 15,
  },
  box_progressInfo: {
    paddingBottom: 25,
  },
  box_title: {
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  box_subTitle: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
    alignItems: 'flex-end',
  },
  box_button: {
    marginBottom: 10,
    flexDirection: 'row',
    maxHeight: 50,
  },

  // Labels
  label_leftMoney: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 35,
    alignItems: 'center',
  },
  label_title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
    marginEnd: 10,
  },
  label_goal: {
    color: '#BABABA',
    fontSize: 14,
  },
  label_now: {
    color: '#BABABA',
    fontSize: 14,
  },
  label_howMuchToGoal: {
    color: '#28DBB0',
    fontWeight: 'bold',
    fontSize: 18,
  },
  label_input: {
    color: '#28DBB0',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
});


export default MyStack;