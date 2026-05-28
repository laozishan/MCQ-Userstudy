import React, { useState } from 'react';
import { phrasesFromGraph } from '../lib/graph.js';
import { highlightText } from '../lib/text.js';

export function QuestionPanel({
  question,
  activeEvidenceId,
  onEvidenceHover,
  onSave,
  onAccept,
  onReject,
  onRegenerate,
  onReset,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(question);
  const phrases = phrasesFromGraph(question.graph);
  const segments = highlightText(question.vignette, phrases, activeEvidenceId ? [activeEvidenceId] : []);

  function startEditing() {
    setDraft(structuredClone(question));
    setEditing(true);
  }

  function saveDraft() {
    onSave(draft);
    setEditing(false);
  }

  return (
    <section className="question-panel">
      <div className="card">
        <div className="card-label">Clinical vignette</div>
        <div className="source-chip">{question.source}</div>
        <p className="vignette">
          {segments.map((segment, index) =>
            segment.type === 'highlight' ? (
              <mark
                key={`${segment.id}-${index}`}
                className={segment.active ? 'active' : ''}
                onMouseEnter={() => onEvidenceHover(segment.id)}
                onMouseLeave={() => onEvidenceHover(null)}
              >
                {segment.text}
              </mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </p>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-label">Question</div>
            <h1>{question.stem}</h1>
          </div>
          <span className={`difficulty ${question.difficulty}`}>{question.difficulty}</span>
        </div>

        <div className="options">
          {question.options.map((option) => (
            <div
              key={option.id}
              className={option.id === question.correctOptionId ? 'option correct' : 'option'}
            >
              <span className="option-letter">{option.id}</span>
              <span>{option.text}</span>
              {option.id === question.correctOptionId ? <strong>Correct</strong> : null}
            </div>
          ))}
        </div>

        <div className="action-row">
          <button className="accept" type="button" onClick={onAccept}>Accept</button>
          <button className="reject" type="button" onClick={onReject}>Reject</button>
          <button type="button" onClick={startEditing}>Edit</button>
          {onRegenerate ? <button type="button" onClick={onRegenerate}>Regenerate</button> : null}
          <button type="button" onClick={onReset}>Reset</button>
        </div>
      </div>

      {editing ? (
        <div className="card editor-card">
          <div className="card-label">Edit JSON-backed question fields</div>
          <label className="field">
            <span>Stem</span>
            <textarea
              value={draft.stem}
              onChange={(event) => setDraft({ ...draft, stem: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Vignette</span>
            <textarea
              value={draft.vignette}
              onChange={(event) => setDraft({ ...draft, vignette: event.target.value })}
            />
          </label>
          <div className="option-editor-grid">
            {draft.options.map((option, index) => (
              <label className="field" key={option.id}>
                <span>Option {option.id}</span>
                <input
                  value={option.text}
                  onChange={(event) => {
                    const options = [...draft.options];
                    options[index] = { ...option, text: event.target.value };
                    setDraft({ ...draft, options });
                  }}
                />
              </label>
            ))}
          </div>
          <label className="field">
            <span>Correct option</span>
            <select
              value={draft.correctOptionId}
              onChange={(event) => setDraft({ ...draft, correctOptionId: event.target.value })}
            >
              {draft.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.id}
                </option>
              ))}
            </select>
          </label>
          <div className="action-row">
            <button className="accept" type="button" onClick={saveDraft}>Save revision</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
