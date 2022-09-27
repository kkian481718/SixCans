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
  StatusBar,
} from 'react-native'



// Progress bar vars setting
const barWidth = Dimensions.get('screen').width - 50;
const progressCustomStyles = {
  width: barWidth,
  height: 20,
  borderWidth: 0,
  borderRadius: 50,
  backgroundColor: '#F7F8DF', // 進度條(前面) 顏色
  underlyingColor: '#A9A598', // 背景條(底) 顏色
};



// [Home Screen]
export default function HomeScreen({ route, navigation }) {

  console.log('[Refresh] Home Screen');

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
  let [list_progress, set_list_progress] = useState([0, 0, 0, 0, 0, 0]);
  let [list_goal, set_list_goal] = useState([0, 0, 0, 0, 0, 0]);

  let list_usedMoneyMonthlyRecord = [];

  

  // 1. get data from LocalStorage
  const _getDatafromLocalStorage = async () => {

    console.log('--正在拿 Local Storage 的資料');

    try {

      // leftBudget
      const LS_leftBudget = await AsyncStorage.getItem('@leftBudget');
      if (LS_leftBudget === null) {
        leftBudget = 0;
      }
      else {
        leftBudget = parseInt(LS_leftBudget);
      }

      // list_usedMoney
      const LS_string_usedMoney = await AsyncStorage.getItem('@Category.usedMoney');
      if (LS_string_usedMoney === null) {
        list_usedMoney = [0, 0, 0, 0, 0, 0];
      }
      else {
        const LS_list_usedMoney = LS_string_usedMoney.split(",");

        for (let i=0; i<=5; i++)
          list_usedMoney[i] = parseInt(LS_list_usedMoney[i]);
      }

      // Category
      const LS_string_Category = await AsyncStorage.getItem('@Category');
      if (LS_string_Category === null) {
        list_obj_Category = [
          {
            "name": "生活",
            "percentage": 55,
            "description": "Necessities 房租、食物、水電、帳單"
          },
          {
            "name": "長線",
            "percentage": 10,
            "description": "Long-Term 存給PS5、旅行基金、醫療備用金..."
          },
          {
            "name": "玩樂",
            "percentage": 10,
            "description": "Play 自己出去玩花的錢！"
          },
          {
            "name": "學習",
            "percentage": 10,
            "description": "Eduation 課本、家教、線上課程"
          }, 
          {
            "name": "投資",
            "percentage": 10,
            "description": "Financial 股票、基金、讓自己財富自由的投資"
          },     
          {
            "name": "贈予",
            "percentage": 5,
            "description": "Give 送禮、請同學吃飯..."
          }
        ];

        // save initial value into LocalStorage
        const list_Category = [
          "生活", 55, "Necessities 房租、食物、水電、帳單",
          "長線", 10, "Long-Term 存給PS5、旅行基金、醫療備用金...",
          "玩樂", 10, "Play 自己出去玩花的錢！",
          "學習", 10, "Eduation 課本、家教、線上課程",
          "投資", 10, "Financial 股票、基金、讓自己財富自由的投資",
          "贈予",  5, "Give 送禮、請同學吃飯..."
        ]
        await AsyncStorage.setItem('@Category', list_Category.toString());
      }
      else {
        const LS_list_Category = LS_string_Category.split(",");

        let n_of_LS_list_Category = 0; // 
        for (let i=0; i<=5; i++) {
          list_obj_Category[i] = {
            "name": LS_list_Category[n_of_LS_list_Category],
            "percentage": parseInt(LS_list_Category[n_of_LS_list_Category + 1]), // must be number
            "description": LS_list_Category[n_of_LS_list_Category + 2]
          }
          n_of_LS_list_Category += 3 ;
        }
      }

      
      console.log("\tleftBudget: ", leftBudget);
      console.log("\tlist_usedMoney: ", list_usedMoney);
      _checkMonth();
      
    } catch (error) {
      console.log(error);
    }
  };

  // 2. 
  const _checkMonth = async () => {

    console.log("--正在檢查年月份");

    // lastYearAndMonth: 用來判斷要不要結算
    const LS_lastYearAndMonth = await AsyncStorage.getItem('@lastYearAndMonth');

    const _thisMonth = JSON.stringify(new Date().getMonth() + 1); // string
    const _thisYear = JSON.stringify(new Date().getFullYear()); // string
    const _thisYearAndMonth = _thisYear + '.' + _thisMonth;
    
    console.log('\tLS_lastYearAndMonth: ', LS_lastYearAndMonth);
    console.log('\t_thisYearAndMonth: ', _thisYearAndMonth);
  

    if (LS_lastYearAndMonth === _thisYearAndMonth) {
      console.log("----年、月份相同");
      _checkProgressValue();
    }
    else if (LS_lastYearAndMonth === null) {

      console.log("----建立年月份資料");

      list_usedMoneyMonthlyRecord = [_thisYearAndMonth, leftBudget]
      list_usedMoneyMonthlyRecord = list_usedMoneyMonthlyRecord.concat(list_usedMoney);
      console.log('\tlist_usedMoneyMonthlyRecord: ', list_usedMoneyMonthlyRecord);
      /*
      [
        2022.1, 10000, // 2022年1月的紀錄、當月預算總計為10000
        0, 0, 0, 0, 0, 0, // 類別一用了0元、...

        2022.3, 60000, // 2022年3月的紀錄、當月預算總計為60000
        200, 45, 2, 18, 6

        ...
      ]
      */

      await AsyncStorage.setItem('@lastYearAndMonth', _thisYearAndMonth);
      await AsyncStorage.setItem('@usedMoneyMonthlyRecord', list_usedMoneyMonthlyRecord.toString())

      _checkProgressValue();
    }
    else if (LS_lastYearAndMonth != _thisYearAndMonth) {
      console.log("----新月份");
      _monthlySettlement();
    }

  };

  // 3. adjust progress value under 100%
  const _checkProgressValue = () => {

    console.log('--正在整理資料');
 
    list_goal = [
      Math.round(leftBudget * (list_obj_Category[0].percentage * 0.01)), // 投資
      Math.round(leftBudget * (list_obj_Category[1].percentage * 0.01)), // 學習
      Math.round(leftBudget * (list_obj_Category[2].percentage * 0.01)), // 生活
      Math.round(leftBudget * (list_obj_Category[3].percentage * 0.01)), // 玩樂
      Math.round(leftBudget * (list_obj_Category[4].percentage * 0.01)), // 長線
      Math.round(leftBudget * (list_obj_Category[5].percentage * 0.01)), // 給予
    ];

    list_progress_origin = [
      Math.round((list_usedMoney[0] / list_goal[0]) * 100),
      Math.round((list_usedMoney[1] / list_goal[1]) * 100),
      Math.round((list_usedMoney[2] / list_goal[2]) * 100),
      Math.round((list_usedMoney[3] / list_goal[3]) * 100),
      Math.round((list_usedMoney[4] / list_goal[4]) * 100),
      Math.round((list_usedMoney[5] / list_goal[5]) * 100),
    ];



    // check the Value of ProgressBar < 100
    for (let i=0; i<=5; i++) {
      
      if (isNaN(list_progress_origin[i])) {
        list_progress[i] = 0;
      }
      else if (list_progress_origin[i] > 100) {
        list_progress[i] = 100;
      }
      else{
        list_progress[i] = list_progress_origin[i];
      }
    }

    _refreshPage();
  };

  // 4. render things
  const _refreshPage = () => {
    set_leftBudget(leftBudget);
    set_list_usedMoney(list_usedMoney);
    set_list_obj_Category(list_obj_Category);

    set_list_progress(list_progress);
    set_list_progress_origin(list_progress_origin);
    set_list_goal(list_goal);
  };

  // sub: Settlement 結算
  const _monthlySettlement = async () => {

    console.log("--正在建立新月份資料");

    // 1. get data from LocalStorage
    const LS_usedMoneyMonthlyRecord = await AsyncStorage.getItem('@usedMoneyMonthlyRecord');
    let list_LS_usedMoneyMonthlyRecord = LS_usedMoneyMonthlyRecord.split(",");

    // 2. update data of last month
    list_LS_usedMoneyMonthlyRecord[1] = leftBudget;
    for (let i=2; i <= 7; i++) list_LS_usedMoneyMonthlyRecord[i] = list_usedMoney[i-2];

    // 3. set new dada for this month
    leftBudget = 0;
    list_usedMoney = [0, 0, 0, 0, 0, 0];
    const _thisMonth = JSON.stringify(new Date().getMonth() + 1); // string
    const _thisYear = JSON.stringify(new Date().getFullYear()); // string
    const _thisYearAndMonth = _thisYear + '.' + _thisMonth;

    list_usedMoneyMonthlyRecord = [
      _thisYearAndMonth, 0, 
      0, 0, 0, 0, 0, 0
    ];

    // 4. save it back
    let list_new_usedMoneyMonthlyRecord = list_usedMoneyMonthlyRecord.concat(list_LS_usedMoneyMonthlyRecord)
    try {

      await AsyncStorage.setItem('@lastYearAndMonth', _thisYearAndMonth);
      await AsyncStorage.setItem('@usedMoneyMonthlyRecord', list_new_usedMoneyMonthlyRecord.toString());

      await AsyncStorage.setItem('@leftBudget', JSON.stringify(leftBudget));
      await AsyncStorage.setItem('@Category.usedMoney', list_usedMoney.toString());

    } catch (error) {
      console.log(error);
    }

    Alert.alert(
      "結算！",
      "啊哈！又過了一個月！\n\n我們已經為您準備好上個月的花費圖表\n不妨按左下角的按鈕看看？"
    )

    _checkProgressValue();

  };

  // sub: shows the hint of total
  const _totalInfo = () => {
    Alert.alert(
      "本月預算",
      "\n這是你這個月的「所有收入」\n\n剩餘可用金額請參考旁邊的橘字"
    )
  };

  // >>> Entering point <<<
  if (route.params != undefined) {
    console.log('--正在refresh');
    route.params = undefined;
    _getDatafromLocalStorage();
  };
  React.useEffect(() => { 
    // run once after initial rendering
    console.log('[Open] Home Screen');
    _getDatafromLocalStorage();
  }, [])


  
  return (

    <View style={styles.backgroundView}>

      <StatusBar backgroundColor="#A9A598" />

      <TouchableOpacity style={styles.box_total} onPress={_totalInfo}>
        <Text style={styles.label_leftMoney}>{leftBudget} NTD.</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>

          {/*1 投資*/}
          <View style={styles.box_progressInfo}>

            <View style={{flexDirection: 'row',}}>
              <Text style={styles.label_boxBeforeTitle}>▌</Text>
              <Text style={styles.label_title}>{list_obj_Category[0].name}</Text>
            </View>

            <ProgressBarAnimated
              {...progressCustomStyles}

              value={list_progress[0]}
              maxValue={100}
            />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_usedMoney[0]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(list_goal[0] - list_usedMoney[0])}$ 可用</Text>
            </View>

          </View>


          {/*2 學習*/}
          <View style={styles.box_progressInfo}>

            <View style={{flexDirection: 'row',}}>
              <Text style={styles.label_boxBeforeTitle}>▌</Text>
              <Text style={styles.label_title}>{list_obj_Category[1].name}</Text>
            </View>

            <ProgressBarAnimated
              {...progressCustomStyles}

              value={list_progress[1]}
              maxValue={100}
            />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_usedMoney[1]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{list_goal[1] - list_usedMoney[1]}$ 可用</Text>
            </View>

          </View>


          {/*3 生活*/}
          <View style={styles.box_progressInfo}>

            <View style={{flexDirection: 'row',}}>
              <Text style={styles.label_boxBeforeTitle}>▌</Text>
              <Text style={styles.label_title}>{list_obj_Category[2].name}</Text>
            </View>

            <ProgressBarAnimated
              {...progressCustomStyles}
              
              value={list_progress[2]}
              maxValue={100}
            />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_usedMoney[2]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(list_goal[2] - list_usedMoney[2])}$ 可用</Text>
            </View>

          </View>

          {/*4 玩樂*/}
          <View style={styles.box_progressInfo}>

            <View style={{flexDirection: 'row',}}>
              <Text style={styles.label_boxBeforeTitle}>▌</Text>
              <Text style={styles.label_title}>{list_obj_Category[3].name}</Text>
            </View>

            <ProgressBarAnimated
              {...progressCustomStyles}
              
              value={list_progress[3]}
              maxValue={100}
            />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_usedMoney[3]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(list_goal[3] - list_usedMoney[3])}$ 可用</Text>
            </View>

          </View>


          {/*5 長線*/}
          <View style={styles.box_progressInfo}>

            <View style={{flexDirection: 'row',}}>
              <Text style={styles.label_boxBeforeTitle}>▌</Text>
              <Text style={styles.label_title}>{list_obj_Category[4].name}</Text>
            </View>

            <ProgressBarAnimated
              {...progressCustomStyles}
              
              value={list_progress[4]}
              maxValue={100}
            />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_usedMoney[4]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(list_goal[4] - list_usedMoney[4])}$ 可用</Text>
            </View>

          </View>


          {/*6 給予*/}
          <View style={styles.box_progressInfo}>

            <View style={{flexDirection: 'row',}}>
              <Text style={styles.label_boxBeforeTitle}>▌</Text>
              <Text style={styles.label_title}>{list_obj_Category[5].name}</Text>
            </View>

            <ProgressBarAnimated
              {...progressCustomStyles}
              
              value={list_progress[5]}
              maxValue={100}
            />

            <View style={styles.box_subTitle}>
              <Text style={styles.label_now}>已使用 {list_usedMoney[5]} NTD.</Text>
              <Text style={styles.label_howMuchToGoal}>{Math.round(list_goal[5] - list_usedMoney[5])}$ 可用</Text>
            </View>

          </View>

        </View>
      </ScrollView>


      <View style={styles.box_button}>

        <TouchableOpacity
          style={styles.button_left}
          onPress={() => navigation.navigate('Detail', { leftBudget, list_obj_Category, list_usedMoney, list_progress_origin })}
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
  box_progressInfo: {
    paddingBottom: 25,
  },
  box_subTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 水平
    alignItems: 'flex-start', // 垂直
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

  // Labels
  label_leftMoney: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 35,
    alignItems: 'center',
  },
  label_boxBeforeTitle: {
    color: '#F7F8DF',
    fontSize: 18,
    marginBottom: 6,
  },
  label_title: {
    color: '#DBD6C7',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  label_goal: {
    color: '#BABABA',
    fontSize: 14,
  },
  label_now: {
    color: '#E4E4E4',
    fontSize: 10,
    marginTop: 4,
  },
  label_howMuchToGoal: {
    color: '#F79C30',
    fontWeight: 'bold',
    fontSize: 18,
  },
});