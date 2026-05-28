import React from 'react';

export function DistractorMiniGraphs({ question, onEvidenceHover }) {
  const evidenceNodes = (question.graph.nodes ?? []).filter((node) => node.type === 'evidence');
  const distractors = question.options.filter((option) => option.id !== question.correctOptionId);

  return (
    <section className="side-panel mini-graphs-panel">
      <div className="panel-head">
        <div>
          <span>Distractor mini graphs</span>
          <h2>Why alternatives are excluded</h2>
        </div>
      </div>
      <div className="mini-graph-grid">
        {distractors.map((option, index) => (
          <article className="mini-graph-card" key={option.id}>
            <div className="mini-graph-head">
              <strong>{option.id}. {option.text}</strong>
              <span>Excluded</span>
            </div>
            <svg viewBox="0 0 320 190" aria-label={`Mini graph for option ${option.id}`}>
              <MiniNode x={36} y={26} width={118} label={evidenceNodes[index % evidenceNodes.length]?.label ?? 'Case clue'} type="evidence" />
              <MiniNode x={36} y={112} width={118} label={evidenceNodes[(index + 1) % evidenceNodes.length]?.label ?? 'Case clue'} type="evidence" />
              <MiniNode x={190} y={69} width={104} label={option.text} type="distractor" />
              <path d="M154 56 C172 56, 178 82, 190 92" />
              <path d="M154 142 C172 142, 178 116, 190 100" />
              <text x="172" y="72">against</text>
              <text x="172" y="132">against</text>
            </svg>
            <p>{question.explanation.distractors[option.id]}</p>
            <div className="mini-evidence-row">
              {evidenceNodes.slice(0, 3).map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => onEvidenceHover(node.id)}
                  onMouseLeave={() => onEvidenceHover(null)}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MiniNode({ x, y, width, label, type }) {
  const fill = type === 'distractor' ? '#f8eaea' : '#fff7d8';
  const stroke = type === 'distractor' ? '#8a2d2d' : '#c48a1d';

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height="48" rx="8" fill={fill} stroke={stroke} />
      <foreignObject x="8" y="8" width={width - 16} height="32">
        <div className="mini-node-label">{label}</div>
      </foreignObject>
    </g>
  );
}
