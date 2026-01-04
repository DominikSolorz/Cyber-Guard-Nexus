import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface Node {
  id: string;
  position: [number, number, number];
  type: 'server' | 'router' | 'client' | 'firewall';
  label: string;
}

const NetworkNode: React.FC<{ node: Node; onClick: (id: string) => void }> = ({ node, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const getColor = () => {
    switch (node.type) {
      case 'server': return '#ff4444';
      case 'router': return '#4444ff';
      case 'client': return '#44ff44';
      case 'firewall': return '#ffaa00';
      default: return '#ffffff';
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onClick={() => onClick(node.id)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color={getColor()} 
        emissive={getColor()} 
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  );
};

const NetworkConnections: React.FC<{ nodes: Node[] }> = ({ nodes }) => {
  const connections: [number, number][] = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [3, 6]
  ];

  return (
    <>
      {connections.map(([start, end], idx) => {
        if (nodes[start] && nodes[end]) {
          return (
            <Line
              key={idx}
              points={[nodes[start].position, nodes[end].position]}
              color="#00ff00"
              lineWidth={1}
              opacity={0.3}
              transparent
            />
          );
        }
        return null;
      })}
    </>
  );
};

const NetworkMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: 'server-1', position: [0, 2, 0], type: 'server', label: 'Main Server' },
    { id: 'router-1', position: [0, 0, 0], type: 'router', label: 'Core Router' },
    { id: 'firewall-1', position: [-2, -1, 0], type: 'firewall', label: 'Firewall' },
    { id: 'router-2', position: [2, -1, 0], type: 'router', label: 'Edge Router' },
    { id: 'client-1', position: [-3, -3, 0], type: 'client', label: 'Client PC' },
    { id: 'server-2', position: [1, -3, 2], type: 'server', label: 'Database' },
    { id: 'client-2', position: [3, -3, -2], type: 'client', label: 'Workstation' }
  ];

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  return (
    <div className="network-map-container">
      <div className="network-map-header">
        <h2>Network Topology Visualization</h2>
        <p className="network-subtitle">3D Network Map - Click nodes to inspect</p>
      </div>

      <div className="network-canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {nodes.map(node => (
            <NetworkNode key={node.id} node={node} onClick={handleNodeClick} />
          ))}

          <NetworkConnections nodes={nodes} />

          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
        </Canvas>
      </div>

      <div className="network-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ff4444' }}></span>
            <span>Server</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#4444ff' }}></span>
            <span>Router</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#44ff44' }}></span>
            <span>Client</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ffaa00' }}></span>
            <span>Firewall</span>
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="network-info-panel">
          <h3>Node Information</h3>
          <p><strong>ID:</strong> {selectedNode}</p>
          <p><strong>Type:</strong> {nodes.find(n => n.id === selectedNode)?.type}</p>
          <p><strong>Label:</strong> {nodes.find(n => n.id === selectedNode)?.label}</p>
          <button onClick={() => setSelectedNode(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NetworkMap;
