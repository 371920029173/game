import React, { useState } from 'react';

const WORDS = [
  'REACT', 'VITE', 'JAVASCRIPT', 'PYTHON', 'PUZZLE', 'BRAIN', 'LOGIC', 'SMART', 'APPLE', 'MOUSE'
];
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game16() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [letters, setLetters] = useState(() => shuffle(word.split('')));
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const [score, setScore] = useState(0);

  const handleClick = idx => {
    setInput(input + letters[idx]);
    setLetters(letters.filter((_, i) => i !== idx));
  };
  const check = () => {
    if (input === word) {
      setMsg('恭喜拼对！+1分');
      setScore(s => s + 1);
      const next = WORDS[Math.floor(Math.random() * WORDS.length)];
      setWord(next);
      setLetters(shuffle(next.split('')));
      setInput('');
    } else {
      setMsg('拼错了，再试试！');
    }
  };
  const restart = () => {
    const next = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(next);
    setLetters(shuffle(next.split('')));
    setInput('');
    setMsg('');
    setScore(0);
  };
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ marginBottom: 12, fontSize: 18, color: '#64748b' }}>拼出正确单词：</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {letters.map((l, i) => (
          <button key={i} onClick={() => handleClick(i)} style={{ width: 40, height: 40, fontSize: 22, fontWeight: 700, background: '#fbbf24', color: '#fff', border: 'none', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: 'pointer' }}>{l}</button>
        ))}
      </div>
      <div style={{ minHeight: 40, fontSize: 22, letterSpacing: 4, marginBottom: 12 }}>{input}</div>
      <button onClick={check} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginBottom: 8 }}>提交</button>
      <div style={{ color: msg.includes('恭喜') ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: 8 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>点击字母拼出正确单词，提交得分！</div>
    </div>
  );
} 