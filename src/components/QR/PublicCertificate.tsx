import React, { useState } from "react"
import { GraduationCap, Upload, X, CheckCircle, FileText } from "lucide-react"

type FileItem = { name: string; type: string; data: string }

export default function PublicCertificate() {
  const [form, setForm] = useState({ name: "", phone: "" })
  const [files, setFiles] = useState<FileItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleFileSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,.pdf"
    input.multiple = true
    input.onchange = (e) => {
      const selectedFiles = (e.target as HTMLInputElement).files
      if (selectedFiles) {
        Array.from(selectedFiles).forEach(file => {
          const reader = new FileReader()
          reader.onload = (ev) => setFiles(prev => [...prev, { name: file.name, type: file.type, data: ev.target?.result as string }])
          reader.readAsDataURL(file)
        })
      }
    }
    input.click()
  }

  const handleRemoveFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!form.name) { alert("이름을 입력해주세요."); return }
    if (files.length === 0) { alert("파일을 업로드해주세요."); return }
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleReset = () => {
    setForm({ name: "", phone: "" })
    setFiles([])
    setIsSuccess(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-1">제출 완료</h2>
        <p className="text-sm text-gray-500 mb-6">이수증이 제출되었습니다.</p>
        <button onClick={handleReset} className="px-6 py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg">새로 제출</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <GraduationCap size={24} />
          <h1 className="text-base font-semibold">이수증 제출</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <div className="p-3 flex items-center">
            <label className="w-20 text-sm text-gray-500 shrink-0">이름 *</label>
            <input
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="p-3 flex items-center">
            <label className="w-20 text-sm text-gray-500 shrink-0">연락처</label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={e => handleChange("phone", e.target.value)}
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-500">이수증 *</label>
              <button onClick={handleFileSelect} className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 rounded-lg">
                <Upload size={14} />파일 추가
              </button>
            </div>
            {files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    {file.type.startsWith("image/") ? (
                      <img src={file.data} alt="" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center"><FileText size={16} className="text-red-500" /></div>
                    )}
                    <span className="flex-1 text-xs text-gray-600 truncate">{file.name}</span>
                    <button onClick={() => handleRemoveFile(i)} className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={12} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300">이미지 또는 PDF</p>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg disabled:opacity-50">
          {isSubmitting ? "제출 중..." : "제출"}
        </button>
      </div>
    </div>
  )
}