import React, { useState } from "react"
import { AlertTriangle, Camera, X, CheckCircle } from "lucide-react"

export default function PublicNearMiss() {
  const [form, setForm] = useState({ place: "", danger: "", registrant: "", date: new Date().toISOString().split("T")[0] })
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handlePhoto = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader()
          reader.onload = (ev) => setPhotos(prev => [...prev, ev.target?.result as string])
          reader.readAsDataURL(file)
        })
      }
    }
    input.click()
  }

  const handleRemovePhoto = (index: number) => setPhotos(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!form.place || !form.danger || !form.registrant) { alert("필수 항목을 입력해주세요."); return }
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleReset = () => {
    setForm({ place: "", danger: "", registrant: "", date: new Date().toISOString().split("T")[0] })
    setPhotos([])
    setIsSuccess(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-1">등록 완료</h2>
        <p className="text-sm text-gray-500 mb-6">아차사고가 등록되었습니다.</p>
        <button onClick={handleReset} className="px-6 py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg">새로 작성</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <AlertTriangle size={24} />
          <h1 className="text-base font-semibold">아차사고 등록</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">

          <div className="p-3 flex items-center">
            <label className="w-20 text-sm text-gray-500 shrink-0">등록일</label>
            <input
              type="date"
              value={form.date}
              onChange={e => handleChange("date", e.target.value)}
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
            />
          </div>


          <div className="p-3 flex items-center">
            <label className="w-20 text-sm text-gray-500 shrink-0">장소 *</label>
            <input
              type="text"
              placeholder="발생 장소"
              value={form.place}
              onChange={e => handleChange("place", e.target.value)}
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>

    
          <div className="p-3 flex items-center">
            <label className="w-20 text-sm text-gray-500 shrink-0">등록인 *</label>
            <input
              type="text"
              placeholder="이름"
              value={form.registrant}
              onChange={e => handleChange("registrant", e.target.value)}
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>

          {/* 유해위험요인 */}
          <div className="p-3">
            <label className="text-sm text-gray-500 mb-2 block">유해위험요인 *</label>
            <textarea
              placeholder="위험요인을 상세히 입력"
              value={form.danger}
              onChange={e => handleChange("danger", e.target.value)}
              className="w-full text-sm text-gray-800 bg-gray-50 rounded-lg p-3 outline-none placeholder:text-gray-300 min-h-[100px] resize-none border-0"
            />
          </div>

          {/* 사진 */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-500">현장 사진</label>
              <button onClick={handlePhoto} className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg">
                <Camera size={14} />추가
              </button>
            </div>
            {photos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {photos.map((photo, i) => (
                  <div key={i} className="relative">
                    <img src={photo} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <button onClick={() => handleRemovePhoto(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300">사진 없음</p>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg disabled:opacity-50">
          {isSubmitting ? "등록 중..." : "등록"}
        </button>
      </div>
    </div>
  )
}