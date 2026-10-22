import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Type, ImageIcon, Trash2, Move, RotateCw, ZoomIn, Plus } from 'lucide-react'
import { useDesignStore } from '@/store/designStore'
import { useDropzone } from 'react-dropzone'
import { FONTS } from '@/utils/designData'
import { clsx } from 'clsx'
import { v4 as uuidv4 } from 'uuid'
import type { TextDecal, ImageDecal } from '@/types'

type DecalZone = 'front' | 'back' | 'left_sleeve' | 'right_sleeve' | 'chest'

const ZONES: { id: DecalZone; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'chest', label: 'Chest' },
  { id: 'left_sleeve', label: 'L. Sleeve' },
  { id: 'right_sleeve', label: 'R. Sleeve' },
]

export function DecalEditor() {
  const [tab, setTab] = useState<'text' | 'image'>('text')
  const [textInput, setTextInput] = useState('YOUR TEXT')
  const [textColor, setTextColor] = useState('#ffffff')
  const [textFont, setTextFont] = useState('Inter')
  const [textSize, setTextSize] = useState(24)
  const [selectedZone, setSelectedZone] = useState<DecalZone>('front')

  const { textDecals, imageDecals, addTextDecal, removeTextDecal, addImageDecal, removeImageDecal, selectedDecalId, setSelectedDecalId } = useDesignStore()

  const handleAddText = () => {
    if (!textInput.trim()) return
    const decal: TextDecal = {
      id: uuidv4(),
      text: textInput,
      font: textFont,
      color: textColor,
      size: textSize,
      position: [0, 0],
      rotation: 0,
      zone: selectedZone,
    }
    addTextDecal(decal)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const url = URL.createObjectURL(file)
      const decal: ImageDecal = {
        id: uuidv4(),
        url,
        position: [0, 0],
        size: 80,
        rotation: 0,
        opacity: 1,
        zone: selectedZone,
      }
      addImageDecal(decal)
    })
  }, [addImageDecal, selectedZone])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
  })

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
        <button
          onClick={() => setTab('text')}
          className={clsx('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all', tab === 'text' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white')}
        >
          <Type size={13} /> Text
        </button>
        <button
          onClick={() => setTab('image')}
          className={clsx('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all', tab === 'image' ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white')}
        >
          <ImageIcon size={13} /> Image
        </button>
      </div>

      {/* Zone */}
      <div>
        <p className="text-xs text-zinc-500 mb-1.5">Placement Zone</p>
        <div className="flex gap-1 flex-wrap">
          {ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={clsx('px-2 py-1 rounded-lg text-xs transition-all', selectedZone === z.id ? 'bg-brand-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200')}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'text' && (
        <div className="space-y-3">
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text..."
            className="input text-sm"
            maxLength={50}
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Font</p>
              <select
                value={textFont}
                onChange={(e) => setTextFont(e.target.value)}
                className="input text-xs py-2"
              >
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Color</p>
              <div className="flex gap-2 items-center">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-xs text-zinc-400">{textColor}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-1">Size: {textSize}px</p>
            <input type="range" min={12} max={72} value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} />
          </div>

          <button onClick={handleAddText} className="btn-primary w-full justify-center text-sm">
            <Plus size={14} /> Add Text
          </button>
        </div>
      )}

      {tab === 'image' && (
        <div className="space-y-3">
          <div
            {...getRootProps()}
            className={clsx(
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
              isDragActive ? 'border-brand-500 bg-brand-600/10' : 'border-zinc-700 hover:border-zinc-500'
            )}
          >
            <input {...getInputProps()} />
            <ImageIcon size={24} className="mx-auto text-zinc-500 mb-2" />
            <p className="text-xs text-zinc-400">Drop image or click to upload</p>
            <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG, SVG up to 5MB</p>
          </div>
        </div>
      )}

      {/* Active decals list */}
      {(textDecals.length > 0 || imageDecals.length > 0) && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Design Elements</p>
          <div className="space-y-1.5">
            {textDecals.map((d) => (
              <div key={d.id} className={clsx('flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer', selectedDecalId === d.id ? 'bg-brand-600/15 border-brand-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600')} onClick={() => setSelectedDecalId(d.id)}>
                <div className="flex items-center gap-2">
                  <Type size={12} className="text-zinc-500" />
                  <span className="text-xs text-zinc-300 truncate max-w-[120px]">{d.text}</span>
                  <span className="text-[10px] text-zinc-600">{d.zone}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeTextDecal(d.id) }} className="text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {imageDecals.map((d) => (
              <div key={d.id} className={clsx('flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer', selectedDecalId === d.id ? 'bg-brand-600/15 border-brand-500/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600')} onClick={() => setSelectedDecalId(d.id)}>
                <div className="flex items-center gap-2">
                  <img src={d.url} alt="" className="w-6 h-6 rounded object-cover" />
                  <span className="text-xs text-zinc-300">Image</span>
                  <span className="text-[10px] text-zinc-600">{d.zone}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeImageDecal(d.id) }} className="text-zinc-600 hover:text-red-400 transition-colors">
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
