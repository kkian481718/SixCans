import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';

import AsyncStorage from '@react-native-async-storage/async-storage';




export default function SectionList() {

    // === GET DATA ===
    let [listData, setListData] = useState([]);

    React.useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            let temp = await AsyncStorage.getItem('@Record');

            if (temp == null) {
                console.log('== 沒有紀錄 ==');
                setListData([{ "title": "Oh No 沒有任何紀錄", "data": [{ "key": `0.0`, "text": `：）` }] }]);
            }
            else {
                listData = temp.split(",");

                console.log('');
                console.log('--listData: ', listData);
                console.log('');

                let listWholeSection = [
                    {
                        "title": listData[0],
                        "data": [] // waiting to put 'listData_temp' inside
                    }
                ];
                let listData_temp = [
                    {
                        "key": "0.0",
                        "text": listData[1] + ` | ` + listData[2] + ' NTD. |  ' + listData[3],
                        "count": 0
                    }
                ];

                let [i, j] = [0, 0];
                for (let count = 4; count <= (listData.length); count = count + 4) {

                    console.log('----count: ', count);
                    console.log('----i: ', i);
                    console.log('----j: ', j);

                    if (listData[count] == listData[count - 4]) {
                        // add !
                        j++;
                        listData_temp.push(
                            {
                                "key": i + '.' + j,
                                "text": listData[count + 1] + ` | ` + listData[count + 2] + ' NTD. |  ' + listData[count + 3],
                                "count": count
                            }
                        );
                    }
                    else if (count == (listData.length - 1)) {
                        listWholeSection[i].data = listData_temp;
                    }
                    else {
                        listWholeSection[i].data = listData_temp;

                        i++;
                        listWholeSection.push(
                            {
                                "title": listData[count],
                                "data": [] // waiting to put 'listData_temp' inside
                            }
                        )

                        // reset, write a new one !
                        j = 0;
                        listData_temp = [
                            {
                                "key": i + ".0",
                                "text": listData[count + 1] + ` | ` + listData[count + 2] + ' NTD. |  ' + listData[count + 3],
                                "count": count
                            }
                        ];
                    }
                };

                console.log('--listWholeSection: ', listWholeSection);
                setListData(listWholeSection);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // === GET DATA ===


    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);

        const [section] = rowKey.split('.');
        const newData = [...listData];
        const prevIndex = listData[section].data.findIndex(
            item => item.key === rowKey
        );

        // update storage value
        const deleteCount = newData[section].data[prevIndex].count;
        deleteValue(deleteCount);
        console.log('Count', deleteCount);

        // update list
        newData[section].data.splice(prevIndex, 1);
        setListData(newData);
    };

    const deleteValue = async (deleteCount) => {

        console.log('=== 正在刪除 count:' + deleteCount + ' ===');

        let list_forDelete = await AsyncStorage.getItem('@Record');
        list_forDelete = list_forDelete.split(",");

        const removeType = list_forDelete[deleteCount + 1];
        const removeValue = list_forDelete[deleteCount + 2];

        console.log('removeType: ', removeType);
        console.log('removeValue: ', removeValue);

        // Get Storage Value
        try {
            let moneyLeft = await AsyncStorage.getItem('@Total');
            let list_moneyNow = await AsyncStorage.getItem('@NowList');
            let record_temp = await AsyncStorage.getItem('@Record');

            record_temp = record_temp.split(",");

            console.log('@Total: ', moneyLeft);
            console.log('@NowList: ', list_moneyNow);
            console.log('@Record: \n', record_temp);

            record_temp.splice(deleteCount, 4);

            if (removeType == "新增收入") moneyLeft = moneyLeft - parseInt(removeValue)
            else if (removeType == "投資") list_moneyNow[0] = list_moneyNow[0] - parseInt(removeValue)
            else if (removeType == "學習") list_moneyNow[1] = list_moneyNow[1] - parseInt(removeValue)
            else if (removeType == "生活") list_moneyNow[2] = list_moneyNow[2] - parseInt(removeValue)
            else if (removeType == "玩樂") list_moneyNow[3] = list_moneyNow[3] - parseInt(removeValue)
            else if (removeType == "長線") list_moneyNow[4] = list_moneyNow[4] - parseInt(removeValue)
            else if (removeType == "給予") list_moneyNow[5] = list_moneyNow[5] - parseInt(removeValue)

            console.log('@Total: ', moneyLeft);
            console.log('@NowList: ', list_moneyNow);
            saveData(moneyLeft, list_moneyNow, record_temp);

        } catch (error) {
            console.log(error);
        }
    };

    // Save Value
    const saveData = async (moneyLeft, list_moneyNow, record_temp) => {

        console.log('=== 正在儲存 ===');

        try {
            let temp = moneyLeft + '';
            let temp2 = list_moneyNow.toString();
            let temp3 = record_temp.toString();

            AsyncStorage.setItem('@Total', temp);
            AsyncStorage.setItem('@NowList', temp2);
            AsyncStorage.setItem('@Record', temp3);

            console.log('@Total: ', moneyLeft);
            console.log('@NowList: ', list_moneyNow);
            console.log('@Record (Dele): \n', record_temp);

        } catch (error) {
            console.log(error);
        }
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);

        const [section] = rowKey.split('.');
        const newData = [...listData];
        const prevIndex = listData[section].data.findIndex(
            item => item.key === rowKey
        );

        const deleteCount = newData[section].data[prevIndex].count;
        console.log('count:', deleteCount);
    };

    const renderItem = data => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text>{data.item.text}</Text>
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <Text>早安：Ｄ</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>關閉</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>刪除</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSectionHeader = ({ section }) => <Text>{section.title}</Text>;

    return (
        <View style={styles.container}>
            <SwipeListView
                useSectionList
                sections={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                renderSectionHeader={renderSectionHeader}
                leftOpenValue={75}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        height: 50,
        marginBottom: 5,
        paddingLeft: 15,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginBottom: 5,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: '#88c1b8',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#ed7a5d',
        right: 0,
    },
});