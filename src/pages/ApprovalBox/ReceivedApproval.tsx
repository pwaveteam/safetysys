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
import ApprovalDetail, { type ReceivedDetail } from "@/components/snippet/ApprovalDetail"
import { useApprovalStore } from "@/stores/approvalStore"
import { receivedApprovalMockData } from "@/data/mockData"

const TAB_LABELS = ["받은결재함", "보낸결재함"]
const TAB_PATHS = ["/approval-box/received", "/approval-box/sent"]

const columns: Column[] = [
  { key: "index", label: "번호", type: "index" },
  { key: "date", label: "요청일" },
  { key: "type", label: "결재유형" },
  { key: "content", label: "결재내용", align: "left" },
  { key: "drafter", label: "기안자" },
  { key: "status", label: "상태", type: "badge" },
  { key: "detail", label: "보기", type: "detail" },
]

export default function ReceivedApproval() {
  const navigate = useNavigate()
  const activeIndex = TAB_PATHS.findIndex((p) => window.location.pathname.startsWith(p))

  const { receivedApprovals, approveRequest, rejectRequest, deleteReceivedApproval } = useApprovalStore()

  const combinedData = useMemo(() => {
    const storeData: DataRow[] = receivedApprovals.map(item => ({
      id: item.id,
      date: item.date,
      type: item.type,
      content: item.content,
      drafter: item.drafter,
      status: item.status
    }))
    return [...storeData, ...receivedApprovalMockData]
  }, [receivedApprovals])

  const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
  const [detail, setDetail] = useState<ReceivedDetail | null>(null)

  const { startDate, endDate, searchText, setStartDate, setEndDate, setSearchText, filteredData, handleSearch } = useFilterBar({ data: combinedData, dateKey: "date", searchKeys: ["type", "content", "drafter"] })
  const { currentPage, totalPages, currentData, onPageChange } = usePagination<DataRow>(filteredData, 30)

  const handleTabClick = (i: number) => {
    navigate(TAB_PATHS[i])
    setCheckedIds([])
  }

  const handleDelete = () => {
    if (!checkedIds.length) return alert("삭제할 항목을 선택하세요")
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteReceivedApproval(checkedIds)
      setCheckedIds([])
    }
  }

  const handleDetailClick = (row: DataRow) => {
    setDetail({
      id: row.id,
      date: String(row.date),
      type: String(row.type),
      content: String(row.content),
      drafter: String(row.drafter),
      status: row.status.text as "결재대기" | "결재완료" | "반려",
    })
  }

  const handleApprove = (id: number | string, signature: string) => {
    approveRequest(id as number)
    setDetail(null)
    alert("결재가 승인되었습니다.")
  }

  const handleReject = (id: number | string) => {
    rejectRequest(id as number)
    setDetail(null)
    alert("결재가 반려되었습니다.")
  }

  return (
    <section className="w-full bg-white">
      <PageTitle>{TAB_LABELS[activeIndex === -1 ? 0 : activeIndex]}</PageTitle>

      <TabMenu tabs={TAB_LABELS} activeIndex={activeIndex === -1 ? 0 : activeIndex} onTabClick={handleTabClick} className="mb-6" />

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
        <ApprovalDetail
          variant="received"
          row={detail}
          onClose={() => setDetail(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </section>
  )
}
