import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Center } from '@react-three/drei'
import * as THREE from 'three'
import type { GarmentZone, ColorOption, FabricOption, ClothingCategory, TextDecal, ImageDecal } from '@/types'
import { useDesignStore } from '@/store/designStore'

// Shared scratch Color objects to avoid allocating in useFrame
const _targetColor = new THREE.Color()
const _emissiveTarget = new THREE.Color()

// preload models lazily (called from the component that needs them)

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface GarmentModelProps {
  category: ClothingCategory
  zoneColors: Record<GarmentZone, ColorOption>
  fabric: FabricOption
  isAutoRotating: boolean
  activeZone: GarmentZone | null
  textDecals?: TextDecal[]
  imageDecals?: ImageDecal[]
}

interface MeshModelProps extends Required<Pick<GarmentModelProps,
  'zoneColors' | 'fabric' | 'isAutoRotating' | 'activeZone' | 'textDecals' | 'imageDecals'
>> {}

// ─── Zone positions for decal overlay planes ───────────────────────────────────
const DECAL_POS: Record<string, [number, number, number]> = {
  front:        [0,     0.05,  0.14],
  chest:        [0.06,  0.10,  0.14],
  back:         [0,     0.05, -0.14],
  left_sleeve:  [-0.22, 0,     0.06],
  right_sleeve: [ 0.22, 0,     0.06],
}
// ─── Text → canvas data URL ────────────────────────────────────────────────────
function textToDataUrl(text: string, font: string, color: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 1024, 512)
  const fontFamily = `"${font || 'Arial'}", Arial, sans-serif`
  ctx.font = `bold 140px ${fontFamily}`
  // Measure to auto-scale if text is too wide
  const metrics = ctx.measureText(text)
  if (metrics.width > 900) {
    const scale = 900 / metrics.width
    ctx.font = `bold ${Math.floor(140 * scale)}px ${fontFamily}`
  }
  // Subtle shadow for visibility on any garment color
  ctx.shadowColor = color === '#ffffff' || color === '#FFFFFF'
    ? 'rgba(0,0,0,0.6)'
    : 'rgba(255,255,255,0.25)'
  ctx.shadowBlur = 6
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 512, 256)
  return canvas.toDataURL()
}

// ─── Single decal plane (owns its useTexture) ─────────────────────────────────
function DecalPlane({
  url,
  position,
  rotationY = 0,
  rotationZ = 0,
  scale,
}: {
  url: string
  position: [number, number, number]
  rotationY?: number
  rotationZ?: number
  scale: number
}) {
  const tex = useTexture(url)
  useEffect(() => {
    if (tex) { tex.colorSpace = THREE.SRGBColorSpace; tex.needsUpdate = true }
  }, [tex])
  return (
    <mesh position={position} rotation={[0, rotationY, rotationZ]} renderOrder={10}>
      <planeGeometry args={[scale * 2, scale]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        depthTest={false}
        alphaTest={0.01}
      />
    </mesh>
  )
}

// ─── Decal overlay layer ───────────────────────────────────────────────────────
function DecalOverlay({ textDecals, imageDecals }: { textDecals: TextDecal[]; imageDecals: ImageDecal[] }) {
  const textUrls = useMemo(
    () => textDecals.map((d) => textToDataUrl(d.text, d.font, d.color)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(textDecals)],
  )
  return (
    <>
      {textDecals.map((d, i) => {
        const pos = DECAL_POS[d.zone] ?? DECAL_POS.front
        const isBack = d.zone === 'back'
        return (
          <DecalPlane
            key={d.id}
            url={textUrls[i]}
            position={pos}
            rotationY={isBack ? Math.PI : 0}
            rotationZ={(d.rotation * Math.PI) / 180}
            scale={d.size / 100}
          />
        )
      })}
      {imageDecals.map((d) => {
        const pos = DECAL_POS[d.zone] ?? DECAL_POS.front
        const isBack = d.zone === 'back'
        return (
          <DecalPlane
            key={d.id}
            url={d.url}
            position={pos}
            rotationY={isBack ? Math.PI : 0}
            rotationZ={(d.rotation * Math.PI) / 180}
            scale={d.size / 100}
          />
        )
      })}
    </>
  )
}

// ─── Base model component factory ─────────────────────────────────────────────
interface BaseModelDef {
  url: string
  materialZones: Record<string, GarmentZone>
  defaultZone?: GarmentZone
  hiddenMaterials?: string[]
}

function BaseModel({
  def,
  zoneColors,
  fabric,
  isAutoRotating,
  activeZone,
  textDecals,
  imageDecals,
}: MeshModelProps & { def: BaseModelDef }) {
  const gltf = useGLTF(def.url) as any
  // Clone scene so multiple instances (hoodie vs jacket) don't share visibility state
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const materials = useMemo(() => {
    const mats: Record<string, any> = {}
    scene.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        const mat = obj.material.clone()
        obj.material = mat
        mats[mat.name] = mat
      }
    })
    return mats
  }, [scene])
  const groupRef = useRef<THREE.Group>(null)
  const rotRef = useRef(0)

  // Read store directly in useFrame to avoid stale closure issues
  const storeRef = useRef(useDesignStore.getState)
  // Apply colors every frame — directly update GLTF materials (single-instance model, safe to mutate)
  useFrame((_, delta) => {
    if (!materials) return
    const { zoneColors: liveZoneColors, fabric: liveFabric, activeZone: liveActiveZone } = storeRef.current()
    Object.entries(materials).forEach(([matName, mat]: [string, any]) => {
      const zone: GarmentZone = def.materialZones[matName] ?? def.defaultZone ?? 'body'
      const hex = liveZoneColors[zone]?.hex ?? liveZoneColors.body?.hex ?? '#FFFFFF'
      if (mat.color) {
        _targetColor.set(hex)
        mat.color.lerp(_targetColor, 0.25)
      }
      if ('roughness' in mat) mat.roughness = liveFabric.roughness
      if ('metalness' in mat) mat.metalness = liveFabric.metalness
      if (mat.emissive) {
        const isActive = liveActiveZone === zone
        _emissiveTarget.set(isActive ? '#a855f7' : '#000000')
        mat.emissive.lerp(_emissiveTarget, 0.25)
        if ('emissiveIntensity' in mat) mat.emissiveIntensity = isActive ? 0.15 : 0
      }
    })

    if (isAutoRotating && groupRef.current) {
      rotRef.current += delta * 0.5
      groupRef.current.rotation.y = rotRef.current
    }
  })

  // Enable shadows; hide any material-named meshes the def wants invisible
  useEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        if (def.hiddenMaterials?.includes(obj.material?.name)) {
          obj.visible = false
        }
      }
    })
  }, [scene, def])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <DecalOverlay textDecals={textDecals} imageDecals={imageDecals} />
    </group>
  )
}

