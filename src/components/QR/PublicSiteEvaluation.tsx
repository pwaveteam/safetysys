import React, { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Button from "@/components/common/base/Button"
import { ClipboardCheck, Send, Plus, X, CheckCircle } from "lucide-react"
import SignatureSelector from "@/pages/PTW/SignatureModule/SignatureSelector"
import { SignatureInfo } from "@/pages/PTW/SignatureModule/types"

interface RiskRow { id: number; task: string; hazard: string; currentRisk: string; measure: string; checked: boolean }
interface InspectionRow { id: number; time: string; person: string; note: string }

const RISK_LEVELS = ["상", "중", "하"]
const INITIAL_QUESTIONS = [
{ id: 1, question: "처음 작업에 투입되는 작업자가 있는가?", key: "first_worker" },
{ id: 2, question: "처음 취급하는 공기구나 장비가 있는가?", key: "first_equipment" }
]

export default function PublicSiteEvaluation() {
const navigate = useNavigate()
const [isSubmitted, setIsSubmitted] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
const [formData, setFormData] = useState<{ teamName: string; signDate: string; teamMember?: SignatureInfo; safetyChecks: Record<string, string | boolean> }>({ teamName: "", signDate: "", safetyChecks: {} })
const [riskRows, setRiskRows] = useState<RiskRow[]>(Array.from({ length: 3 }, (_, i) => ({ id: i + 1, task: "", hazard: "", currentRisk: "", measure: "", checked: false })))
const [inspectionRows, setInspectionRows] = useState<InspectionRow[]>(Array.from({ length: 2 }, (_, i) => ({ id: i + 1, time: "", person: "", note: "" })))

const updateFormData = useCallback((updates: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...updates })), [])
const updateSafetyCheck = useCallback((key: string, value: string | boolean) => setFormData(prev => ({ ...prev, safetyChecks: { ...prev.safetyChecks, [key]: value } })), [])
const updateRiskRow = useCallback((id: number, key: keyof RiskRow, value: any) => setRiskRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row)), [])
const addRiskRow = useCallback(() => setRiskRows(prev => prev.length >= 10 ? prev : [...prev, { id: Date.now(), task: "", hazard: "", currentRisk: "", measure: "", checked: false }]), [])
const removeRiskRow = useCallback((id: number) => setRiskRows(prev => prev.filter(row => row.id !== id)), [])
const updateInspectionRow = useCallback((id: number, key: keyof InspectionRow, value: string) => setInspectionRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row)), [])
const addInspectionRow = useCallback(() => setInspectionRows(prev => prev.length >= 5 ? prev : [...prev, { id: Date.now(), time: "", person: "", note: "" }]), [])
const removeInspectionRow = useCallback((id: number) => setInspectionRows(prev => prev.filter(row => row.id !== id)), [])

const getRiskBadgeColor = (level: string) => level === "상" ? "bg-[#B65E5D] text-white" : level === "중" ? "bg-[#CAB359] text-white" : level === "하" ? "bg-[#80A16A] text-white" : "bg-gray-200 text-gray-600"

const handleSubmit = async () => {
if (!formData.teamName) { alert("작업팀(업체)을 입력해주세요."); return }
if (!formData.signDate) { alert("일자를 선택해주세요."); return }
setIsSubmitting(true)
await new Promise(resolve => setTimeout(resolve, 1000))
setIsSubmitting(false)
setIsSubmitted(true)
}

if (isSubmitted) {
return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
<div className="bg-white rounded-lg p-6 text-center max-w-sm w-full shadow-lg">
<CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
<h2 className="text-lg font-semibold text-gray-800 mb-2">제출 완료</h2>
<p className="text-sm text-gray-500 mb-4">현장 위험성평가가 제출되었습니다.</p>
<Button variant="action" onClick={() => navigate("/public/site-evaluation")} className="w-full">새 양식 작성</Button>
</div>
</div>
)
}

