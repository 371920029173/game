import React, { useState, useEffect } from 'react';

const SIZE = 4;
const getEmptyBoard = () => Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
const getRandomInt = (max) => Math.floor(Math.random() * max);

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
  8192: '#f43f5e'
};

function addRandom(board) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!board[r][c]) empty.push([r, c]);
  if (empty.length === 0) return board;
  const [r, c] = empty[getRandomInt(empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function move(board, dir) {
  let moved = false;
  let score = 0;
  let newBoard = board.map(row => row.slice());
  const merge = (row) => {
    let arr = row.filter(x => x);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(x => x);
    while (arr.length < SIZE) arr.push(0);
    return arr;
  };
  for (let i = 0; i < SIZE; i++) {
    let row = [];
    if (dir === 'left') row = newBoard[i];
    if (dir === 'right') row = [...newBoard[i]].reverse();
    if (dir === 'up') row = newBoard.map(r => r[i]);
    if (dir === 'down') row = newBoard.map(r => r[i]).reverse();
    let merged = merge(row);
    if (dir === 'right' || dir === 'down') merged = merged.reverse();
    for (let j = 0; j < SIZE; j++) {
      let val = merged[j];
      if (dir === 'left' || dir === 'right') {
        if (newBoard[i][j] !== val) moved = true;
        newBoard[i][j] = val;
      } else {
        if (newBoard[j][i] !== val) moved = true;
        newBoard[j][i] = val;
      }
    }
  }
  return { board: newBoard, moved, score };
}

export default function Game01() {
  const [board, setBoard] = useState(() => addRandom(addRandom(getEmptyBoard())));
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (over) return;
      let dir = null;
      if (e.key === 'ArrowLeft') dir = 'left';
      if (e.key === 'ArrowRight') dir = 'right';
      if (e.key === 'ArrowUp') dir = 'up';
      if (e.key === 'ArrowDown') dir = 'down';
      if (!dir) return;
      const { board: newBoard, moved, score: addScore } = move(board, dir);
      if (moved) {
        setBoard(addRandom(newBoard));
        setScore(s => s + addScore);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, over]);

  useEffect(() => {
    // 检查是否还能移动
    let canMove = false;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) canMove = true;
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) canMove = true;
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) canMove = true;
    }
    if (!canMove) setOver(true);
  }, [board]);

  const restart = () => {
    setBoard(addRandom(addRandom(getEmptyBoard())));
    setScore(0);
    setOver(false);
  };

  // 屏幕操作面板
  const moveDir = (dir) => {
    if (over) return;
    const { board: newBoard, moved, score: addScore } = move(board, dir);
    if (moved) {
      setBoard(addRandom(newBoard));
      setScore(s => s + addScore);
    }
  };
  const controls = [
    { label: '↑', onClick: () => moveDir('up') },
    { label: '↓', onClick: () => moveDir('down') },
    { label: '←', onClick: () => moveDir('left') },
    { label: '→', onClick: () => moveDir('right') },
    { label: '重开', onClick: restart },
  ];

  return (
    <div style={{ width: 320, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8 }}>
        {board.flat().map((n, i) => (
          <div key={i} aria-label={n ? `数字${n}` : '空格'} title={n ? `数字${n}` : '空格'} style={{ height: 60, background: n ? (COLOR_MAP[n] || '#fbbf24') : '#f3f4f6', color: n ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: n ? '0 1px 4px #0002' : 'none', transition: 'all .2s' }}>{n || ''}</div>
        ))}
      </div>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>用方向键或下方按钮移动方块，合成2048！</div>
      {/* 屏幕操作面板 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
        {controls.map((c, i) => (
          <button key={i} onClick={c.onClick} style={{ minWidth: 48, minHeight: 48, fontSize: 20, borderRadius: 12, background: '#f3f4f6', border: '2px solid #2563eb', color: '#2563eb', fontWeight: 700, boxShadow: '0 1px 4px #0001', cursor: 'pointer', margin: 4 }}>{c.label}</button>
        ))}
      </div>
    </div>
  );
} 