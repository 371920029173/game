import React, { useState } from 'react';

const SIZE = 5;
function genBoard() {
  return Array.from({ length: SIZE * SIZE }, () => Math.random() > 0.5 ? 1 : 0);
}
function getIdx(x, y) { return y * SIZE + x; }
function toggle(board, x, y) {
  const idxs = [[x, y], [x-1, y], [x+1, y], [x, y-1], [x, y+1]];
  const newBoard = board.slice();
  for (const [nx, ny] of idxs) {
    if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
      const idx = getIdx(nx, ny);
      newBoard[idx] = newBoard[idx] ? 0 : 1;
    }
  }
  return newBoard;
}
function isWin(board) {
  return board.every(v => v === 0);
}

export default function Game19() {
  const [board, setBoard] = useState(genBoard());
  const [moves, setMoves] = useState(0);

  const handleClick = idx => {
    const x = idx % SIZE, y = Math.floor(idx / SIZE);
    setBoard(b => toggle(b, x, y));
    setMoves(m => m + 1);
  };
  const restart = () => {
    setBoard(genBoard());
    setMoves(0);
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8 }}>
        {board.map((v, i) => (
          <div key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, background: v ? '#fbbf24' : '#f3f4f6', color: v ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: 'pointer', userSelect: 'none', transition: 'all .2s' }}>{v ? '💡' : ''}</div>
        ))}
      </div>
      {isWin(board) && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击灯泡切换周围开关，全部熄灭即通关！</div>
    </div>
  );
} 