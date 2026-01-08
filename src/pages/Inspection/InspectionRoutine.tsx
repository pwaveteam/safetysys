import React, { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import InspectionRoutineRegister from "@/pages/Inspection/InspectionRoutineRegister"
import usePagination from "@/hooks/usePagination"
import useHandlers from "@/hooks/useHandlers"
import { CirclePlus, Trash2 } from "lucide-react"
import InfoBox from "@/components/common/base/InfoBox"

const TAB_LABELS = ["점검목록", "점검표(체크리스트)관리", "안전순회 점검일지"]

type RoutineRow = DataRow & {
  id: number | string
  inspectionDate: string
  inspector: string
  status: "완료" | "작성중"
  registeredAt: string
}

const routineMockData: RoutineRow[] = [
  { id: 1, inspectionDate: "2026-01-06 ~ 2026-01-12", inspector: "김안전", status: "작성중", registeredAt: "2026-01-09" },
  { id: 2, inspectionDate: "2025-12-30 ~ 2026-01-05", inspector: "이점검", status: "완료", registeredAt: "2026-01-05" },
  { id: 3, inspectionDate: "2025-12-23 ~ 2025-12-29", inspector: "박순회", status: "완료", registeredAt: "2025-12-29" },
  { id: 4, inspectionDate: "2025-12-16 ~ 2025-12-22", inspector: "김안전", status: "완료", registeredAt: "2025-12-22" },
  { id: 5, inspectionDate: "2025-12-09 ~ 2025-12-15", inspector: "이점검", status: "완료", registeredAt: "2025-12-15" },
]

export default function InspectionRoutine() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tabParam = searchParams.get("tab")
  const currentIndex = tabParam === TAB_LABELS[2] ? 2 : tabParam === TAB_LABELS[1] ? 1 : 0

  const handleTabClick = (idx: number) => {
    const tabName = TAB_LABELS[idx]
    if (idx === 0) {
      navigate(`/inspection?tab=${encodeURIComponent(tabName)}`)
    } else if (idx === 1) {
      navigate(`/inspection/checklist?tab=${encodeURIComponent(tabName)}`)
    } else {
      navigate(`/inspection/routine?tab=${encodeURIComponent(tabName)}`)
    }
  }

  useEffect(() => {
    if (!tabParam) {
      navigate(`/inspection/routine?tab=${encodeURIComponent(TAB_LABELS[2])}`, { replace: true })
    }
  }, [])

  const [data, setData] = useState<RoutineRow[]>(routineMockData)
  const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
  const [searchText, setSearchText] = useState("")
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0])

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<RoutineRow | null>(null)
  const [viewMode, setViewMode] = useState<"view" | "edit">("view")

  const filteredData = useMemo(() => {
    const filtered = data.filter(row => {
      const dateMatch = row.registeredAt.match(/(\d{4})-(\d{2})-(\d{2})/)
      if (!dateMatch) return true
      const rowDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
      const matchesDate = rowDate >= startDate && rowDate <= endDate
      const matchesSearch = !searchText || row.inspector.includes(searchText)
      return matchesDate && matchesSearch
    })
    return filtered.sort((a, b) => {
      if (a.status === "작성중" && b.status !== "작성중") return -1
      if (a.status !== "작성중" && b.status === "작성중") return 1
      return 0
    })
  }, [data, startDate, endDate, searchText])

  const { currentPage, totalPages, currentData: pagedData, onPageChange } = usePagination(filteredData, 30)

  const { handleDelete } = useHandlers({
    data,
    checkedIds,
    onDeleteSuccess: (deletedIds) => {
      setData(prev => prev.filter(item => !deletedIds.includes(item.id)))
      setCheckedIds([])
    }
  })

  const handleProgressClick = (row: RoutineRow) => {
    setSelectedRow(row)
    setViewMode(row.status === "작성중" ? "edit" : "view")
    setIsRegisterOpen(true)
  }

  const handleNewRegister = () => {
    setSelectedRow(null)
    setViewMode("edit")
    setIsRegisterOpen(true)
  }

  const columns: Column<RoutineRow>[] = [
    { key: "index", label: "번호", type: "index" },
    { key: "inspectionDate", label: "점검기간", minWidth: 180 },
    { key: "inspector", label: "점검자" },
    { key: "registeredAt", label: "등록일", minWidth: 120 },
    {
      key: "status",
      label: "진행여부",
      type: "progress",
      minWidth: 90,
      progressOptions: { doneValue: "완료", doneText: "점검완료", doingText: "점검하기" }
    }
  ]

  return (
    <section className="w-full bg-white">
      <PageTitle>안전순회 점검일지</PageTitle>
      <TabMenu tabs={TAB_LABELS} activeIndex={currentIndex} onTabClick={handleTabClick} className="mb-6" />

      <div className="mb-6">
        <InfoBox message="사업장 전체를 대상으로 주 단위 안전순회 점검 내역을 관리합니다." />
      </div>

      <div className="mb-3">
        <FilterBar
          startDate={startDate}
          endDate={endDate}
          onStartDate={setStartDate}
          onEndDate={setEndDate}
          searchText={searchText}
          onSearchText={setSearchText}
          onSearch={() => {}}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
        <div className="flex flex-nowrap gap-1 w-auto justify-end">
          <Button variant="action" onClick={handleNewRegister} className="flex items-center gap-1">
            <CirclePlus size={16} />신규등록
          </Button>
          <Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
            <Trash2 size={16} />삭제
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <DataTable
          columns={columns}
          data={pagedData}
          onCheckedChange={setCheckedIds}
          onProgressClick={handleProgressClick}
        />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <InspectionRoutineRegister
        open={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false)
          setSelectedRow(null)
        }}
        mode={viewMode}
      />
    </section>
  )
}
