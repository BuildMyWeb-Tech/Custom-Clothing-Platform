import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scene } from '@/components/3d/Scene'
import { useDesignStore } from '@/store/designStore'
import { useCartStore } from '@/store/cartStore'
import { calculatePrice, formatPrice } from '@/utils/pricing'
import { CLOTHING_CATEGORIES, COLORS, FABRICS, SIZES, FONTS } from '@/utils/designData'
import { useCatalog } from '@/hooks/useCatalog'
import { HexColorPicker } from 'react-colorful'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import type { GarmentZone, TextDecal, ImageDecal } from '@/types'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Shirt, Palette, Layers, Type, ShoppingCart,
  Minus, Plus, Sparkles, ImageIcon, Trash2, ChevronDown,
  RotateCcw, Check, RefreshCcw,
} from 'lucide-react'
import { clsx } from 'clsx'

type DesignStep = 1 | 2 | 3 | 4 | 5

const STEP_INFO: { step: DesignStep; label: string; hint: string }[] = [
  { step: 1, label: 'Garment', hint: 'What would you like to design?' },
  { step: 2, label: 'Color',   hint: 'Choose your colors' },
  { step: 3, label: 'Fabric',  hint: 'Pick the material & texture' },
  { step: 4, label: 'Design',  hint: 'Add text or artwork' },
  { step: 5, label: 'Order',   hint: 'Size, quantity & add to cart' },
]

const ZONE_LABELS: Record<GarmentZone, string> = {
  body: 'Body', collar: 'Collar', cuffs: 'Cuffs', sleeves: 'Sleeves',
  buttons: 'Buttons', pockets: 'Pockets', stitching: 'Stitching', inner_lining: 'Lining',
}

