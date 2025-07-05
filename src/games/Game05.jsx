import React, { useState, useEffect } from 'react';

const PAIRS = 8;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game05() {
  const [cards, setCards] = useState(() => shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]));
  const [flipped, setFlipped] = useState([]); // 索引
  const [matched, setMatched] = useState([]); // 索引
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      setLock(true);
      setTimeout(() => {
        const [i, j] = flipped;
        if (cards[i] === cards[j]) {
          setMatched(m => [...m, i, j]);
        }
        setFlipped([]);
        setMoves(m => m + 1);
        setLock(false);
      }, 800);
    }
  }, [flipped, cards]);

  const handleClick = idx => {
    if (lock || flipped.includes(idx) || matched.includes(idx)) return;
    setFlipped(f => [...f, idx]);
  };

  const restart = () => {
    setCards(shuffle([...Array(PAIRS).keys(), ...Array(PAIRS).keys()]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  };

  return (
    <div style={{ width: 340, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>步数: {moves}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: '#bdbdbd', padding: 8, borderRadius: 8 }}>
        {cards.map((n, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          let label = show ? `数字${n+1}` : '未翻开';
          return (
            <div key={i} aria-label={label} title={label} onClick={() => handleClick(i)} style={{ width: 70, height: 70, background: show ? '#fbbf24' : '#f3f4f6', color: show ? '#fff' : '#bdbdbd', fontWeight: 700, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: show || lock ? 'not-allowed' : 'pointer', userSelect: 'none', transition: 'all .2s' }}>{show ? n + 1 : '?'}</div>
          );
        })}
      </div>
      {matched.length === cards.length && <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 12 }}>恭喜通关！</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击翻开两张牌，配对成功即可消除，全部配对通关！</div>
    </div>
  );
} 