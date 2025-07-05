import React, { useState, useRef } from 'react';

const WORDS = [
  'react', 'puzzle', 'logic', 'memory', 'speed', 'apple', 'mouse', 'brain', 'smart', 'python',
  'github', 'coding', 'number', 'color', 'block', 'snake', 'maze', 'score', 'timer', 'game'
];
function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function Game23() {
  const [word, setWord] = useState(randomWord());
  const [input, setInput] = useState('');
  const [start, setStart] = useState(null);
  const [msg, setMsg] = useState('');
  const [best, setBest] = useState(() => Number(localStorage.getItem('game23_best')) || 0);
  const inputRef = useRef();

  const handleChange = e => {
    if (!start) setStart(Date.now());
    setInput(e.target.value);
    if (e.target.value === word) {
      const t = Date.now() - start;
      setMsg(`用时：${t}ms`);
      if (!best || t < best) {
        setBest(t);
        localStorage.setItem('game23_best', t);
      }
      setTimeout(() => {
        setWord(randomWord());
        setInput('');
        setStart(null);
        setMsg('');
        inputRef.current.focus();
      }, 1200);
    }
  };
  const restart = () => {
    setWord(randomWord());
    setInput('');
    setStart(null);
    setMsg('');
    inputRef.current.focus();
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>最佳: {best ? best + 'ms' : '无'}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#fbbf24', letterSpacing: 4 }}>{word}</div>
      <input ref={inputRef} value={input} onChange={handleChange} style={{ fontSize: 22, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', width: 180, textAlign: 'center', marginBottom: 12 }} placeholder="输入单词" autoFocus />
      <div style={{ color: '#22c55e', fontWeight: 700, minHeight: 24 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>尽快输入上方单词，测试你的打字速度！</div>
    </div>
  );
} 