// ─── Step 1: Garment ──────────────────────────────────────────────────────────
function StepGarment() {
  const { category, setCategory } = useDesignStore()
  const { categories } = useCatalog()
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={clsx(
              'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200',
              category === cat.id
                ? 'bg-brand-600/20 border-brand-500/60 text-brand-300 shadow-glow'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            )}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
            <span className="text-xs text-zinc-500">from ₹{cat.basePrice.toLocaleString('en-IN')}</span>
            {category === cat.id && (
              <span className="text-[10px] bg-brand-600/30 text-brand-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check size={9} /> Selected
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Color ─────────────────────────────────────────────────────────────
function StepColor() {
  const { zoneColors, activeZone, setZoneColor, setAllZoneColor, setActiveZone } = useDesignStore()
  const [showPicker, setShowPicker] = useState(false)
  const [customHex, setCustomHex] = useState('#ffffff')
  const { colors } = useCatalog()

  return (
    <div className="space-y-4">
      {/* Zone selector */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Zone</p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setActiveZone(null)}
            className={clsx('py-2 px-3 rounded-xl text-xs transition-all', !activeZone ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600')}
          >
            All Zones
          </button>
          {(Object.keys(ZONE_LABELS) as GarmentZone[]).map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={clsx('py-2 px-3 rounded-xl text-xs transition-all flex items-center justify-between', activeZone === zone ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600')}
            >
              <span>{ZONE_LABELS[zone]}</span>
              <span className="w-3.5 h-3.5 rounded-full border border-zinc-600 flex-shrink-0" style={{ background: zoneColors[zone]?.hex }} />
            </button>
          ))}
        </div>
      </div>

      {/* Color swatches */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Color Palette</p>
        <div className="grid grid-cols-6 gap-2">
          {(colors as any[]).map((color: any) => {
            const currentColor = activeZone ? zoneColors[activeZone]?.id : null
            const isSelected = currentColor === color.id
            return (
              <button
                key={color.id}
                title={color.name}
                onClick={() => activeZone ? setZoneColor(activeZone, color) : setAllZoneColor(color)}
                className={clsx(
                  'w-10 h-10 rounded-xl transition-all hover:scale-110 hover:shadow-glow relative group',
                  isSelected && 'ring-2 ring-brand-400 ring-offset-2 ring-offset-zinc-950 scale-110'
                )}
                style={{ background: color.hex, border: '1.5px solid rgba(255,255,255,0.15)' }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={14} className={color.hex === '#FFFFFF' || color.hex === '#FFFFF0' || color.hex === '#FFFDD0' ? 'text-zinc-800' : 'text-white'} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom color */}
      <div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <div className="w-4 h-4 rounded border border-zinc-600" style={{ background: customHex }} />
          Custom color
          <ChevronDown size={12} className={clsx('transition-transform', showPicker && 'rotate-180')} />
        </button>
        {showPicker && (
          <div className="mt-3">
            <HexColorPicker
              color={customHex}
              onChange={(c) => {
                setCustomHex(c)
                const co = { id: 'custom', name: 'Custom', hex: c }
                activeZone ? setZoneColor(activeZone, co) : setAllZoneColor(co)
              }}
            />
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          const white = { id: 'white', name: 'Pure White', hex: '#FFFFFF' }
          setAllZoneColor(white)
        }}
        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
      >
        <RefreshCcw size={11} /> Reset all to white
      </button>
    </div>
  )
}

// ─── Step 3: Fabric ───────────────────────────────────────────────────────────
function StepFabric() {
  const { fabric, setFabric } = useDesignStore()
  const { fabrics } = useCatalog()
  return (
    <div className="space-y-2">
      {(fabrics as any[]).map((f: any) => (
        <button
          key={f.id}
          onClick={() => setFabric(f)}
          className={clsx(
            'w-full text-left p-4 rounded-2xl border transition-all',
            fabric.id === f.id
              ? 'bg-brand-600/15 border-brand-500/40 text-white'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">{f.name}</span>
            {f.priceMultiplier > 1 && (
              <span className="text-xs text-amber-400">+{Math.round((f.priceMultiplier - 1) * 100)}%</span>
            )}
            {fabric.id === f.id && <Check size={14} className="text-brand-400" />}
          </div>
          <p className="text-xs text-zinc-500">{f.description}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-[10px] text-zinc-600">Roughness {Math.round(f.roughness * 100)}%</span>
            <span className="text-[10px] text-zinc-600">Sheen {Math.round(f.metalness * 100)}%</span>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Step 4: Design (Decal Editor) ───────────────────────────────────────────
function StepDesign() {
  const [tab, setTab] = useState<'text' | 'image'>('text')
  const [textInput, setTextInput] = useState('YOUR TEXT')
  const [textColor, setTextColor] = useState('#1a1a1a')
  const [textFont, setTextFont] = useState('Inter')
  const [textSize, setTextSize] = useState(24)
  const [selectedZone, setSelectedZone] = useState<'front' | 'back' | 'chest' | 'left_sleeve' | 'right_sleeve'>('front')
  const { textDecals, imageDecals, addTextDecal, removeTextDecal, addImageDecal, removeImageDecal } = useDesignStore()

  const DECZONES = [
    { id: 'front' as const, label: 'Front' },
    { id: 'back' as const, label: 'Back' },
    { id: 'chest' as const, label: 'Chest' },
    { id: 'left_sleeve' as const, label: 'L.Sleeve' },
    { id: 'right_sleeve' as const, label: 'R.Sleeve' },
  ]

  const handleAddText = () => {
    if (!textInput.trim()) return
    const decal: TextDecal = {
      id: uuidv4(), text: textInput, font: textFont, color: textColor,
      size: textSize, position: [0, 0], rotation: 0, zone: selectedZone,
    }
    addTextDecal(decal)
    toast.success('Text added to garment!')
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      const decal: ImageDecal = {
        id: uuidv4(), url, position: [0, 0], size: 80, rotation: 0, opacity: 1, zone: selectedZone,
      }
      addImageDecal(decal)
      toast.success('Image added to garment!')
    })
  }, [addImageDecal, selectedZone])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxSize: 5 * 1024 * 1024,
  })

  return (
    <div className="space-y-4">
      {/* Text / Image tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
        {(['text', 'image'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all', tab === t ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white')}
          >
            {t === 'text' ? <Type size={13} /> : <ImageIcon size={13} />}
            {t === 'text' ? 'Add Text' : 'Upload Image'}
          </button>
        ))}
      </div>

      {/* Placement zone */}
      <div>
        <p className="text-xs text-zinc-500 mb-1.5">Placement</p>
        <div className="flex gap-1 flex-wrap">
          {DECZONES.map((z) => (
            <button key={z.id} onClick={() => setSelectedZone(z.id)}
              className={clsx('px-2.5 py-1 rounded-lg text-xs transition-all', selectedZone === z.id ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200')}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'text' && (
        <div className="space-y-3">
          <input
            value={textInput} onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text..." className="input text-sm" maxLength={50}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Font</p>
              <select value={textFont} onChange={(e) => setTextFont(e.target.value)} className="input text-xs py-2">
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Color</p>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-xs text-zinc-400">{textColor}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Size: {textSize}px</p>
            <input type="range" min={12} max={72} value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-full" />
          </div>
          <button onClick={handleAddText} className="btn-primary w-full justify-center text-sm">
            <Type size={14} /> Add Text to Garment
          </button>
        </div>
      )}

      {tab === 'image' && (
        <div
          {...getRootProps()}
          className={clsx('border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all', isDragActive ? 'border-brand-500 bg-brand-600/10' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50')}
        >
          <input {...getInputProps()} />
          <ImageIcon size={28} className="mx-auto text-zinc-500 mb-3" />
          <p className="text-sm text-zinc-300 font-medium mb-1">Drop image or click to upload</p>
          <p className="text-xs text-zinc-600">PNG, JPG, SVG · max 5 MB</p>
        </div>
      )}

      {/* Active elements */}
      {(textDecals.length > 0 || imageDecals.length > 0) && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">On Garment ({textDecals.length + imageDecals.length})</p>
          <div className="space-y-1.5">
            {textDecals.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Type size={12} className="text-zinc-500" />
                  <span className="text-xs text-zinc-300 truncate max-w-[120px]">{d.text}</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">{d.zone}</span>
                </div>
                <button onClick={() => removeTextDecal(d.id)} className="text-zinc-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {imageDecals.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <img src={d.url} alt="" className="w-6 h-6 rounded object-cover" />
                  <span className="text-xs text-zinc-300">Image</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">{d.zone}</span>
                </div>
                <button onClick={() => removeImageDecal(d.id)} className="text-zinc-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 5: Order ────────────────────────────────────────────────────────────
function StepOrder({ onAddToCart }: { onAddToCart: () => void }) {
  const { category, fabric, zoneColors, textDecals, imageDecals, size, quantity, setSize, setQuantity, getDesignConfig } = useDesignStore()
  const [priceExpanded, setPriceExpanded] = useState(true)
  const { categories: dynCats } = useCatalog()

  const designConfig = getDesignConfig()
  const price = calculatePrice(designConfig)
  const categoryInfo = dynCats.find((c: any) => c.id === category) ?? CLOTHING_CATEGORIES.find((c) => c.id === category)

  return (
    <div className="space-y-4">
      {/* Size */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Select Size</p>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => setSize(s)}
              className={clsx('py-2.5 rounded-xl border text-sm font-medium transition-all', size === s ? 'bg-brand-600 border-brand-500 text-white shadow-glow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200')}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-zinc-600 flex justify-between px-1">
          <span>XS: 32-34"</span><span>S: 35-37"</span><span>M: 38-40"</span><span>L: 41-43"</span>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quantity</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 flex items-center justify-center transition-colors">
            <Minus size={14} className="text-white" />
          </button>
          <span className="text-white font-semibold text-xl w-8 text-center">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
            <Plus size={14} className="text-white" />
          </button>
          {quantity >= 3 && (
            <span className="text-xs text-emerald-400 ml-1">
              {quantity >= 10 ? '15%' : quantity >= 5 ? '8%' : '4%'} bulk discount
            </span>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <button onClick={() => setPriceExpanded(!priceExpanded)}
          className="w-full flex items-center justify-between p-3.5 text-sm text-zinc-300 hover:text-white transition-colors">
          <span className="font-medium">Price Breakdown</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-400 font-bold">{formatPrice(price.total)}</span>
            <ChevronDown size={14} className={clsx('transition-transform', priceExpanded && 'rotate-180')} />
          </div>
        </button>
        {priceExpanded && (
          <div className="px-4 pb-4 space-y-2 border-t border-zinc-800">
            <div className="flex justify-between text-xs pt-3">
              <span className="text-zinc-500">Base ({categoryInfo?.label})</span>
              <span className="text-zinc-300">{formatPrice(price.basePrice)}</span>
            </div>
            {price.fabricSurcharge > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Fabric ({fabric.name})</span>
                <span className="text-amber-400">+{formatPrice(price.fabricSurcharge)}</span>
              </div>
            )}
            {price.designSurcharge > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Design elements</span>
                <span className="text-amber-400">+{formatPrice(price.designSurcharge)}</span>
              </div>
            )}
            {price.quantityDiscount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Bulk discount</span>
                <span className="text-emerald-400">−{formatPrice(price.quantityDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-zinc-800 mt-1">
              <span className="text-white">Total</span>
              <span className="text-brand-400 text-base">{formatPrice(price.total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">{fabric.name}</span>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">Size {size}</span>
        {textDecals.length > 0 && <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">{textDecals.length} text</span>}
        {imageDecals.length > 0 && <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">{imageDecals.length} image</span>}
      </div>

      {/* Add to cart */}
      <button onClick={onAddToCart} className="btn-primary w-full justify-center py-4 text-base shadow-glow">
        <ShoppingCart size={18} />
        Add to Cart · {formatPrice(price.total)}
      </button>
      <p className="text-xs text-zinc-600 text-center">Free shipping above ₹2,999 · 48h production</p>
    </div>
  )
}

// ─── Main DesignerPage ────────────────────────────────────────────────────────
export default function DesignerPage() {
  const [step, setStep] = useState<DesignStep>(1)
  const { category, getDesignConfig, isAutoRotating, toggleAutoRotate, toggleFullscreen, setCameraView, cameraView, resetDesign } = useDesignStore()
  const { addItem, toggleCart } = useCartStore()
  const { categories: dynamicCategories } = useCatalog()

  const info = STEP_INFO[step - 1]
  const categoryInfo = dynamicCategories.find((c: any) => c.id === category) ?? CLOTHING_CATEGORIES.find((c) => c.id === category)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') useDesignStore.getState().undo()
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) useDesignStore.getState().redo()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleAddToCart = () => {
    const designConfig = getDesignConfig()
    const price = calculatePrice(designConfig)
    addItem({
      id: uuidv4(),
      product: {
        _id: category,
        name: categoryInfo?.label ?? 'Custom Garment',
        category,
        description: `Custom ${categoryInfo?.label}`,
        basePrice: categoryInfo?.basePrice ?? 999,
        images: [], availableSizes: [], availableFabrics: [],
        isActive: true, rating: 5, reviewCount: 0,
      },
      designConfig,
      priceBreakdown: price,
      quantity: designConfig.quantity,
    })
    toast.success('Added to cart!', { icon: '🛒' })
    setTimeout(() => toggleCart(), 300)
  }

  const stepContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.18 }}
        className="flex-1 overflow-y-auto hide-scrollbar p-4"
      >
        {step === 1 && <StepGarment />}
        {step === 2 && <StepColor />}
        {step === 3 && <StepFabric />}
        {step === 4 && <StepDesign />}
        {step === 5 && <StepOrder onAddToCart={handleAddToCart} />}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="flex flex-col bg-zinc-950 h-screen overflow-hidden">
      {/* ── Top Header ── */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800/60 z-20">
        <Link to="/" className="btn-ghost text-sm flex-shrink-0">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="w-px h-5 bg-zinc-800 flex-shrink-0" />

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Sparkles size={15} className="text-brand-400" />
          <span className="font-display font-semibold text-white text-sm hidden sm:block">3D Studio</span>
        </div>

        {/* Step indicator — center */}
        <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
          {STEP_INFO.map(({ step: s, label }) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className="flex items-center gap-1 group"
            >
              <div className={clsx(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                step === s ? 'bg-brand-600 text-white shadow-glow' : step > s ? 'bg-emerald-600/70 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'
              )}>
                {step > s ? <Check size={12} /> : s}
              </div>
              <span className={clsx('text-xs font-medium hidden md:block', step === s ? 'text-white' : 'text-zinc-600')}>
                {label}
              </span>
              {s < 5 && <div className="w-4 h-px bg-zinc-800 mx-0.5 hidden md:block" />}
            </button>
          ))}
        </div>

        {/* Camera controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {(['front', 'back', 'left', 'right'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setCameraView(v)}
              className={clsx('px-2 py-1 rounded-lg text-xs font-medium transition-all hidden lg:block', cameraView === v ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300')}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={toggleAutoRotate} title="Toggle auto-rotate"
            className={clsx('btn-ghost text-xs', isAutoRotating && 'text-brand-400')}>
            <RotateCcw size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─ Left Step Panel (hidden on small screens) ─ */}
        <aside className="hidden md:flex flex-col w-80 bg-zinc-950 border-r border-zinc-800/60 flex-shrink-0">
          {/* Step title */}
          <div className="px-5 py-4 border-b border-zinc-800/40">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-brand-400 bg-brand-600/15 w-5 h-5 rounded-full flex items-center justify-center">{step}</span>
              <h2 className="font-semibold text-white">{info.label}</h2>
            </div>
            <p className="text-xs text-zinc-500 ml-7">{info.hint}</p>
          </div>

          {stepContent}

          {/* Nav buttons */}
          <div className="flex-shrink-0 p-4 border-t border-zinc-800/40 flex gap-2">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1) as DesignStep)}
              disabled={step === 1}
              className="btn-secondary flex-1 justify-center disabled:opacity-30"
            >
              <ArrowLeft size={15} /> Back
            </button>
            {step < 5 ? (
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1) as DesignStep)}
                className="btn-primary flex-1 justify-center shadow-glow"
              >
                Next <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center shadow-glow">
                <ShoppingCart size={15} /> Add to Cart
              </button>
            )}
          </div>
        </aside>

        {/* ─ 3D Canvas ─ */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <Scene height="100%" />

            {/* Canvas hints */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
              <div className="glass-dark px-3 py-1.5 rounded-full text-xs text-zinc-500">
                Drag to rotate · Scroll to zoom
              </div>
            </div>

            {/* Current garment badge */}
            <div className="absolute top-4 right-4 glass-dark px-3 py-1.5 rounded-full text-xs text-zinc-400 flex items-center gap-1.5">
              <span className="text-base leading-none">{categoryInfo?.icon}</span>
              {categoryInfo?.label}
            </div>
          </div>

          {/* ─ Mobile Bottom Sheet ─ */}
          <div className="md:hidden flex-shrink-0 bg-zinc-950 border-t border-zinc-800/60 max-h-[45vh] flex flex-col">
            {/* Mobile step tabs */}
            <div className="flex border-b border-zinc-800/40 overflow-x-auto hide-scrollbar">
              {STEP_INFO.map(({ step: s, label }) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={clsx(
                    'flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap',
                    step === s ? 'border-brand-500 text-brand-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {s}. {label}
                </button>
              ))}
            </div>

            {/* Mobile step content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-3">
              {step === 1 && <StepGarment />}
              {step === 2 && <StepColor />}
              {step === 3 && <StepFabric />}
              {step === 4 && <StepDesign />}
              {step === 5 && <StepOrder onAddToCart={handleAddToCart} />}
            </div>

            {/* Mobile nav */}
            <div className="flex gap-2 p-3 border-t border-zinc-800/40">
              <button onClick={() => setStep((s) => Math.max(1, s - 1) as DesignStep)} disabled={step === 1}
                className="btn-secondary flex-1 justify-center py-2 text-sm disabled:opacity-30">
                <ArrowLeft size={14} /> Back
              </button>
              {step < 5 ? (
                <button onClick={() => setStep((s) => Math.min(5, s + 1) as DesignStep)}
                  className="btn-primary flex-1 justify-center py-2 text-sm shadow-glow">
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center py-2 text-sm shadow-glow">
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
