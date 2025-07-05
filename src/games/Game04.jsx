import React, { useState } from 'react';

const SIZE = 15;
function checkWin(board, x, y, player) {
  const dirs = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];
  for (let [dx, dy] of dirs) {
    let cnt = 1;
    for (let d = 1; d < 5; d++) {
      let nx = x + dx * d, ny = y + dy * d;
      if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE || board[ny][nx] !== player) break;
      cnt++;
    }
    for (let d = 1; d < 5; d++) {
      let nx = x - dx * d, ny = y - dy * d;
      if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE || board[ny][nx] !== player) break;
      cnt++;
    }
    if (cnt >= 5) return true;
  }
  return false;
}

function aiMove(board) {
  // 简单AI：随机落子
  let empty = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (!board[y][x]) empty.push([x, y]);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function Game04() {
  const [board, setBoard] = useState(Array(SIZE).fill(0).map(() => Array(SIZE).fill(0)));
  const [turn, setTurn] = useState(1); // 1:玩家 2:AI
  const [over, setOver] = useState(false);
  const [winner, setWinner] = useState(0);

  const handleClick = (x, y) => {
    if (over || board[y][x]) return;
    const newBoard = board.map(row => row.slice());
    newBoard[y][x] = 1;
    if (checkWin(newBoard, x, y, 1)) {
      setBoard(newBoard);
      setOver(true);
      setWinner(1);
      return;
    }
    // AI
    const [ax, ay] = aiMove(newBoard) || [];
    if (ax !== undefined) {
      newBoard[ay][ax] = 2;
      if (checkWin(newBoard, ax, ay, 2)) {
        setBoard(newBoard);
        setOver(true);
        setWinner(2);
        return;
      }
    }
    setBoard(newBoard);
  };

  const restart = () => {
    setBoard(Array(SIZE).fill(0).map(() => Array(SIZE).fill(0)));
    setTurn(1);
    setOver(false);
    setWinner(0);
  };

  return (
    <div style={{ width: 420, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>玩家 vs AI</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 2, background: '#bdbdbd', padding: 4, borderRadius: 8 }}>
        {board.map((row, y) => row.map((cell, x) => {
          let label = cell === 1 ? '玩家棋子' : cell === 2 ? 'AI棋子' : '空格';
          return <div key={x + '-' + y} aria-label={label} title={label} onClick={() => handleClick(x, y)} style={{ width: 24, height: 24, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 2px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: over || cell ? 'not-allowed' : 'pointer', border: '1px solid #e5e7eb', fontSize: 18, color: cell === 1 ? '#111' : '#fbbf24' }}>{cell === 1 ? '●' : cell === 2 ? '○' : ''}</div>;
        }))}
      </div>
      {over && <div style={{ color: winner === 1 ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: 12 }}>{winner === 1 ? '你赢了！' : 'AI赢了！'}</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击空格下棋，五子连珠获胜！</div>
    </div>
  );
} 