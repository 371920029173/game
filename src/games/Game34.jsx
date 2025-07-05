import React, { useRef, useEffect, useState } from 'react';

const GAME_W = 240, GAME_H = 400, PLAYER_W = 24, PLAYER_H = 24, PLAT_W = 60, PLAT_H = 10;
function randomPlatX() { return Math.random() * (GAME_W - PLAT_W); }

export default function Game34() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [playerX, setPlayerX] = useState(GAME_W / 2 - PLAYER_W / 2);
  const [playerY, setPlayerY] = useState(GAME_H - 40);
  const [vy, setVy] = useState(-8);
  const [plats, setPlats] = useState([
    { x: GAME_W / 2 - PLAT_W / 2, y: GAME_H - 20 },
    { x: randomPlatX(), y: GAME_H - 100 },
    { x: randomPlatX(), y: GAME_H - 180 },
    { x: randomPlatX(), y: GAME_H - 260 },
    { x: randomPlatX(), y: GAME_H - 340 },
  ]);
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
    // 平台碰撞
    for (const p of plats) {
      if (
        playerY + PLAYER_H > p.y && playerY + PLAYER_H < p.y + PLAT_H &&
        playerX + PLAYER_W > p.x && playerX < p.x + PLAT_W && vy > 0
      ) {
        setVy(-10 - Math.random() * 2);
      }
    }
    // 掉落
    if (playerY > GAME_H) setOver(true);
    // 平台循环
    setPlats(ps =>
      ps.map(p => (p.y > GAME_H ? { x: randomPlatX(), y: -PLAT_H } : p))
    );
  }, [playerY, plats, vy, over]);

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

  const restart = () => {
    setScore(0); setOver(false); setPlayerX(GAME_W / 2 - PLAYER_W / 2); setPlayerY(GAME_H - 40); setVy(-8);
    setPlats([
      { x: GAME_W / 2 - PLAT_W / 2, y: GAME_H - 20 },
      { x: randomPlatX(), y: GAME_H - 100 },
      { x: randomPlatX(), y: GAME_H - 180 },
      { x: randomPlatX(), y: GAME_H - 260 },
      { x: randomPlatX(), y: GAME_H - 340 },
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

  return (
    <div style={{ width: GAME_W, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <svg width={GAME_W} height={GAME_H} style={{ background: '#e0e7ef', borderRadius: 12 }}>
        <rect x={playerX} y={playerY} width={PLAYER_W} height={PLAYER_H} rx={8} fill="#2563eb" />
        {plats.map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={PLAT_W} height={PLAT_H} rx={4} fill="#fbbf24" />
        ))}
      </svg>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！分数: {score}，按R重开</div>}
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