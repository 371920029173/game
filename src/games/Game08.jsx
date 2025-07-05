import React, { useState, useEffect, useRef } from 'react';

const ROWS = 20, COLS = 10;
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];
const COLORS = ['#fbbf24', '#38bdf8', '#ef4444', '#22d3ee', '#a3e635', '#f472b6', '#f59e42'];

function randomShape() {
  const i = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[i], color: COLORS[i], idx: i };
}
function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}
function canMove(board, shape, x, y) {
  for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[0].length; c++) {
    if (shape[r][c]) {
      const nx = x + c, ny = y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx])) return false;
    }
  }
  return true;
}

export default function Game08() {
  const [board, setBoard] = useState(() => Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [cur, setCur] = useState(() => {
    const { shape, color, idx } = randomShape();
    return { shape, color, idx, x: 3, y: -2 };
  });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const moveRef = useRef(cur);

  useEffect(() => { moveRef.current = cur; }, [cur]);

  useEffect(() => {
    if (over) return;
    const timer = setInterval(() => {
      move(0, 1);
    }, 400);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    if (over) return;
    const handleKey = e => {
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') rotateCur();
      if (e.key === ' ') drop();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cur, board, over]);

  function move(dx, dy) {
    const { shape, color, idx, x, y } = moveRef.current;
    if (canMove(board, shape, x + dx, y + dy)) {
      setCur(cur => ({ ...cur, x: cur.x + dx, y: cur.y + dy }));
    } else if (dy === 1) {
      // 固定
      const newBoard = board.map(row => row.slice());
      for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c]) {
          const nx = x + c, ny = y + r;
          if (ny >= 0) newBoard[ny][nx] = idx + 1;
        }
      }
      // 消行
      let lines = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newBoard[r].every(v => v)) {
          newBoard.splice(r, 1);
          newBoard.unshift(Array(COLS).fill(0));
          lines++;
          r++;
        }
      }
      setScore(s => s + lines * 100);
      setBoard(newBoard);
      // 新方块
      const next = randomShape();
      if (!canMove(newBoard, next.shape, 3, -2)) setOver(true);
      setCur({ ...next, x: 3, y: -2 });
    }
  }
  function rotateCur() {
    const { shape, color, idx, x, y } = cur;
    const next = rotate(shape);
    if (canMove(board, next, x, y)) setCur(cur => ({ ...cur, shape: next }));
  }
  function drop() {
    let { x, y, shape } = cur;
    while (canMove(board, shape, x, y + 1)) y++;
    setCur(cur => ({ ...cur, y }));
    move(0, 1);
  }
  const restart = () => {
    setBoard(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
    const { shape, color, idx } = randomShape();
    setCur({ shape, color, idx, x: 3, y: -2 });
    setScore(0);
    setOver(false);
  };

  return (
    <div style={{ width: 260, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 1, background: '#bdbdbd', padding: 2, borderRadius: 8 }}>
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const x = i % COLS, y = Math.floor(i / COLS);
          let val = board[y][x];
          // 当前方块
          if (!over && cur) {
            const { shape, color, idx } = cur;
            for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[0].length; c++) {
              if (shape[r][c]) {
                const nx = cur.x + c, ny = cur.y + r;
                if (nx === x && ny === y) val = idx + 1;
              }
            }
          }
          return <div key={i} style={{ width: 12, height: 12, background: val ? COLORS[val - 1] : '#f3f4f6', borderRadius: 2, boxShadow: val ? '0 1px 2px #0001' : 'none' }} />;
        })}
      </div>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>方向键移动，↑旋转，空格下落，消除方块得分！</div>
    </div>
  );
} 