// ─── Per-garment model components (fixed hook URLs) ───────────────────────────
const TSHIRT_DEF: BaseModelDef = {
  url: '/models/shirt_baked.glb',
  materialZones: { lambert1: 'body' },
  defaultZone: 'body',
}
function TShirtModel(p: MeshModelProps) {
  return <BaseModel {...p} def={TSHIRT_DEF} />
}

const SHIRT_DEF: BaseModelDef = {
  url: '/models/full_shirt.glb',
  materialZones: { Shirt: 'body' },
  defaultZone: 'body',
}
function ShirtModel(p: MeshModelProps) {
  return <BaseModel {...p} def={SHIRT_DEF} />
}

const HOODIE_DEF: BaseModelDef = {
  url: '/models/full_hoodie.glb',
  materialZones: {
    Jacket_M: 'body',
    Layer:    'collar',
    Layer_2:  'sleeves',
    Zipper:   'stitching',
    Shirt_M:  'inner_lining',
    buttons:  'buttons',
  },
  defaultZone: 'body',
  hiddenMaterials: ['Pants_M'],
}
function HoodieModel(p: MeshModelProps) {
  return <BaseModel {...p} def={HOODIE_DEF} />
}

// Jacket reuses hoodie GLB but hides pants; maps same material zones
const JACKET_DEF: BaseModelDef = {
  url: '/models/full_hoodie.glb',
  materialZones: {
    Jacket_M: 'body',
    Layer:    'collar',
    Layer_2:  'sleeves',
    Zipper:   'stitching',
    Shirt_M:  'inner_lining',
    buttons:  'buttons',
  },
  defaultZone: 'body',
  hiddenMaterials: ['Pants_M'],
}
function JacketModel(p: MeshModelProps) {
  return <BaseModel {...p} def={JACKET_DEF} />
}

const TROUSER_DEF: BaseModelDef = {
  url: '/models/trouser.glb',
  materialZones: {},
  defaultZone: 'body',
}
function TrouserModel(p: MeshModelProps) {
  return <BaseModel {...p} def={TROUSER_DEF} />
}

// ─── Public export ─────────────────────────────────────────────────────────────
export function GarmentModel({
  category,
  zoneColors,
  fabric,
  isAutoRotating,
  activeZone,
  textDecals = [],
  imageDecals = [],
}: GarmentModelProps) {
  const props: MeshModelProps = { zoneColors, fabric, isAutoRotating, activeZone, textDecals, imageDecals }

  return (
    <Center>
      {category === 'tshirt'                        && <TShirtModel  {...props} />}
      {(category === 'shirt' || category === 'blazer')  && <ShirtModel   {...props} />}
      {category === 'hoodie'   && <HoodieModel  {...props} />}
      {category === 'jacket'   && <JacketModel  {...props} />}
      {category === 'trousers'                      && <TrouserModel {...props} />}
    </Center>
  )
}
