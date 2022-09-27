import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Alert,
} from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';



export default function SectionList() {

    // vars
    let [list_render, set_list_render] = useState([]);
    let list_SpendingRecord = []
    let list_obj_Category = [];
    let [pickerValue, set_pickerValue] = useState('all');

    // Enter point
    React.useEffect(() => {
        _getCategory();
    }, []);

    // 1. get Category parameters from LocalStorage 
    const _getCategory = async () => {

        try {
            const LS_string_Category = await AsyncStorage.getItem('@Category');
            const LS_list_Category = LS_string_Category.split(",");

            let n_LS_list_Category = 0;
            for (let i = 0; i <= 5; i++) {

                // return list_obj_Category
                list_obj_Category[i] = {
                    "name": LS_list_Category[n_LS_list_Category],
                    "percentage": parseInt(LS_list_Category[n_LS_list_Category + 1]), // must be number
                    "description": LS_list_Category[n_LS_list_Category + 2]
                }

                n_LS_list_Category += 3;
            }

            console.log('\nlist_obj_Category: \n', list_obj_Category);
            _getSpendingRecord();

        }
        catch (error) {
            console.log(error);
        }

    };

    // 2. get Category parameters from LocalStorage
    const _getSpendingRecord = async () => {

        try {

            let string_SpendingRecord = await AsyncStorage.getItem('@SpendingRecord');

            if (string_SpendingRecord == null) {
                console.log('== 沒有紀錄 ==');
                set_list_render(
                    [
                        {
                            "title": "Oh No 沒有任何紀錄",
                            "data":
                                [
                                    {
                                        "key": `0.0`,
                                        "text": `：）`
                                    }
                                ]
                        }
                    ]);
            }
            else {
                // 1. transfer string data from LocalStorage into list
                list_SpendingRecord = string_SpendingRecord.split(",");
                console.log('\nlist_SpendingRecord: \n', list_SpendingRecord);
                
                generate_list_render_ALL(list_SpendingRecord);
            };

        }
        catch (error) {
            console.log(error);
        }
    };

    // 3-1. generate and render the full list
    const generate_list_render_ALL = (list_SpendingRecord) => {

        console.log('--generate_list_render_ALL');

        let lastDate = "";
        let key_group = -1; // in order to let the first key as '0.0'
        let key_order = 0;

        let new_Obj = {};
        /*
        {
            "title": "2022.9.2",
            "data": [
                {
                    "key": 0.0,
                    "text": "收入 | 200 NTD. | 小七打工",
                    "count": 0
                },
                {
                    "key": 0.1,
                    "text": "收入 | 200 NTD. | 小七打工",
                    "count": 4
                }
            ]
        }
        */

        let new_Obj_data = {};
        /*
        {
            "key": 0.0,
            "text": "收入 | 200 NTD. | 小七打工",
            "count": 0
        }
        */

        list_render = [];
        for (let i = 0; i <= (list_SpendingRecord.length-4); i += 4) {

            console.log('\t[count]: ', i);

            // list_SpendingRecord should order like this:
            /*
            let Obj_SpendingRecord = {
                "date": "2022.9.2",
                "category": "add",
                "amount": 0,
                "note": ""
            };
            */

            // 1. setting data we needs
            let _date = list_SpendingRecord[i];
            let _amount = list_SpendingRecord[i + 2];
            let _note = list_SpendingRecord[i + 3];
            let _category = "";
            if (list_SpendingRecord[i + 1] === "add") 
                _category = "收入";
            else
                _category = list_obj_Category[parseInt(list_SpendingRecord[i + 1])].name;

            // 2. generate rowkey
            if (_date != lastDate) {
                if (i != 0) list_render.push(new_Obj); // therefore it won't push the initial(empty) obj

                lastDate = _date
                key_group++;
                key_order = 0;
                new_Obj =
                {
                    "title": _date,
                    "data": []
                }
            }
            else {
                key_order++;
            }

            new_Obj_data =
            {
                "key": key_group + "." + key_order,
                "text": _category + ` | ` + _amount + ' NTD. |  ' + _note,
                "count": i
            }

            // 3. putting things together
            new_Obj.data.push(new_Obj_data);
            console.log('\tnew_Obj_data: ', new_Obj_data);

        };

        list_render.push(new_Obj);
        set_list_render(list_render);
    };

    // 3-2. generate and render the list of choosen type

    // sub:
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    // dele 1. located data
    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);

        const [section] = rowKey.split('.');
        const newData = [...list_render];
        const prevIndex = list_render[section].data.findIndex(
            item => item.key === rowKey
        );

        // update storage value
        const deleteCount = newData[section].data[prevIndex].count;
        if (deleteCount != undefined) deleteValue(deleteCount);

        // update list
        newData[section].data.splice(prevIndex, 1);
        set_list_render(newData);
    };

    // dele 2. remove it from LocalStorage
    const deleteValue = async (deleteCount) => {

        console.log('=== 正在 @SpendingRecord 中搜尋 count:' + deleteCount + ' ===');

        let list_forDelete = await AsyncStorage.getItem('@SpendingRecord');
        list_forDelete = list_forDelete.split(",");

        const _list_removeDate = list_forDelete[deleteCount].split('.');
        const removeYearAndMonth = _list_removeDate[0] + '.' + _list_removeDate[1]; // string
        const removeType = list_forDelete[deleteCount + 1]; // string
        const removeValue = parseInt(list_forDelete[deleteCount + 2]); // Int

        console.log('\tremoveYearAndMonth: ', removeYearAndMonth);
        console.log('\tremoveType: ', removeType);
        console.log('\tremoveValue: ', removeValue);

        // Get Storage Value
        try {
            console.log('=== 刪除中... ===');         

            // 1. remove Record
            let string_SpendingRecord = await AsyncStorage.getItem('@SpendingRecord');
            let list_SpendingRecord = string_SpendingRecord.split(",");
            list_SpendingRecord.splice(deleteCount, 4);

            // 2. lastYearAndMonth: 用來確認年月分、要不要更改leftBudget 和 usedMoney
            const string_lastYearAndMonth = await AsyncStorage.getItem('@lastYearAndMonth');

            const _thisMonth = JSON.stringify(new Date().getMonth() + 1); // string
            const _thisYear = JSON.stringify(new Date().getFullYear()); // string
            const _thisYearAndMonth = _thisYear + '.' + _thisMonth;

            if (removeYearAndMonth == _thisYearAndMonth) {

                const string_leftBudget = await AsyncStorage.getItem('@leftBudget');
                const string_usedMoney = await AsyncStorage.getItem('@Category.usedMoney');

                let int_leftBudget = parseInt(string_leftBudget);
                let list_usedMoney = string_usedMoney.split(",");
            

                if (removeType == "add") {
                    int_leftBudget = int_leftBudget - removeValue;
                }
                else {
                    let int_removeType = parseInt(removeType); // string => int
                    list_usedMoney[int_removeType] -= removeValue;
                }

                saveData_thisMonth(int_leftBudget, list_usedMoney, list_SpendingRecord);

            }
            else {
                console.log('=== 正在 @usedMoneyMonthlyRecord 中搜尋 日期:' + removeYearAndMonth + ' ===');
                const string_usedMoneyMonthlyRecord = await AsyncStorage.getItem('@usedMoneyMonthlyRecord');
                let list_usedMoneyMonthlyRecord = string_usedMoneyMonthlyRecord.split(",");
                
                let _monthlyRecord_Count = list_usedMoneyMonthlyRecord.findIndex((element)=>{ return element == removeYearAndMonth }); // 2022.8
                console.log('_monthlyRecord_Count: ', _monthlyRecord_Count);

                if (removeType == "add") {
                    _monthlyRecord_EditingValue = parseInt( list_usedMoneyMonthlyRecord[_monthlyRecord_Count + 1] );
                    list_usedMoneyMonthlyRecord[_monthlyRecord_Count + 1] = _monthlyRecord_EditingValue - removeValue;
                }
                else {
                    _monthlyRecord_EditingValue = parseInt( list_usedMoneyMonthlyRecord[_monthlyRecord_Count + (2+removeType)] );
                    // 2, 3, 4, 5, 6, 7 (0=date, 1=Budget)
                    list_usedMoneyMonthlyRecord[_monthlyRecord_Count + (2+removeType)] = _monthlyRecord_EditingValue - removeValue;
                }

                saveData_old(list_usedMoneyMonthlyRecord, list_SpendingRecord);

            }

        } catch (error) {
            console.log(error);
            Alert.alert(
                "出ㄌ點錯誤",
                error
            )
        }
    };

    // Save Value
    const saveData_thisMonth = async (leftBudget, list_usedMoney, list_SpendingRecord) => {

        console.log('=== 正在儲存 ===');

        try {
            let string_leftBudget = leftBudget + '';
            let string_usedMoney = list_usedMoney.toString();
            let string_SpendingRecord = list_SpendingRecord.toString();

            AsyncStorage.setItem('@leftBudget', string_leftBudget);
            AsyncStorage.setItem('@Category.usedMoney', string_usedMoney);
            AsyncStorage.setItem('@SpendingRecord', string_SpendingRecord);

            console.log('@leftBudget: ', string_leftBudget);
            console.log('@Category.usedMoney: ', string_usedMoney);
            console.log('@SpendingRecord: ', string_SpendingRecord);

            Alert.alert(
                "刪除完成！",
                "",
              );

        } catch (error) {
            console.log(error);
            Alert.alert(
                "出ㄌ點錯誤",
                error
            )
        }
    };

    // Save Value
    const saveData_old = async (list_usedMoneyMonthlyRecord, list_SpendingRecord) => {

        console.log('=== 正在儲存 ===');

        try {
            let string_usedMoneyMonthlyRecord = list_usedMoneyMonthlyRecord.toString();
            let string_SpendingRecord = list_SpendingRecord.toString();

            AsyncStorage.setItem('@usedMoneyMonthlyRecord', string_usedMoneyMonthlyRecord);
            AsyncStorage.setItem('@SpendingRecord', string_SpendingRecord);

            console.log('@usedMoneyMonthlyRecord', string_usedMoneyMonthlyRecord);
            console.log('@SpendingRecord: ', string_SpendingRecord);

            Alert.alert(
                "刪除完成！",
                "",
            );

        } catch (error) {
            console.log(error);
            Alert.alert(
                "出ㄌ點錯誤",
                error
            )
        }
    };

    // sub:
    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);

        const [section] = rowKey.split('.');
        const newData = [...list_render];
        const prevIndex = list_render[section].data.findIndex(
            item => item.key === rowKey
        );

        const openCount = newData[section].data[prevIndex].count;
        console.log('count:', openCount);
    };

    // sub:
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

    // sub:
    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <Text>早安：Ｄ</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.label_btnTextLeft}>關閉</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Text style={styles.label_btnTextRight}>刪除</Text>
            </TouchableOpacity>
        </View>
    );

    // sub:
    const renderSectionHeader = ({ section }) => <Text style={styles.label_sectionTitle}>◆  {section.title}</Text>;

    /*
    // sub:
    const pickerValueChange = (value) => {

        pickerValue = value;
        set_pickerValue(pickerValue);
    
    };

    // Render Part
    const renderRNPickerSelect = () => {
        if (pickerValue == 'all') {
            return(
                <RNPickerSelect
                    onValueChange={(value) => pickerValueChange(value)}
                    placeholder={{}}
                    items={[
                        { label: '所有紀錄', value: 'all' },
                        { label: '依月份', value: 'date' },
                        { label: '依類別', value: 'type' },
                    ]}
                />
            );
        }
        if (pickerValue == 'date') {
            return(
                <RNPickerSelect
                    onValueChange={(value) => pickerValueChange(value)}
                    placeholder={{}}
                    items={[
                        { label: '所有紀錄', value: 'all' },
                        { label: '依月份', value: 'date' },
                        { label: '依類別', value: 'type' },
                    ]}
                />
            );
        }
        if (pickerValue == 'type') {
            <RNPickerSelect
                    onValueChange={(value) => pickerValueChange(value)}
                    placeholder={{}}
                    items={[
                        { label: '所有紀錄', value: 'all' },
                        { label: '依月份', value: 'date' },
                        { label: '依類別', value: 'type' },
                    ]}
                />
        }
    };
    */

    return (
        <View style={styles.container}>
            
            <View style={styles.RNPicker}>
                {/*renderRNPickerSelect()*/}
            </View>

            <SwipeListView
                useSectionList
                sections={list_render}
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
        backgroundColor: '#727272',
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    label_btnTextLeft: {
        color: '#202020',
    },
    label_btnTextRight: {
        color: '#FFF',
    },
    label_sectionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    rowFront: {
        alignItems: 'flex-start',
        backgroundColor: '#F7F8DF',
        justifyContent: 'center',
        height: 51,
        marginBottom: 5,
        paddingLeft: 15,
        borderRadius: 10,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        paddingLeft: 15,
        borderRadius: 10,
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
        color: '#202020',
        backgroundColor: '#DDD',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#ed7a5d',
        right: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    RNPicker: {
        color: '#202020',
        backgroundColor: '#DDD',
        borderRadius: 10,
        marginBottom: 20,
        paddingLeft: 20,
    }
});