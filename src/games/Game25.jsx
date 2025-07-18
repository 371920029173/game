import React, { useState, useRef } from 'react';

const COLORS = ['#fbbf24', '#38bdf8', '#ef4444', '#22d3ee', '#a3e635'];
function genSeq(len) {
  return Array.from({ length: len }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
}
const MAX_LEVEL = 500;

export default function Game25() {
  const [level, setLevel] = useState(1);
  const [seq, setSeq] = useState(() => genSeq(3));
  const [show, setShow] = useState(true);
  const [input, setInput] = useState([]);
  const [msg, setMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef();

  const start = () => {
    const nextLevel = Math.min(level, MAX_LEVEL);
    setSeq(genSeq(2 + nextLevel));
    setShow(true);
    setInput([]);
    setMsg('');
    const time = Math.ceil((1200 + nextLevel * 400) / 1000);
    setCountdown(time);
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
    setTimeout(() => {
      setShow(false);
      setCountdown(0);
      clearInterval(timerRef.current);
    }, 1200 + nextLevel * 400);
  };
  const handleClick = c => {
    if (show) return;
    setInput(inp => {
      const next = [...inp, c];
      if (next.length === seq.length) {
        if (next.join() === seq.join()) {
          setMsg('恭喜通过，进入下一关！');
          setLevel(l => Math.min(l + 1, MAX_LEVEL));
          setTimeout(start, 1200);
        } else {
          setMsg('记错了，重新开始！');
          setLevel(1);
          setTimeout(start, 1200);
        }
      }
      return next;
    });
  };
  React.useEffect(() => { start(); return () => { clearInterval(timerRef.current); }; }, []);
  return (
    <div style={{ width: 320, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>颜色记忆大师 | 关卡: {level}</span>
        <button onClick={start} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      {show && <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>记忆倒计时：{countdown}s</div>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {(show ? seq : input).map((c, i) => (
          <div key={i} style={{ width: 40, height: 40, background: c, borderRadius: 8, boxShadow: '0 1px 4px #0002', border: '2px solid #fff' }} />
        ))}
      </div>
      {!show && <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
        {COLORS.map((c, i) => (
          <button key={i} onClick={() => handleClick(c)} style={{ width: 40, height: 40, background: c, border: 'none', borderRadius: 8, boxShadow: '0 1px 4px #0002', cursor: 'pointer' }} />
        ))}
      </div>}
      <div style={{ color: msg.includes('恭喜') ? '#22c55e' : '#ef4444', fontWeight: 700, marginTop: 16 }}>{msg}</div>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>记住颜色顺序，依次点击还原，关卡递增更难！（最高500关）</div>
    </div>
  );
} 