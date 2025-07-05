import React, { useState } from 'react';

const SIZE = 6;
const COLORS = ['#fbbf24', '#38bdf8', '#ef4444', '#22d3ee', '#a3e635'];
function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
function genBoard() {
  return Array.from({ length: SIZE * SIZE }, () => randomColor());
}
function getIdx(x, y) { return y * SIZE + x; }
function swap(arr, i, j) { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
function canSwap(i, j) {
  const dx = Math.abs(i % SIZE - j % SIZE);
  const dy = Math.abs(Math.floor(i / SIZE) - Math.floor(j / SIZE));
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}
function findMatches(board) {
  let matched = new Set();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE - 2; x++) {
    const c = board[getIdx(x, y)];
    if (c && c === board[getIdx(x + 1, y)] && c === board[getIdx(x + 2, y)]) {
      matched.add(getIdx(x, y)); matched.add(getIdx(x + 1, y)); matched.add(getIdx(x + 2, y));
    }
  }
  for (let x = 0; x < SIZE; x++) for (let y = 0; y < SIZE - 2; y++) {
    const c = board[getIdx(x, y)];
    if (c && c === board[getIdx(x, y + 1)] && c === board[getIdx(x, y + 2)]) {
      matched.add(getIdx(x, y)); matched.add(getIdx(x, y + 1)); matched.add(getIdx(x, y + 2));
    }
  }
  return matched;
}
function drop(board) {
  for (let x = 0; x < SIZE; x++) {
    let col = [];
    for (let y = 0; y < SIZE; y++) {
      const idx = getIdx(x, y);
      if (board[idx]) col.push(board[idx]);
    }
    while (col.length < SIZE) col.unshift(randomColor());
    for (let y = 0; y < SIZE; y++) board[getIdx(x, y)] = col[y];
  }
}

export default function Game15() {
  const [board, setBoard] = useState(genBoard());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const handleClick = idx => {
    if (selected === null) setSelected(idx);
    else if (selected === idx) setSelected(null);
    else if (canSwap(selected, idx)) {
      const newBoard = board.slice();
      swap(newBoard, selected, idx);
      let matched = findMatches(newBoard);
      if (matched.size === 0) {
        setSelected(null);
        return;
      }
      let total = 0;
      while (matched.size) {
        matched.forEach(i => newBoard[i] = null);
        setScore(s => s + matched.size * 10);
        drop(newBoard);
        matched = findMatches(newBoard);
        total++;
      }
      setBoard(newBoard);
      setSelected(null);
    } else setSelected(idx);
  };
  const restart = () => {
    setBoard(genBoard());
    setSelected(null);
    setScore(0);
  };
  return (
    <div style={{ width: 320, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 4, background: '#bdbdbd', padding: 4, borderRadius: 8 }}>
        {board.map((c, i) => (
          <div key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, background: c, border: selected === i ? '3px solid #ef4444' : 'none', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: 'pointer', userSelect: 'none', transition: 'all .2s' }} />
        ))}
      </div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击两个相邻方块交换，消除3个及以上同色方块得分！</div>
    </div>
  );
} 