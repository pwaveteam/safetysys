import { useState, useEffect } from "react"
import Checkbox from "@/components/common/base/Checkbox"
import EditableTextArea from "@/components/common/inputs/EditableTextArea"
import { processSelectorMockData } from "@/data/mockRiskAssessmentData"

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"

type IndustryTypeDialogProps = {
industry: unknown
selectedIds: number[]
onSelectIds: (ids: number[]) => void
}

export default function IndustryTypeDialog({ industry, selectedIds, onSelectIds }: IndustryTypeDialogProps) {
const [rows, setRows] = useState(processSelectorMockData)

useEffect(() => {
if (selectedIds.length === 0 && rows.length > 0) {
onSelectIds(rows.map((row) => row.id))
}
}, [])

const handleChange = (id: number, val: string) => {
setRows((prev) => prev.map((row) => (row.id === id ? { ...row, description: val } : row)))
}

const isAllSelected = rows.length > 0 && selectedIds.length === rows.length

const handleSelectAll = () => {
if (isAllSelected) {
onSelectIds([])
} else {
onSelectIds(rows.map((row) => row.id))
}
}

const handleSelect = (id: number) => {
if (selectedIds.includes(id)) {
onSelectIds(selectedIds.filter((s) => s !== id))
} else {
onSelectIds([...selectedIds, id])
}
}

return (
<div className={`border ${BORDER_CLASS} rounded-lg overflow-auto max-h-[60vh] md:max-h-[72vh]`}>
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`border-b ${BORDER_CLASS} ${TH_PADDING} w-12 md:w-16 text-center`}>
<Checkbox checked={isAllSelected} onChange={handleSelectAll} />
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-28 md:w-32 text-center`}>
공정(작업)
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-left`}>
공정 설명
</th>
</tr>
</thead>
<tbody className="bg-white">
{rows.length > 0 ? (
rows.map((row) => (
<tr key={row.id} className="hover:bg-gray-50 transition-colors">
<td className={`border-b ${BORDER_CLASS} ${CELL_PADDING} text-center`}>
<Checkbox checked={selectedIds.includes(row.id)} onChange={() => handleSelect(row.id)} />
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center`}>
{row.process}
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING}`}>
<EditableTextArea
value={row.description}
onChange={(val) => handleChange(row.id, val)}
maxLength={200}
rows={2}
placeholder="공정 설명을 입력하세요"
className={TEXT_SIZE_TD}
/>
</td>
</tr>
))
) : (
<tr>
<td colSpan={3} className={`p-12 ${TEXT_SIZE_TD} text-gray-400 text-center`}>
등록된 공정이 없습니다.
</td>
</tr>
)}
</tbody>
</table>
</div>
)
}