import React, { useState, useRef } from 'react';

const SIZE = 5;
const N = SIZE * SIZE;
const MAX_ROUNDS = 100;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game27() {
  const [nums, setNums] = useState(() => shuffle(Array.from({ length: N }, (_, i) => i + 1)));
  const [next, setNext] = useState(1);
  const [msg, setMsg] = useState('');
  const [start, setStart] = useState(null);
  const [best, setBest] = useState(() => Number(localStorage.getItem('game27_best')) || 0);
  const [round, setRound] = useState(1);
  const [animIdx, setAnimIdx] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef();

  const beginRound = () => {
    setNums(shuffle(Array.from({ length: N }, (_, i) => i + 1)));
    setNext(1);
    setMsg('');
    setStart(null);
    setAnimIdx(null);
    setCountdown(3);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  React.useEffect(() => {
    beginRound();
    return () => { clearInterval(timerRef.current); };
  }, []);

  const handleClick = idx => {
    if (countdown > 0) return;
    if (nums[idx] === next) {
      setAnimIdx(idx);
      setTimeout(() => setAnimIdx(null), 300);
      if (next === 1) setStart(Date.now());
      if (next === N) {
        const t = Date.now() - start;
        setMsg(`完成！用时${t}ms`);
        if (!best || t < best) {
          setBest(t);
          localStorage.setItem('game27_best', t);
        }
        if (round < MAX_ROUNDS) {
          setTimeout(() => {
            setRound(r => r + 1);
            beginRound();
          }, 1200);
        }
      } else {
        setNext(n => n + 1);
      }
    }
  };
  const restart = () => {
    setRound(1);
    beginRound();
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>数字顺序挑战 | 第{round}/{MAX_ROUNDS}局 | 最佳: {best ? best + 'ms' : '无'}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      {countdown > 0 && <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 8, fontSize: 20 }}>倒计时：{countdown}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8, marginBottom: 12 }}>
        {nums.map((n, i) => (
          <div key={i} onClick={() => handleClick(i)}
            className={animIdx === i ? 'num-anim-right' : ''}
            style={{ width: 40, height: 40, background: n < next ? '#a3e635' : '#fbbf24', color: '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: countdown > 0 ? 'not-allowed' : (n === next ? 'pointer' : 'not-allowed'), userSelect: 'none', transition: 'all .2s' }}>{n < next ? '' : n}</div>
        ))}
      </div>
      <div style={{ color: '#22c55e', fontWeight: 700, minHeight: 24 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>按顺序点击1到{N}，用时越短越好！共100局挑战！</div>
    </div>
  );
} 