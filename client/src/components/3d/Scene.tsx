import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Grid, Preload } from '@react-three/drei'
import { GarmentModel } from './GarmentModel'
import { useDesignStore } from '@/store/designStore'
import * as THREE from 'three'

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-4, 4, -3]} intensity={0.6} color="#c0aafe" />
      <pointLight position={[0, 6, 0]} intensity={0.8} color="#ffffff" distance={15} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.2}
        color="#f8f4ff"
        castShadow={false}
      />
      <hemisphereLight args={['#c0aafe', '#1a0a2e', 0.3]} />
    </>
  )
}

function LoadingMesh() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 0.8, 0.2]} />
      <meshStandardMaterial color="#3f3f46" wireframe />
    </mesh>
  )
}

// Resets camera position when cameraView changes
function CameraController({ cameraView, positions }: { cameraView: string; positions: Record<string, [number, number, number]> }) {
  const { camera } = useThree()
  useEffect(() => {
    const pos = positions[cameraView] ?? positions.front
    camera.position.set(...pos)
    camera.lookAt(0, 0.1, 0)
    camera.updateProjectionMatrix()
  }, [cameraView, camera, positions])
  return null
}

interface SceneProps {
  height?: string
}

export function Scene({ height = '100%' }: SceneProps) {
  const { category, zoneColors, fabric, isAutoRotating, activeZone, cameraView, textDecals, imageDecals } = useDesignStore()

  const cameraPositions: Record<string, [number, number, number]> = {
    front: [0, 0.15, 2.5],
    back: [0, 0.15, -2.5],
    left: [-2.5, 0.15, 0],
    right: [2.5, 0.15, 0],
    custom: [0, 0.15, 2.5],
  }

  const camPos = cameraPositions[cameraView] ?? cameraPositions.front

  return (
    <div style={{ height, width: '100%', background: 'transparent' }}>
      <Canvas
        camera={{ position: camPos, fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 8, 20]} />

        <StudioLighting />
        <CameraController cameraView={cameraView} positions={cameraPositions} />

        <Suspense fallback={<LoadingMesh />}>
          <Environment preset="warehouse" background={false} />

          <Float
            speed={isAutoRotating ? 0 : 1.5}
            rotationIntensity={0.1}
            floatIntensity={0.2}
          >
            <GarmentModel
              category={category}
              zoneColors={zoneColors}
              fabric={fabric}
              isAutoRotating={isAutoRotating}
              activeZone={activeZone}
              textDecals={textDecals}
              imageDecals={imageDecals}
            />
          </Float>

          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.5}
            scale={3}
            blur={2.5}
            far={0.9}
          />

          <Grid
            position={[0, -0.86, 0]}
            args={[6, 6]}
            cellSize={0.4}
            cellThickness={0.3}
            cellColor="#3f3f46"
            sectionSize={1.2}
            sectionThickness={0.6}
            sectionColor="#52525b"
            fadeDistance={5}
            fadeStrength={1}
            followCamera={false}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.2}
          maxDistance={4.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI * 0.78}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
          makeDefault
        />
      </Canvas>
    </div>
  )
}
