import React, { useRef, useEffect, useState } from 'react';

const GAME_W = 320, GAME_H = 180, GROUND = 150, PLAYER_W = 22, PLAYER_H = 30, COIN_W = 14, COIN_H = 14, OBST_W = 18, OBST_H = 30;
function randomCoinX() { return 100 + Math.random() * 180; }
function randomObstX() { return 180 + Math.random() * 120; }

export default function Game35() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [jump, setJump] = useState(false);
  const [playerY, setPlayerY] = useState(GROUND);
  const [coin, setCoin] = useState({ x: randomCoinX(), y: GROUND - 10 });
  const [obst, setObst] = useState({ x: randomObstX() });
  const vy = useRef(0);
  const raf = useRef();

  useEffect(() => {
    if (over) return;
    const loop = () => {
      setCoin(c => ({ ...c, x: c.x - 3 }));
      setObst(o => ({ ...o, x: o.x - 3 }));
      setPlayerY(y => {
        let v = vy.current;
        v += 1.2;
        let ny = y + v;
        if (ny > GROUND) { ny = GROUND; v = 0; }
        vy.current = v;
        return ny;
      });
      setScore(s => s + 1);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [over]);

  useEffect(() => {
    if (over) return;
    // 收集金币
    if (
      coin.x < 40 + PLAYER_W && coin.x + COIN_W > 40 &&
      playerY < coin.y + COIN_H && playerY + PLAYER_H > coin.y
    ) {
      setScore(s => s + 10);
      setCoin({ x: randomCoinX(), y: GROUND - 10 - Math.random() * 40 });
    }
    // 金币出界
    if (coin.x < -COIN_W) setCoin({ x: randomCoinX(), y: GROUND - 10 - Math.random() * 40 });
    // 障碍碰撞
    if (
      obst.x < 40 + PLAYER_W && obst.x + OBST_W > 40 &&
      playerY + PLAYER_H > GROUND && playerY < GROUND + OBST_H
    ) {
      setOver(true);
    }
    // 障碍出界
    if (obst.x < -OBST_W) setObst({ x: randomObstX() });
  }, [coin, obst, playerY, over]);

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
    setScore(0); setOver(false); setPlayerY(GROUND); setCoin({ x: randomCoinX(), y: GROUND - 10 }); setObst({ x: randomObstX() }); vy.current = 0;
  };

  return (
    <div style={{ width: GAME_W, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span>分数: {score}</span>
        <button onClick={restart} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>重开</button>
      </div>
      <svg width={GAME_W} height={GAME_H} style={{ background: '#e0e7ef', borderRadius: 12 }}>
        <rect x={0} y={GROUND + PLAYER_H} width={GAME_W} height={GAME_H - GROUND - PLAYER_H} fill="#64748b" />
        <rect x={40} y={playerY} width={PLAYER_W} height={PLAYER_H} rx={6} fill={jump ? '#fbbf24' : '#2563eb'} />
        <rect x={coin.x} y={coin.y} width={COIN_W} height={COIN_H} rx={7} fill="#fbbf24" />
        <rect x={obst.x} y={GROUND} width={OBST_W} height={OBST_H} rx={4} fill="#ef4444" />
      </svg>
      {over && <div style={{ color: '#ef4444', fontWeight: 700, marginTop: 12 }}>游戏结束！分数: {score}，按R重开</div>}
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>空格跳跃，收集金币并躲避障碍，挑战高分！</div>
    </div>
  );
} 