import React, { useMemo, useEffect, useState } from "react"
import { X } from "lucide-react"
import Button from "@/components/common/base/Button"
import Pagination from "@/components/common/base/Pagination"
import FilterBar from "@/components/common/base/FilterBar"
import useFilterBar from "@/hooks/useFilterBar"
import { DOCUMENT_DETAILS, DocumentDetail } from "@/data/mockDocumentData"
import { useLoadingStore } from "@/stores/loadingStore"

interface PTWListDialogProps {
isOpen: boolean
onClose: () => void
onSelect: (data: DocumentDetail) => void
documentType: "위험작업허가서" | "작업위험분석(JSA)" | "현장 위험성평가(JSA)" | "TBM"
}

type PTWItem = {
id: string
type: string
name: string
writer: string
createdAt: string
detailData: DocumentDetail
}

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"

export default function PTWListDialog({ isOpen, onClose, onSelect, documentType }: PTWListDialogProps) {
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10
const { setLoading } = useLoadingStore()

const ptwList = useMemo<PTWItem[]>(() => {
const allDocs = Object.entries(DOCUMENT_DETAILS).map(([id, detail]) => {
let type = ""
let name = detail.workType || detail.workName || detail.processName || ""
let writer = detail.applicantName || detail.teamMember?.name || detail.manager || ""
if (id.startsWith("PTW")) type = "위험작업허가서"
else if (id.startsWith("JSA")) type = "작업위험분석(JSA)"
else if (id.startsWith("EVAL")) type = "현장 위험성평가(JSA)"
else if (id.startsWith("TBM")) type = "TBM"
return { id, type, name, writer, createdAt: detail.applicationDate || detail.date || "", detailData: detail }
})
return allDocs.filter(doc => doc.type === documentType)
}, [documentType])

const { searchText, setSearchText, filteredData } = useFilterBar<PTWItem>({ data: ptwList, searchKeys: ["name", "writer"] })

useEffect(() => {
setCurrentPage(1)
}, [searchText])

const totalPages = Math.ceil(filteredData.length / itemsPerPage)
const paginatedList = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

const handleSelect = async (detailData: DocumentDetail) => {
onClose()
setLoading(true)
try {
await new Promise(resolve => setTimeout(resolve, 1500))
onSelect(detailData)
} finally {
setLoading(false)
}
}

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[1000px] md:max-w-full p-4 md:p-6 shadow-2xl h-screen md:h-[85vh] flex flex-col">
<div className="flex items-center justify-between mb-4 shrink-0">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>{documentType}</h2>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>
<div className="mb-4 shrink-0">
<FilterBar showDateRange={false} searchText={searchText} onSearchText={setSearchText} onSearch={() => setCurrentPage(1)} />
</div>
<div className={`flex-1 overflow-auto mb-4 border ${BORDER_CLASS} rounded-lg`}>
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th className={`border-b ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-24 md:w-40 text-center`}>문서 구분</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-left`}>작업명</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-16 md:w-24 text-center hidden md:table-cell`}>작성자</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-20 md:w-28 text-center hidden md:table-cell`}>작성일</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} w-16 md:w-24 text-center`}>선택</th>
</tr>
</thead>
<tbody className="bg-white">
{paginatedList.length > 0 ? (
paginatedList.map((item) => (
<tr key={item.id} className="hover:bg-gray-50 transition-colors">
<td className={`border-b ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center`}>
<span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">{item.type}</span>
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY}`}>{item.name}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center hidden md:table-cell`}>{item.writer}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_SECONDARY} text-center hidden md:table-cell`}>{item.createdAt}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-1 md:px-2 py-2`}>
<div className="flex items-center justify-center">
<Button variant="action" onClick={() => handleSelect(item.detailData)} className="text-[11px] h-[26px] px-2 py-0">선택</Button>
</div>
</td>
</tr>
))
) : (
<tr>
<td colSpan={5} className={`p-12 ${TEXT_SIZE_TD} text-gray-400 text-center`}>
{searchText ? "검색 결과가 없습니다." : "등록된 문서가 없습니다."}
</td>
</tr>
)}
</tbody>
</table>
</div>
<div className="flex justify-center pt-2 shrink-0">
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
</div>
</div>
</div>
)
}