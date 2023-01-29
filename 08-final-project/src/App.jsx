import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

function App() {
  const scroll = useRef(0);
  const overlay = useRef(null);
  const caption = useRef(null);

  return (
    <Canvas shadows eventSource={document.querySelector('#root')}>
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}

export default App;
