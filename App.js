import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { SwipeListView } from 'react-native-swipe-list-view';

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
} from 'react-native';

/*
// List Viewer
this.state.listViewData = Array(20)
    .fill("")
    .map((_, i) => ({ key: `${i}`, text: `item #${i}` }));
*/

// Store Varibles in your Phone
import AsyncStorage from "@react-native-async-storage/async-storage";
const saveData = (Datakey ,value) => {
  try {
      AsyncStorage.setItem(Datakey, value);
  } catch (e) {
      console.log("error", e);
  }
};


// [Variables Setting]
let Money_leftTotal = 0;

if ( AsyncStorage.getItem('S_Total')._U == 0 ) Money_leftTotal = 0;
else Money_leftTotal = AsyncStorage.getItem('S_Total');

let Money_NowList = [
  0,
  0,
  0,
  0,
  0,
  0,
]

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
const HomeScreen = ({ navigation })  => {

  console.log(AsyncStorage.getItem('S_Total'));
  console.log(AsyncStorage.getItem('S_NowList'));

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

  // check the Value of ProgressBar
  for(let i=0; i <= 5; i++) {
    if(calculateResultList[i].progress > 100 || calculateResultList[i].progress < 0) calculateResultList[i].progress = 100;
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>

          <View style={styles.box_top}>
            <Text style={styles.label_leftMoney}>{ Money_leftTotal } NTD.</Text>
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
              width={'75%'}
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

  console.log(AsyncStorage.getItem('S_Total'));
  console.log(AsyncStorage.getItem('S_NowList'));

  // initial state: Recording Type
  let [recordType, setrecordType] = React.useState('unchanged');
  const _onPress = (typeValue) => setrecordType(typeValue);

  // initial state: Text Inputer
  const [number, onChangeNumber] = React.useState(null);

  // Add a new record
  const _addRecord = () => {
    if (recordType != 'unchanged') {
      if (recordType == '_INCOME') Money_leftTotal = Money_leftTotal + parseInt(number)
      else if (recordType == '_INVEST') Money_NowList[0] = Money_NowList[0] + parseInt(number)
      else if (recordType == '_LEARN') Money_NowList[1] = Money_NowList[1] + parseInt(number)
      else if (recordType == '_LIFE') Money_NowList[2] = Money_NowList[2] + parseInt(number)
      else if (recordType == '_FUN') Money_NowList[3] = Money_NowList[3] + parseInt(number)
      else if (recordType == '_SAVE') Money_NowList[4] = Money_NowList[4] + parseInt(number)
      else if (recordType == '_GIVE') Money_NowList[5] = Money_NowList[5] + parseInt(number)
    }

    saveData('S_Total', parseInt(Money_leftTotal))
    saveData('S_NowList', Money_NowList)

    navigation.navigate('Home', {}) // 加上 {} ，HomeScreen才會重新整理
    
    console.log(Money_NowList)
    console.log(Money_leftTotal)
    console.log(AsyncStorage.getItem('S_Total'))
  };


  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={{ backgroundColor: '#F5F5F5', width: '90%', padding: 15, alignItems: "center", borderRadius: 10, marginTop: 50, marginBottom:20}}
        onPress={() => _onPress('_INCOME')}
      >
        <Text style={{ color: '#28DBB0', fontWeight: 'bold', fontSize: 20 }}>新的收入？</Text>
      </TouchableOpacity>

      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10}}
          onPress={() => _onPress('_INVEST')}
        >
          <Text style={{ fontWeight: 'bold' }}>投資</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10}}
          onPress={() => _onPress('_LEARN')}
        >
          <Text style={{ fontWeight: 'bold' }}>學習</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10}}
          onPress={() => _onPress('_LIFE')}
        >
          <Text style={{ fontWeight: 'bold' }}>生活</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10}}
          onPress={() => _onPress('_FUN')}
        >
          <Text style={{ fontWeight: 'bold' }}>玩樂</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10}}
          onPress={() => _onPress('_SAVE')}
        >
          <Text style={{ fontWeight: 'bold' }}>長線</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '30%', padding: 15, alignItems: "center", borderRadius: 10}}
          onPress={() => _onPress('_GIVE')}
        >
          <Text style={{ fontWeight: 'bold' }}>給予</Text>
        </TouchableOpacity>
      </View>


      {/* Space */}
      <View style={{ marginTop: 50 }}></View>
      {/* Space */}


      <Text>TYPE: { recordType }</Text>


      <TextInput
        style={styles.label_leftMoney}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="點這裡輸入金額"
        keyboardType="numeric"
      />


      {/* Space */}
      <View style={{ marginTop: 50 }}></View>
      {/* Space */}


      <View style={styles.box_button}>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '75%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10}}
          onPress={() => _addRecord()}
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

  return (
    <SafeAreaView style={styles.container}>
      <SwipeListView
            data={this.state.listViewData}
            renderItem={ (data, rowMap) => (
                <View style={styles.rowFront}>
                    <Text>I am {data.item.text} in a SwipeListView</Text>
                </View>
            )}
            renderHiddenItem={ (data, rowMap) => (
                <View style={styles.rowBack}>
                    <Text>Left</Text>
                    <Text>Right</Text>
                </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-75}
        />
    </SafeAreaView>
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
    //backgroundColor: '#00000000',
  },

  // Labels
  label_leftMoney: {
    color: '#28DBB0',
    fontWeight: 'bold',
    fontSize: 35,
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
});


export default MyStack;