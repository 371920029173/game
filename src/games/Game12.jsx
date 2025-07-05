import React, { useState } from 'react';

const SIZE = 8;
const COLORS = ['#fbbf24', '#38bdf8', '#ef4444', '#22d3ee', '#a3e635'];
function randomBoard() {
  let board = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0).map(() => Math.floor(Math.random() * COLORS.length)));
  return board;
}
function clone(board) {
  return board.map(row => row.slice());
}
function findMatches(board) {
  let matched = Array(SIZE).fill(0).map(() => Array(SIZE).fill(false));
  // 横向
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE - 2; c++) {
    let v = board[r][c];
    if (v !== null && v === board[r][c+1] && v === board[r][c+2]) {
      matched[r][c] = matched[r][c+1] = matched[r][c+2] = true;
    }
  }
  // 纵向
  for (let c = 0; c < SIZE; c++) for (let r = 0; r < SIZE - 2; r++) {
    let v = board[r][c];
    if (v !== null && v === board[r+1][c] && v === board[r+2][c]) {
      matched[r][c] = matched[r+1][c] = matched[r+2][c] = true;
    }
  }
  return matched;
}
function drop(board) {
  for (let c = 0; c < SIZE; c++) {
    let col = [];
    for (let r = SIZE - 1; r >= 0; r--) if (board[r][c] !== null) col.push(board[r][c]);
    for (let r = SIZE - 1; r >= 0; r--) board[r][c] = col[SIZE - 1 - r] !== undefined ? col[SIZE - 1 - r] : Math.floor(Math.random() * COLORS.length);
  }
}

export default function Game12() {
  const [board, setBoard] = useState(() => randomBoard());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [anim, setAnim] = useState(false);

  const handleClick = (r, c) => {
    if (anim) return;
    if (!selected) {
      setSelected({ r, c });
    } else {
      const { r: r0, c: c0 } = selected;
      if ((Math.abs(r - r0) === 1 && c === c0) || (Math.abs(c - c0) === 1 && r === r0)) {
        const newBoard = clone(board);
        [newBoard[r][c], newBoard[r0][c0]] = [newBoard[r0][c0], newBoard[r][c]];
        let matched = findMatches(newBoard);
        if (matched.flat().some(Boolean)) {
          setAnim(true);
          setTimeout(() => {
            let total = 0;
            let tempBoard = clone(newBoard);
            while (true) {
              let matched = findMatches(tempBoard);
              let has = false;
              for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (matched[r][c]) {
                tempBoard[r][c] = null;
                has = true;
                total++;
              }
              if (!has) break;
              drop(tempBoard);
            }
            setBoard(tempBoard);
            setScore(s => s + total);
            setAnim(false);
          }, 300);
        } else {
          setSelected(null);
        }
      } else {
        setSelected({ r, c });
      }
    }
  };

  const restart = () => {
    setBoard(randomBoard());
    setSelected(null);
    setScore(0);
  };

  return (
    <div style={{ width: 400, margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{marginBottom:12}}>消消乐</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 4, background: '#bdbdbd', padding: 8, borderRadius: 8, justifyContent: 'center' }}>
        {board.map((row, r) => row.map((v, c) => {
          const isSel = selected && selected.r === r && selected.c === c;
          return (
            <div key={r + '-' + c}
              onClick={() => handleClick(r, c)}
              style={{ width: 36, height: 36, background: v === null ? '#f3f4f6' : COLORS[v], border: isSel ? '2px solid #ef4444' : 'none', borderRadius: 8, boxShadow: v !== null ? '0 1px 4px #0002' : 'none', cursor: v !== null ? 'pointer' : 'default', userSelect: 'none', transition: 'all .2s' }}></div>
          );
        }))}
      </div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 12 }}>点击相邻方块交换，形成3个及以上同色即可消除，得分无上限！</div>
    </div>
  );
} 