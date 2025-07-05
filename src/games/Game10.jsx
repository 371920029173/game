import React, { useState, useEffect } from 'react';

const MAZE = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,0,1,0,1,0,1],
  [1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];
const SIZE = 10;
const START = { x: 1, y: 1 };
const END = { x: 8, y: 8 };

export default function Game10() {
  const [pos, setPos] = useState(START);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const handleKey = e => {
      if (win) return;
      const dirs = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };
      if (!dirs[e.key]) return;
      const [dx, dy] = dirs[e.key];
      const nx = pos.x + dx, ny = pos.y + dy;
      if (MAZE[ny][nx] === 1) return;
      setPos({ x: nx, y: ny });
      setMoves(m => m + 1);
      if (nx === END.x && ny === END.y) setWin(true);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pos, win]);

  const restart = () => {
    setPos(START);
    setMoves(0);
    setWin(false);
  };

  return (
    <div style={{ width: 340, margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{marginBottom:12}}>迷宫</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 2, background: '#bdbdbd', padding: 4, borderRadius: 8, justifyContent: 'center' }}>
        {MAZE.flat().map((v, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          let color = v === 1 ? '#64748b' : '#fff';
          if (x === pos.x && y === pos.y) color = '#ef4444';
          if (x === END.x && y === END.y) color = '#22c55e';
          return <div key={i} style={{ width: 28, height: 28, background: color, color: '#fff', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: '0 1px 2px #0001', userSelect: 'none' }}>{x === pos.x && y === pos.y ? '人' : x === END.x && y === END.y ? '终' : ''}</div>;
        })}
      </div>
      {win && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>用方向键走出迷宫，绿色为终点！</div>
    </div>
  );
} 