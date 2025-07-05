import React, { useState } from 'react';

const SIZE = 6;
const PAIRS = SIZE * SIZE / 2;
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Game11() {
  return (
    <div style={{textAlign:'center',color:'#888',fontSize:24,padding:40}}>
      <h3>拼图</h3>
      <p>本游戏正在开发中，敬请期待！</p>
    </div>
  )
} 