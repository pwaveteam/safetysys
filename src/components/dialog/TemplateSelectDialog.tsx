import React, { useMemo, useState, useCallback } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"
import { checklistTemplateMockData } from "@/data/mockData"

type Props = { onClose: () => void; onConfirm: (items: string[]) => void }

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"
const ROW_HOVER = "hover:bg-gray-50"
const ROW_ACTIVE = "bg-gray-50"

const TemplateSelectDialog: React.FC<Props> = ({ onClose, onConfirm }) => {
const [selectedId, setSelectedId] = useState<number | null>(checklistTemplateMockData[0]?.id ?? null)
const selected = useMemo(() => checklistTemplateMockData.find(t => t.id === selectedId) ?? null, [selectedId])

const confirm = useCallback(() => {
if (!selected) { alert("점검표를 선택하세요"); return }
onConfirm(selected.items)
}, [onConfirm, selected])

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[96vw] md:max-w-5xl p-4 md:p-6 shadow-2xl flex flex-col relative h-screen md:h-[85vh]">
<div className="flex items-center justify-between mb-2 pb-2">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>점검표(체크리스트) 등록</h2>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className="flex-1 grid grid-cols-1 grid-rows-2 md:grid-cols-[3.5fr_6.5fr] md:grid-rows-1 gap-3 md:gap-5 min-h-0 overflow-hidden">
<div className="flex flex-col min-h-0">
<div className="px-1 h-6 md:h-7 flex items-center mb-1">
<span className={`${TEXT_SIZE_TH} font-semibold ${TEXT_PRIMARY}`}>점검표 목록</span>
</div>
<div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden flex-1 min-h-0`}>
<div className="h-full overflow-auto">
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} ${HEADER_BG_CLASS} border-b ${BORDER_CLASS} ${TH_PADDING} text-left`}>점검표명</th>
</tr>
</thead>
<tbody className="bg-white">
{checklistTemplateMockData.map(t => {
const active = t.id === selectedId
return (
<tr key={t.id} onClick={() => setSelectedId(t.id)} className={`cursor-pointer select-none transition-colors ${active ? ROW_ACTIVE : ROW_HOVER}`}>
<td className={`${TEXT_SIZE_TD} ${TEXT_PRIMARY} ${CELL_PADDING} border-b ${BORDER_CLASS} truncate ${active ? "font-medium" : ""}`}>{t.name}</td>
</tr>
)
})}
{checklistTemplateMockData.length === 0 && (
<tr><td className={`${TEXT_SIZE_TD} text-gray-400 ${CELL_PADDING} py-8 border-b ${BORDER_CLASS} text-center`}>등록된 점검표가 없습니다.</td></tr>
)}
</tbody>
</table>
</div>
</div>
</div>

<div className="flex flex-col min-h-0">
<div className="px-1 h-6 md:h-7 flex items-center mb-1">
<span className={`${TEXT_SIZE_TH} font-semibold ${TEXT_PRIMARY}`}>세부 항목</span>
</div>
<div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden flex-1 min-h-0`}>
<div className="h-full overflow-auto">
<table className="w-full border-separate border-spacing-0">
<colgroup>
<col className="w-8 md:w-12" />
<col />
</colgroup>
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} ${HEADER_BG_CLASS} border-b ${BORDER_CLASS} border-r ${BORDER_CLASS} ${TH_PADDING} text-center`}>No</th>
<th className={`${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} ${HEADER_BG_CLASS} border-b ${BORDER_CLASS} ${TH_PADDING} text-left`}>점검세부내용</th>
</tr>
</thead>
<tbody className="bg-white">
{!selected && (
<tr><td colSpan={2} className={`${TEXT_SIZE_TD} text-gray-400 ${CELL_PADDING} py-8 border-b ${BORDER_CLASS} text-center`}>점검표를 선택하세요.</td></tr>
)}
{selected?.items.map((txt, i) => (
<tr key={i} className={`${ROW_HOVER} transition-colors`}>
<td className={`${TEXT_SIZE_TD} ${TEXT_PRIMARY} ${CELL_PADDING} border-b ${BORDER_CLASS} border-r ${BORDER_CLASS} text-center`}>{i + 1}</td>
<td className={`${TEXT_SIZE_TD} ${TEXT_PRIMARY} ${CELL_PADDING} border-b ${BORDER_CLASS}`}>{txt}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
</div>

<div className="mt-3 md:mt-5 flex justify-center gap-2">
<Button variant="primary" onClick={confirm} className="min-w-20 md:min-w-24 text-xs md:text-sm">확인</Button>
</div>
</div>
</div>
)
}

export default TemplateSelectDialog