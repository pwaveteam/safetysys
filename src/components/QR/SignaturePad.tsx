import React, { useRef, useEffect, useState } from "react"
import { X, RotateCcw } from "lucide-react"

interface SignaturePadProps {
onSave: (dataUrl: string) => void
onClose: () => void
title?: string
}

export default function SignaturePad({ onSave, onClose, title = "서명" }: SignaturePadProps) {
const canvasRef = useRef<HTMLCanvasElement>(null)
const [isDrawing, setIsDrawing] = useState(false)
const [hasDrawn, setHasDrawn] = useState(false)

useEffect(() => {
const canvas = canvasRef.current
if (!canvas) return
const ctx = canvas.getContext("2d")
if (!ctx) return
const rect = canvas.getBoundingClientRect()
canvas.width = rect.width * 2
canvas.height = rect.height * 2
ctx.scale(2, 2)
ctx.fillStyle = "#ffffff"
ctx.fillRect(0, 0, rect.width, rect.height)
ctx.strokeStyle = "#000000"
ctx.lineWidth = 2
ctx.lineCap = "round"
ctx.lineJoin = "round"
}, [])

const getPosition = (e: React.TouchEvent | React.MouseEvent) => {
const canvas = canvasRef.current
if (!canvas) return { x: 0, y: 0 }
const rect = canvas.getBoundingClientRect()
if ("touches" in e) {
return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
} else {
return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}
}

const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
e.preventDefault()
const canvas = canvasRef.current
const ctx = canvas?.getContext("2d")
if (!ctx) return
const pos = getPosition(e)
ctx.beginPath()
ctx.moveTo(pos.x, pos.y)
setIsDrawing(true)
}

const draw = (e: React.TouchEvent | React.MouseEvent) => {
e.preventDefault()
if (!isDrawing) return
const canvas = canvasRef.current
const ctx = canvas?.getContext("2d")
if (!ctx) return
const pos = getPosition(e)
ctx.lineTo(pos.x, pos.y)
ctx.stroke()
setHasDrawn(true)
}

const stopDrawing = () => setIsDrawing(false)

const clearCanvas = () => {
const canvas = canvasRef.current
const ctx = canvas?.getContext("2d")
if (!ctx || !canvas) return
const rect = canvas.getBoundingClientRect()
ctx.fillStyle = "#ffffff"
ctx.fillRect(0, 0, rect.width, rect.height)
setHasDrawn(false)
}

const saveSignature = () => {
if (!hasDrawn) { alert("서명을 입력해주세요."); return }
const canvas = canvasRef.current
if (!canvas) return
onSave(canvas.toDataURL("image/png"))
}

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-lg w-[90%] max-w-sm mx-4">
<div className="flex items-center justify-between p-3 border-b border-gray-200">
<span className="text-sm font-semibold text-gray-800">{title}</span>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]"><X size={20} /></button>
</div>
<div className="p-3">
<div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
<canvas ref={canvasRef} className="w-full h-40 touch-none" onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} />
</div>
<p className="text-[10px] text-gray-400 text-center mt-1">위 영역에 서명해주세요</p>
</div>
<div className="flex gap-2 p-3 border-t border-gray-200">
<button onClick={clearCanvas} className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-xs font-medium flex items-center justify-center gap-1"><RotateCcw size={14} />다시 그리기</button>
<button onClick={saveSignature} className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-medium">확인</button>
</div>
</div>
</div>
)
}