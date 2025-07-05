import React, { useState, useEffect } from 'react';

const MAZE = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,0,1,0,1,0,1],
  [1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];
const SIZE = 10;
const START = { x: 1, y: 1 };
const END = { x: 8, y: 8 };

export default function Game10() {
  return (
    <div style={{textAlign:'center',color:'#888',fontSize:24,padding:40}}>
      <h3>拼图</h3>
      <p>本游戏正在开发中，敬请期待！</p>
    </div>
  )
} 