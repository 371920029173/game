import React, { useState } from 'react';

const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];
const SOLUTION = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

export default function Game17() {
  const [board, setBoard] = useState(PUZZLE.map(row => row.slice()));
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');

  const handleClick = (r, c) => {
    if (PUZZLE[r][c] !== 0) return;
    setSelected([r, c]);
  };
  const handleInput = n => {
    if (!selected) return;
    const [r, c] = selected;
    if (PUZZLE[r][c] !== 0) return;
    const newBoard = board.map(row => row.slice());
    newBoard[r][c] = n;
    setBoard(newBoard);
    setSelected(null);
    // 检查是否完成
    if (JSON.stringify(newBoard) === JSON.stringify(SOLUTION)) setMsg('恭喜通关！');
    else setMsg('');
  };
  const restart = () => {
    setBoard(PUZZLE.map(row => row.slice()));
    setSelected(null);
    setMsg('');
  };
  return (
    <div style={{ width: 340, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>数独</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 2, background: '#bdbdbd', padding: 4, borderRadius: 8, marginBottom: 12 }}>
        {board.flat().map((n, i) => {
          const r = Math.floor(i / 9), c = i % 9;
          const isSel = selected && selected[0] === r && selected[1] === c;
          return <div key={i} onClick={() => handleClick(r, c)} style={{ width: 30, height: 30, background: PUZZLE[r][c] ? '#fbbf24' : isSel ? '#22d3ee' : '#fff', color: PUZZLE[r][c] ? '#fff' : '#374151', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: '0 1px 2px #0001', cursor: PUZZLE[r][c] ? 'not-allowed' : 'pointer', userSelect: 'none', border: (r % 3 === 2 && r !== 8 ? '2px solid #e5e7eb' : 'none') + (c % 3 === 2 && c !== 8 ? ' 2px solid #e5e7eb' : '') }}>{n || ''}</div>;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => handleInput(n)} style={{ width: 32, height: 32, fontSize: 18, fontWeight: 700, background: '#38bdf8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{n}</button>)}
      </div>
      <div style={{ color: '#22c55e', fontWeight: 700, minHeight: 24 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击空格输入数字，完成数独挑战！</div>
    </div>
  );
} 