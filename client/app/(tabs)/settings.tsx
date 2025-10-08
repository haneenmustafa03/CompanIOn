import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundImage: require('../../assets/images/background.png'),
    backgroundColor: '#25292e',
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#25292e',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // text: {
  //   color: '#fff',
  // },
});