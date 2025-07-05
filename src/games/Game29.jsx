import React, { useState } from 'react';

const TIMES = 5;

export default function Game29() {
  const [waiting, setWaiting] = useState(false);
  const [start, setStart] = useState(false);
  const [msg, setMsg] = useState('点击开始测试反应力');
  const [time, setTime] = useState(0);
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(null);

  const begin = () => {
    setMsg('请等待变绿...');
    setWaiting(true);
    setStart(false);
    setTime(0);
    setTimer(setTimeout(() => {
      setMsg('快点点击！');
      setStart(true);
      setWaiting(false);
      setTime(Date.now());
    }, 1000 + Math.random() * 2000));
  };
  const click = () => {
    if (waiting) {
      setMsg('太快了！重新开始');
      clearTimeout(timer);
      setWaiting(false);
      setStart(false);
      setTime(0);
    } else if (start) {
      const t = Date.now() - time;
      setResults(r => {
        const next = [...r, t];
        if (next.length === TIMES) {
          setMsg(`平均反应时间：${Math.round(next.reduce((a, b) => a + b, 0) / TIMES)}ms`);
        } else {
          setMsg(`第${next.length}次：${t}ms，继续...`);
          setTimeout(begin, 1200);
        }
        return next;
      });
      setStart(false);
      setTime(0);
    }
  };
  const restart = () => {
    setMsg('点击开始测试反应力');
    setWaiting(false);
    setStart(false);
    setTime(0);
    setResults([]);
    clearTimeout(timer);
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>次数: {results.length}/{TIMES}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重置</button>
      </div>
      <div onClick={waiting || start ? click : begin} style={{ height: 180, background: start ? '#22c55e' : waiting ? '#fbbf24' : '#38bdf8', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, cursor: 'pointer', marginBottom: 12, userSelect: 'none', transition: 'all .2s' }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14 }}>连续{TIMES}次测试，取平均反应速度！</div>
    </div>
  );
} 