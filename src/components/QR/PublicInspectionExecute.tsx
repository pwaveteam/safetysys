import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Camera, MessageSquare, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { inspectionPlanMockData, checklistTemplateMockData } from "@/data/mockData"

type CheckItem = { id: number; category: string; item: string; checked: boolean; note: string; photo?: string }

export default function PublicInspectionExecute() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [checkItems, setCheckItems] = useState<CheckItem[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const plan = (inspectionPlanMockData as any[]).find(p => String(p.id) === id)
    setPlanInfo(plan)
    
    // 중앙화된 데이터에서 체크리스트 가져오기
    const template = checklistTemplateMockData.find(t => t.id === Number(id))
    let itemId = 1
    const items: CheckItem[] = []
    if (template) {
      template.items.forEach(item => {
        items.push({ id: itemId++, category: template.name, item, checked: false, note: "" })
      })
    }
    setCheckItems(items)
  }, [id])

  const handleCheck = (itemId: number, value: boolean) => setCheckItems(prev => prev.map(item => item.id === itemId ? { ...item, checked: value } : item))
  const handleNoteChange = (itemId: number, note: string) => setCheckItems(prev => prev.map(item => item.id === itemId ? { ...item, note } : item))
  const handleRemovePhoto = (itemId: number) => setCheckItems(prev => prev.map(item => item.id === itemId ? { ...item, photo: undefined } : item))

  const handlePhoto = (itemId: number) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => setCheckItems(prev => prev.map(item => item.id === itemId ? { ...item, photo: ev.target?.result as string } : item))
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert("점검이 완료되었습니다.")
    navigate("/public/inspection")
  }

  const completedCount = checkItems.filter(item => item.checked).length
  const progress = checkItems.length ? Math.round((completedCount / checkItems.length) * 100) : 0
  const groupedItems = checkItems.reduce((acc, item) => { if (!acc[item.category]) acc[item.category] = []; acc[item.category].push(item); return acc }, {} as Record<string, CheckItem[]>)

  if (!planInfo) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500 text-sm">로딩 중...</p></div>

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft size={20} /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">{planInfo.planName}</h1>
            <p className="text-xs opacity-80">{completedCount}/{checkItems.length} ({progress}%)</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 mb-2">{category}</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className={`p-3 ${item.checked ? "bg-green-50" : ""}`}>
                  <div className="flex items-center gap-2">
                    <p className="flex-1 text-sm text-gray-800 leading-snug">{item.item}</p>
                    
                    <button onClick={() => handlePhoto(item.id)} className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600">
                      <Camera size={18} />
                    </button>
                    
                    <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className={`shrink-0 p-1.5 ${item.note ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}>
                      <MessageSquare size={18} />
                    </button>
                    
                    <Checkbox checked={item.checked} onCheckedChange={v => handleCheck(item.id, Boolean(v))} />
                  </div>
                  
                  {item.photo && (
                    <div className="mt-2 relative inline-block">
                      <img src={item.photo} alt="" className="w-16 h-16 object-cover rounded border" />
                      <button onClick={() => handleRemovePhoto(item.id)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={12} /></button>
                    </div>
                  )}
                  
                  {expandedId === item.id && (
                    <input
                      type="text"
                      placeholder="비고 입력"
                      value={item.note}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      className="mt-2 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)]"
                      autoFocus
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg disabled:opacity-50">
          {isSubmitting ? "제출 중..." : "점검 완료"}
        </button>
      </div>
    </div>
  )
}