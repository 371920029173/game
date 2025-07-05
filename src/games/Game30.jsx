import React, { useState } from 'react';

const SIZE = 5;
function genBoard() {
  return Array.from({ length: SIZE * SIZE }, () => Math.random() < 0.7 ? 2 : 4);
}
function getIdx(x, y) { return y * SIZE + x; }
function getXY(idx) { return [idx % SIZE, Math.floor(idx / SIZE)]; }
function canMerge(a, b) { return a && b && a === b; }

export default function Game30() {
  const [board, setBoard] = useState(genBoard());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleClick = idx => {
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const [x1, y1] = getXY(selected);
      const [x2, y2] = getXY(idx);
      if (Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1 && canMerge(board[selected], board[idx])) {
        const newBoard = board.slice();
        newBoard[idx] *= 2;
        newBoard[selected] = 0;
        setScore(s => s + newBoard[idx]);
        // 下落补空
        for (let x = 0; x < SIZE; x++) {
          let col = [];
          for (let y = 0; y < SIZE; y++) {
            const i = getIdx(x, y);
            if (newBoard[i]) col.push(newBoard[i]);
          }
          while (col.length < SIZE) col.unshift(Math.random() < 0.7 ? 2 : 4);
          for (let y = 0; y < SIZE; y++) newBoard[getIdx(x, y)] = col[y];
        }
        setBoard(newBoard);
        setSelected(null);
      } else {
        setSelected(idx);
      }
    }
  };
  const restart = () => {
    setBoard(genBoard());
    setScore(0);
    setSelected(null);
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8, marginBottom: 12 }}>
        {board.map((n, i) => (
          <div key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, background: n ? '#fbbf24' : '#f3f4f6', color: n ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: n ? 'pointer' : 'default', userSelect: 'none', border: selected === i ? '2px solid #ef4444' : 'none', transition: 'all .2s' }}>{n || ''}</div>
        ))}
      </div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击两个相邻相同数字合成，挑战更高分数！</div>
    </div>
  );
} 