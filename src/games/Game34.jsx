import React, { useRef, useEffect, useState } from 'react';

const GAME_W = 240, GAME_H = 400, PLAYER_W = 24, PLAYER_H = 24, PLAT_W = 60, PLAT_H = 10;
function randomPlatX() { return Math.random() * (GAME_W - PLAT_W); }
const PLAYER_COLORS = ['#2563eb', '#22d3ee', '#fbbf24', '#f43f5e'];
const PLAT_COLORS = ['#fbbf24', '#34d399', '#818cf8', '#f472b6', '#f87171'];

export default function Game34() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [playerX, setPlayerX] = useState(GAME_W / 2 - PLAYER_W / 2);
  const [playerY, setPlayerY] = useState(GAME_H - 40);
  const [vy, setVy] = useState(-8);
  const [plats, setPlats] = useState([
    { x: GAME_W / 2 - PLAT_W / 2, y: GAME_H - 20, color: 0, flash: false },
    { x: randomPlatX(), y: GAME_H - 100, color: 1, flash: false },
    { x: randomPlatX(), y: GAME_H - 180, color: 2, flash: false },
    { x: randomPlatX(), y: GAME_H - 260, color: 3, flash: false },
    { x: randomPlatX(), y: GAME_H - 340, color: 4, flash: false },
  ]);
  const [playerAnim, setPlayerAnim] = useState(''); // '' | 'jump' | 'land'
  const [countdown, setCountdown] = useState(null); // null | 3/2/1/0
  const raf = useRef();

  useEffect(() => {
    if (over) return;
    const loop = () => {
      setPlayerY(y => y + vy);
      setVy(v => v + 0.4);
      setPlats(ps => ps.map(p => ({ ...p, y: p.y + (vy > 0 ? -vy / 2 : 0) }))); // 平台随玩家上升
      setScore(s => s + 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [over, vy]);

  useEffect(() => {
    if (over) return;
    let landed = false;
    setPlats(ps => ps.map((p, idx) => {
      if (
        playerY + PLAYER_H > p.y && playerY + PLAYER_H < p.y + PLAT_H &&
        playerX + PLAYER_W > p.x && playerX < p.x + PLAT_W && vy > 0
      ) {
        setVy(-10 - Math.random() * 2);
        setPlayerAnim('jump');
        landed = true;
        // 平台闪烁
        setTimeout(() => setPlats(ps2 => ps2.map((pp, i) => i === idx ? { ...pp, flash: false } : pp)), 120);
        return { ...p, flash: true };
      }
      return p;
    }));
    if (!landed && vy > 0) setPlayerAnim('land');
    // 掉落
    if (playerY > GAME_H) setOver(true);
    // 平台循环
    setPlats(ps =>
      ps.map(p => (p.y > GAME_H ? { x: randomPlatX(), y: -PLAT_H, color: Math.floor(Math.random()*PLAT_COLORS.length), flash: false } : p))
    );
  }, [playerY, plats, vy, over]);

  // 玩家动画状态自动还原
  useEffect(() => {
    if (playerAnim) {
      const t = setTimeout(() => setPlayerAnim(''), 180);
      return () => clearTimeout(t);
    }
  }, [playerAnim]);

  useEffect(() => {
    const onKey = e => {
      if (over && e.key === 'r') restart();
      if (over) return;
      if (e.key === 'ArrowLeft') setPlayerX(x => Math.max(0, x - 24));
      if (e.key === 'ArrowRight') setPlayerX(x => Math.min(GAME_W - PLAYER_W, x + 24));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [over]);

  // 游戏结束倒计时动画
  useEffect(() => {
    if (over) {
      setCountdown(3);
      let t1 = setTimeout(() => setCountdown(2), 700);
      let t2 = setTimeout(() => setCountdown(1), 1400);
      let t3 = setTimeout(() => setCountdown(0), 2100);
      let t4 = setTimeout(() => { setCountdown(null); restart(); }, 2800);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [over]);

  const restart = () => {
    setScore(0); setOver(false); setPlayerX(GAME_W / 2 - PLAYER_W / 2); setPlayerY(GAME_H - 40); setVy(-8);
    setPlats([
      { x: GAME_W / 2 - PLAT_W / 2, y: GAME_H - 20, color: 0, flash: false },
      { x: randomPlatX(), y: GAME_H - 100, color: 1, flash: false },
      { x: randomPlatX(), y: GAME_H - 180, color: 2, flash: false },
      { x: randomPlatX(), y: GAME_H - 260, color: 3, flash: false },
      { x: randomPlatX(), y: GAME_H - 340, color: 4, flash: false },
    ]);
  };

  // 屏幕操作面板
  const moveLeft = () => { if (!over) setPlayerX(x => Math.max(0, x - 24)); };
  const moveRight = () => { if (!over) setPlayerX(x => Math.min(GAME_W - PLAYER_W, x + 24)); };
  const controls = [
    { label: '←', onClick: moveLeft },
    { label: '→', onClick: moveRight },
    { label: '重开', onClick: restart },
  ];

  // 动画样式
  const playerStyle = {
    transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), fill 0.18s',
    transform: playerAnim === 'jump' ? 'scale(1.15,0.85)' : playerAnim === 'land' ? 'scale(0.9,1.1)' : 'scale(1,1)',
    filter: playerAnim ? 'brightness(1.2)' : 'none',
  };

  return (
    <div style={{ width: '100vw', maxWidth: 320, margin: '0 auto', textAlign: 'center', padding: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 16 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <div style={{ position: 'relative', width: GAME_W, height: GAME_H, margin: '0 auto' }}>
        <svg width={GAME_W} height={GAME_H} style={{ background: 'linear-gradient(180deg,#e0e7ef 60%,#bae6fd 100%)', borderRadius: 12, display: 'block' }}>
          <rect x={playerX} y={playerY} width={PLAYER_W} height={PLAYER_H} rx={8}
            fill={PLAYER_COLORS[score % PLAYER_COLORS.length]}
            style={playerStyle}
          />
          {plats.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width={PLAT_W} height={PLAT_H} rx={4}
              fill={PLAT_COLORS[p.color % PLAT_COLORS.length]}
              style={{ filter: p.flash ? 'brightness(2) drop-shadow(0 0 8px #fff)' : 'none', transition: 'filter 0.12s' }}
            />
          ))}
        </svg>
        {countdown !== null && (
          <div style={{
            position: 'absolute', left: 0, top: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 64, color: countdown === 0 ? '#22d3ee' : '#f43f5e', fontWeight: 900,
            background: 'rgba(255,255,255,0.7)', borderRadius: 12,
            transition: 'opacity 0.3s', zIndex: 2
          }}>{countdown === 0 ? 'GO!' : countdown}</div>
        )}
      </div>
      {over && countdown === null && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！分数: {score}，按R重开</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>左右方向键或下方按钮移动，跳跃攀爬平台，挑战高分！</div>
      {/* 屏幕操作面板 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
        {controls.map((c, i) => (
          <button key={i} onClick={c.onClick} style={{ minWidth: 48, minHeight: 48, fontSize: 20, borderRadius: 12, background: '#f3f4f6', border: '2px solid #2563eb', color: '#2563eb', fontWeight: 700, boxShadow: '0 1px 4px #0001', cursor: 'pointer', margin: 4 }}>{c.label}</button>
        ))}
      </div>
    </div>
  );
} 