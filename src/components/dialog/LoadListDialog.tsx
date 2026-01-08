import React, { useState, useEffect } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"
import Pagination from "@/components/common/base/Pagination"

interface Item {
id: string | number
name: string
}

interface LoadListDialogProps {
isOpen: boolean
items: Item[]
selectedId?: string | number | null
selectedIds?: (string | number)[]
onChangeSelected: (selected: (string | number)[] | string | number | null) => void
onClose: () => void
singleSelect?: boolean
}

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"

export default function LoadListDialog({
isOpen,
items,
selectedId = null,
selectedIds = [],
onChangeSelected,
onClose,
singleSelect = false,
}: LoadListDialogProps) {
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10

useEffect(() => {
if (isOpen) setCurrentPage(1)
}, [isOpen])

const handleSelect = (id: string | number) => {
if (singleSelect) {
onChangeSelected(id)
onClose()
} else {
const current = selectedIds || []
const isSelected = current.includes(id)
const newSelected = isSelected
? current.filter(x => x !== id)
: [...current, id]
onChangeSelected(newSelected)
}
}

const totalPages = Math.ceil(items.length / itemsPerPage)
const paginatedList = items.slice(
(currentPage - 1) * itemsPerPage,
currentPage * itemsPerPage
)

const sampleDates = ["2024-05-26", "2024-05-25", "2024-05-24", "2024-05-23", "2024-05-22"]

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[800px] md:max-w-full p-4 md:p-6 shadow-2xl h-screen md:h-[85vh] flex flex-col relative">
<div className="flex items-center justify-between mb-2 pb-2">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>
위험성평가표 불러오기
</h2>
<button
onClick={onClose}
className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]"
>
<X size={24} />
</button>
</div>

<div className={`flex-1 overflow-auto mb-4 border ${BORDER_CLASS} rounded-lg`}>
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`border-b ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-8 md:w-12 text-center`}>
No
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-left`}>
위험성평가명
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-24 md:w-28 text-center hidden md:table-cell`}>
등록일
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-16 md:w-24 text-center`}>
선택
</th>
</tr>
</thead>
<tbody className="bg-white">
{paginatedList.length > 0 ? (
paginatedList.map((item, index) => {
const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
const isSelected = singleSelect
? selectedId === item.id
: selectedIds?.includes(item.id)

return (
<tr key={item.id}>
<td className={`border-b ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center`}>
{globalIndex}
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} font-normal`}>
{item.name}
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_SECONDARY} text-center hidden md:table-cell`}>
{sampleDates[index % sampleDates.length]}
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-1 md:px-2 py-2`}>
<div className="flex items-center justify-center w-full h-full">
<Button
variant={isSelected ? "secondary" : "action"}
onClick={() => handleSelect(item.id)}
className="text-[11px] h-[26px] px-2 py-0"
>
{isSelected && !singleSelect ? "해제" : "선택"}
</Button>
</div>
</td>
</tr>
)
})
) : (
<tr>
<td
colSpan={4}
className={`p-12 ${TEXT_SIZE_TD} text-gray-400 text-center`}
>
등록된 위험성평가표가 없습니다.
</td>
</tr>
)}
</tbody>
</table>
</div>

<div className="flex justify-center pt-2">
<Pagination
currentPage={currentPage}
totalPages={totalPages}
onPageChange={setCurrentPage}
/>
</div>
</div>
</div>
)
}