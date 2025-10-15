import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControls, button } from 'leva';
import { useState } from 'react';
import DataVisualizer from './components/DataVisualizer';
import { generateRandomData } from './utils/dataGenerator';


export default function App() {
  const [data, setData] = useState(generateRandomData(20));
  
  const { 
    backgroundColor,
    regenerateData,
    dataCount
  } = useControls({
    backgroundColor: '#000000',
    dataCount: {
      value: 20,
      min: 5,
      max: 50,
      step: 1
    },
    regenerateData: button(() => {
      setData(generateRandomData(dataCount));
    })
  });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 40], fov: 50 }} style={{ background: backgroundColor }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <DataVisualizer data={data} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
