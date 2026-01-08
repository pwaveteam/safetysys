import React, { useState, useMemo } from "react"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import InspectionChecklistRegister from "@/pages/Inspection/InspectionChecklistRegister"
import InspectionResultView from "@/pages/Inspection/InspectionResultView"
import InspectionRoutineRegister from "@/pages/Inspection/InspectionRoutineRegister"
import InspectionPlanRegister from "@/pages/Inspection/InspectionPlanRegister"
import usePagination from "@/hooks/usePagination"
import useHandlers from "@/hooks/useHandlers"
import { ClipboardList, CirclePlus, ChevronLeft, ChevronRight, Eye, SquareCheck, Trash2 } from "lucide-react"
import { inspectionResultsMockData, inspectionPlanMockData } from "@/data/mockData"
import { DocumentTemplate } from "@/components/snippetDocument/printDocument"

const PAGE_SIZE = 15

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

const getWeekDates = (baseDate: Date) => {
const day = baseDate.getDay()
const sunday = new Date(baseDate)
sunday.setDate(baseDate.getDate() - day)

const dates = []
for (let i = 0; i < 7; i++) {
const d = new Date(sunday)
d.setDate(sunday.getDate() + i)
dates.push(d)
}
return dates
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

const STATUS_OPTIONS = [
{ value: "all", label: "전체" },
{ value: "예정", label: "예정" },
{ value: "완료", label: "완료" }
]

const FIELD_OPTIONS = [
{ value: "all", label: "점검분야 선택" },
{ value: "자산(설비)", label: "자산(설비)" },
{ value: "시설물", label: "시설물" },
{ value: "자율점검", label: "자율점검" }
]

const KIND_OPTIONS = [
{ value: "all", label: "점검종류 선택" },
{ value: "정기점검", label: "정기점검" },
{ value: "수시점검", label: "수시점검" },
{ value: "특별점검", label: "특별점검" }
]

export default function Inspection() {
const [currentWeekStart, setCurrentWeekStart] = useState(() => {
const today = new Date()
const day = today.getDay()
const sunday = new Date(today)
sunday.setDate(today.getDate() - day)
return sunday
})

const [patrolData] = useState<Record<string, boolean>>({
"2026-01-06": true,
})

const allInspectionData = useMemo(() => {
const planData = inspectionPlanMockData.map(convertPlanToInspection)
const resultData = inspectionResultsMockData.map(convertResultToInspection)
const filteredPlanData = planData.filter(p => p.status !== "완료")
return [...filteredPlanData, ...resultData]
}, [])

const [data, setData] = useState<InspectionRow[]>(allInspectionData)
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false)
const [isResultViewOpen, setIsResultViewOpen] = useState(false)
const [selectedResult, setSelectedResult] = useState<InspectionRow | null>(null)
const [isPatrolDialogOpen, setIsPatrolDialogOpen] = useState(false)
const [patrolDialogMode, setPatrolDialogMode] = useState<"view" | "edit">("view")
const [isPlanRegisterOpen, setIsPlanRegisterOpen] = useState(false)

const [statusFilter, setStatusFilter] = useState("all")
const [fieldFilter, setFieldFilter] = useState("all")
const [kindFilter, setKindFilter] = useState("all")
const [searchText, setSearchText] = useState("")

const filteredData = useMemo(() => {
let result = data
if (statusFilter !== "all") {
result = result.filter(r => r.status === statusFilter)
}
if (fieldFilter !== "all") {
result = result.filter(r => r.field === fieldFilter)
}
if (kindFilter !== "all") {
result = result.filter(r => r.kind === kindFilter)
}
if (searchText.trim()) {
const search = searchText.toLowerCase()
result = result.filter(r =>
r.template.toLowerCase().includes(search) ||
r.workplace.toLowerCase().includes(search) ||
r.inspector.toLowerCase().includes(search)
)
}
return result
}, [data, statusFilter, fieldFilter, kindFilter, searchText])

const { currentPage, totalPages, currentData: pagedData, onPageChange } = usePagination(filteredData, PAGE_SIZE)

const { handleDelete } = useHandlers({
data,
checkedIds,
onDeleteSuccess: (deletedIds) => {
setData(prev => prev.filter(item => !deletedIds.includes(item.id)))
setCheckedIds([])
}
})

const weekDates = getWeekDates(currentWeekStart)

const prevWeek = () => {
const newStart = new Date(currentWeekStart)
newStart.setDate(newStart.getDate() - 7)
setCurrentWeekStart(newStart)
}

const nextWeek = () => {
const newStart = new Date(currentWeekStart)
newStart.setDate(newStart.getDate() + 7)
setCurrentWeekStart(newStart)
}

const goToToday = () => {
const today = new Date()
const day = today.getDay()
const sunday = new Date(today)
sunday.setDate(today.getDate() - day)
setCurrentWeekStart(sunday)
}

const formatDateKey = (d: Date) => {
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const handleRowClick = (row: InspectionRow) => {
if (row.status === "완료") {
setSelectedResult(row)
setIsResultViewOpen(true)
}
}

const columns: Column<InspectionRow>[] = [
{ key: "index", label: "번호", type: "index" },
{ key: "kind", label: "종류" },
{ key: "template", label: "점검표명", minWidth: 180 },
{ key: "workplace", label: "장소" },
{ key: "field", label: "분야" },
{ key: "schedule", label: "점검일정", minWidth: 150 },
{ key: "inspector", label: "점검자" },
{ key: "registeredAt", label: "최종등록일", minWidth: 120 },
{
key: "status",
label: "상태",
align: "center",
minWidth: 90,
renderCell: (row) => {
if (row.status === "완료") {
return (
<button onClick={() => handleRowClick(row)} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors whitespace-nowrap">
<Eye size={12} />
점검완료
</button>
)
}
return (
<button onClick={() => alert("점검하기 기능은 준비중입니다.")} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity whitespace-nowrap">
<SquareCheck size={12} />
점검하기
</button>
)
}
}
]

const SELECT_CLASS = "border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"

return (
<section className="w-full bg-white">
<PageTitle>안전점검</PageTitle>

<div className="mb-6 border border-[var(--border)] rounded-lg p-4">
<div className="flex items-center justify-between mb-4">
<h3 className="text-sm font-semibold text-gray-800">일일순회점검</h3>
<div className="flex items-center gap-3">
<button onClick={goToToday} className="text-xs px-2 py-1 border border-[var(--border)] rounded hover:bg-gray-50 text-gray-600 transition">
오늘
</button>
<button onClick={prevWeek} className="text-gray-400 hover:text-gray-600 transition">
<ChevronLeft size={18} />
</button>
<span className="text-sm font-semibold text-gray-800 min-w-[80px] text-center">
{currentWeekStart.getMonth() + 1}월 {Math.ceil((currentWeekStart.getDate() + new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), 1).getDay()) / 7)}주차
</span>
<button onClick={nextWeek} className="text-gray-400 hover:text-gray-600 transition">
<ChevronRight size={18} />
</button>
</div>
</div>

<div className="flex gap-2">
{weekDates.map((date, idx) => {
const dateKey = formatDateKey(date)
const isCompleted = patrolData[dateKey]
const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
const isPast = date < todayStart
const isToday = formatDateKey(date) === formatDateKey(new Date())
const isFuture = date > todayStart && !isToday
const isSunday = idx === 0
const isSaturday = idx === 6

return (
<div
key={idx}
className={`flex-1 rounded-lg p-2 text-center transition-all ${
isToday
? "bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]"
: "bg-gray-50"
}`}
>
<div className={`text-xs font-medium ${
isToday ? "text-[var(--primary)]"
: isSunday ? "text-red-600"
: isSaturday ? "text-blue-600"
: "text-gray-500"
}`}>
{DAYS[idx]}
</div>
<div className={`text-xl font-medium my-1 ${
isToday ? "text-[var(--primary)]"
: isSunday ? "text-red-600"
: isSaturday ? "text-blue-600"
: "text-gray-800"
}`}>
{date.getDate()}
</div>
<div className="min-h-[28px] flex items-center justify-center">
{isCompleted ? (
<button
  onClick={(e) => {
    e.stopPropagation()
    setPatrolDialogMode("view")
    setIsPatrolDialogOpen(true)
  }}
  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors whitespace-nowrap"
>
  <Eye size={12} />
  점검완료
</button>
) : isPast ? (
<span className="px-2 py-1 text-xs rounded-lg border border-gray-200 bg-white text-gray-400 whitespace-nowrap">
  미점검
</span>
) : isFuture ? (
<span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-gray-200 text-gray-400 whitespace-nowrap">
  <SquareCheck size={12} />
  점검하기
</span>
) : (
<button
  onClick={(e) => {
    e.stopPropagation()
    setPatrolDialogMode("edit")
    setIsPatrolDialogOpen(true)
  }}
  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity whitespace-nowrap"
>
  <SquareCheck size={12} />
  점검하기
</button>
)}
</div>
</div>
)
})}
</div>
</div>

<div className="border border-[var(--border)] rounded-lg p-4">
<h3 className="text-sm font-semibold text-gray-800 mb-4">점검관리</h3>

<div className="flex flex-wrap items-center justify-between gap-3 mb-3">
<div className="flex flex-wrap items-center gap-1">
<select
value={statusFilter}
onChange={e => setStatusFilter(e.target.value)}
className={SELECT_CLASS}
>
{STATUS_OPTIONS.map(opt => (
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>

<select
value={fieldFilter}
onChange={e => setFieldFilter(e.target.value)}
className={SELECT_CLASS}
>
{FIELD_OPTIONS.map(opt => (
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>

<select
value={kindFilter}
onChange={e => setKindFilter(e.target.value)}
className={SELECT_CLASS}
>
{KIND_OPTIONS.map(opt => (
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>

<input
type="text"
value={searchText}
onChange={e => setSearchText(e.target.value)}
placeholder="검색어 입력"
className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-[var(--primary)] transition-colors"
/>
</div>
<div className="flex flex-wrap items-center gap-1">
<Button variant="action" onClick={() => setIsPlanRegisterOpen(true)} className="flex items-center gap-1">
<CirclePlus size={16} />신규등록
</Button>
<Button variant="action" onClick={() => setIsChecklistDialogOpen(true)} className="flex items-center gap-1">
<ClipboardList size={16} />점검표관리
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
onManageClick={handleRowClick}
/>
</div>

<div className="mt-4 flex justify-center">
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
</div>
</div>

<InspectionChecklistRegister
open={isChecklistDialogOpen}
onClose={() => setIsChecklistDialogOpen(false)}
/>

<InspectionResultView
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