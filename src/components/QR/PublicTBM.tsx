import React, { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Button from "@/components/common/base/Button"
import { ClipboardCheck, Plus, X, CheckCircle, Pencil } from "lucide-react"
import SignaturePad from "./SignaturePad"

interface AttendeeRow { id: number; name: string; health: string; isNew: boolean; signature?: string }
interface RiskRow { id: number; hazard: string; currentRisk: string; measure: string }
interface ProposalRow { id: number; hazard: string; solution: string; proposer: string }

const RISK_LEVELS = ["상", "중", "하"]
const WORKPLACE_NAME = "(주)에스피에스앤아이 당진 슬래그공장"
const INITIAL_RISK_DATA = [
{ hazard: "작업중 설비 가동 위험", measure: "LOTOTO 실시" },
{ hazard: "조도불량에 따른 시야확보 불가", measure: "내부 조명 설치" },
{ hazard: "분진에 의한 호흡기 질환", measure: "방진마스크 착용" }
]

export default function PublicTBM() {
const navigate = useNavigate()
const [isSubmitted, setIsSubmitted] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
const [formData, setFormData] = useState({ companyName: "", date: "", time: "", processName: "", manager: "" })
const [attendeeRows, setAttendeeRows] = useState<AttendeeRow[]>(Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: "", health: "", isNew: false, signature: undefined })))
const [riskRows, setRiskRows] = useState<RiskRow[]>(INITIAL_RISK_DATA.map((data, i) => ({ id: i + 1, hazard: data.hazard, currentRisk: "", measure: data.measure })))
const [proposalRows, setProposalRows] = useState<ProposalRow[]>(Array.from({ length: 2 }, (_, i) => ({ id: i + 1, hazard: "", solution: "", proposer: "" })))
const [signaturePadOpen, setSignaturePadOpen] = useState(false)
const [signatureTargetId, setSignatureTargetId] = useState<number | null>(null)

const updateFormData = useCallback((updates: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...updates })), [])
const updateAttendeeRow = useCallback((id: number, key: keyof AttendeeRow, value: any) => setAttendeeRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row)), [])
const addAttendeeRow = useCallback(() => setAttendeeRows(prev => prev.length >= 20 ? prev : [...prev, { id: Date.now(), name: "", health: "", isNew: false, signature: undefined }]), [])
const removeAttendeeRow = useCallback((id: number) => setAttendeeRows(prev => prev.filter(row => row.id !== id)), [])
const updateRiskRow = useCallback((id: number, key: keyof RiskRow, value: any) => setRiskRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row)), [])
const addRiskRow = useCallback(() => setRiskRows(prev => prev.length >= 10 ? prev : [...prev, { id: Date.now(), hazard: "", currentRisk: "", measure: "" }]), [])
const removeRiskRow = useCallback((id: number) => setRiskRows(prev => prev.filter(row => row.id !== id)), [])
const updateProposalRow = useCallback((id: number, key: keyof ProposalRow, value: string) => setProposalRows(prev => prev.map(row => row.id === id ? { ...row, [key]: value } : row)), [])
const addProposalRow = useCallback(() => setProposalRows(prev => prev.length >= 5 ? prev : [...prev, { id: Date.now(), hazard: "", solution: "", proposer: "" }]), [])
const removeProposalRow = useCallback((id: number) => setProposalRows(prev => prev.filter(row => row.id !== id)), [])

const getRiskBadgeColor = (level: string) => level === "상" ? "bg-[#B65E5D] text-white" : level === "중" ? "bg-[#CAB359] text-white" : level === "하" ? "bg-[#80A16A] text-white" : "bg-gray-200 text-gray-600"
const openSignaturePad = (attendeeId: number) => { setSignatureTargetId(attendeeId); setSignaturePadOpen(true) }
const handleSignatureSave = (dataUrl: string) => { if (signatureTargetId !== null) updateAttendeeRow(signatureTargetId, "signature", dataUrl); setSignaturePadOpen(false); setSignatureTargetId(null) }

