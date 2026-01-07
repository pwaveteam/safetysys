import React, { useCallback, useMemo, useState } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"

interface ChecklistSelectDialogProps {
onClose: () => void
onConfirm: (selected: string) => void
}

type Checklist = { id: string; name: string }

const MOCK_CHECKLISTS: Checklist[] = [
{ id: "chk-1", name: "전기설비 정기점검표" },
{ id: "chk-2", name: "소방시설 점검표" },
{ id: "chk-3", name: "작업장 안전점검표" }
]

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"

const ChecklistSelectDialog: React.FC<ChecklistSelectDialogProps> = ({ onClose, onConfirm }) => {
const hasData = useMemo(() => MOCK_CHECKLISTS.length > 0, [])
const defaultId = useMemo(() => hasData ? MOCK_CHECKLISTS[0].id : null, [hasData])
const [selectedId, setSelectedId] = useState<string | null>(defaultId)

const handleSelect = useCallback((id: string) => {
const selected = MOCK_CHECKLISTS.find(chk => chk.id === id)
if (!selected) return
onConfirm(selected.name)
onClose()
}, [onClose, onConfirm])

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[600px] md:max-w-full p-4 md:p-6 shadow-2xl h-screen md:h-[70vh] flex flex-col relative">
<div className="flex items-center justify-between mb-2 pb-2">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>점검표 선택</h2>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className={`flex-1 overflow-auto mb-4 border ${BORDER_CLASS} rounded-lg`}>
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`border-b ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-8 md:w-12 text-center`}>No</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-left`}>점검표명</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-16 md:w-24 text-center`}>선택</th>
</tr>
</thead>
<tbody className="bg-white">
{MOCK_CHECKLISTS.length > 0 ? (
MOCK_CHECKLISTS.map((chk, index) => (
<tr key={chk.id}>
<td className={`border-b ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center`}>{index + 1}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} font-normal`}>{chk.name}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-1 md:px-2 py-2`}>
<div className="flex items-center justify-center w-full h-full">
<Button variant="action" onClick={() => handleSelect(chk.id)} className="text-[11px] h-[26px] px-2 py-0">선택</Button>
</div>
</td>
</tr>
))
) : (
<tr>
<td colSpan={3} className={`p-12 ${TEXT_SIZE_TD} text-gray-400 text-center`}>등록된 점검표가 없습니다.</td>
</tr>
)}
</tbody>
</table>
</div>
</div>
</div>
)
}

export default ChecklistSelectDialog