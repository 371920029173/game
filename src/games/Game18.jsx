import React, { useState } from 'react';

function genSeq(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10));
}

export default function Game18() {
  const [level, setLevel] = useState(1);
  const [seq, setSeq] = useState(() => genSeq(3));
  const [show, setShow] = useState(true);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');

  const start = () => {
    setSeq(genSeq(2 + level));
    setShow(true);
    setInput('');
    setMsg('');
    setTimeout(() => setShow(false), 1200 + level * 400);
  };
  const handleInput = e => {
    setInput(e.target.value.replace(/\D/g, ''));
  };
  const check = () => {
    if (input === seq.join('')) {
      setMsg('恭喜通过，进入下一关！');
      setLevel(l => l + 1);
      setTimeout(start, 1200);
    } else {
      setMsg('记错了，重新开始！');
      setLevel(1);
      setTimeout(start, 1200);
    }
  };
  React.useEffect(() => { start(); }, []);
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>关卡: {level}</span>
        <button onClick={start} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, minHeight: 48, marginBottom: 16, color: show ? '#fbbf24' : '#bdbdbd', letterSpacing: 8 }}>{show ? seq.join('') : ''}</div>
      {!show && <input value={input} onChange={handleInput} maxLength={seq.length} style={{ fontSize: 24, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', width: 120, textAlign: 'center', marginBottom: 12 }} placeholder="输入数字" />}
      {!show && <button onClick={check} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginLeft: 12 }}>提交</button>}
      <div style={{ color: msg.includes('恭喜') ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: 16 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>记住数字顺序，输入正确即可过关，关卡递增更难！</div>
    </div>
  );
} 