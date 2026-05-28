import React, { useMemo, useState } from 'react';
import questionsData from './data/questions.json';
import { SetupPage } from './components/SetupPage.jsx';
import { ReviewApp } from './components/ReviewApp.jsx';
import { useLocalStorage } from './lib/useLocalStorage.js';
import './styles.css';

function cloneQuestion(question) {
  return structuredClone(question);
}

function defaultModeForQuestion(question) {
  if (question.taskLabel === 'Task 1') return 'text';
  if (question.taskLabel === 'Task 2') return 'kg';
  return 'both';
}

export default function App() {
  const [questions, setQuestions] = useState(() => questionsData.map(cloneQuestion));
  const [setupOpen, setSetupOpen] = useState(true);
  const [currentQuestionId, setCurrentQuestionId] = useState(questionsData[0].id);
  const [reviewMode, setReviewMode] = useState(defaultModeForQuestion(questionsData[0]));
  const [bank, setBank] = useLocalStorage('medmcq_question_bank', []);

  const currentQuestion = useMemo(
    () => questions.find((question) => question.id === currentQuestionId) ?? questions[0],
    [currentQuestionId, questions],
  );

  function selectQuestion(nextQuestionId) {
    const nextQuestion = questions.find((question) => question.id === nextQuestionId) ?? questions[0];
    setCurrentQuestionId(nextQuestionId);
    setReviewMode(defaultModeForQuestion(nextQuestion));
  }

  function startReview(nextQuestionId) {
    selectQuestion(nextQuestionId);
    setSetupOpen(false);
  }

  function updateQuestion(nextQuestion) {
    setQuestions((current) =>
      current.map((question) => (question.id === nextQuestion.id ? nextQuestion : question)),
    );
  }

  function resetQuestion(questionId) {
    const original = questionsData.find((question) => question.id === questionId);
    if (original) updateQuestion(cloneQuestion(original));
  }

  function saveToBank(question) {
    setBank((current) => [
      {
        id: `${question.id}-${Date.now()}`,
        savedAt: new Date().toISOString(),
        questionId: question.id,
        title: question.title,
        stem: question.stem,
        vignette: question.vignette,
        options: question.options,
        correctOptionId: question.correctOptionId,
        source: question.source,
      },
      ...current,
    ]);
  }

  if (setupOpen) {
    return (
      <SetupPage
        questions={questions}
        onStart={startReview}
        selectedQuestionId={currentQuestionId}
      />
    );
  }

  return (
    <ReviewApp
      questions={questions}
      question={currentQuestion}
      mode={reviewMode}
      bank={bank}
      onModeChange={setReviewMode}
      onQuestionChange={selectQuestion}
      onSetup={() => setSetupOpen(true)}
      onSaveQuestion={updateQuestion}
      onResetQuestion={resetQuestion}
      onAccept={saveToBank}
      onDeleteBankItem={(itemId) => setBank((current) => current.filter((item) => item.id !== itemId))}
    />
  );
}
