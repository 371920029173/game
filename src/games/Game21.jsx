import React, { useState } from 'react';

const SIZE = 6;
const COLORS = ['#fbbf24', '#38bdf8', '#ef4444', '#22d3ee', '#a3e635'];
function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
function genBoard() {
  let arr = [];
  for (let i = 0; i < SIZE * SIZE / 2; i++) {
    const c = randomColor();
    arr.push(c, c);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game21() {
  const [board, setBoard] = useState(genBoard());
  const [selected, setSelected] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [score, setScore] = useState(0);

  const handleClick = idx => {
    if (cleared.includes(idx)) return;
    if (selected === null) setSelected(idx);
    else if (selected === idx) setSelected(null);
    else if (board[selected] === board[idx]) {
      setCleared(c => [...c, selected, idx]);
      setScore(s => s + 10);
      setSelected(null);
    } else setSelected(idx);
  };
  const restart = () => {
    setBoard(genBoard());
    setSelected(null);
    setCleared([]);
    setScore(0);
  };
  return (
    <div style={{ width: 320, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8 }}>
        {board.map((c, i) => (
          <div key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, background: cleared.includes(i) ? '#f3f4f6' : c, border: selected === i ? '3px solid #ef4444' : 'none', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: cleared.includes(i) ? 'not-allowed' : 'pointer', userSelect: 'none', transition: 'all .2s' }} />
        ))}
      </div>
      {cleared.length === board.length && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击两个相同颜色的点进行连接并消除，全部消除即通关！</div>
    </div>
  );
} 