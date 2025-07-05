import React, { useState } from 'react';

const ROWS = 6, COLS = 6;
const PAIRS = (ROWS * COLS) / 2;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function canLink(grid, a, b) {
  // 只实现简单的直线和一次转弯连线
  if (!a || !b) return false;
  if (a.r === b.r) {
    let min = Math.min(a.c, b.c), max = Math.max(a.c, b.c);
    for (let c = min + 1; c < max; c++) if (grid[a.r][c] !== null) return false;
    return true;
  }
  if (a.c === b.c) {
    let min = Math.min(a.r, b.r), max = Math.max(a.r, b.r);
    for (let r = min + 1; r < max; r++) if (grid[r][a.c] !== null) return false;
    return true;
  }
  // 一次转弯
  if (grid[a.r][b.c] === null && canLink(grid, a, { r: a.r, c: b.c }) && canLink(grid, { r: a.r, c: b.c }, b)) return true;
  if (grid[b.r][a.c] === null && canLink(grid, a, { r: b.r, c: a.c }) && canLink(grid, { r: b.r, c: a.c }, b)) return true;
  return false;
}

export default function Game09() {
  const [grid, setGrid] = useState(() => {
    let arr = shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]);
    let g = [];
    for (let r = 0; r < ROWS; r++) g.push(arr.slice(r * COLS, (r + 1) * COLS));
    return g;
  });
  const [selected, setSelected] = useState([]);
  const [cleared, setCleared] = useState([]);
  const [win, setWin] = useState(false);

  const handleClick = (r, c) => {
    if (grid[r][c] === null) return;
    if (selected.length === 0) {
      setSelected([{ r, c }]);
    } else if (selected.length === 1) {
      const [a] = selected;
      if (a.r === r && a.c === c) return;
      if (grid[a.r][a.c] === grid[r][c] && canLink(grid, a, { r, c })) {
        const newGrid = grid.map(row => row.slice());
        newGrid[a.r][a.c] = null;
        newGrid[r][c] = null;
        setGrid(newGrid);
        setCleared([...cleared, `${a.r},${a.c}`, `${r},${c}`]);
        setSelected([]);
        if (newGrid.flat().every(x => x === null)) setWin(true);
      } else {
        setSelected([]);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{marginBottom:12}}>连连看</h3>
      {win && <div style={{ color: '#22c55e', fontWeight: 700, marginBottom: 12 }}>恭喜通关！</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 8, borderRadius: 12, justifyContent: 'center' }}>
        {grid.map((row, r) => row.map((n, c) => {
          const isSel = selected.some(s => s.r === r && s.c === c);
          return (
            <div key={r + '-' + c}
              onClick={() => handleClick(r, c)}
              style={{ width: 48, height: 48, background: n === null ? '#f3f4f6' : isSel ? '#fbbf24' : '#38bdf8', color: n === null ? '#bdbdbd' : '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: n !== null ? '0 1px 4px #0002' : 'none', cursor: n !== null ? 'pointer' : 'default', userSelect: 'none', transition: 'all .2s' }}>{n !== null ? n + 1 : ''}</div>
          );
        }))}
      </div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 12 }}>点击两个相同的方块，若可连线则消除，全部消除即通关！</div>
    </div>
  );
} 