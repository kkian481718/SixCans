import React, { useState } from 'react'
import ProgressBarAnimated from 'react-native-progress-bar-animated'
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
} from 'react-native'


// [Home Screen]
export default function HomeScreen({ route, navigation }) {

    console.log('[Open] Home Screen');

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
    let [list_progress_origin, set_list_progress_origin] = useState([0, 0, 0, 0, 0, 0]);
    let [goalList, set_goalList] = useState([0, 0, 0, 0, 0, 0]);
    


    // 1. get data from the phone
    const getData = async () => {
  
      console.log('\n--正在拿資料');
  
      try {
        const S_Total = await AsyncStorage.getItem('@Total');
        const S_NowList = await AsyncStorage.getItem('@NowList');
  
        if (S_Total === null) leftTotalMoney = 0;
        else leftTotalMoney = parseInt(S_Total);
  
        if (S_NowList === null) list_nowMoney = [0, 0, 0, 0, 0, 0];
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
  
    // 2. adjust progress value under 100%
    const checkProgressValue = () => {
  
      console.log('\n--正在整理資料');
  
      goalList = [
        Math.round(leftTotalMoney * (proportionList[0] * 0.01)), // 投資
        Math.round(leftTotalMoney * (proportionList[1] * 0.01)), // 學習
        Math.round(leftTotalMoney * (proportionList[2] * 0.01)), // 生活
        Math.round(leftTotalMoney * (proportionList[3] * 0.01)), // 玩樂
        Math.round(leftTotalMoney * (proportionList[4] * 0.01)), // 長線
        Math.round(leftTotalMoney * (proportionList[5] * 0.01)), // 給予
      ];
  
      list_progress_origin = [
        Math.round((list_nowMoney[0] / goalList[0]) * 100),
        Math.round((list_nowMoney[1] / goalList[1]) * 100),
        Math.round((list_nowMoney[2] / goalList[2]) * 100),
        Math.round((list_nowMoney[3] / goalList[3]) * 100),
        Math.round((list_nowMoney[4] / goalList[4]) * 100),
        Math.round((list_nowMoney[5] / goalList[5]) * 100),
      ];
  
  
  
      // check the Value of ProgressBar < 100
      for (let i = 0; i <= 5; i++) {
        if (list_progress_origin[i] > 100) list_progress[i] = 100;
        else if (isNaN(list_progress_origin[i])) {
          list_progress[i] = 0;
          list_progress_origin[i] = 0;
        }
        else list_progress[i] = list_progress_origin[i];
      }
  
      console.log('goalList: ', goalList);
      console.log('list_progress: ', list_progress);
  
      set_leftTotalMoney(leftTotalMoney);
      set_list_nowMoney(list_nowMoney);
      set_list_progress(list_progress);
      set_goalList(goalList);
      set_list_progress_origin(list_progress_origin);
    };
    
    // sub: warning before reset anything
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
    
    // sub: reset anything
    const Remove = async () => {
      await AsyncStorage.removeItem('@Total');
      await AsyncStorage.removeItem('@NowList');
      await AsyncStorage.removeItem('@Record');
  
      console.log('=== 清除中 ===');
      getData();
      Alert.alert("資料已成功清除！");
    };
  
    // >>> Entering point <<<
    React.useEffect(() => { getData(); }, []);
  

    return (
      <View style={styles.backgroundView}>
  
        <TouchableOpacity style={styles.box_top} onPress={checkRemove}>
          <Text style={styles.label_leftMoney}>{leftTotalMoney} NTD.</Text>
        </TouchableOpacity>
  
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollViewContainer}>
            <View style={styles.box_progressInfo}>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌投資 {proportionList[0]}%</Text>
              </View>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌投資 {proportionList[0]}%</Text>
                <Text style={styles.label_goal}>| 預算 {goalList[0]} NTD.</Text>
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
                <Text style={styles.label_now}>已使用 {list_progress_origin[0]}% ( {list_nowMoney[0]}元 )</Text>
                <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[0] - list_nowMoney[0])} NTD.</Text>
              </View>
  
            </View>
  
            <View style={styles.box_progressInfo}>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌學習 {proportionList[1]}%</Text>
                <Text style={styles.label_goal}>| 預算 {goalList[1]} NTD.</Text>
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
                <Text style={styles.label_now}>已使用 {list_progress_origin[1]}% ( {list_nowMoney[1]}元 )</Text>
                <Text style={styles.label_howMuchToGoal}>{goalList[1] - list_nowMoney[1]} NTD.</Text>
              </View>
  
            </View>
  
            <View style={styles.box_progressInfo}>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌生活 {proportionList[2]}%</Text>
                <Text style={styles.label_goal}>| 預算 {goalList[2]} NTD.</Text>
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
                <Text style={styles.label_now}>已使用 {list_progress_origin[2]}% ( {list_nowMoney[2]}元 )</Text>
                <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[2] - list_nowMoney[2])} NTD.</Text>
              </View>
  
            </View>
  
            <View style={styles.box_progressInfo}>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌玩樂 {proportionList[3]}%</Text>
                <Text style={styles.label_goal}>| 預算 {goalList[3]} NTD.</Text>
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
                <Text style={styles.label_now}>已使用 {list_progress_origin[3]}% ( {list_nowMoney[3]}元 )</Text>
                <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[3] - list_nowMoney[3])} NTD.</Text>
              </View>
  
            </View>
  
            <View style={styles.box_progressInfo}>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌長線 {proportionList[4]}%</Text>
                <Text style={styles.label_goal}>| 預算 {goalList[4]} NTD.</Text>
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
                <Text style={styles.label_now}>已使用 {list_progress_origin[4]}% ( {list_nowMoney[4]}元 )</Text>
                <Text style={styles.label_howMuchToGoal}>{Math.round(goalList[4] - list_nowMoney[4])} NTD.</Text>
              </View>
  
            </View>
  
            <View style={styles.box_progressInfo}>
  
              <View style={styles.box_title}>
                <Text style={styles.label_title}>▌給予 {proportionList[5]}%</Text>
                <Text style={styles.label_goal}>| 預算 {goalList[5]} NTD.</Text>
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
                <Text style={styles.label_now}>已使用 {list_progress_origin[5]}% ( {list_nowMoney[5]}元 )</Text>
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
            <Image source={require('../common/plus.png')} resizeMode='center' style={{ maxHeight: 20, marginTop: 15, }} />
          </TouchableOpacity>
  
          <TouchableOpacity
            style={{ backgroundColor: '#F5F5F5', width: 60, alignItems: "center", borderRadius: 10, marginRight: 10 }}
            onPress={() => navigation.navigate("Record")}
          >
            <Image source={require('../common/list.png')} resizeMode='center' style={{ maxHeight: 20, marginTop: 15, }} />
          </TouchableOpacity>
        </View>
  
      </View>
    );
};



// [Styling]
const styles = StyleSheet.create({
  backgroundView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
  },
  scrollView: {
    paddingLeft: 15,
    paddingRight: 15,
  },

  // Boxes
  box_top: {
    marginBottom: 15,
    justifyContent: 'center', // vertical
    alignItems: 'center', // horizontal
    height: 100,
    width: '90%',
    backgroundColor: '#88c1b8',
    borderRadius: 15,
  },
  box_progressInfo: {
    paddingBottom: 25,
  },
  box_title: {
    marginBottom: 15,
    padding: 10,
    width: 'auto',
    backgroundColor: 'rgba(211,196,167, 0.2)',
    borderRadius: 30,
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
    paddingLeft: 15,
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
    color: 'rgba(211,196,167, 1)',
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
    color: '#88c1b8',
    fontWeight: 'bold',
    fontSize: 18,
  },
});