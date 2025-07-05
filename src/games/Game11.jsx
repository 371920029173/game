import React, { useState } from 'react';

const SIZE = 6;
const PAIRS = SIZE * SIZE / 2;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game11() {
  const [tiles, setTiles] = useState(() => shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]));
  const [selected, setSelected] = useState([]);
  const [cleared, setCleared] = useState([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const handleClick = idx => {
    if (lock || selected.includes(idx) || cleared.includes(idx)) return;
    if (selected.length === 0) {
      setSelected([idx]);
    } else if (selected.length === 1) {
      setSelected([selected[0], idx]);
      setLock(true);
      setTimeout(() => {
        if (tiles[selected[0]] === tiles[idx]) {
          setCleared(c => [...c, selected[0], idx]);
        }
        setSelected([]);
        setMoves(m => m + 1);
        setLock(false);
      }, 500);
    }
  };

  const restart = () => {
    setTiles(shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]));
    setSelected([]);
    setCleared([]);
    setMoves(0);
    setLock(false);
  };

  return (
    <div style={{ width: 320, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8 }}>
        {tiles.map((n, i) => {
          const show = selected.includes(i) || cleared.includes(i);
          return (
            <div key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, background: show ? '#fbbf24' : '#f3f4f6', color: show ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: show || lock ? 'not-allowed' : 'pointer', userSelect: 'none', transition: 'all .2s' }}>{show ? n + 1 : ''}</div>
          );
        })}
      </div>
      {cleared.length === tiles.length && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击两块相同的牌消除，全部消除即通关！</div>
    </div>
  );
} 