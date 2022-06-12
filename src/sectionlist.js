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

                let listWholeSection_temp = [
                    {
                        "title": listData[0],
                        "data": [] // waiting to put 'listData_temp' inside
                    }
                ];
                let listData_temp = [
                    {
                        "key": "0.0",
                        "text": listData[1] + `/ ` + listData[2] + ' NTD.'
                    }
                ];

                let [i, j] = [0, 0];
                for (let count = 3; count <= (listData.length); count = count + 3) {

                    console.log('----count: ', count);
                    console.log('----i: ', i);
                    console.log('----j: ', j);

                    if (listData[count] == listData[count - 3]) {
                        // add !
                        j++;
                        listData_temp.push(
                            {
                                "key": i + '.' + j,
                                "text": listData[count + 1] + `/ ` + listData[count + 2] + ' NTD.'
                            }
                        );
                    }
                    else if (count == (listData.length - 1)) {
                        listWholeSection_temp[i].data = listData_temp;
                    }
                    else {
                        listWholeSection_temp[i].data = listData_temp;

                        i++;
                        listWholeSection_temp.push(
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
                                "text": listData[count + 1] + `/ ` + listData[count + 2] + ' NTD.'
                            }
                        ];
                    }
                };

                console.log('--listWholeSection_temp: ', listWholeSection_temp);
                setListData(listWholeSection_temp);
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
        newData[section].data.splice(prevIndex, 1);
        setListData(newData);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
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
        backgroundColor: '#BABABA',
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
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});