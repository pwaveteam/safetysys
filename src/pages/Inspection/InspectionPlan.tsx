import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import QRDialog from "@/components/QR/QRDialog"
import useFilterBar from "@/hooks/useFilterBar"
import usePagination from "@/hooks/usePagination"
import useHandlers from "@/hooks/useHandlers"
import useTabNavigation from "@/hooks/useTabNavigation"
import { CirclePlus, QrCode, Trash2, Eye } from "lucide-react"
import { inspectionPlanMockData } from "@/data/mockData"

const TAB_LABELS = ["점검일정", "점검결과", "점검표(체크리스트)"]
const TAB_PATHS = ["/inspection/plan", "/inspection/results", "/inspection/checklist"]

type PlanRow = DataRow & {
planName: string
site: string
area: string
kind: string
inspector: string
schedule: string
registrant: string
progress: "미점검" | "완료"
}

export default function InspectionPlan() {
const navigate = useNavigate()
const { currentIndex, handleTabClick } = useTabNavigation(TAB_PATHS)
const [data, setData] = useState<PlanRow[]>(inspectionPlanMockData as PlanRow[])
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])

const [qrDialogOpen, setQrDialogOpen] = useState(false)
const [qrUrl, setQrUrl] = useState("")

const {
  searchText,
  setSearchText,
  inspectionField,
  setInspectionField,
  inspectionKind,
  setInspectionKind,
  filteredData,
  handleSearch
} = useFilterBar({ data, dateKey: "schedule", searchKeys: ["planName", "site", "inspector", "registrant"] })

const { currentPage, totalPages, currentData, onPageChange } = usePagination<PlanRow>(filteredData as PlanRow[], 30)

const { handleCreate, handleDelete } = useHandlers({
data,
checkedIds,
onCreate: () => navigate("/inspection/plan/register"),
onDeleteSuccess: ids => setData(prev => prev.filter(row => !ids.includes(row.id)))
})

const handleOpenQR = () => {
if (checkedIds.length === 0) {
const url = `${window.location.origin}/public/inspection`
setQrUrl(url)
} else {
const url = `${window.location.origin}/public/inspection?ids=${checkedIds.join(",")}`
setQrUrl(url)
}
setQrDialogOpen(true)
}

const handleStartInspection = (id: number | string) => {
navigate(`/inspection/plan/${id}/execute`)
}

const btnBase = { background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer", font: "inherit", lineHeight: "inherit" }

const columns: Column<PlanRow>[] = [
{ key: "index", label: "번호", type: "index", align: "center" },
{ key: "planName", label: "점검표명" },
{ key: "site", label: "장소" },
{ key: "area", label: "점검분야" },
{ key: "kind", label: "점검종류" },
{ key: "schedule", label: "점검일정" },
{ key: "inspector", label: "점검자" },
{ key: "registrant", label: "등록인" },
{
key: "progress",
label: "점검여부",
align: "center",
renderCell: row => (
<div className="flex justify-center">
{row.progress === "완료" ? (
<button style={{ ...btnBase, color: "#9CA3AF", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "default" }}>
<Eye size={14} />
점검완료
</button>
) : (
<button type="button" onClick={() => handleStartInspection(row.id)} style={{ ...btnBase, color: "var(--tertiary)", display: "inline-flex", alignItems: "center", gap: "4px" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
<Eye size={14} />
점검하기
</button>
)}
</div>
)
}
]

return (
<section className="inspection-plan w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentIndex} onTabClick={handleTabClick} className="mb-6" />

<div className="mb-3">
<FilterBar
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

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
<Button variant="action" onClick={handleOpenQR} className="flex items-center gap-1"><QrCode size={16} />QR</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
<Button variant="action" onClick={handleOpenQR} className="flex items-center gap-1"><QrCode size={16} />QR</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable<PlanRow> columns={columns} data={currentData} onCheckedChange={setCheckedIds} />
</div>

<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

<QRDialog
open={qrDialogOpen}
url={qrUrl}
title="점검 QR코드"
onClose={() => setQrDialogOpen(false)}
/>
</section>
)
}