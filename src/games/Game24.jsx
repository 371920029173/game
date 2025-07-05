import React, { useState } from 'react';

const SEQS = [
  { seq: [2, 4, 6, 8, 10, 0], ans: 12, tip: '等差数列' },
  { seq: [1, 1, 2, 3, 5, 0], ans: 8, tip: '斐波那契' },
  { seq: [3, 6, 12, 24, 0], ans: 48, tip: '等比数列' },
  { seq: [2, 4, 8, 16, 0], ans: 32, tip: '等比数列' },
  { seq: [1, 4, 9, 16, 0], ans: 25, tip: '平方数列' },
  { seq: [2, 3, 5, 7, 11, 0], ans: 13, tip: '质数列' },
  { seq: [1, 2, 4, 7, 11, 0], ans: 16, tip: '递推数列' },
];
function randomSeq() {
  return SEQS[Math.floor(Math.random() * SEQS.length)];
}

export default function Game24() {
  const [q, setQ] = useState(randomSeq());
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const [score, setScore] = useState(0);

  const check = () => {
    if (Number(input) === q.ans) {
      setMsg('恭喜答对！+1分');
      setScore(s => s + 1);
      setQ(randomSeq());
      setInput('');
    } else {
      setMsg('答错了，再试试！');
    }
  };
  const restart = () => {
    setQ(randomSeq());
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
      <div style={{ fontSize: 20, marginBottom: 12, color: '#64748b' }}>找规律填空：</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, letterSpacing: 4 }}>{q.seq.map((n, i) => n === 0 ? '___' : n).join(' , ')}</div>
      <input value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ''))} style={{ fontSize: 22, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', width: 100, textAlign: 'center', marginBottom: 12 }} placeholder="填空" />
      <button onClick={check} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginLeft: 12 }}>提交</button>
      <div style={{ color: msg.includes('恭喜') ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: 8 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>观察数列规律，填入正确数字得分！</div>
    </div>
  );
} 