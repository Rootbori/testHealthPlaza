import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; 
import QuestionScreen from './screens/QuestionScreen'; 
import LeaderboardScreen from './screens/LeaderboardScreen'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreStructure} from './utils/scoreManager';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    initializeMockData();
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="LeaderBoard" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


export const initializeMockData = async (): Promise<void> => {
  try {
    const scoresJson = await AsyncStorage.getItem('scores');
    if (scoresJson === null) {
      const mockScores: ScoreStructure[] = [
        { name: "Alice", score: 90 },
        { name: "Bob", score: 80 },
        { name: "Charlie", score: 85 },
        { name: "Diana", score: 95 }
      ];
      await AsyncStorage.setItem('scores', JSON.stringify(mockScores));
    }
  } catch (e) {
    console.error("Failed to initialize mock data", e);
  }
};
