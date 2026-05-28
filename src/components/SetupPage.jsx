import React, { useMemo, useState } from 'react';

export function SetupPage({ questions, selectedQuestionId, onStart }) {
  const [domain, setDomain] = useState(questions[0]?.domain ?? '');
  const [topic, setTopic] = useState(questions[0]?.topic ?? '');
  const [difficulty, setDifficulty] = useState(questions[0]?.difficulty ?? 'easy');
  const [questionId, setQuestionId] = useState(selectedQuestionId);

  const domains = [...new Set(questions.map((question) => question.domain))];
  const topics = [...new Set(questions.filter((q) => q.domain === domain).map((q) => q.topic))];
  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.domain === domain &&
          question.topic === topic &&
          question.difficulty === difficulty,
      ),
    [difficulty, domain, questions, topic],
  );

  const selectedQuestion = filteredQuestions.find((question) => question.id === questionId) ?? filteredQuestions[0];

  function handleStart() {
    onStart(selectedQuestion.id);
  }

  return (
    <main className="setup-page">
      <section className="setup-shell">
        <div className="brand-lockup">
          <div className="brand">Med<span>MCQ</span></div>
          <p>User study prototype · Question setup</p>
        </div>

        <div className="setup-grid">
          <div className="setup-panel">
            <h1>Question setup</h1>
            <p className="muted">Configure the medical education question parameters.</p>

            <label className="field">
              <span>Domain</span>
              <select value={domain} onChange={(event) => setDomain(event.target.value)}>
                {domains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Topic</span>
              <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="field">
              <span>Difficulty</span>
              <div className="segmented">
                {['easy', 'medium', 'hard'].map((item) => (
                  <button
                    key={item}
                    className={difficulty === item ? 'active' : ''}
                    type="button"
                    onClick={() => setDifficulty(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="field">
              <span>Question</span>
              <select value={selectedQuestion?.id ?? ''} onChange={(event) => setQuestionId(event.target.value)}>
                {filteredQuestions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.taskLabel} - {question.title}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-action" type="button" onClick={handleStart} disabled={!selectedQuestion}>
              Start review
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
