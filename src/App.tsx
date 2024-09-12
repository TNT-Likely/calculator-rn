/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
// import {Button, Provider, Toast} from '@ant-design/react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from '@/screens/home';
import DetailsScreen from '@/screens/details';

const Stack = createNativeStackNavigator();

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Text>222</Text>
//           <Provider>
//             <Button onPress={() => Toast.info('This is a toast tips')}>
//               Start
//             </Button>
//           </Provider>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// function HomeScreen({navigation}) {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.push('Details')}
//       />
//     </View>
//   );
// }

// function DetailsScreen({navigation}) {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Text>Details Screen</Text>
//       <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
//       <Button title="Go back" onPress={() => navigation.goBack()} />
//     </View>
//   );
// }

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
