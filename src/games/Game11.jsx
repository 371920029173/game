import React, { useState } from 'react';

const SIZE = 4;
const PAIRS = SIZE * SIZE / 2;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game11() {
  const [cards, setCards] = useState(() => shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]));
  const [flipped, setFlipped] = useState([]); // 索引
  const [matched, setMatched] = useState([]); // 索引
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const handleClick = idx => {
    if (lock || flipped.includes(idx) || matched.includes(idx)) return;
    setFlipped(f => {
      if (f.length === 1) {
        setLock(true);
        setTimeout(() => {
          if (cards[f[0]] === cards[idx]) {
            setMatched(m => [...m, f[0], idx]);
          }
          setFlipped([]);
          setMoves(m => m + 1);
          setLock(false);
        }, 800);
        return [f[0], idx];
      }
      return [idx];
    });
  };

  const restart = () => {
    setCards(shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  };

  return (
    <div style={{ width: 340, margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{marginBottom:12}}>记忆翻牌</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 8, background: '#bdbdbd', padding: 8, borderRadius: 8 }}>
        {cards.map((n, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          return (
            <div key={i} onClick={() => handleClick(i)} style={{ width: 70, height: 70, background: show ? '#fbbf24' : '#f3f4f6', color: show ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: show || lock ? 'not-allowed' : 'pointer', userSelect: 'none', transition: 'all .2s' }}>{show ? n + 1 : '?'}</div>
          );
        })}
      </div>
      {matched.length === cards.length && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击翻开两张牌，配对成功即可消除，全部配对通关！</div>
    </div>
  );
} 