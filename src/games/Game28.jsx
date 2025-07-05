import React, { useState } from 'react';

const SIZE = 3;
const IMG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80';
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

export default function Game28() {
  const [tiles, setTiles] = useState(getShuffled);
  const [moves, setMoves] = useState(0);
  const [animTiles, setAnimTiles] = useState(tiles);
  const [moving, setMoving] = useState(false);

  React.useEffect(() => { setAnimTiles(tiles); }, [tiles]);

  const moveTile = idx => {
    if (moving) return;
    const empty = tiles.indexOf(0);
    const canMove = [empty - 1, empty + 1, empty - SIZE, empty + SIZE].includes(idx) &&
      (Math.floor(idx / SIZE) === Math.floor(empty / SIZE) || idx % SIZE === empty % SIZE);
    if (!canMove) return;
    setMoving(true);
    const newTiles = tiles.slice();
    [newTiles[empty], newTiles[idx]] = [newTiles[idx], newTiles[empty]];
    setAnimTiles(newTiles);
    setTimeout(() => {
      setTiles(newTiles);
      setMoves(m => m + 1);
      setMoving(false);
    }, 220);
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
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 2, background: '#bdbdbd', padding: 2, borderRadius: 8, position: 'relative', height: 76 * SIZE + 2 * (SIZE - 1) }}>
        {animTiles.map((n, i) => {
          if (!n) return null;
          const pos = tiles.indexOf(n);
          const x = pos % SIZE, y = Math.floor(pos / SIZE);
          return (
            <div key={n}
              onClick={() => moveTile(pos)}
              style={{
                width: 76, height: 76, background: `url(${IMG})`, backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`, backgroundPosition: `${(n % SIZE) * 100 / (SIZE - 1)}% ${(Math.floor(n / SIZE)) * 100 / (SIZE - 1)}%`, color: 'transparent', fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, boxShadow: '0 1px 4px #0002', cursor: moving ? 'default' : 'pointer', userSelect: 'none', position: 'absolute', left: x * 78, top: y * 78, transition: 'left 0.2s, top 0.2s' }}
            >
              {n}
            </div>
          );
        })}
      </div>
      {isWin(tiles) && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击图片滑块，将拼图还原为原图！</div>
    </div>
  );
} 