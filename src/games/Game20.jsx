import React, { useState } from 'react';

const SIZE = 6;
function initBoard() {
  const board = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
  board[2][2] = board[3][3] = 1;
  board[2][3] = board[3][2] = 2;
  return board;
}
const DIRS = [
  [1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]
];
function validMove(board, x, y, player) {
  if (board[y][x]) return false;
  for (const [dx, dy] of DIRS) {
    let nx = x + dx, ny = y + dy, found = false;
    while (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && board[ny][nx] && board[ny][nx] !== player) {
      nx += dx; ny += dy; found = true;
    }
    if (found && nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && board[ny][nx] === player) return true;
  }
  return false;
}
function flip(board, x, y, player) {
  const newBoard = board.map(row => row.slice());
  newBoard[y][x] = player;
  for (const [dx, dy] of DIRS) {
    let nx = x + dx, ny = y + dy, toFlip = [];
    while (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && newBoard[ny][nx] && newBoard[ny][nx] !== player) {
      toFlip.push([nx, ny]); nx += dx; ny += dy;
    }
    if (toFlip.length && nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && newBoard[ny][nx] === player) {
      for (const [fx, fy] of toFlip) newBoard[fy][fx] = player;
    }
  }
  return newBoard;
}
function hasMove(board, player) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (validMove(board, x, y, player)) return true;
  return false;
}
function count(board, player) {
  return board.flat().filter(v => v === player).length;
}

export default function Game20() {
  const [board, setBoard] = useState(initBoard());
  const [player, setPlayer] = useState(1);
  const [msg, setMsg] = useState('黑棋先手');

  const handleClick = (x, y) => {
    if (!validMove(board, x, y, player)) return;
    const newBoard = flip(board, x, y, player);
    const next = player === 1 ? 2 : 1;
    if (hasMove(newBoard, next)) {
      setPlayer(next);
      setMsg(next === 1 ? '黑棋回合' : '白棋回合');
    } else if (hasMove(newBoard, player)) {
      setMsg('对方无子可下，继续你的回合');
    } else {
      // 结束
      const b = count(newBoard, 1), w = count(newBoard, 2);
      setMsg(b === w ? '平局！' : b > w ? '黑棋胜！' : '白棋胜！');
    }
    setBoard(newBoard);
  };
  const restart = () => {
    setBoard(initBoard());
    setPlayer(1);
    setMsg('黑棋先手');
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>黑: {count(board, 1)} 白: {count(board, 2)}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ marginBottom: 8, color: '#64748b', fontWeight: 700 }}>{msg}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 4, background: '#bdbdbd', padding: 4, borderRadius: 8 }}>
        {board.flat().map((v, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          return <div key={i} onClick={() => handleClick(x, y)} style={{ width: 40, height: 40, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 2px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: validMove(board, x, y, player) ? 'pointer' : 'not-allowed', border: '1px solid #e5e7eb', fontSize: 22, color: v === 1 ? '#111' : '#fbbf24' }}>{v === 1 ? '●' : v === 2 ? '○' : ''}</div>;
        })}
      </div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击空格下棋，翻转对方棋子，棋盘满后多者胜！</div>
    </div>
  );
} 