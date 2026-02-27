import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import { useState } from 'react'

const Building = ({ position, args, color, name, info, setHovered }) => {
    return (
        <mesh
            position={position}
            onPointerOver={(e) => { e.stopPropagation(); setHovered({ name, info }) }}
            onPointerOut={() => setHovered(null)}
        >
            <boxGeometry args={args} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        </mesh>
    )
}

export default function CampusMap3D() {
    const [hovered, setHovered] = useState(null)

    return (
        <div className="fade-in" style={{ height: '500px', width: '100%', position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0a0a0f', border: '1px solid var(--border-subtle)' }}>
            {hovered && (
                <div style={{
                    position: 'absolute', top: '1rem', left: '1rem', zIndex: 10,
                    background: 'rgba(15, 15, 20, 0.9)', backdropFilter: 'blur(10px)',
                    padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                    pointerEvents: 'none'
                }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{hovered.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hovered.info}</p>
                </div>
            )}

            <Canvas camera={{ position: [20, 20, 20], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />

                {/* Ground */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#1a1a24" />
                </mesh>

                {/* Buildings */}
                <Building position={[-5, 3, -5]} args={[6, 6, 6]} color="#3b82f6" name="Science Library" info="Open 24/7. Access to academic journals." setHovered={setHovered} />
                <Building position={[8, 5, -8]} args={[8, 10, 8]} color="#8b5cf6" name="Main Administrative Block" info="Registrar, Financial Aid, and Dean's Office." setHovered={setHovered} />
                <Building position={[-10, 2, 8]} args={[12, 4, 10]} color="#10b981" name="Student Union" info="Cafeteria, Clubs, and Recreation spaces." setHovered={setHovered} />
                <Building position={[12, 6, 10]} args={[5, 12, 5]} color="#f59e0b" name="Dormitory A" info="Freshman and Sophomore housing." setHovered={setHovered} />
                <Building position={[5, 4, 2]} args={[6, 8, 5]} color="#ec4899" name="Arts Center" info="Theaters, Studios, and Exhibition Halls." setHovered={setHovered} />

                {/* Labels Above Buildings */}
                <Text position={[-5, 7, -5]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">Library</Text>
                <Text position={[8, 11, -8]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">Admin</Text>
                <Text position={[-10, 5, 8]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">Union</Text>
                <Text position={[12, 13, 10]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">Dorms</Text>
                <Text position={[5, 9, 2]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">Arts</Text>

                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
                <Environment preset="city" />
            </Canvas>
        </div>
    )
}
