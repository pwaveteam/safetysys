import React, { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import InspectionLog from "@/pages/Inspection/InspectionLog"
import InspectionRoutineRegister from "@/pages/Inspection/InspectionRoutineRegister"
import InspectionPlanRegister from "@/pages/Inspection/InspectionPlanRegister"
import usePagination from "@/hooks/usePagination"
import useHandlers from "@/hooks/useHandlers"
import useFilterBar from "@/hooks/useFilterBar"
import { CirclePlus, ClipboardList, Trash2 } from "lucide-react"
import InfoBox from "@/components/common/base/InfoBox"
import { inspectionResultsMockData, inspectionPlanMockData } from "@/data/mockData"

const TAB_LABELS = ["점검목록", "점검표(체크리스트)관리", "안전순회 점검일지"]

type InspectionRow = DataRow & {
  id: number | string
  template: string
  workplace: string
  field: string
  kind: string
  inspector: string
  schedule: string
  registeredAt: string
  status: "예정" | "진행중" | "완료"
  notes?: string
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"]

const formatDateWithDay = (dateStr: string) => {
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return dateStr
  const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]))
  const dayName = DAY_NAMES[date.getDay()]
  return `${match[1]}-${match[2]}-${match[3]}(${dayName})`
}

const convertPlanToInspection = (plan: DataRow): InspectionRow => {
  const progressMap: Record<string, "예정" | "진행중" | "완료"> = {
    "미점검": "예정",
    "진행중": "진행중",
    "완료": "완료"
  }

  return {
    id: `plan-${plan.id}`,
    template: plan.planName as string,
    workplace: plan.site as string,
    field: plan.area as string,
    kind: plan.kind as string,
    inspector: plan.inspector as string,
    schedule: plan.schedule as string,
    registeredAt: formatDateWithDay("2025-01-05"),
    status: progressMap[plan.progress as string] || "예정",
    notes: ""
  }
}

const convertResultToInspection = (result: DataRow): InspectionRow => {
  const dateStr = result.inspectedAt as string
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/)
  const formattedSchedule = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : dateStr

  return {
    id: `result-${result.id}`,
    template: result.template as string,
    workplace: result.workplace as string,
    field: result.field as string,
    kind: result.kind as string,
    inspector: result.inspector as string,
    schedule: formattedSchedule,
    registeredAt: formatDateWithDay(dateStr.split("(")[0]),
    status: "완료",
    notes: result.notes as string
  }
}

