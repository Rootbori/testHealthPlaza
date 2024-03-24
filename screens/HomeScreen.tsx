import React from 'react';
import { View, Button } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button  title="Go to Question Screen"
        onPress={() => navigation.navigate('Question')}/>

        <Button  title="Go to Leader Board Screen"
          onPress={() => navigation.navigate('LeaderBoard')}/>
    </View>
  );
};

export default HomeScreen;
