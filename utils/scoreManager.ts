import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScoreStructure {
  name: string;
  score: number;
}

export const addScore = async (newScore: ScoreStructure): Promise<void> => {
  try {
    const existingScoresJson = await AsyncStorage.getItem('scores');
    const existingScores: ScoreStructure[] = existingScoresJson ? JSON.parse(existingScoresJson) : [];
    existingScores.push(newScore);
    await AsyncStorage.setItem('scores', JSON.stringify(existingScores));
  } catch (e) {
    console.error("Failed to add score", e);
  }
}

export const getScores = async (): Promise<ScoreStructure[]> => {
  try {
    const scoresJson = await AsyncStorage.getItem('scores');
    const scores: ScoreStructure[] = scoresJson ? JSON.parse(scoresJson) : [];
    return scores;
  } catch (e) {
    console.error("Failed to get scores", e);
    return [];
  }
}
