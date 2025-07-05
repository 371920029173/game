import React, { useRef, useEffect, useState } from 'react';

const GAME_W = 320, GAME_H = 180, GROUND = 150, PLAYER_W = 20, PLAYER_H = 28, STAR_W = 16, STAR_H = 16;
function randomStarX() { return 80 + Math.random() * 200; }

export default function Game33() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [jump, setJump] = useState(false);
  const [playerY, setPlayerY] = useState(GROUND);
  const [star, setStar] = useState({ x: randomStarX(), y: GROUND - 20 });
  const vy = useRef(0);
  const raf = useRef();

  useEffect(() => {
    if (over) return;
    const loop = () => {
      setStar(s => ({ ...s, x: s.x - 3 }));
      setPlayerY(y => {
        let v = vy.current;
        v += 1.2;
        let ny = y + v;
        if (ny > GROUND) { ny = GROUND; v = 0; }
        vy.current = v;
        return ny;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [over]);

  useEffect(() => {
    if (over) return;
    // 收集星星
    if (
      star.x < 40 + PLAYER_W && star.x + STAR_W > 40 &&
      playerY < star.y + STAR_H && playerY + PLAYER_H > star.y
    ) {
      setScore(s => s + 1);
      setStar({ x: randomStarX(), y: GROUND - 20 - Math.random() * 40 });
    }
    // 星星出界
    if (star.x < -STAR_W) setStar({ x: randomStarX(), y: GROUND - 20 - Math.random() * 40 });
  }, [star, playerY, over]);

  useEffect(() => {
    const onKey = e => {
      if (e.code === 'Space' && !over && playerY >= GROUND) {
        vy.current = -13;
        setJump(true);
        setTimeout(() => setJump(false), 200);
      }
      if (e.key === 'r' && over) restart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [over, playerY]);

  const restart = () => {
    setScore(0); setOver(false); setPlayerY(GROUND); setStar({ x: randomStarX(), y: GROUND - 20 }); vy.current = 0;
  };

  return (
    <div style={{ width: GAME_W, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <svg width={GAME_W} height={GAME_H} style={{ background: '#e0e7ef', borderRadius: 12 }}>
        <rect x={0} y={GROUND + PLAYER_H} width={GAME_W} height={GAME_H - GROUND - PLAYER_H} fill="#64748b" />
        <rect x={40} y={playerY} width={PLAYER_W} height={PLAYER_H} rx={4} fill={jump ? '#fbbf24' : '#2563eb'} />
        <rect x={star.x} y={star.y} width={STAR_W} height={STAR_H} rx={8} fill="#fbbf24" />
      </svg>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！分数: {score}，按R重开</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>空格跳跃，收集星星，挑战高分！</div>
    </div>
  );
} 