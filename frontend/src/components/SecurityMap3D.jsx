import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Line } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

const Node = ({ position, color, label, pulseRate }) => {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const scale = 1 + Math.sin(time * pulseRate) * 0.2
        if (meshRef.current) {
            meshRef.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <pointLight distance={5} intensity={5} color={color} />
        </group>
    )
}

const Arc = ({ start, end, color }) => {
    const points = useMemo(() => {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(...start),
            new THREE.Vector3((start[0] + end[0]) / 2, Math.max(start[1], end[1]) + 5, (start[2] + end[2]) / 2),
            new THREE.Vector3(...end)
        )
        return curve.getPoints(50)
    }, [start, end])

    return (
        <Line points={points} color={color} lineWidth={2} dashed dashScale={5} dashSize={1} dashOffset={0} opacity={0.5} transparent />
    )
}

export default function SecurityMap3D() {
    const nodes = [
        { id: 'n1', pos: [-10, 0, -5], color: '#10b981', label: 'US-East Server', rate: 2 },
        { id: 'n2', pos: [8, 2, -10], color: '#3b82f6', label: 'EU-West Cluster', rate: 1.5 },
        { id: 'n3', pos: [12, -2, 5], color: '#f59e0b', label: 'AP-South Gateway', rate: 4 },
        { id: 'n4', pos: [-8, 0, 10], color: '#ef4444', label: 'Traffic Anomaly', rate: 10 },
        { id: 'n5', pos: [0, 5, 0], color: '#8b5cf6', label: 'Central Auth', rate: 1 },
    ]

    const arcs = [
        { start: nodes[0].pos, end: nodes[4].pos, color: '#10b981' },
        { start: nodes[1].pos, end: nodes[4].pos, color: '#3b82f6' },
        { start: nodes[2].pos, end: nodes[4].pos, color: '#f59e0b' },
        { start: nodes[3].pos, end: nodes[4].pos, color: '#ef4444' },
    ]

    return (
        <div className="fade-in" style={{ height: '600px', width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#050508', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{
                position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)',
                padding: '0.5rem 1rem', borderRadius: '20px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }}></div>
                Threat Level: ELEVATED
            </div>

            <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
                <color attach="background" args={['#050508']} />
                <fog attach="fog" args={['#050508', 10, 50]} />
                <ambientLight intensity={0.2} />

                {/* Cyber Grid */}
                <gridHelper args={[40, 40, '#1a1a2e', '#0f0f1a']} position={[0, -2, 0]} />

                {/* Nodes */}
                {nodes.map(node => (
                    <Node key={node.id} position={node.pos} color={node.color} label={node.label} pulseRate={node.rate} />
                ))}

                {/* Attack Vectors (Arcs) */}
                {arcs.map((arc, i) => (
                    <Arc key={i} start={arc.start} end={arc.end} color={arc.color} />
                ))}

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls autoRotate autoRotateSpeed={1} maxPolarAngle={Math.PI / 2} />
            </Canvas>
        </div>
    )
}
