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



// [Variables Setting]
let Money_leftTotal = 0;
let Money_NowList = [0, 0, 0, 0, 0, 0];
let recordList = `[
  {
  "title": "2022.06.12",
  "data": [{ "key": "20220612.0", "text": "新增收入/ 100 NTD." }, { "key": "20220612.1", "text": "投資/ 90 NTD." }]
  }§
]`;
let proportionList = [
  // total = 100
  15, // 投資 15%
  10, // 學習 10%
  55, // 生活 55%
  10, // 玩樂 10%
  10, // 長線 10%
  10, // 給予 10%
]



// [Pages Navigator]
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

  console.log('');
  console.log('[Open] Home Screen');

  const remove = () => {
    AsyncStorage.removeItem('@Total');
    AsyncStorage.removeItem('@NowList');
    AsyncStorage.removeItem('@Record');
  };


  const getData = async () => {
    try {
      let Money_leftTotal = await AsyncStorage.getItem('@Total');
      let Money_NowList = await AsyncStorage.getItem('@NowList');

      console.log('@Total: ', Money_leftTotal);
      console.log('@NowList: ', Money_NowList);

      if (Money_leftTotal == null) Money_leftTotal = 0;
      else Money_leftTotal = parseInt(Money_leftTotal);
      if (Money_NowList == null) Money_NowList = [0, 0, 0, 0, 0, 0];
      else {
        Money_NowList = Money_NowList.split(",");
        for (let i = 0; i <= 5; i++) Money_NowList[i] = parseInt(Money_NowList[i]);
      }

      console.log('Total: ', Money_leftTotal);
      console.log('NowList: ', Money_NowList);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    //remove(); // REMEMVER TO TURN THIS OFF !
    getData();
  }, []);


  // ProgressBar Width Setting
  const barWidth = Dimensions.get('screen').width - 30;

  let goalList = [
    Math.round(Money_leftTotal * proportionList[0] * 0.01), // 投資
    Math.round(Money_leftTotal * proportionList[1] * 0.01), // 學習
    Math.round(Money_leftTotal * proportionList[2] * 0.01), // 生活
    Math.round(Money_leftTotal * proportionList[3] * 0.01), // 玩樂
    Math.round(Money_leftTotal * proportionList[4] * 0.01), // 長線
    Math.round(Money_leftTotal * proportionList[5] * 0.01), // 給予
  ]

  let calculateResultList = [
    {
      "progress": (Money_NowList[0] / goalList[0]) * 100,
      "howMuchToGoal": Math.round(goalList[0] - Money_NowList[0]),
    },
    {
      "progress": (Money_NowList[1] / goalList[1]) * 100,
      "howMuchToGoal": Math.round(goalList[1] - Money_NowList[1]),
    },
    {
      "progress": (Money_NowList[2] / goalList[2]) * 100,
      "howMuchToGoal": Math.round(goalList[2] - Money_NowList[2]),
    },
    {
      "progress": (Money_NowList[3] / goalList[3]) * 100,
      "howMuchToGoal": Math.round(goalList[3] - Money_NowList[3]),
    },
    {
      "progress": (Money_NowList[4] / goalList[4]) * 100,
      "howMuchToGoal": Math.round(goalList[4] - Money_NowList[4]),
    },
    {
      "progress": (Money_NowList[5] / goalList[5]) * 100,
      "howMuchToGoal": Math.round(goalList[5] - Money_NowList[5]),
    },
  ]

  // check the Value of ProgressBar < 100
  for (let i = 0; i <= 5; i++) {
    if (calculateResultList[i].progress > 100 || calculateResultList[i].progress < 0) calculateResultList[i].progress = 100;
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>

          <View style={styles.box_top}>
            <Text style={styles.label_leftMoney}>{Money_leftTotal} NTD.</Text>
          </View>

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
              value={calculateResultList[0].progress}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {Money_NowList[0]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{calculateResultList[0].howMuchToGoal} NTD.</Text>
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
              value={calculateResultList[1].progress}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {Money_NowList[1]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{calculateResultList[1].howMuchToGoal} NTD.</Text>
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
              value={calculateResultList[2].progress}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {Money_NowList[2]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{calculateResultList[2].howMuchToGoal} NTD.</Text>
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
              value={calculateResultList[3].progress}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {Money_NowList[3]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{calculateResultList[3].howMuchToGoal} NTD.</Text>
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
              value={calculateResultList[4].progress}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {Money_NowList[4]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{calculateResultList[4].howMuchToGoal} NTD.</Text>
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
              value={calculateResultList[5].progress}
              maxValue={100}
              backgroundColor="#28DBB0" />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {Money_NowList[5]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{calculateResultList[5].howMuchToGoal} NTD.</Text>
            </View>

          </View>

        </View>
      </ScrollView>

      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '75%', alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => navigation.navigate('NewRecord')}
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
const NewRecordScreen = ({ navigation }) => {

  console.log('');
  console.log('[Open] New Record Screen');

  // initial state: Recording Type
  let [recordType, setrecordType] = useState('unchanged');
  const _onPress = (typeValue) => setrecordType(typeValue);

  // initial state: Text Inputer
  const [number, onChangeNumber] = useState(null);

  const _checkInput = () => {
    if (recordType == 'unchanged') Alert.alert("類別錯誤！", "請選擇其中一種收入／支出類別");
    else if (number == null) Alert.alert("：）", "您沒有填東西ㄛ：）");
    else if (number.match(/[^\d]/)) Alert.alert("輸入錯誤！", "只能填入半形數字ㄛ：）\n\n(不能有空格、逗點、全形數字...等)");

    else _addRecord();
  }

  const _addRecord = () => {

    if (recordType == "新增收入") Money_leftTotal = Money_leftTotal + parseInt(number)
    else if (recordType == "投資") Money_NowList[0] = Money_NowList[0] + parseInt(number)
    else if (recordType == "學習") Money_NowList[1] = Money_NowList[1] + parseInt(number)
    else if (recordType == "生活") Money_NowList[2] = Money_NowList[2] + parseInt(number)
    else if (recordType == "玩樂") Money_NowList[3] = Money_NowList[3] + parseInt(number)
    else if (recordType == "長線") Money_NowList[4] = Money_NowList[4] + parseInt(number)
    else if (recordType == "給予") Money_NowList[5] = Money_NowList[5] + parseInt(number)

    saveData();
    //DEBUGgetData();

    console.log('Total: ', Money_leftTotal);
    console.log('NowList: ', Money_NowList);

    navigation.navigate('Home', {}) // 加上 {} ，HomeScreen才會重新整理
  };

  const saveData = async () => {
    try {
      let temp = Money_leftTotal + '';
      let temp2 = Money_NowList.toString();
      let temp3 = await AsyncStorage.getItem('@Record');
      
      AsyncStorage.setItem('@Total', temp);
      AsyncStorage.setItem('@NowList', temp2);

      console.log('@Record', temp3);
      if (temp3 == null) temp3 = [ getCurrentDate(), recordType, number ];
      else temp3 = temp3.split(",") + ',' + [ getCurrentDate(), recordType, number ];

      temp3 = temp3.toString();
      AsyncStorage.setItem('@Record', temp3);
      console.log('Adding... \n', temp3);
      console.log('@Record (added)\n', temp3);

    } catch (error) {
      console.log(error);
    }
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

  const getCurrentDate = () => {

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();

    // Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return year + '.' + month + '.' + date; //format: yyyy.mm.dd;
  }



  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={{ backgroundColor: '#F5F5F5', width: '90%', padding: 15, alignItems: "center", borderRadius: 10, marginTop: 50, marginBottom: 20 }}
        onPress={() => _onPress("新增收入")}
      >
        <Text style={{ color: '#28DBB0', fontWeight: 'bold', fontSize: 20 }}>新的收入？</Text>
      </TouchableOpacity>

      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => _onPress("投資")}
        >
          <Text style={{ fontWeight: 'bold' }}>投資</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => _onPress("學習")}
        >
          <Text style={{ fontWeight: 'bold' }}>學習</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10 }}
          onPress={() => _onPress("生活")}
        >
          <Text style={{ fontWeight: 'bold' }}>生活</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => _onPress("玩樂")}
        >
          <Text style={{ fontWeight: 'bold' }}>玩樂</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10 }}
          onPress={() => _onPress("長線")}
        >
          <Text style={{ fontWeight: 'bold' }}>長線</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10 }}
          onPress={() => _onPress("給予")}
        >
          <Text style={{ fontWeight: 'bold' }}>給予</Text>
        </TouchableOpacity>
      </View>


      {/* Space */}
      <View style={{ marginTop: 50 }}></View>
      {/* Space */}


      <Text>TYPE: {recordType}</Text>


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

  return (
    <View style={styles.listContainer}>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '98%', height: 50, padding: 15, alignItems: "center", borderRadius: 10, }}
          onPress={() => navigation.navigate('Home')}>
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
    height: 150,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
    color: '#28DBB0',
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