const handleSubmit = async () => {
if (!formData.processName) { alert("공정명을 입력해주세요."); return }
if (!formData.date) { alert("일자를 선택해주세요."); return }
if (attendeeRows.filter(a => a.name && a.signature).length === 0) { alert("최소 1명 이상의 참석자 서명이 필요합니다."); return }
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
<p className="text-sm text-gray-500 mb-4">TBM 안전일지가 제출되었습니다.</p>
<Button variant="action" onClick={() => navigate("/public/tbm")} className="w-full">새 양식 작성</Button>
</div>
</div>
)
}

return (
<div className="min-h-screen bg-gray-50 pb-24">
<header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
<div className="flex items-center gap-2">
<ClipboardCheck size={24} />
<div>
<h1 className="text-base font-semibold">T.B.M 안전일지</h1>
<p className="text-[10px] opacity-80">현장 위험성평가/작업계획서 내용 및 안전대책 공유 확인</p>
</div>
</div>
</header>

<main className="p-4 space-y-4">
<div className="bg-white rounded-lg border border-gray-200 p-4">
<p className="text-xs font-semibold text-gray-700 mb-3">기본정보</p>
<div className="space-y-3">
<div className="grid grid-cols-2 gap-3">
<div><label className="text-[10px] text-gray-500 mb-1 block">회사명</label><Input value={formData.companyName} onChange={e => updateFormData({ companyName: e.target.value })} className="h-9 text-xs" placeholder="회사명" /></div>
<div><label className="text-[10px] text-gray-500 mb-1 block">사업장명</label><Input value={WORKPLACE_NAME} readOnly className="h-9 text-xs bg-gray-50" /></div>
</div>
<div className="grid grid-cols-2 gap-3">
<div><label className="text-[10px] text-gray-500 mb-1 block">일자 *</label><Input type="date" value={formData.date} onChange={e => updateFormData({ date: e.target.value })} className="h-9 text-xs" /></div>
<div><label className="text-[10px] text-gray-500 mb-1 block">시간</label><Input type="time" value={formData.time} onChange={e => updateFormData({ time: e.target.value })} className="h-9 text-xs" /></div>
</div>
<div className="grid grid-cols-2 gap-3">
<div><label className="text-[10px] text-gray-500 mb-1 block">공정명 *</label><Input value={formData.processName} onChange={e => updateFormData({ processName: e.target.value })} className="h-9 text-xs" placeholder="공정명" /></div>
<div><label className="text-[10px] text-gray-500 mb-1 block">관리담당자</label><Input value={formData.manager} onChange={e => updateFormData({ manager: e.target.value })} className="h-9 text-xs" placeholder="담당자" /></div>
</div>
</div>
</div>

<div className="bg-white rounded-lg border border-gray-200 p-4">
<div className="flex items-center justify-between mb-3">
<p className="text-xs font-semibold text-gray-700">참석자 서명 ({attendeeRows.filter(a => a.name).length}명)</p>
<button onClick={addAttendeeRow} disabled={attendeeRows.length >= 20} className={`text-[11px] text-blue-600 flex items-center gap-1 ${attendeeRows.length >= 20 ? 'opacity-50' : ''}`}><Plus size={12} />추가</button>
</div>
<div className="space-y-3">
{attendeeRows.map((attendee, idx) => (
<div key={attendee.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-500 font-medium">#{idx + 1}</span>
<div className="flex items-center gap-2">
<label className="flex items-center gap-1 text-[10px]"><Checkbox checked={attendee.isNew} onCheckedChange={v => updateAttendeeRow(attendee.id, "isNew", Boolean(v))} />신규</label>
{attendeeRows.length > 1 && <button onClick={() => removeAttendeeRow(attendee.id)}><X size={14} className="text-gray-400" /></button>}
</div>
</div>
<div className="grid grid-cols-2 gap-2 mb-2">
<div><label className="text-[10px] text-gray-500 mb-1 block">이름</label><Input value={attendee.name} onChange={e => updateAttendeeRow(attendee.id, "name", e.target.value)} className="h-8 text-xs" placeholder="이름" /></div>
<div><label className="text-[10px] text-gray-500 mb-1 block">건강상태</label><Input value={attendee.health} onChange={e => updateAttendeeRow(attendee.id, "health", e.target.value)} className="h-8 text-xs" placeholder="양호, 피로 등" /></div>
</div>
<div>
<label className="text-[10px] text-gray-500 mb-1 block">서명</label>
{attendee.signature ? (
<div className="flex items-center gap-2">
<div className="flex-1 h-12 border border-gray-200 rounded bg-white flex items-center justify-center"><img src={attendee.signature} alt="서명" className="h-10 object-contain" /></div>
<button onClick={() => openSignaturePad(attendee.id)} className="px-2 py-1 text-[10px] text-gray-500 border border-gray-300 rounded">다시</button>
</div>
) : (
<button onClick={() => openSignaturePad(attendee.id)} className="w-full h-12 border border-dashed border-gray-300 rounded-lg bg-white flex items-center justify-center gap-1 text-xs text-gray-500"><Pencil size={14} />터치하여 서명</button>
)}
</div>
</div>
))}
</div>
<p className="text-[10px] text-gray-400 mt-3 leading-relaxed">현장 관리담당자(관리감독자)로부터 주요 위험포인트가 무엇인지 교육받았으며, 위험성평가(JSA) 내용을 숙지하고 안전작업절차(SOP)에 따라 작업 절차를 준수하며 안전하게 작업할 것을 약속합니다.</p>
</div>

<div className="bg-white rounded-lg border border-gray-200 p-4">
<div className="flex items-center justify-between mb-3">
<p className="text-xs font-semibold text-gray-700">작업 전 위험성 평가 공유</p>
<button onClick={addRiskRow} disabled={riskRows.length >= 10} className={`text-[11px] text-blue-600 flex items-center gap-1 ${riskRows.length >= 10 ? 'opacity-50' : ''}`}><Plus size={12} />추가</button>
</div>
<div className="space-y-3">
{riskRows.map((row, idx) => (
<div key={row.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-500 font-medium">#{idx + 1}</span>
<div className="flex items-center gap-1">
{RISK_LEVELS.map(level => (<button key={level} onClick={() => updateRiskRow(row.id, "currentRisk", row.currentRisk === level ? "" : level)} className={`text-[10px] px-2 py-1 rounded ${row.currentRisk === level ? getRiskBadgeColor(level) : 'bg-gray-100 text-gray-500'}`}>{level}</button>))}
{riskRows.length > 1 && <button onClick={() => removeRiskRow(row.id)} className="ml-1"><X size={14} className="text-gray-400" /></button>}
</div>
</div>
<div className="space-y-2">
<Input value={row.hazard} onChange={e => updateRiskRow(row.id, "hazard", e.target.value)} className="h-8 text-xs" placeholder="위험요인" />
<Input value={row.measure} onChange={e => updateRiskRow(row.id, "measure", e.target.value)} className="h-8 text-xs" placeholder="방호대책" />
</div>
</div>
))}
</div>
</div>

<div className="bg-white rounded-lg border border-gray-200 p-4">
<div className="flex items-center justify-between mb-3">
<p className="text-xs font-semibold text-gray-700">안전제안 내용</p>
<button onClick={addProposalRow} disabled={proposalRows.length >= 5} className={`text-[11px] text-blue-600 flex items-center gap-1 ${proposalRows.length >= 5 ? 'opacity-50' : ''}`}><Plus size={12} />추가</button>
</div>
<div className="space-y-3">
{proposalRows.map((row, idx) => (
<div key={row.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
<div className="flex items-center justify-between mb-2">
<span className="text-[10px] text-gray-500 font-medium">#{idx + 1}</span>
{proposalRows.length > 1 && <button onClick={() => removeProposalRow(row.id)}><X size={14} className="text-gray-400" /></button>}
</div>
<div className="space-y-2">
<Input value={row.hazard} onChange={e => updateProposalRow(row.id, "hazard", e.target.value)} className="h-8 text-xs" placeholder="유해·위험요인" />
<Input value={row.solution} onChange={e => updateProposalRow(row.id, "solution", e.target.value)} className="h-8 text-xs" placeholder="개선대책" />
<Input value={row.proposer} onChange={e => updateProposalRow(row.id, "proposer", e.target.value)} className="h-8 text-xs" placeholder="제안자" />
</div>
</div>
))}
</div>
</div>
</main>

<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
<button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">{isSubmitting ? "제출 중..." : "제출하기"}</button>
</div>

{signaturePadOpen && <SignaturePad title="본인 서명" onSave={handleSignatureSave} onClose={() => { setSignaturePadOpen(false); setSignatureTargetId(null) }} />}
</div>
)
}