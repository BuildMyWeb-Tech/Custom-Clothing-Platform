import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type {
  ClothingCategory, DesignConfig, FabricOption, ColorOption,
  GarmentZone, PatternOption, TextDecal, ImageDecal, PriceBreakdown
} from '@/types'

const DEFAULT_COLORS: Record<GarmentZone, ColorOption> = {
  body: { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  collar: { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  cuffs: { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  sleeves: { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  buttons: { id: 'pearl', name: 'Pearl', hex: '#F0EAD6' },
  pockets: { id: 'white', name: 'Pure White', hex: '#FFFFFF' },
  stitching: { id: 'ivory', name: 'Ivory', hex: '#FFFFF0' },
  inner_lining: { id: 'silk-white', name: 'Silk White', hex: '#FDF5E6' },
}

const DEFAULT_FABRIC: FabricOption = {
  id: 'cotton',
  name: 'Premium Cotton',
  description: '100% Egyptian cotton, 180 GSM',
  priceMultiplier: 1,
  roughness: 0.8,
  metalness: 0,
}

export type CameraView = 'front' | 'back' | 'left' | 'right' | 'custom'
export type ActiveZone = GarmentZone | null
export type ActiveTool = 'select' | 'text' | 'image' | 'color' | null

interface DesignHistory {
  past: Partial<DesignConfig>[]
  future: Partial<DesignConfig>[]
}

interface DesignStore {
  category: ClothingCategory
  fabric: FabricOption
  pattern: PatternOption | null
  zoneColors: Record<GarmentZone, ColorOption>
  textDecals: TextDecal[]
  imageDecals: ImageDecal[]
  size: string
  quantity: number

  // UI state
  cameraView: CameraView
  activeZone: ActiveZone
  activeTool: ActiveTool
  isAutoRotating: boolean
  isFullscreen: boolean
  selectedDecalId: string | null
  isLoading: boolean
  priceBreakdown: PriceBreakdown | null

  // History
  history: DesignHistory

  // Actions
  setCategory: (c: ClothingCategory) => void
  setFabric: (f: FabricOption) => void
  setPattern: (p: PatternOption | null) => void
  setZoneColor: (zone: GarmentZone, color: ColorOption) => void
  setAllZoneColor: (color: ColorOption) => void
  addTextDecal: (d: TextDecal) => void
  updateTextDecal: (id: string, updates: Partial<TextDecal>) => void
  removeTextDecal: (id: string) => void
  addImageDecal: (d: ImageDecal) => void
  updateImageDecal: (id: string, updates: Partial<ImageDecal>) => void
  removeImageDecal: (id: string) => void
  setSize: (s: string) => void
  setQuantity: (q: number) => void
  setCameraView: (v: CameraView) => void
  setActiveZone: (z: ActiveZone) => void
  setActiveTool: (t: ActiveTool) => void
  toggleAutoRotate: () => void
  toggleFullscreen: () => void
  setSelectedDecalId: (id: string | null) => void
  setLoading: (b: boolean) => void
  setPriceBreakdown: (p: PriceBreakdown | null) => void
  undo: () => void
  redo: () => void
  resetDesign: () => void
  getDesignConfig: () => DesignConfig
}

export const useDesignStore = create<DesignStore>()(
  subscribeWithSelector((set, get) => ({
    category: 'tshirt',
    fabric: DEFAULT_FABRIC,
    pattern: null,
    zoneColors: { ...DEFAULT_COLORS },
    textDecals: [],
    imageDecals: [],
    size: 'M',
    quantity: 1,
    cameraView: 'front',
    activeZone: null,
    activeTool: null,
    isAutoRotating: true,
    isFullscreen: false,
    selectedDecalId: null,
    isLoading: false,
    priceBreakdown: null,
    history: { past: [], future: [] },

    setCategory: (category) => set({ category, zoneColors: { ...DEFAULT_COLORS }, textDecals: [], imageDecals: [] }),
    setFabric: (fabric) => set({ fabric }),
    setPattern: (pattern) => set({ pattern }),

    setZoneColor: (zone, color) =>
      set((s) => ({
        zoneColors: { ...s.zoneColors, [zone]: color },
      })),

    setAllZoneColor: (color) =>
      set({
        zoneColors: Object.fromEntries(
          (Object.keys(DEFAULT_COLORS) as GarmentZone[]).map((k) => [k, color])
        ) as Record<GarmentZone, ColorOption>,
      }),

    addTextDecal: (d) => set((s) => ({ textDecals: [...s.textDecals, d] })),
    updateTextDecal: (id, updates) =>
      set((s) => ({
        textDecals: s.textDecals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      })),
    removeTextDecal: (id) =>
      set((s) => ({ textDecals: s.textDecals.filter((d) => d.id !== id) })),

    addImageDecal: (d) => set((s) => ({ imageDecals: [...s.imageDecals, d] })),
    updateImageDecal: (id, updates) =>
      set((s) => ({
        imageDecals: s.imageDecals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      })),
    removeImageDecal: (id) =>
      set((s) => ({ imageDecals: s.imageDecals.filter((d) => d.id !== id) })),

    setSize: (size) => set({ size }),
    setQuantity: (quantity) => set({ quantity: Math.max(1, quantity) }),
    setCameraView: (cameraView) => set({ cameraView }),
    setActiveZone: (activeZone) => set({ activeZone }),
    setActiveTool: (activeTool) => set({ activeTool }),
    toggleAutoRotate: () => set((s) => ({ isAutoRotating: !s.isAutoRotating })),
    toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
    setSelectedDecalId: (selectedDecalId) => set({ selectedDecalId }),
    setLoading: (isLoading) => set({ isLoading }),
    setPriceBreakdown: (priceBreakdown) => set({ priceBreakdown }),

    undo: () =>
      set((s) => {
        const past = [...s.history.past]
        const prev = past.pop()
        if (!prev) return s
        return {
          ...prev,
          history: { past, future: [s, ...s.history.future] },
        } as Partial<DesignStore>
      }),

    redo: () =>
      set((s) => {
        const future = [...s.history.future]
        const next = future.shift()
        if (!next) return s
        return {
          ...next,
          history: { past: [...s.history.past, s], future },
        } as Partial<DesignStore>
      }),

    resetDesign: () =>
      set({
        fabric: DEFAULT_FABRIC,
        pattern: null,
        zoneColors: { ...DEFAULT_COLORS },
        textDecals: [],
        imageDecals: [],
        size: 'M',
        quantity: 1,
        selectedDecalId: null,
        history: { past: [], future: [] },
      }),

    getDesignConfig: (): DesignConfig => {
      const s = get()
      return {
        category: s.category,
        fabric: s.fabric,
        pattern: s.pattern ?? undefined,
        zoneColors: s.zoneColors,
        textDecals: s.textDecals,
        imageDecals: s.imageDecals,
        size: s.size,
        quantity: s.quantity,
      }
    },
  }))
)
