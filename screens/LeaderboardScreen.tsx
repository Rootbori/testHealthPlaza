import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {getScores, ScoreStructure} from '../utils/scoreManager';

const LeaderboardScreen: React.FC = () => {
  const [scores, setScores] = useState<ScoreStructure[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const fetchedScores = await getScores();
      fetchedScores.sort((a, b) => b.score - a.score);
      setScores(fetchedScores);
    };
    fetch();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={scores}
        renderItem={({item, index}) => (
          <View style={styles.scoreRow}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  rank: {
    marginRight: 10,
    fontSize: 18,
  },
  name: {
    flex: 1,
    fontSize: 18,
  },
  score: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default LeaderboardScreen;
