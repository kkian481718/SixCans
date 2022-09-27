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
} from 'react-native'

// Line Chart setting
import {
    LineChart,
    /*
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
    */
} from "react-native-chart-kit";
const barWidth = Math.round(Dimensions.get('screen').width - 50);
const LineChartStyle = {
    width: barWidth,
    height: 200,
    yAxisLabel: "$",
    yAxisSuffix: "",
    yAxisInterval: 1, // optional, defaults to 1
    chartConfig: {
        backgroundColor: "#F7F8DF",
        backgroundGradientFrom: "#A9A598",
        backgroundGradientTo: "#DDD8C8",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(247, 248, 223, ${opacity})`,
        labelColor: () => '#F7F8DF',

        style: {
            borderRadius: 16
        },

        propsForDots: {
            r: "4",
            //strokeWidth: "0",
            //stroke: "#F7F8DF",
        },
    },

    style: {
        marginVertical: 8,
        borderRadius: 10
    },
};



// [Home Screen]
export default function HomeScreen({ route, navigation }) {

    console.log('[Open] BarChart Screen');

    // Line Chart Data
    let [list_lineChartData, set_list_lineChartData] = useState([

        // #0 Budget
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },

        // #1
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },

        // #2
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },

        // #3 
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },

        // #4
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },

        // #5
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        },

        // #6
        {
            labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
            datasets: [
                {
                    data: [0, 0, 0, 0, 0, 0]
                }
            ]
        }
    ]);

    // Variables Setting
    let [leftBudget, set_leftBudget] = useState(0);
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
    let list_usedMoney = [0, 0, 0, 0, 0, 0];

    let [list_compare_usedMoney, set_list_compare_usedMoney] = useState([0, 0, 0, 0, 0, 0, 0]);
    let [list_compare_excessAmount, set_list_compare_excessAmount] = useState([0, 0, 0, 0, 0, 0, 0]);


    // 1. get data from LocalStorage
    const _get_usedMoneyMonthlyRecord = async () => {
        const string_usedMoneyMonthlyRecord = await AsyncStorage.getItem('@usedMoneyMonthlyRecord');

        if (string_usedMoneyMonthlyRecord=== null) _refreshPage();
        else _generateLineChartData(string_usedMoneyMonthlyRecord);

    };

    // 2. generate line chart data
    const _generateLineChartData = (string_usedMoneyMonthlyRecord) => {
        const list_usedMoneyMonthlyRecord = string_usedMoneyMonthlyRecord.split(",");

        console.log('list_usedMoneyMonthlyRecord: ', list_usedMoneyMonthlyRecord);

        // a. setting x-axix labels
        const _monthList = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        const _thisMonth = new Date().getMonth() + 1; // 1, 2, 3, ..., 11, 12
        const _thisYear = new Date().getFullYear()

        const lineChartLabel = [
            _monthList[_thisMonth - 6],
            _monthList[_thisMonth - 5],
            _monthList[_thisMonth - 4],
            _monthList[_thisMonth - 3],
            _monthList[_thisMonth - 2],
            _monthList[_thisMonth - 1]
        ];

        // b. setting data
        let temp_data = [
            [0, 0, 0, 0, 0, 0], // budget
            [0, 0, 0, 0, 0, 0], // 1
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]  // 6
        ];

        // the first point would be data from this month
        temp_data[0][5] = leftBudget;
        for (let i = 1; i <= 6; i++) temp_data[i][5] = list_usedMoney[i - 1];

        // for another 5 points we need datas of recent 5 month 
        for (let i = 0; i <= 4; i++) {

            const _nextMonthAndYearInRecord = list_usedMoneyMonthlyRecord[(i+1) * 8]; // 2022.8

            let _nextMonthWeNeed = _thisMonth - (i+1);
            let _nextYearWeNeed = _thisYear;
            
            if (_nextMonthWeNeed <= 0) {
                _nextMonthWeNeed += 12;
                _nextYearWeNeed -= 1;
            }
            const _nextMontAndYearhWeNeed = _nextYearWeNeed + '.' + _nextMonthWeNeed

            console.log('_nextMonthAndYearInRecord', _nextMonthAndYearInRecord);
            console.log('_nextMontAndYearhWeNeed: ', _nextMontAndYearhWeNeed);

            // fill the empty data
            if (_nextMonthAndYearInRecord != _nextMontAndYearhWeNeed) {
                // for (let n = 0; n <= 6; n++) temp_data[n][i] = 0; // it's '0' from the beginning
            }
            else {
                for (let n = 0; n <= 6; n++) temp_data[n][(4-i)] = parseInt(list_usedMoneyMonthlyRecord[(i+1) * 8 + (n+1)]);
            }

            console.log('temp_data: ', temp_data);
        };

        // putting thing in
        for (let i = 0; i <= 6; i++) {
            list_lineChartData[i].labels = lineChartLabel;
            list_lineChartData[i].datasets = [
                {
                    data: temp_data[i]
                }
            ]
        }

        _generateCompareData(list_usedMoneyMonthlyRecord);
    
    };

    // 3. generate compare data (below the chart)
    const _generateCompareData = (list_usedMoneyMonthlyRecord) => {
        
        let temp_totalUsedMoney = 0;

        // 
        temp_totalUsedMoney = 0;
        for (let i=0; i <= 5; i++) temp_totalUsedMoney += list_usedMoney[i];

        list_compare_usedMoney = [
            Math.round( (temp_totalUsedMoney / leftBudget) * 100 ),
            list_progress_origin[0],
            list_progress_origin[1],
            list_progress_origin[2],
            list_progress_origin[3],
            list_progress_origin[4],
            list_progress_origin[5]
        ];

        // 
        list_compare_excessAmount = [
            Math.round((leftBudget / list_usedMoneyMonthlyRecord[9]) * 100) - 100,
            Math.round((list_usedMoney[0] / list_usedMoneyMonthlyRecord[10]) * 100) - 100,
            Math.round((list_usedMoney[1] / list_usedMoneyMonthlyRecord[11]) * 100) - 100,
            Math.round((list_usedMoney[2] / list_usedMoneyMonthlyRecord[12]) * 100) - 100,
            Math.round((list_usedMoney[3] / list_usedMoneyMonthlyRecord[13]) * 100) - 100,
            Math.round((list_usedMoney[4] / list_usedMoneyMonthlyRecord[14]) * 100) - 100,
            Math.round((list_usedMoney[5] / list_usedMoneyMonthlyRecord[15]) * 100) - 100
        ];
        for (let i=0; i <= 6; i++) {
            if (isNaN(list_compare_excessAmount[i])) list_compare_excessAmount[i] = "--";
        }

        _refreshPage();

    };

    // 4. render things
    const _refreshPage = () => {
        set_leftBudget(leftBudget);
        set_list_obj_Category(list_obj_Category);

        set_list_lineChartData(list_lineChartData);
        set_list_compare_usedMoney(list_compare_usedMoney);
        set_list_compare_excessAmount(list_compare_excessAmount);
    };

    // sub: shows the hint of total
    const totalInfo = () => {
        Alert.alert(
            "本月預算",
            "\n這是你這個月的「所有收入」\n\n剩餘可用金額請參考首頁旁邊的橘字"
        )
    };

    // >>> Entering point <<<
    if (route.params != undefined) {
        leftBudget = route.params.leftBudget;
        list_obj_Category = route.params.list_obj_Category;
        list_usedMoney = route.params.list_usedMoney;
        list_progress_origin = route.params.list_progress_origin;

        route.params = undefined;
        _get_usedMoneyMonthlyRecord();
    }


    return (

        <View style={styles.backgroundView}>

            <StatusBar backgroundColor="#A9A598" />

            <TouchableOpacity style={styles.box_total} onPress={totalInfo}>
                <Text style={styles.label_leftMoney}>{leftBudget} NTD.</Text>
            </TouchableOpacity>

            <ScrollView style={styles.scrollView}>
                <View style={styles.scrollViewContainer}>


                    {/*0 收入*/}
                    <View style={styles.box_progressInfo}>

                    <View style={{flexDirection: 'row',}}>
                        <Text style={styles.label_boxBeforeTitle}>▌</Text>
                        <Text style={styles.label_title}>每月收入</Text>
                    </View>
                        

                        <LineChart
                            data={list_lineChartData[0]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[0]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[0]}%</Text>
                            </View>
                        </View>

                    </View>


                    {/*1 投資*/}
                    <View style={styles.box_progressInfo}>

                        <View style={{flexDirection: 'row',}}>
                            <Text style={styles.label_boxBeforeTitle}>▌</Text>
                            <Text style={styles.label_title}>{list_obj_Category[0].name}</Text>
                        </View>

                        <LineChart
                            data={list_lineChartData[1]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[1]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[1]}%</Text>
                            </View>
                        </View>

                    </View>



                    {/*2 學習*/}
                    <View style={styles.box_progressInfo}>

                        <View style={{flexDirection: 'row',}}>
                            <Text style={styles.label_boxBeforeTitle}>▌</Text>
                            <Text style={styles.label_title}>{list_obj_Category[1].name}</Text>
                        </View>

                        <LineChart
                            data={list_lineChartData[2]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[2]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[2]}%</Text>
                            </View>
                        </View>

                    </View>



                    {/*3 生活*/}
                    <View style={styles.box_progressInfo}>

                        <View style={{flexDirection: 'row',}}>
                            <Text style={styles.label_boxBeforeTitle}>▌</Text>
                            <Text style={styles.label_title}>{list_obj_Category[2].name}</Text>
                        </View>

                        <LineChart
                            data={list_lineChartData[3]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[3]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[3]}%</Text>
                            </View>
                        </View>

                    </View>



                    {/*4 玩樂*/}
                    <View style={styles.box_progressInfo}>

                        <View style={{flexDirection: 'row',}}>
                            <Text style={styles.label_boxBeforeTitle}>▌</Text>
                            <Text style={styles.label_title}>{list_obj_Category[3].name}</Text>
                        </View>

                        <LineChart
                            data={list_lineChartData[4]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[4]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[4]}%</Text>
                            </View>
                        </View>

                    </View>



                    {/*5 長線*/}
                    <View style={styles.box_progressInfo}>

                        <View style={{flexDirection: 'row',}}>
                            <Text style={styles.label_boxBeforeTitle}>▌</Text>
                            <Text style={styles.label_title}>{list_obj_Category[4].name}</Text>
                        </View>

                        <LineChart
                            data={list_lineChartData[5]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[5]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[5]}%</Text>
                            </View>
                        </View>

                    </View>


                    {/*6 給予*/}
                    <View style={styles.box_progressInfo}>

                        <View style={{flexDirection: 'row',}}>
                            <Text style={styles.label_boxBeforeTitle}>▌</Text>
                            <Text style={styles.label_title}>{list_obj_Category[5].name}</Text>
                        </View>

                        <LineChart
                            data={list_lineChartData[6]}
                            {...LineChartStyle}
                            bezier
                        />

                        <View style={styles.box_compare}>
                            <View style={styles.box_compareTitle}>
                                <Text style={styles.lable_compareTitle}>本</Text>
                                <Text style={styles.lable_compareTitle}>月</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>已使用</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_usedMoney[6]}%</Text>
                            </View>

                            <View style={styles.box_compareItem}>
                                <Text style={styles.lable_compareSubTitle}>比起上月</Text>
                                <Text style={styles.lable_compareNumber}>{list_compare_excessAmount[6]}%</Text>
                            </View>
                        </View>

                    </View>


                </View>
            </ScrollView>


            <View style={styles.box_button}>

                <TouchableOpacity
                    style={styles.button_left}
                    onPress={() => navigation.navigate('Home', {})}
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
        width: '90%',
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
    box_compare: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // 水平
        alignItems: 'center', // 垂直
        marginBottom: 6,
        width: '100%'
    },
    box_compareTitle: {
        flexDirection: 'column',
        justifyContent: 'center', // 水平
        alignItems: 'center', // 垂直
        height: 100,
        width: 40,
        backgroundColor: '#A9A598',
        borderRadius: 10,
    },
    box_compareItem: {
        marginLeft: 10,
        justifyContent: 'center', // 水平
        alignItems: 'center', // 垂直
        height: 100,
        width: 150,
        borderWidth: 1,
        borderColor: '#A9A598',
        borderRadius: 10,
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
        color: 'rgba(211,196,167, 1)',
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 15,
    },
    lable_compareTitle: {
        color: '#F7F8DF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    lable_compareSubTitle: {
        color: '#F7F8DF',
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 5,
    },
    lable_compareNumber: {
        color: '#F7F8DF',
        fontWeight: 'bold',
        fontSize: 40,
    },
});