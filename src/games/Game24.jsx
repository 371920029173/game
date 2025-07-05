import React, { useState } from 'react';

// 自动生成500道多样化找规律题
function genSeqs() {
  const seqs = [];
  // 等差
  for (let i = 1; i <= 100; i++) {
    const d = Math.floor(Math.random() * 8) + 2;
    const start = Math.floor(Math.random() * 20) + 1;
    const arr = Array.from({length:5}, (_,k)=>start+k*d);
    seqs.push({ seq: [...arr, 0], ans: arr[4]+d, tip: '等差数列' });
  }
  // 等比
  for (let i = 1; i <= 80; i++) {
    const r = Math.floor(Math.random() * 4) + 2;
    const start = Math.floor(Math.random() * 5) + 1;
    const arr = Array.from({length:4}, (_,k)=>start*Math.pow(r,k));
    seqs.push({ seq: [...arr, 0], ans: arr[3]*r, tip: '等比数列' });
  }
  // 斐波那契
  for (let i = 1; i <= 60; i++) {
    let a = Math.floor(Math.random()*5)+1, b = Math.floor(Math.random()*5)+1;
    const arr = [a,b];
    for(let k=2;k<6;k++) arr.push(arr[k-1]+arr[k-2]);
    seqs.push({ seq: [...arr.slice(0,5), 0], ans: arr[5], tip: '斐波那契' });
  }
  // 平方
  for (let i = 1; i <= 60; i++) {
    const start = Math.floor(Math.random()*10)+1;
    const arr = Array.from({length:5}, (_,k)=>(start+k)**2);
    seqs.push({ seq: [...arr, 0], ans: (start+5)**2, tip: '平方数列' });
  }
  // 质数
  function nthPrime(n) {
    let cnt=0, x=2;
    while(true){
      let isP=true;
      for(let d=2;d*d<=x;d++) if(x%d===0){isP=false;break;}
      if(isP){cnt++;if(cnt===n)return x;}
      x++;
    }
  }
  for (let i = 1; i <= 60; i++) {
    const start = Math.floor(Math.random()*10)+1;
    const arr = Array.from({length:5}, (_,k)=>nthPrime(start+k));
    seqs.push({ seq: [...arr, 0], ans: nthPrime(start+5), tip: '质数列' });
  }
  // 递推
  for (let i = 1; i <= 60; i++) {
    let a = Math.floor(Math.random()*10)+1, d = Math.floor(Math.random()*5)+1;
    const arr = [a];
    for(let k=1;k<6;k++) arr.push(arr[k-1]+d*k);
    seqs.push({ seq: [...arr.slice(0,5), 0], ans: arr[5], tip: '递推数列' });
  }
  // 其它类型
  for (let i = 1; i <= 80; i++) {
    const arr = [1,2,4,8,0];
    seqs.push({ seq: arr, ans: 16, tip: '倍增数列' });
  }
  return seqs.slice(0,500);
}
const SEQS = genSeqs();
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
        <span>数字找规律 | 得分: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ fontSize: 20, marginBottom: 12, color: '#64748b' }}>找规律填空（{q.tip}）：</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, letterSpacing: 4 }}>{q.seq.map((n, i) => n === 0 ? '___' : n).join(' , ')}</div>
      <input value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ''))} style={{ fontSize: 22, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', width: 100, textAlign: 'center', marginBottom: 12 }} placeholder="填空" />
      <button onClick={check} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginLeft: 12 }}>提交</button>
      <div style={{ color: msg.includes('恭喜') ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: 8 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>观察数列规律，填入正确数字得分！</div>
    </div>
  );
} 