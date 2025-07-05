import React, { useState } from 'react';

const DIFFS = [
  { x: 40, y: 40 },
  { x: 120, y: 60 },
  { x: 80, y: 120 },
  { x: 160, y: 100 },
  { x: 60, y: 160 },
];
const SIZE = 200;

export default function Game09() {
  const [found, setFound] = useState([]);
  const [moves, setMoves] = useState(0);

  const handleClick = e => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hit = -1;
    for (let i = 0; i < DIFFS.length; i++) {
      const d = DIFFS[i];
      if (!found.includes(i) && Math.hypot(d.x - x, d.y - y) < 18) hit = i;
    }
    setMoves(m => m + 1);
    if (hit !== -1) setFound(f => [...f, hit]);
  };

  const restart = () => {
    setFound([]);
    setMoves(0);
  };

  return (
    <div style={{ width: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>已找出: {found.length}/{DIFFS.length} 次</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
        {[0, 1].map(idx => (
          <svg key={idx} width={SIZE} height={SIZE} style={{ borderRadius: 12, boxShadow: '0 1px 4px #0002', background: '#fff', cursor: 'pointer' }} onClick={idx === 1 ? handleClick : undefined}>
            <rect x={20} y={20} width={160} height={160} fill="#fbbf24" />
            <circle cx={60} cy={60} r={20} fill="#38bdf8" />
            <rect x={100} y={40} width={40} height={40} fill="#ef4444" />
            <ellipse cx={140} cy={140} rx={18} ry={10} fill="#22d3ee" />
            <polygon points="80,120 100,100 120,120 100,140" fill="#a3e635" />
            {/* 差异点 */}
            {idx === 1 && DIFFS.map((d, i) => !found.includes(i) ? null : <circle key={i} cx={d.x} cy={d.y} r={18} fill="none" stroke="#22c55e" strokeWidth={4} />)}
            {idx === 0 && DIFFS.map((d, i) => i < 3 ? null : <circle key={i} cx={d.x} cy={d.y} r={18} fill="#fff" />)}
          </svg>
        ))}
      </div>
      {found.length === DIFFS.length && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜全部找出！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击右侧图片不同处，全部找出即通关！</div>
    </div>
  );
} 