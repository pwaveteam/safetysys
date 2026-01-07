import React, { useRef } from "react"
import Button from "@/components/common/base/Button"
import { X, Printer, Check, Minus } from "lucide-react"
import { useReactToPrint } from "react-to-print"

interface ResultRow {
id: number | string
template: string
workplace: string
field: string
kind: string
inspector: string
inspectedAt: string
confirmed: boolean
notes: string
}

interface CheckItem {
id: number
content: string
confirmed: boolean
note: string
}

interface InspectionResultViewDialogProps {
open: boolean
onClose: () => void
data: ResultRow | null
}

const SAMPLE_ITEMS: CheckItem[] = [
{ id: 1, content: "분전반 외함 파손·열화·부식 여부 및 표면 이물질 부착 상태 확인", confirmed: true, note: "" },
{ id: 2, content: "누전차단기 시험버튼 동작 확인 및 동작 후 원위치 복귀 상태 점검", confirmed: true, note: "" },
{ id: 3, content: "접지선 체결상태(풀림/탈락/손상) 및 접지저항 측정기록 최신성 확인", confirmed: true, note: "접지저항 측정 완료" },
{ id: 4, content: "전선 피복 손상·가닥 노출·비규격 접속(테이프 임시처리 등) 사용 금지 여부", confirmed: false, note: "일부 피복 손상 발견, 교체 필요" },
{ id: 5, content: "분전반 내부 과열 흔적(변색/그을음) 및 냄새 유무, 발열 부위 비접촉 온도계 점검", confirmed: true, note: "" },
]

const BORDER_CLASS = "border-[var(--border)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"

export default function InspectionResultViewDialog({ open, onClose, data }: InspectionResultViewDialogProps) {
const printRef = useRef<HTMLDivElement>(null)

const handlePrint = useReactToPrint({
contentRef: printRef,
documentTitle: `점검결과_${data?.template || "문서"}`,
})

if (!open || !data) return null

const confirmedCount = SAMPLE_ITEMS.filter(i => i.confirmed).length

return (
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[900px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[90vh] flex flex-col relative">
<div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>점검결과</h2>
<div className="flex items-center gap-2">
<Button variant="action" onClick={() => handlePrint()} className="flex items-center gap-1 text-xs">
<Printer size={14} />인쇄
</Button>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>
</div>

<div className="flex-1 overflow-auto">
<div ref={printRef} className="bg-white p-4 md:p-6">
{/* Document Header */}
<div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-800">
<h1 className="text-xl md:text-2xl font-bold text-gray-900">점검일지</h1>
<p className="text-sm text-gray-500">[문서번호] IR_{String(data.id).padStart(8, "0")}</p>
</div>

{/* Basic Info Table */}
<div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden mb-6`}>
<table className="w-full border-collapse">
<tbody>
<tr>
<th className={`bg-gray-50 ${BORDER_CLASS} border-b border-r px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left w-28`}>점검표명</th>
<td className={`${BORDER_CLASS} border-b px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{data.template}</td>
<th className={`bg-gray-50 ${BORDER_CLASS} border-b border-l border-r px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left w-28`}>점검일</th>
<td className={`${BORDER_CLASS} border-b px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{data.inspectedAt}</td>
</tr>
<tr>
<th className={`bg-gray-50 ${BORDER_CLASS} border-b border-r px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left`}>장소</th>
<td className={`${BORDER_CLASS} border-b px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{data.workplace}</td>
<th className={`bg-gray-50 ${BORDER_CLASS} border-b border-l border-r px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left`}>점검자</th>
<td className={`${BORDER_CLASS} border-b px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{data.inspector}</td>
</tr>
<tr>
<th className={`bg-gray-50 ${BORDER_CLASS} border-r px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left`}>점검분야</th>
<td className={`${BORDER_CLASS} px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{data.field}</td>
<th className={`bg-gray-50 ${BORDER_CLASS} border-l border-r px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left`}>점검종류</th>
<td className={`${BORDER_CLASS} px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{data.kind}</td>
</tr>
</tbody>
</table>
</div>

{/* Result Summary */}
<div className="mb-6">
<div className="flex items-center justify-between mb-3">
<h3 className="text-base font-bold text-gray-900">점검결과 요약</h3>
<div className="flex items-center gap-4 text-sm">
<span className="flex items-center gap-1">
<span className="w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center"><Check size={10} className="text-white" /></span>
<span className="text-gray-600">확인: {confirmedCount}건</span>
</span>
<span className="flex items-center gap-1">
<span className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center"><Minus size={10} className="text-white" /></span>
<span className="text-gray-600">미확인: {SAMPLE_ITEMS.length - confirmedCount}건</span>
</span>
</div>
</div>
</div>

{/* Checklist Items */}
<div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden`}>
<table className="w-full border-collapse">
<thead>
<tr className="bg-gray-50">
<th className={`${BORDER_CLASS} border-b px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-center w-14`}>No</th>
<th className={`${BORDER_CLASS} border-b border-l px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left`}>점검항목</th>
<th className={`${BORDER_CLASS} border-b border-l px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-center w-20`}>결과</th>
<th className={`${BORDER_CLASS} border-b border-l px-4 py-3 text-sm font-medium ${TEXT_SECONDARY} text-left w-48`}>비고/조치사항</th>
</tr>
</thead>
<tbody>
{SAMPLE_ITEMS.map((item, idx) => (
<tr key={item.id} className={idx % 2 === 1 ? "bg-gray-50/50" : ""}>
<td className={`${BORDER_CLASS} ${idx < SAMPLE_ITEMS.length - 1 ? "border-b" : ""} px-4 py-3 text-sm ${TEXT_PRIMARY} text-center`}>{idx + 1}</td>
<td className={`${BORDER_CLASS} ${idx < SAMPLE_ITEMS.length - 1 ? "border-b" : ""} border-l px-4 py-3 text-sm ${TEXT_PRIMARY}`}>{item.content}</td>
<td className={`${BORDER_CLASS} ${idx < SAMPLE_ITEMS.length - 1 ? "border-b" : ""} border-l px-4 py-3 text-center`}>
{item.confirmed ? (
<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white">
<Check size={14} />
</span>
) : (
<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300 text-white">
<Minus size={14} />
</span>
)}
</td>
<td className={`${BORDER_CLASS} ${idx < SAMPLE_ITEMS.length - 1 ? "border-b" : ""} border-l px-4 py-3 text-sm ${item.note ? TEXT_PRIMARY : TEXT_SECONDARY}`}>
{item.note || "-"}
</td>
</tr>
))}
</tbody>
</table>
</div>

{/* Notes Section */}
{data.notes && (
<div className={`mt-6 border ${BORDER_CLASS} rounded-lg overflow-hidden`}>
<div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
<h4 className="text-sm font-medium text-gray-700">종합 비고</h4>
</div>
<div className="px-4 py-3">
<p className="text-sm text-gray-800 whitespace-pre-wrap">{data.notes}</p>
</div>
</div>
)}

{/* Footer for print */}
<div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400 print:block hidden">
출력일: {new Date().toLocaleDateString("ko-KR")} | 본 문서는 안전점검 결과를 기록한 공식 문서입니다.
</div>
</div>
</div>
</div>

<style>{`
@media print {
@page { size: A4; margin: 15mm; }
body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
`}</style>
</div>
)
}