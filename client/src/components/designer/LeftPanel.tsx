import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shirt, Palette, Layers, Type, ImageIcon, Settings2, ChevronRight } from 'lucide-react'
import { useDesignStore } from '@/store/designStore'
import { CLOTHING_CATEGORIES, COLORS, FABRICS, PATTERNS, SIZES } from '@/utils/designData'
import { HexColorPicker } from 'react-colorful'
import type { GarmentZone } from '@/types'
import { clsx } from 'clsx'

type Tab = 'garment' | 'colors' | 'fabric' | 'patterns' | 'size'

const ZONE_LABELS: Record<GarmentZone, string> = {
  body: 'Body',
  collar: 'Collar',
  cuffs: 'Cuffs',
  sleeves: 'Sleeves',
  buttons: 'Buttons',
  pockets: 'Pockets',
  stitching: 'Stitching',
  inner_lining: 'Inner Lining',
}

export function LeftPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('garment')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState('#ffffff')

  const {
    category, setCategory,
    fabric, setFabric,
    pattern, setPattern,
    zoneColors, setZoneColor, setAllZoneColor,
    size, setSize,
    activeZone, setActiveZone,
  } = useDesignStore()

  const tabs = [
    { id: 'garment' as Tab, icon: Shirt, label: 'Garment' },
    { id: 'colors' as Tab, icon: Palette, label: 'Colors' },
    { id: 'fabric' as Tab, icon: Layers, label: 'Fabric' },
    { id: 'patterns' as Tab, icon: Settings2, label: 'Pattern' },
    { id: 'size' as Tab, icon: Type, label: 'Size' },
  ]

  return (
    <div className="panel w-72 flex flex-col h-full overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-zinc-800/60 bg-zinc-950">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all duration-150',
              activeTab === tab.id
                ? 'text-brand-400 border-b-2 border-brand-500'
                : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
            )}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'garment' && (
            <motion.div key="garment" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Choose Garment</p>
              <div className="grid grid-cols-2 gap-2">
                {CLOTHING_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all duration-150',
                      category === cat.id
                        ? 'bg-brand-600/20 border-brand-500/50 text-brand-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    )}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-xs text-zinc-500">₹{cat.basePrice.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'colors' && (
            <motion.div key="colors" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              {/* Zone selector */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Color Zone</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setActiveZone(null)}
                    className={clsx('py-1.5 px-2 rounded-lg text-xs transition-all', !activeZone ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600')}
                  >
                    All Zones
                  </button>
                  {(Object.keys(ZONE_LABELS) as GarmentZone[]).map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setActiveZone(zone)}
                      className={clsx('py-1.5 px-2 rounded-lg text-xs transition-all flex items-center justify-between', activeZone === zone ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600')}
                    >
                      <span>{ZONE_LABELS[zone]}</span>
                      <span
                        className="w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0"
                        style={{ background: zoneColors[zone]?.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Palette</p>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((color) => {
                    const currentZoneColor = activeZone ? zoneColors[activeZone]?.id : null
                    const isSelected = currentZoneColor === color.id
                    return (
                      <button
                        key={color.id}
                        title={color.name}
                        onClick={() => {
                          if (activeZone) {
                            setZoneColor(activeZone, color)
                          } else {
                            setAllZoneColor(color)
                          }
                        }}
                        className={clsx('swatch', isSelected && 'swatch-selected')}
                        style={{ background: color.hex, border: `2px solid ${isSelected ? '#a855f7' : 'rgba(255,255,255,0.15)'}` }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Custom color picker */}
              <div>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <div className="w-4 h-4 rounded border border-zinc-600" style={{ background: customColor }} />
                  Custom Color
                  <ChevronRight size={12} className={clsx('transition-transform', showColorPicker && 'rotate-90')} />
                </button>
                {showColorPicker && (
                  <div className="mt-3">
                    <HexColorPicker
                      color={customColor}
                      onChange={(c) => {
                        setCustomColor(c)
                        const colorObj = { id: 'custom', name: 'Custom', hex: c }
                        if (activeZone) setZoneColor(activeZone, colorObj)
                        else setAllZoneColor(colorObj)
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'fabric' && (
            <motion.div key="fabric" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Choose Fabric</p>
              {FABRICS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFabric(f)}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border transition-all duration-150',
                    fabric.id === f.id
                      ? 'bg-brand-600/15 border-brand-500/40 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{f.name}</span>
                    {f.priceMultiplier > 1 && (
                      <span className="text-xs text-amber-400">+{Math.round((f.priceMultiplier - 1) * 100)}%</span>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-zinc-500">{f.description}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[10px] text-zinc-600">Roughness: {Math.round(f.roughness * 100)}%</span>
                    <span className="text-[10px] text-zinc-600">Sheen: {Math.round(f.metalness * 100)}%</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'patterns' && (
            <motion.div key="patterns" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Patterns & Prints</p>
              <div className="grid grid-cols-2 gap-2">
                {PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPattern(p.id === 'solid' ? null : p)}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all',
                      (pattern?.id === p.id || (p.id === 'solid' && !pattern))
                        ? 'bg-brand-600/20 border-brand-500/50 text-brand-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    )}
                  >
                    <div className={clsx('w-10 h-10 rounded-lg', getPatternPreview(p.id))} />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'size' && (
            <motion.div key="size" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Select Size</p>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={clsx(
                      'py-2.5 rounded-xl border text-sm font-medium transition-all',
                      size === s
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">Size Guide</p>
                <div className="space-y-1 text-xs text-zinc-400">
                  <div className="flex justify-between"><span>XS</span><span>32-34"</span></div>
                  <div className="flex justify-between"><span>S</span><span>35-37"</span></div>
                  <div className="flex justify-between"><span>M</span><span>38-40"</span></div>
                  <div className="flex justify-between"><span>L</span><span>41-43"</span></div>
                  <div className="flex justify-between"><span>XL</span><span>44-46"</span></div>
                  <div className="flex justify-between"><span>XXL</span><span>47-49"</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function getPatternPreview(id: string): string {
  const map: Record<string, string> = {
    solid: 'bg-zinc-700',
    stripes: 'bg-gradient-to-r from-zinc-300 via-zinc-700 to-zinc-300',
    checks: 'bg-zinc-400',
    plaid: 'bg-zinc-600',
    herringbone: 'bg-zinc-500',
    dots: 'bg-zinc-700',
    floral: 'bg-zinc-600',
    abstract: 'bg-gradient-to-br from-brand-600 to-purple-900',
  }
  return map[id] ?? 'bg-zinc-700'
}
