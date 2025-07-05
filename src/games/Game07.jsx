import React, { useState, useEffect } from 'react';

const LEVEL = [
  [
    [1,1,1,1,1],
    [1,0,0,2,1],
    [1,0,3,0,1],
    [1,4,0,0,1],
    [1,1,1,1,1],
  ],
];
// 0:空地 1:墙 2:目标 3:箱子 4:人
const SIZE = 5;
function clone(map) { return map.map(row => row.slice()); }
function findPlayer(map) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (map[y][x] === 4) return [x, y];
}
function isWin(map) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (map[y][x] === 2) return false;
  return true;
}

export default function Game07() {
  const [map, setMap] = useState(() => clone(LEVEL[0]));
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const handleKey = e => {
      if (isWin(map)) return;
      const dirs = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] };
      if (!dirs[e.key]) return;
      const [dx, dy] = dirs[e.key];
      const [px, py] = findPlayer(map);
      const tx = px + dx, ty = py + dy;
      if (map[ty][tx] === 1) return;
      if (map[ty][tx] === 3 || map[ty][tx] === 2 && map[ty][tx] !== 4) {
        const bx = tx + dx, by = ty + dy;
        if (map[by][bx] === 1 || map[by][bx] === 3) return;
        const newMap = clone(map);
        if (map[by][bx] === 2) newMap[by][bx] = 0; else newMap[by][bx] = 3;
        newMap[ty][tx] = 4;
        newMap[py][px] = 0;
        if (map[ty][tx] === 2) newMap[ty][tx] = 4;
        else newMap[ty][tx] = 4;
        newMap[by][bx] = 3;
        setMap(newMap);
        setMoves(m => m + 1);
        return;
      }
      if (map[ty][tx] === 0 || map[ty][tx] === 2) {
        const newMap = clone(map);
        newMap[ty][tx] = 4;
        newMap[py][px] = 0;
        setMap(newMap);
        setMoves(m => m + 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [map]);

  const restart = () => {
    setMap(clone(LEVEL[0]));
    setMoves(0);
  };

  return (
    <div style={{ width: 260, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 2, background: '#bdbdbd', padding: 4, borderRadius: 8 }}>
        {map.flat().map((v, i) => {
          let color = '#f3f4f6', txt = '';
          if (v === 1) color = '#64748b', txt = '';
          if (v === 2) color = '#fbbf24', txt = '★';
          if (v === 3) color = '#38bdf8', txt = '□';
          if (v === 4) color = '#ef4444', txt = '人';
          return <div key={i} style={{ width: 40, height: 40, background: color, color: '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: '0 1px 2px #0001', userSelect: 'none' }}>{txt}</div>;
        })}
      </div>
      {isWin(map) && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>用方向键推动箱子到目标点，全部完成即通关！</div>
    </div>
  );
} 