export default function Inspection() {
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
      navigate(`/inspection?tab=${encodeURIComponent(TAB_LABELS[0])}`, { replace: true })
    }
  }, [])

  const [todayPatrolCompleted] = useState(false)

  const allInspectionData = useMemo(() => {
    const planData = inspectionPlanMockData.map(convertPlanToInspection)
    const resultData = inspectionResultsMockData.map(convertResultToInspection)
    const filteredPlanData = planData.filter(p => p.status !== "완료")
    return [...filteredPlanData, ...resultData]
  }, [])

  const [data, setData] = useState<InspectionRow[]>(allInspectionData)
  const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
  const [isResultViewOpen, setIsResultViewOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState<InspectionRow | null>(null)
  const [resultViewMode, setResultViewMode] = useState<"view" | "edit">("view")
  const [isPatrolDialogOpen, setIsPatrolDialogOpen] = useState(false)
  const [patrolDialogMode, setPatrolDialogMode] = useState<"view" | "edit">("view")
  const [isPlanRegisterOpen, setIsPlanRegisterOpen] = useState(false)

  const { searchText, setSearchText, inspectionField, setInspectionField, inspectionKind, setInspectionKind, filteredData, handleSearch } = useFilterBar({
    data,
    dateKey: "registeredAt",
    searchKeys: ["template", "workplace", "inspector"]
  })

  const sortedData = useMemo(() => {
    return [...(filteredData as InspectionRow[])].sort((a, b) => {
      if (a.status !== "완료" && b.status === "완료") return -1
      if (a.status === "완료" && b.status !== "완료") return 1
      return 0
    })
  }, [filteredData])

  const { currentPage, totalPages, currentData: pagedData, onPageChange } = usePagination(sortedData, 30)

  const { handleDelete } = useHandlers({
    data,
    checkedIds,
    onDeleteSuccess: (deletedIds) => {
      setData(prev => prev.filter(item => !deletedIds.includes(item.id)))
      setCheckedIds([])
    }
  })

  const handleProgressClick = (row: InspectionRow) => {
    setSelectedResult(row)
    setResultViewMode(row.status === "완료" ? "view" : "edit")
    setIsResultViewOpen(true)
  }

  const columns: Column<InspectionRow>[] = [
    { key: "index", label: "번호", type: "index" },
    { key: "kind", label: "점검종류" },
    { key: "template", label: "점검표명", minWidth: 180 },
    { key: "workplace", label: "장소" },
    { key: "field", label: "점검분야" },
    { key: "schedule", label: "점검일정", minWidth: 150 },
    { key: "inspector", label: "점검자" },
    { key: "registeredAt", label: "최종등록일", minWidth: 120 },
    {
      key: "status",
      label: "진행여부",
      type: "progress",
      minWidth: 90,
      progressOptions: { doneValue: "완료", doneText: "점검완료", doingText: "점검하기" }
    }
  ]

  const pageTitle = currentIndex === 0 ? "점검목록" : "점검표(체크리스트)관리"

  return (
    <section className="w-full bg-white">
      <PageTitle>{pageTitle}</PageTitle>
      <TabMenu tabs={TAB_LABELS} activeIndex={currentIndex} onTabClick={handleTabClick} className="mb-6" />

      <div className="mb-6">
        <InfoBox message="장소, 분야, 점검종류별로 점검일정을 등록하고 관리합니다." />
      </div>

      <div className="mb-3">
        <FilterBar
          showDateRange={false}
          inspectionField={inspectionField}
          onInspectionFieldChange={setInspectionField}
          inspectionKind={inspectionKind}
          onInspectionKindChange={setInspectionKind}
          searchText={searchText}
          onSearchText={setSearchText}
          onSearch={handleSearch}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
        <div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
          <Button variant="action" onClick={() => setIsPlanRegisterOpen(true)} className="flex items-center gap-1">
            <CirclePlus size={16} />신규등록
          </Button>
          {todayPatrolCompleted ? (
            <Button
              variant="action"
              onClick={() => {
                setPatrolDialogMode("view")
                setIsPatrolDialogOpen(true)
              }}
              className="flex items-center gap-1"
            >
              <ClipboardList size={16} />안전순회 점검일지
            </Button>
          ) : (
            <Button
              variant="action"
              onClick={() => {
                setPatrolDialogMode("edit")
                setIsPatrolDialogOpen(true)
              }}
              className="flex items-center gap-1"
            >
              <ClipboardList size={16} />안전순회 점검일지
            </Button>
          )}
          <Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
            <Trash2 size={16} />삭제
          </Button>
        </div>
        <div className="flex flex-col gap-1 w-full justify-end sm:hidden">
          <div className="flex gap-1 justify-end">
            <Button variant="action" onClick={() => setIsPlanRegisterOpen(true)} className="flex items-center gap-1">
              <CirclePlus size={16} />신규등록
            </Button>
            {todayPatrolCompleted ? (
              <Button
                variant="action"
                onClick={() => {
                  setPatrolDialogMode("view")
                  setIsPatrolDialogOpen(true)
                }}
                className="flex items-center gap-1"
              >
                <ClipboardList size={16} />안전순회 점검일지
              </Button>
            ) : (
              <Button
                variant="action"
                onClick={() => {
                  setPatrolDialogMode("edit")
                  setIsPatrolDialogOpen(true)
                }}
                className="flex items-center gap-1"
              >
                <ClipboardList size={16} />안전순회 점검일지
              </Button>
            )}
            <Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
              <Trash2 size={16} />삭제
            </Button>
          </div>
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

      <InspectionLog
        open={isResultViewOpen}
        onClose={() => {
          setIsResultViewOpen(false)
          setSelectedResult(null)
        }}
        data={selectedResult ? {
          id: selectedResult.id,
          template: selectedResult.template,
          workplace: selectedResult.workplace,
          field: selectedResult.field,
          kind: selectedResult.kind,
          inspector: selectedResult.inspector,
          inspectedAt: selectedResult.schedule,
          confirmed: true,
          notes: selectedResult.notes || ""
        } : null}
        mode={resultViewMode}
      />

      <InspectionRoutineRegister
        open={isPatrolDialogOpen}
        onClose={() => setIsPatrolDialogOpen(false)}
        mode={patrolDialogMode}
      />

      <InspectionPlanRegister
        open={isPlanRegisterOpen}
        onClose={() => setIsPlanRegisterOpen(false)}
      />
    </section>
  )
}