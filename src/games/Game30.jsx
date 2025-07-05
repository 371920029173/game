import React, { useState } from 'react';

const SIZE = 5;
function genBoard() {
  return Array.from({ length: SIZE * SIZE }, () => Math.random() < 0.7 ? 2 : 4);
}
function getIdx(x, y) { return y * SIZE + x; }
function getXY(idx) { return [idx % SIZE, Math.floor(idx / SIZE)]; }
function canMerge(a, b) { return a && b && a === b; }

// 颜色映射
const COLOR_MAP = {
  2: '#fbbf24',
  4: '#f87171',
  8: '#34d399',
  16: '#60a5fa',
  32: '#a78bfa',
  64: '#f472b6',
  128: '#facc15',
  256: '#fb7185',
  512: '#38bdf8',
  1024: '#a3e635',
  2048: '#f59e42',
  4096: '#e879f9',
  8192: '#f43f5e',
};

export default function Game30() {
  const [board, setBoard] = useState(genBoard());
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  // 屏幕操作面板
  const moveSel = dir => {
    if (selected === null) {
      setSelected(0);
      return;
    }
    const [x, y] = getXY(selected);
    let nx = x, ny = y;
    if (dir === 'up') ny = Math.max(0, y - 1);
    if (dir === 'down') ny = Math.min(SIZE - 1, y + 1);
    if (dir === 'left') nx = Math.max(0, x - 1);
    if (dir === 'right') nx = Math.min(SIZE - 1, x + 1);
    setSelected(getIdx(nx, ny));
  };
  const mergeSel = () => {
    if (selected === null) return;
    const [x, y] = getXY(selected);
    // 尝试与四周合成
    const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) continue;
      const ni = getIdx(nx, ny);
      if (canMerge(board[selected], board[ni])) {
        const newBoard = board.slice();
        newBoard[ni] *= 2;
        newBoard[selected] = 0;
        setScore(s => s + newBoard[ni]);
        // 下落补空
        for (let cx = 0; cx < SIZE; cx++) {
          let col = [];
          for (let cy = 0; cy < SIZE; cy++) {
            const i = getIdx(cx, cy);
            if (newBoard[i]) col.push(newBoard[i]);
          }
          while (col.length < SIZE) col.unshift(Math.random() < 0.7 ? 2 : 4);
          for (let cy = 0; cy < SIZE; cy++) newBoard[getIdx(cx, cy)] = col[cy];
        }
        setBoard(newBoard);
        setSelected(null);
        return;
      }
    }
  };
  const restart = () => {
    setBoard(genBoard());
    setScore(0);
    setSelected(null);
  };
  const controls = [
    { label: '↑', onClick: () => moveSel('up') },
    { label: '↓', onClick: () => moveSel('down') },
    { label: '←', onClick: () => moveSel('left') },
    { label: '→', onClick: () => moveSel('right') },
    { label: '合成', onClick: mergeSel },
    { label: '重开', onClick: restart },
  ];

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

  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8, marginBottom: 12 }}>
        {board.map((n, i) => (
          <div key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, background: n ? (COLOR_MAP[n] || '#fbbf24') : '#f3f4f6', color: n && n <= 4 ? '#fff' : '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: n ? 'pointer' : 'default', userSelect: 'none', border: selected === i ? '2px solid #ef4444' : 'none', transition: 'all .2s' }}>{n || ''}</div>
        ))}
      </div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击两个相邻相同数字合成，挑战更高分数！</div>
      {/* 屏幕操作面板 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
        {controls.map((c, i) => (
          <button key={i} onClick={c.onClick} style={{ minWidth: 48, minHeight: 48, fontSize: 20, borderRadius: 12, background: '#f3f4f6', border: '2px solid #2563eb', color: '#2563eb', fontWeight: 700, boxShadow: '0 1px 4px #0001', cursor: 'pointer', margin: 4 }}>{c.label}</button>
        ))}
      </div>
    </div>
  );
} 