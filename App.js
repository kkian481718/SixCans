import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
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


// [Variables Setting]
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
  // total = 100
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
    "progress": (Money_NowList[0] / goalList[0]) * 100,
    "howMuchToGoal": goalList[0] - Money_NowList[0],
  },
  {
    "progress": (Money_NowList[1] / goalList[1]) * 100,
    "howMuchToGoal": goalList[1] - Money_NowList[1],
  },
  {
    "progress": (Money_NowList[2] / goalList[2]) * 100,
    "howMuchToGoal": goalList[2] - Money_NowList[2],
  },
  {
    "progress": (Money_NowList[3] / goalList[3]) * 100,
    "howMuchToGoal": goalList[3] - Money_NowList[3],
  },
  {
    "progress": (Money_NowList[4] / goalList[4]) * 100,
    "howMuchToGoal": goalList[4] - Money_NowList[4],
  },
  {
    "progress": (Money_NowList[5] / goalList[5]) * 100,
    "howMuchToGoal": goalList[5] - Money_NowList[5],
  },
]


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
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 50,
    backgroundColor: '#00000000',
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

  // ProgressBar Width Setting
  const barWidth = Dimensions.get('screen').width - 30;

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
              useNativeDriver={true} // Add This line
              width={barWidth}
              height={20}
              borderWidth={0}
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
              useNativeDriver={true} // Add This line
              width={barWidth}
              height={20}
              borderWidth={0}
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
              useNativeDriver={true} // Add This line
              width={barWidth}
              height={20}
              borderWidth={0}
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
              useNativeDriver={true} // Add This line
              width={barWidth}
              height={20}
              borderWidth={0}
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
              useNativeDriver={true} // Add This line
              width={barWidth}
              height={20}
              borderWidth={0}
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
              useNativeDriver={true} // Add This line
              width={barWidth}
              height={20}
              borderWidth={0}
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
          style={{ backgroundColor: '#F5F5F5', width: '75%', padding: 15, alignItems: "center", borderRadius: 10, marginRight: 10}}
          onPress={() => navigation.navigate('NewRecord')}
        >
          <Image source={require('./common/plus.png')} resizeMode='center' style={{ maxHeight: 20 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#F5F5F5', width: '20%', padding: 15, alignItems: "center", borderRadius: 10, }}
          onPress={() => navigation.navigate('Setting')}
        >
          <Image source={require('./common/apps.png')} resizeMode='center' style={{ maxHeight: 20 }} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

// [New Record Screen]
const NewRecordScreen = ({ navigation }) => {

  // initial state: Recording Type
  let [recordType, setrecordType] = React.useState('unchanged');
  const _onPress = (typeValue) => setrecordType(typeValue);

  // initial state: Text Inputer
  const [number, onChangeNumber] = React.useState(null);

  // Add a new record
  const _addRecord = () => {

    if (recordType != 'unchanged') {
      if (recordType == '_INCOME') {

        Money_leftTotal = Money_leftTotal + parseInt(number);
        console.log(Money_leftTotal);
        
      }
    }

    navigation.navigate('Home')
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


      <Text>TYPE：{ recordType }</Text>


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
          <Image source={require('./common/check.png')} resizeMode='center' style={{ maxHeight: 20, zIndex: 1 }} />
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
      <RefreshListView
            data={this.state.dataList}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCell}

            refreshState={this.state.refreshState}
            onHeaderRefresh={this.onHeaderRefresh}
            onFooterRefresh={this.onFooterRefresh}
        />
    </SafeAreaView>
  );

  // 开始下拉刷新
this.setState({refreshState: RefreshState.HeaderRefreshing})

// 开始上拉翻页
this.setState({refreshState: RefreshState.FooterRefreshing})

// 加载成功
this.setState({refreshState: RefreshState.Idle})

// 加载失败
this.setState({refreshState: RefreshState.Failure})

// 加载全部数据
this.setState({refreshState: RefreshState.NoMoreData})

// 服务器没有数据
this.setState({refreshState: RefreshState.EmptyData})

};

export default MyStack;