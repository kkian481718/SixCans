import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Text,
} from 'react-native';

import ProgressBarAnimated from 'react-native-progress-bar-animated';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    paddingTop: 10,
    marginHorizontal: 20,
  },

  // Boxes
  box_top: {
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 15,
  },
  box_button: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  // Labels
  label_leftMoney: {
    color: '#28DBB0',
    fontWeight: 'bold',
    fontSize: 30,
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

export default class Main extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      indeterminate: true,
    };
  }

  // Code
  _newRecord_onPress() {
    
  }

  _setting_onPress() {


  }


  render() {
    
    // Variables Setting
    let Money_leftTotal = 10000;
    let Money_NowList = [
      1491,
      200,
      3200,
      400,
      500,
      600,
    ]

    let proportionList = [
      /* total = 100 */
      15, // 投資 15%
      10, // 學習 10%
      55, // 生活 55%
      10, // 玩樂 10%
      10, // 長線 10%
      10, // 給予 10%
    ]

    let goalList = [
      Money_leftTotal * proportionList[0] * 0.01, // 投資
      Money_leftTotal * proportionList[1] * 0.01, // 學習
      Money_leftTotal * proportionList[2] * 0.01, // 生活
      Money_leftTotal * proportionList[3] * 0.01, // 玩樂
      Money_leftTotal * proportionList[4] * 0.01, // 長線
      Money_leftTotal * proportionList[5] * 0.01, // 給予
    ]

    let calculateResultList = [
      {
        "progress" : (Money_NowList[0] / goalList[0]) * 100,
        "howMuchToGoal" : goalList[0] - Money_NowList[0],
      },
      {
        "progress" : (Money_NowList[1] / goalList[1]) * 100,
        "howMuchToGoal" : goalList[1] - Money_NowList[1],
      },
      {
        "progress" : (Money_NowList[2] / goalList[2]) * 100,
        "howMuchToGoal" : goalList[2] - Money_NowList[2],
      },
      {
        "progress" : (Money_NowList[3] / goalList[3]) * 100,
        "howMuchToGoal" : goalList[3] - Money_NowList[3],
      },
      {
        "progress" : (Money_NowList[4] / goalList[4]) * 100,
        "howMuchToGoal" : goalList[4] - Money_NowList[4],
      },
      {
        "progress" : (Money_NowList[5] / goalList[5]) * 100,
        "howMuchToGoal" : goalList[5] - Money_NowList[5],
      },
    ]

    // ProgressBar Styling
    const barWidth = Dimensions.get('screen').width - 30;

    // Components
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
                height={40}
                borderWidth={0}
                borderRadius= {50}
                value={calculateResultList[0].progress}
                maxValue={100}
                backgroundColor="#28DBB0"
              />

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
                height={40}
                borderWidth={0}
                borderRadius= {50}
                value={calculateResultList[1].progress}
                maxValue={100}
                backgroundColor="#28DBB0"
              />

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
                height={40}
                borderWidth={0}
                borderRadius= {50}
                value={calculateResultList[2].progress}
                maxValue={100}
                backgroundColor="#28DBB0"
              />

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
                height={40}
                borderWidth={0}
                borderRadius= {50}
                value={calculateResultList[3].progress}
                maxValue={100}
                backgroundColor="#28DBB0"
              />

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
                height={40}
                borderWidth={0}
                borderRadius= {50}
                value={calculateResultList[4].progress}
                maxValue={100}
                backgroundColor="#28DBB0"
              />

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
                height={40}
                borderWidth={0}
                borderRadius= {50}
                value={calculateResultList[5].progress}
                maxValue={100}
                backgroundColor="#28DBB0"
              />

              <View style={styles.box_subTitle}>
                <Text style={styles.label_now}>已使用 {Money_NowList[5]} NTD.</Text>
                <Text style={styles.label_howMuchToGoal}>{calculateResultList[5].howMuchToGoal} NTD.</Text>
              </View>
        
            </View>

          </View>
        </ScrollView>

        <View style={styles.box_button}>
          <TouchableOpacity 
            style={{ backgroundColor: '#F5F5F5', width: '78%', padding: 15, alignItems: "center", borderRadius: 10, }}
            onPress={this._newRecord_onPress}
          >
            <Image source={require('./common/plus.png')} style={{alignSelf: 'flex-start'}}/>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: '#F5F5F5', width: '20%', padding: 15, alignItems: "center", borderRadius: 10, }} onPress={this._setting_onPress}>
          <Text>+</Text>
        </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }
}