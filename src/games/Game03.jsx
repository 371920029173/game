import React, { useState } from 'react';

const SIZE = 9;
const MINES = 10;

function createBoard() {
  const board = Array(SIZE).fill(0).map(() => Array(SIZE).fill({ mine: false, open: false, flag: false, count: 0 }));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!board[r][c].mine) {
      board[r][c] = { ...board[r][c], mine: true };
      placed++;
    }
  }
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (board[r][c].mine) continue;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].mine) count++;
    }
    board[r][c] = { ...board[r][c], count };
  }
  return board;
}

function clone(board) {
  return board.map(row => row.map(cell => ({ ...cell })));
}

function openCell(board, r, c) {
  if (board[r][c].open || board[r][c].flag) return;
  board[r][c].open = true;
  if (board[r][c].count === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !board[nr][nc].open) openCell(board, nr, nc);
    }
  }
}

export default function Game03() {
  const [board, setBoard] = useState(() => createBoard());
  const [over, setOver] = useState(false);
  const [win, setWin] = useState(false);

  const handleCell = (r, c, e) => {
    if (over || win) return;
    e.preventDefault();
    const newBoard = clone(board);
    if (e.type === 'contextmenu') {
      newBoard[r][c].flag = !newBoard[r][c].flag;
    } else {
      if (newBoard[r][c].mine) {
        setOver(true);
        newBoard[r][c].open = true;
      } else {
        openCell(newBoard, r, c);
      }
    }
    setBoard(newBoard);
    // 检查胜利
    let opened = 0, total = SIZE * SIZE - MINES;
    for (let row of newBoard) for (let cell of row) if (cell.open && !cell.mine) opened++;
    if (opened === total) setWin(true);
  };

  const restart = () => {
    setBoard(createBoard());
    setOver(false);
    setWin(false);
  };

  return (
    <div style={{ width: 340, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>剩余地雷: {MINES - board.flat().filter(c => c.flag).length}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 2, background: '#bdbdbd', padding: 4, borderRadius: 8 }}>
        {board.map((row, r) => row.map((cell, c) => (
          <div
            key={r + '-' + c}
            onClick={e => handleCell(r, c, e)}
            onContextMenu={e => handleCell(r, c, e)}
            style={{ width: 32, height: 32, background: cell.open ? (cell.mine ? '#ef4444' : '#fff') : '#f3f4f6', color: cell.mine ? '#fff' : '#374151', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: '0 1px 2px #0001', cursor: over || win ? 'not-allowed' : 'pointer', userSelect: 'none', border: cell.flag ? '2px solid #fbbf24' : 'none' }}
          >
            {cell.open ? (cell.mine ? '💣' : (cell.count || '')) : (cell.flag ? '🚩' : '')}
          </div>
        )))}
      </div>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏失败！</div>}
      {win && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>左键开格，右键插旗，排除所有地雷！</div>
    </div>
  );
} 