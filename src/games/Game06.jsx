import React, { useState, useEffect } from 'react';

const SIZE = 3;
function getShuffled() {
  let arr = Array.from({ length: SIZE * SIZE }, (_, i) => i);
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr));
  return arr;
}
function isSolvable(arr) {
  let inv = 0;
  for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
  return inv % 2 === 0;
}
function isWin(arr) {
  return arr.every((v, i) => v === (i + 1) % (SIZE * SIZE));
}

export default function Game06() {
  const [tiles, setTiles] = useState(getShuffled);
  const [moves, setMoves] = useState(0);

  const moveTile = idx => {
    const empty = tiles.indexOf(0);
    const canMove = [empty - 1, empty + 1, empty - SIZE, empty + SIZE].includes(idx) &&
      (Math.floor(idx / SIZE) === Math.floor(empty / SIZE) || idx % SIZE === empty % SIZE);
    if (!canMove) return;
    const newTiles = tiles.slice();
    [newTiles[empty], newTiles[idx]] = [newTiles[idx], newTiles[empty]];
    setTiles(newTiles);
    setMoves(m => m + 1);
  };

  const restart = () => {
    setTiles(getShuffled());
    setMoves(0);
  };

  return (
    <div style={{ width: 240, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8 }}>
        {tiles.map((n, i) => (
          <div key={i} onClick={() => moveTile(i)} style={{ width: 60, height: 60, background: n ? '#fbbf24' : '#f3f4f6', color: n ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: n ? 'pointer' : 'default', userSelect: 'none', transition: 'all .2s' }}>{n || ''}</div>
        ))}
      </div>
      {isWin(tiles) && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击数字滑块，将拼图还原为1~8顺序！</div>
    </div>
  );
} 