import React, { useState, useMemo } from "react"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import useFilterBar from "@/hooks/useFilterBar"
import usePagination from "@/hooks/usePagination"
import useTabNavigation from "@/hooks/useTabNavigation"
import useHandlers from "@/hooks/useHandlers"
import { educationCertificateMockData } from "@/data/mockBusinessData"
import { QrCode, Trash2 } from "lucide-react"

const TAB_LABELS = ["안전보건교육", "이수증관리"]
const TAB_PATHS = ["/safety-education/education", "/safety-education/certificate"]

const columns: Column[] = [
  { key: "index", label: "번호", type: "index" },
  { key: "submitDate", label: "제출일" },
  { key: "name", label: "성명" },
  { key: "phone", label: "연락처" },
  { key: "eduName", label: "교육명" },
  { key: "eduDate", label: "교육일자" },
  { key: "certificate", label: "이수증", type: "certificate" },
  { key: "submitStatus", label: "확인", type: "badge" }
]

export default function EducationCertificate() {
const sortedMockData = useMemo(() => {
  return [...educationCertificateMockData].sort((a, b) => {
    const dateA = String(a.submitDate || "")
    const dateB = String(b.submitDate || "")
    return dateB.localeCompare(dateA)
  })
}, [])
const [data, setData] = useState<DataRow[]>(sortedMockData)
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const { searchText, setSearchText, filteredData, handleSearch } = useFilterBar({data, dateKey:"submitDate", searchKeys:["name","eduName","phone"]})
const { currentIndex, handleTabClick } = useTabNavigation(TAB_PATHS)
const { currentPage, totalPages, currentData, onPageChange } = usePagination<DataRow>(filteredData, 30)

const { handleDelete, handleGenerateQR } = useHandlers({
data,
checkedIds,
onDeleteSuccess: ids => setData(prev => prev.filter(r => !ids.includes(r.id)))
})

return (
<section className="education-certificate-content w-full bg-white">
<PageTitle>이수증관리</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentIndex} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar
searchText={searchText}
onSearchText={setSearchText}
onSearch={handleSearch}
/>
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1"><QrCode size={16} />QR</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>
<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={currentData}
onCheckedChange={setCheckedIds}
onCertificateClick={(row) => {
  if (row.certificate) {
    alert(`이수증 파일: ${row.certificate}`)
  }
}}
/>
</div>
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
</section>
)
}