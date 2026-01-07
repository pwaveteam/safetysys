import { useState } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"
import Checkbox from "@/components/common/base/Checkbox"
import Pagination from "@/components/common/base/Pagination"
import { nearMissImporterMockData } from "@/data/mockRiskAssessmentData"

type NearMissImportDialogProps = {
isOpen: boolean
onClose: () => void
onSubmit?: (selectedIds: number[]) => void
}

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"

export default function NearMissImportDialog({ isOpen, onClose, onSubmit }: NearMissImportDialogProps) {
const [selectedIds, setSelectedIds] = useState<number[]>([])
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10

const data = nearMissImporterMockData
const totalPages = Math.ceil(data.length / itemsPerPage)
const paginatedList = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

const isAllSelected = paginatedList.length > 0 && paginatedList.every((row) => selectedIds.includes(row.id))

const handleSelectAll = () => {
if (isAllSelected) {
setSelectedIds(selectedIds.filter((id) => !paginatedList.some((row) => row.id === id)))
} else {
const newIds = paginatedList.map((row) => row.id).filter((id) => !selectedIds.includes(id))
setSelectedIds([...selectedIds, ...newIds])
}
}

const handleSelect = (id: number) => {
if (selectedIds.includes(id)) {
setSelectedIds(selectedIds.filter((s) => s !== id))
} else {
setSelectedIds([...selectedIds, id])
}
}

const handleSubmit = () => {
if (onSubmit) onSubmit(selectedIds)
onClose()
}

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[1000px] md:max-w-full p-4 md:p-6 shadow-2xl h-screen md:h-[85vh] flex flex-col">
<div className="flex items-center justify-between mb-4 shrink-0">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>아차사고 불러오기</h2>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className={`flex-1 overflow-auto mb-4 border ${BORDER_CLASS} rounded-lg`}>
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`border-b ${BORDER_CLASS} ${TH_PADDING} w-12 md:w-16 text-center`}>
<Checkbox checked={isAllSelected} onChange={handleSelectAll} />
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-32 md:w-44 text-center`}>공정(작업)</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-left`}>유해위험요인</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-48 md:w-64 text-left hidden md:table-cell`}>현재 안전보건조치</th>
</tr>
</thead>
<tbody className="bg-white">
{paginatedList.length > 0 ? (
paginatedList.map((row) => (
<tr key={row.id} className="hover:bg-gray-50 transition-colors">
<td className={`border-b ${BORDER_CLASS} ${CELL_PADDING} text-center`}>
<Checkbox checked={selectedIds.includes(row.id)} onChange={() => handleSelect(row.id)} />
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center`}>{row.process}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY}`}>{row.hazard}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} hidden md:table-cell`}>{row.action}</td>
</tr>
))
) : (
<tr>
<td colSpan={4} className={`p-12 ${TEXT_SIZE_TD} text-gray-400 text-center`}>등록된 아차사고가 없습니다.</td>
</tr>
)}
</tbody>
</table>
</div>

<div className="flex items-center justify-between pt-2 shrink-0">
<div className="flex-1" />
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
<div className="flex-1 flex justify-end">
<Button variant="primary" onClick={handleSubmit} disabled={selectedIds.length === 0}>확인</Button>
</div>
</div>
</div>
</div>
)
}