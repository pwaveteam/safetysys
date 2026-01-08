import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import usePagination from "@/hooks/usePagination"
import useTabNavigation from "@/hooks/useTabNavigation"
import useHandlers from "@/hooks/useHandlers"
import useFilterBar from "@/hooks/useFilterBar"
import { CirclePlus, Trash2, FileSpreadsheet, Printer } from "lucide-react"
import { safetyEducationMockData } from "@/data/mockData"
import { DocumentTemplate } from "@/components/snippetDocument/printDocument"

type EducationRow = DataRow & { id: number | string; course: string; targetGroup: string; eduName: string; date: string; trainer: string; sitePhotos: string[] }

const TAB_LABELS = ["안전보건교육"]
const TAB_PATHS = ["/safety-education/education"]

const educationColumns: Column[] = [
  { key: "index", label: "번호", type: "index" },
  { key: "course", label: "교육과정" },
  { key: "targetGroup", label: "교육대상" },
  { key: "eduName", label: "교육명" },
  { key: "date", label: "교육일자" },
  { key: "trainer", label: "강사" },
  { key: "sitePhotos", label: "현장사진", type: "photo" },
  { key: "eduMaterial", label: "교육자료", type: "download" },
  { key: "proof", label: "첨부파일", type: "download" },
  { key: "manage", label: "관리", type: "manage" }
]

const createEducationTemplate = (row: EducationRow): DocumentTemplate => ({
  id: `education-${row.id}`,
  title: "안전보건교육 보고서",
  companyName: "",
  documentNumber: `EDU_${String(row.id).padStart(8, "0")}`,
  createdAt: row.date,
  fields: [
    { label: "교육과정", value: row.course, type: "text", section: "overview" },
    { label: "교육대상", value: row.targetGroup, type: "text", section: "overview" },
    { label: "교육명", value: row.eduName, type: "text", section: "overview" },
    { label: "교육일자", value: row.date, type: "date", section: "overview" },
    { label: "강사", value: row.trainer, type: "text", section: "overview" },
    ...(row.sitePhotos?.length ? [{ label: "현장사진", value: row.sitePhotos, type: "photos" as const, section: "content" as const }] : [])
  ]
})

export default function EducationList() {
  const navigate = useNavigate()
  const [data, setData] = useState<EducationRow[]>(safetyEducationMockData as EducationRow[])
  const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
  const { currentIndex, handleTabClick } = useTabNavigation(TAB_PATHS)

  const {
    educationCourse,
    setEducationCourse,
    educationTarget,
    setEducationTarget,
    filteredData,
    handleSearch
  } = useFilterBar({ data, dateKey: "date", searchKeys: ["eduName", "trainer", "course"] })

  const { currentPage, totalPages, currentData, onPageChange } = usePagination<EducationRow>(filteredData as EducationRow[], 30)

  const { handleDelete, handleExcelDownload, handlePrint, isDownloading, isPrinting } = useHandlers<EducationRow>({
    data: filteredData as EducationRow[],
    checkedIds,
    onDeleteSuccess: ids => setData(prev => prev.filter(r => !ids.includes(r.id))),
    createTemplate: createEducationTemplate
  })

  return (
    <section className="education-content w-full bg-white">
      <PageTitle>안전보건교육</PageTitle>
      <TabMenu tabs={TAB_LABELS} activeIndex={currentIndex} onTabClick={handleTabClick} className="mb-6" />
      <div className="mb-3">
        <FilterBar
          showDateRange={false}
          educationCourse={educationCourse}
          onEducationCourseChange={setEducationCourse}
          educationTarget={educationTarget}
          onEducationTargetChange={setEducationTarget}
          onSearch={handleSearch}
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
        <div className="flex flex-col gap-1 w-full justify-end sm:hidden">
          <div className="flex gap-1 justify-end">
            <Button variant="action" onClick={() => navigate("/safety-education/register", { state: { mode: "create" } })} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
            <Button variant="action" loading={isPrinting} onClick={handlePrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
            <Button variant="action" loading={isDownloading} onClick={handleExcelDownload} className="flex items-center gap-1"><FileSpreadsheet size={16} />Excel</Button>
            <Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
          </div>
        </div>
        <div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
          <Button variant="action" onClick={() => navigate("/safety-education/register", { state: { mode: "create" } })} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
          <Button variant="action" loading={isPrinting} onClick={handlePrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
          <Button variant="action" loading={isDownloading} onClick={handleExcelDownload} className="flex items-center gap-1"><FileSpreadsheet size={16} />Excel</Button>
          <Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white">
        <DataTable
          columns={educationColumns}
          data={currentData}
          onCheckedChange={setCheckedIds}
          onManageClick={() => navigate("/safety-education/register", { state: { mode: "edit" } })}
        />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </section>
  )
}