import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import FilterBar from "@/components/common/base/FilterBar"
import Pagination from "@/components/common/base/Pagination"
import usePagination from "@/hooks/usePagination"
import useFilterBar from "@/hooks/useFilterBar"
import { Save, Trash2 } from "lucide-react"
import ApprovalDetail, { type SentDetail } from "@/components/snippet/ApprovalDetail"
import { useApprovalStore } from "@/stores/approvalStore"
import { sentApprovalMockData } from "@/data/mockData"

const TAB_LABELS = ["받은결재함", "보낸결재함"]
const TAB_PATHS = ["/approval-box/received", "/approval-box/sent"]

const columns: Column[] = [
{ key: "index", label: "번호", type: "index" },
{ key: "date", label: "기안일" },
{ key: "document", label: "결재유형", align: "left" },
{ key: "status", label: "상태", type: "badge" },
{ key: "progress", label: "결재진행" },
{ key: "finalApprover", label: "최종결재자" },
{ key: "detail", label: "보기", type: "detail" },
]

export default function SentApproval() {
const navigate = useNavigate()
const activeIndex = TAB_PATHS.findIndex((p) => window.location.pathname.startsWith(p))

const { sentApprovals, deleteSentApproval } = useApprovalStore()

const combinedData = useMemo(() => {
  const storeData: DataRow[] = sentApprovals.map(item => ({
    id: item.id,
    date: item.date,
    document: item.documentType,
    content: item.document,
    status: item.status,
    progress: item.progress,
    finalApprover: item.finalApprover
  }))
  const mockData: DataRow[] = sentApprovalMockData.map(item => ({
    id: item.id,
    date: item.date,
    document: item.documentType || item.document,
    content: item.content || item.document,
    status: item.status,
    progress: item.progress,
    finalApprover: item.finalApprover
  }))
  return [...storeData, ...mockData]
}, [sentApprovals])

const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const [detail, setDetail] = useState<SentDetail | null>(null)

const { startDate, endDate, searchText, setStartDate, setEndDate, setSearchText, filteredData, handleSearch } = useFilterBar({data: combinedData, dateKey: "date", searchKeys: ["document", "finalApprover"]})
const { currentPage, totalPages, currentData, onPageChange } = usePagination<DataRow>(filteredData, 30)

const handleTabClick = (i: number) => {
navigate(TAB_PATHS[i])
setCheckedIds([])
}

const handleDelete = () => {
  if (!checkedIds.length) return alert("삭제할 항목을 선택하세요")
  if (window.confirm("정말 삭제하시겠습니까?")) {
    deleteSentApproval(checkedIds)
    setCheckedIds([])
  }
}

const handleDetailClick = (row: DataRow) => {
setDetail({
id: row.id,
date: String(row.date),
document: String(row.document),
content: String(row.content || row.document),
status: row.status.text as string,
progress: String(row.progress),
finalApprover: String(row.finalApprover),
})
}

return (
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[activeIndex === -1 ? 1 : activeIndex]}</PageTitle>

<TabMenu tabs={TAB_LABELS} activeIndex={activeIndex === -1 ? 1 : activeIndex} onTabClick={handleTabClick} className="mb-6" />

<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
searchText={searchText}
onSearchText={setSearchText}
onSearch={handleSearch}
/>

<div className="mb-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2">
<span className="text-sm text-gray-600 leading-none mt-2 sm:mt-0">총 {filteredData.length}건</span>
<div className="flex gap-1 justify-end w-full sm:w-auto">
<Button variant="action" className="flex gap-1 items-center"><Save size={16} />다운로드</Button>
<Button variant="action" onClick={handleDelete} className="flex gap-1 items-center"><Trash2 size={16} />삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={columns} data={currentData} onCheckedChange={setCheckedIds} onDetailClick={handleDetailClick} />
</div>

<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

{detail && (
<ApprovalDetail variant="sent" row={detail} onClose={() => setDetail(null)} />
)}
</section>
)
}