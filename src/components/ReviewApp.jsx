import React, { useState } from 'react';
import { QuestionPanel } from './QuestionPanel.jsx';
import { ExplanationPanel } from './ExplanationPanel.jsx';
import { KnowledgeGraph } from './KnowledgeGraph.jsx';
import { DistractorMiniGraphs } from './DistractorMiniGraphs.jsx';
import { QuestionBankModal } from './QuestionBankModal.jsx';
import { RegenerateModal } from './RegenerateModal.jsx';
import { RejectModal } from './RejectModal.jsx';

export function ReviewApp({
  questions,
  question,
  mode,
  bank,
  onModeChange,
  onQuestionChange,
  onSetup,
  onSaveQuestion,
  onResetQuestion,
  onAccept,
  onDeleteBankItem,
}) {
  const [activeEvidenceId, setActiveEvidenceId] = useState(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const showText = mode === 'text' || mode === 'both';
  const showGraph = mode === 'kg' || mode === 'both';
  const availableModes = getAvailableModes(question);
  const canRegenerate = Boolean(question.regenerable);
  const canEditGraph = question.taskLabel === 'Task 3';

  function updateGraphNodeLabel(nodeId, label) {
    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        nodes: question.graph.nodes.map((node) => (node.id === nodeId ? { ...node, label } : node)),
      },
    });
  }

  function deleteGraphNode(nodeId) {
    const node = question.graph.nodes.find((item) => item.id === nodeId);
    const nextGraph = {
      ...question.graph,
      nodes: question.graph.nodes.filter((item) => item.id !== nodeId),
      edges: question.graph.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
    };
    const nextVignette = node?.phrase
      ? question.vignette.replace(new RegExp(escapeRegExp(node.phrase), 'i'), '').replace(/\s{2,}/g, ' ').trim()
      : question.vignette;

    onSaveQuestion({
      ...question,
      vignette: nextVignette,
      graph: nextGraph,
      clueCandidates: (question.clueCandidates ?? []).filter((clue) => clue.id !== nodeId),
    });
  }

  return (
    <main className="review-app">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={onSetup}>
          Med<span>MCQ</span>
        </button>
        <nav className="question-tabs" aria-label="Question tabs">
          {questions.map((item) => (
            <button
              key={item.id}
              className={item.id === question.id ? 'active' : ''}
              type="button"
              onClick={() => onQuestionChange(item.id)}
            >
              {item.taskLabel}
              <small>{item.title}</small>
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <select value={mode} onChange={(event) => onModeChange(event.target.value)} aria-label="Review mode">
            {availableModes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setBankOpen(true)}>
            Question bank <span>{bank.length}</span>
          </button>
          <button type="button" onClick={onSetup}>Setup</button>
        </div>
      </header>

      <div className={`review-layout ${showText && showGraph ? 'three-column' : ''}`}>
        <QuestionPanel
          question={question}
          activeEvidenceId={activeEvidenceId}
          onEvidenceHover={setActiveEvidenceId}
          onSave={onSaveQuestion}
          onAccept={() => onAccept(question)}
          onReject={() => setRejectOpen(true)}
          onRegenerate={canRegenerate ? () => setRegenerateOpen(true) : null}
          onReset={() => onResetQuestion(question.id)}
        />

        {showGraph ? (
          <div className="kg-stack">
            <KnowledgeGraph
              graph={question.graph}
              activeEvidenceId={activeEvidenceId}
              editable={canEditGraph}
              onEvidenceHover={setActiveEvidenceId}
              onNodeLabelChange={updateGraphNodeLabel}
              onNodeDelete={deleteGraphNode}
            />
            <DistractorMiniGraphs question={question} onEvidenceHover={setActiveEvidenceId} />
          </div>
        ) : null}

        {showText ? <ExplanationPanel question={question} /> : null}
      </div>

      <QuestionBankModal
        open={bankOpen}
        bank={bank}
        onClose={() => setBankOpen(false)}
        onDelete={onDeleteBankItem}
      />
      <RejectModal open={rejectOpen} onClose={() => setRejectOpen(false)} />
      <RegenerateModal
        open={regenerateOpen}
        question={question}
        onClose={() => setRegenerateOpen(false)}
        onApply={(nextQuestion) => {
          onSaveQuestion(nextQuestion);
          setRegenerateOpen(false);
        }}
      />
    </main>
  );
}

function getAvailableModes(question) {
  if (question.taskLabel === 'Task 1') {
    return [{ value: 'text', label: 'Text only' }];
  }
  if (question.taskLabel === 'Task 2') {
    return [
      { value: 'kg', label: 'KG' },
      { value: 'both', label: 'KG + enriched text' },
    ];
  }
  return [
    { value: 'text', label: 'Text' },
    { value: 'both', label: 'KG / KG + enriched text' },
  ];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
