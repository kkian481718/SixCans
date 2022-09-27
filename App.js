import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './src/HomeScreen'
import NewRecordScreen from './src/NewRecordScreen'
import RecordScreen from './src/RecordScreen'
import DetailScreen from './src/DetailScreen'
import BarChartScreen from './src/BarChartScreen'


// [Pages Navigator]
// let REFRESH_HOME = '';
const Stack = createNativeStackNavigator();
const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={() => ({ headerShown: false, animation: 'slide_from_right' })}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={() => ({ headerShown: false, animation: 'slide_from_right' })}
        />
        <Stack.Screen
          name="BarChart"
          component={BarChartScreen}
          options={() => ({ headerShown: false, animation: 'slide_from_right' })}
        />
        <Stack.Screen
          name="NewRecord"
          component={NewRecordScreen}
          options={() => ({ headerShown: false })}
        />
        <Stack.Screen
          name="Record"
          component={RecordScreen}
          options={() => ({ headerShown: false })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;