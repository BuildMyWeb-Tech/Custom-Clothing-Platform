import { motion } from 'framer-motion'
import {
  RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2,
  Play, Pause, RefreshCcw, Eye, EyeOff,
  ArrowLeft, ArrowRight, Undo2, Redo2
} from 'lucide-react'
import { useDesignStore } from '@/store/designStore'
import { clsx } from 'clsx'
import type { CameraView } from '@/store/designStore'

const VIEWS: { id: CameraView; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
]

export function BottomToolbar() {
  const {
    cameraView, setCameraView,
    isAutoRotating, toggleAutoRotate,
    isFullscreen, toggleFullscreen,
    resetDesign, undo, redo,
  } = useDesignStore()

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-dark flex items-center justify-between px-4 py-2.5 rounded-2xl mx-4 mb-3 shadow-premium"
    >
      {/* View Controls */}
      <div className="flex items-center gap-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setCameraView(v.id)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              cameraView === v.id
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-1">
        <ToolButton onClick={undo} title="Undo (Ctrl+Z)">
          <Undo2 size={15} />
        </ToolButton>
        <ToolButton onClick={redo} title="Redo (Ctrl+Y)">
          <Redo2 size={15} />
        </ToolButton>
        <div className="w-px h-5 bg-zinc-700 mx-1" />
        <ToolButton onClick={toggleAutoRotate} title={isAutoRotating ? 'Pause rotation' : 'Auto-rotate'} active={isAutoRotating}>
          {isAutoRotating ? <Pause size={15} /> : <Play size={15} />}
        </ToolButton>
        <ToolButton onClick={resetDesign} title="Reset design">
          <RefreshCcw size={15} />
        </ToolButton>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1">
        <ToolButton onClick={toggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </ToolButton>
      </div>
    </motion.div>
  )
}

function ToolButton({
  children, onClick, title, active,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150',
        active
          ? 'bg-brand-600/20 text-brand-400'
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
      )}
    >
      {children}
    </button>
  )
}
