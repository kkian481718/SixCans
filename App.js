import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ height: '10%', backgroundColor: 'powderblue' }} />
      <View style={{ height: '10%', backgroundColor: 'skyblue' }} />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
