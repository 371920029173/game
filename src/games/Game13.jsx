import React, { useState, useEffect, useRef } from 'react';

const SIZE = 3;
const TOTAL = 20;

export default function Game13() {
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(TOTAL);
  const [playing, setPlaying] = useState(false);
  const timer = useRef();

  useEffect(() => {
    if (!playing) return;
    if (left === 0) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => {
      setPos(Math.floor(Math.random() * SIZE * SIZE));
      setLeft(l => l - 1);
    }, 700);
    return () => clearTimeout(timer.current);
  }, [playing, left]);

  const hit = idx => {
    if (!playing || idx !== pos) return;
    setScore(s => s + 1);
    setPos(-1);
  };
  const start = () => {
    setScore(0);
    setLeft(TOTAL);
    setPlaying(true);
    setPos(Math.floor(Math.random() * SIZE * SIZE));
  };
  const restart = () => {
    setScore(0);
    setLeft(TOTAL);
    setPlaying(false);
    setPos(0);
    clearTimeout(timer.current);
  };
  return (
    <div style={{ width: 220, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重置</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: 6, background: '#bdbdbd', padding: 6, borderRadius: 8, marginBottom: 12 }}>
        {Array.from({ length: SIZE * SIZE }, (_, i) => (
          <div key={i} onClick={() => hit(i)} style={{ width: 50, height: 50, background: i === pos && playing ? '#fbbf24' : '#f3f4f6', color: '#ef4444', fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: playing ? 'pointer' : 'not-allowed', userSelect: 'none', transition: 'all .2s' }}>{i === pos && playing ? '鼹' : ''}</div>
        ))}
      </div>
      <div style={{ marginBottom: 8 }}>剩余: {left}</div>
      {!playing ? <button onClick={start} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>开始</button> : null}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击出现的鼹鼠，20次后统计得分！</div>
    </div>
  );
} 