return (
<div className="min-h-screen bg-gray-50 pb-24">
<header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
<div className="flex items-center gap-2">
<ClipboardCheck size={24} />
<h1 className="text-base font-semibold">현장 위험성평가(JSA)</h1>
</div>
</header>

<main className="p-4 space-y-4">
<div className="bg-white rounded-lg border border-gray-200 p-4">
<p className="text-xs font-semibold text-gray-700 mb-3">기본정보</p>
<div className="grid grid-cols-2 gap-3">
<div><label className="text-[10px] text-gray-500 mb-1 block">일자 *</label><Input type="date" value={formData.signDate} onChange={e => updateFormData({ signDate: e.target.value })} className="w-full h-9 text-xs" /></div>
<div><label className="text-[10px] text-gray-500 mb-1 block">작업팀(업체) *</label><Input value={formData.teamName} onChange={e => updateFormData({ teamName: e.target.value })} className="w-full h-9 text-xs" placeholder="업체명" /></div>
</div>
<div className="mt-3">
<label className="text-[10px] text-gray-500 mb-1 block">작성자 서명</label>
<SignatureSelector value={formData.teamMember} onChange={person => updateFormData({ teamMember: person })} />
</div>
</div>

<div className="bg-white rounded-lg border border-gray-200 p-4">
<p className="text-xs font-semibold text-gray-700 mb-3">사전 확인</p>
{INITIAL_QUESTIONS.map(item => (
<div key={item.id} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
<p className="text-[11px] text-gray-700 mb-2">{item.id}. {item.question}</p>
<div className="flex items-center gap-4 mb-2">
<label className="flex items-center gap-1 text-[11px]"><Checkbox checked={formData.safetyChecks[`${item.key}_yes`] as boolean || false} onCheckedChange={v => updateSafetyCheck(`${item.key}_yes`, Boolean(v))} />네</label>
<label className="flex items-center gap-1 text-[11px]"><Checkbox checked={formData.safetyChecks[`${item.key}_no`] as boolean || false} onCheckedChange={v => updateSafetyCheck(`${item.key}_no`, Boolean(v))} />아니오</label>
</div>
<Input value={formData.safetyChecks[`${item.key}_action`] as string || ""} onChange={e => updateSafetyCheck(`${item.key}_action`, e.target.value)} className="h-8 text-xs" placeholder="조치사항" />
</div>
))}
</div>

<div className="bg-white rounded-lg border border-gray-200 p-4">
<div className="flex items-center justify-between mb-3">
<p className="text-xs font-semibold text-gray-700">위험분석</p>
<button onClick={addRiskRow} disabled={riskRows.length >= 10} className={`text-[11px] text-blue-600 flex items-center gap-1 ${riskRows.length >= 10 ? 'opacity-50' : ''}`}><Plus size={12} />추가</button>
</div>
<div className="space-y-3">
{riskRows.map((row, idx) => (
<div key={row.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-500 font-medium">#{idx + 1}</span>
<div className="flex items-center gap-1">
{RISK_LEVELS.map(level => (<button key={level} onClick={() => updateRiskRow(row.id, "currentRisk", row.currentRisk === level ? "" : level)} className={`text-[10px] px-2 py-1 rounded ${row.currentRisk === level ? getRiskBadgeColor(level) : 'bg-gray-100 text-gray-500'}`}>{level}</button>))}
<label className="flex items-center gap-1 text-[10px] ml-2"><Checkbox checked={row.checked} onCheckedChange={v => updateRiskRow(row.id, "checked", Boolean(v))} />확인</label>
{riskRows.length > 1 && <button onClick={() => removeRiskRow(row.id)} className="ml-1"><X size={14} className="text-gray-400" /></button>}
</div>
</div>
<div className="space-y-2">
<Input value={row.task} onChange={e => updateRiskRow(row.id, "task", e.target.value)} className="h-8 text-xs" placeholder="작업순서" />
<Input value={row.hazard} onChange={e => updateRiskRow(row.id, "hazard", e.target.value)} className="h-8 text-xs" placeholder="위험요인" />
<Input value={row.measure} onChange={e => updateRiskRow(row.id, "measure", e.target.value)} className="h-8 text-xs" placeholder="방호대책" />
</div>
</div>
))}
</div>
</div>

<div className="bg-white rounded-lg border border-gray-200 p-4">
<div className="flex items-center justify-between mb-3">
<p className="text-xs font-semibold text-gray-700">일일순회점검</p>
<button onClick={addInspectionRow} disabled={inspectionRows.length >= 5} className={`text-[11px] text-blue-600 flex items-center gap-1 ${inspectionRows.length >= 5 ? 'opacity-50' : ''}`}><Plus size={12} />추가</button>
</div>
<div className="space-y-3">
{inspectionRows.map((row, idx) => (
<div key={row.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-500 font-medium">#{idx + 1}</span>
{inspectionRows.length > 1 && <button onClick={() => removeInspectionRow(row.id)}><X size={14} className="text-gray-400" /></button>}
</div>
<div className="grid grid-cols-2 gap-2 mb-2">
<Input value={row.time} onChange={e => updateInspectionRow(row.id, "time", e.target.value)} className="h-8 text-xs" placeholder="시간" />
<Input value={row.person} onChange={e => updateInspectionRow(row.id, "person", e.target.value)} className="h-8 text-xs" placeholder="소속/성명" />
</div>
<Textarea value={row.note} onChange={e => updateInspectionRow(row.id, "note", e.target.value)} className="text-xs min-h-[60px]" placeholder="점검내용" />
</div>
))}
</div>
</div>
</main>

<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
<button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">{isSubmitting ? "제출 중..." : <><Send size={16} />제출하기</>}</button>
</div>
</div>
)
}