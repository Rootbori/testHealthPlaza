import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUESTIONS_LIST } from '../api/List';

// const questionsData = require('../data/questions.json');

interface AnswerStructure {
  text: string;
  correct: boolean;
}

export interface QuestionStructure {
  question: string;
  answers: AnswerStructure[];
  id: string;
}

interface QuestionProps {
  question: QuestionStructure;
  onSelectAnswer: (answerIndex: number, questionIndex: number) => void;
  questionIndex: number;
  selectedAnswerIndex: number | null;
}

type SelectedAnswersState = Array<number | null>;

const Question = React.memo(({ question, onSelectAnswer, questionIndex, selectedAnswerIndex }: QuestionProps) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.question}</Text>
      {question.answers.map((answer, answerIndex) => (
        <TouchableOpacity  key={answer.text}
          style={[ styles.answerButton,
            selectedAnswerIndex === answerIndex ? styles.selectedAnswer : null,
          ]}
          onPress={() => onSelectAnswer(answerIndex, questionIndex)} >
          <Text>{answer.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});


const QuestionScreen: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionStructure[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswersState>(new Array(0).fill(null));
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await QUESTIONS_LIST()
        const shuffledQuestions = response.lists.map((question: QuestionStructure) => ({
          ...question,
          answers: [...question.answers].sort(() => Math.random() - 0.5),
        })).sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions.slice(0, 20));
      } catch (err) {
        console.log('error', err);
      }
    };

    fetchData();
  }, []);

  const handleAnswer = useCallback((answerIndex: number, questionIndex: number) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });

    const correct = questions[questionIndex].answers[answerIndex].correct;
    if (correct) {
      setScore((prevScore) => prevScore + 5);
    }
  }, [questions]);

  const saveScore = useCallback(async () => {
    const name = `User_${Math.floor(Math.random() * 1000)}`;
    const newScore = { name, score };

    try {
      const existingScoresJson = await AsyncStorage.getItem('scores');
      const existingScores = existingScoresJson ? JSON.parse(existingScoresJson) : [];
      existingScores.push(newScore);
      await AsyncStorage.setItem('scores', JSON.stringify(existingScores));
      alert(`Score saved for ${name}: ${score} points`);
    } catch (e) {
      console.error("Failed to save score", e);
    } finally {
      setSelectedAnswers(new Array(0).fill(null))
      setScore(0)
    }
  }, [score]);

  return (
    <SafeAreaView style={styles.container}>
      {questions?.length == 0 && <Text>ไม่พบข้อมูล กรุณา run backend จาก test ข้อ backend</Text>}


      <FlatList
        data={questions}
        extraData={selectedAnswers}
        renderItem={({ item, index: questionIndex }) => (
          <Question
            question={item}
            onSelectAnswer={handleAnswer}
            questionIndex={questionIndex}
            selectedAnswerIndex={selectedAnswers[questionIndex]}
          />
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.fullWidthButtonContainer}>
            <TouchableOpacity onPress={saveScore} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Score</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  questionContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  questionText: {
    marginBottom: 10,
  },
  answerButton: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#ddd',
  },
  selectedAnswer: {
    backgroundColor: '#cfe3ff',
  },
  fullWidthButtonContainer: {
    width: '100%', 
    paddingHorizontal: 10,
    paddingVertical: 10, 
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center', 
    borderRadius: 5, 
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16, 
  },

});

export default QuestionScreen;
