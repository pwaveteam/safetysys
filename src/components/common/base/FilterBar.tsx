import React from "react"
import Button from "@/components/common/base/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FilterBarProps {
showDateRange?: boolean
startDate?: string
endDate?: string
onStartDate?: (date: string) => void
onEndDate?: (date: string) => void
showMonthPicker?: boolean
selectedMonth?: string
onMonthChange?: (month: string) => void
keyword?: string
onKeywordChange?: (value: string) => void
searchText?: string
onSearchText?: (value: string) => void
educationCourse?: string
onEducationCourseChange?: (value: string) => void
educationTarget?: string
onEducationTargetChange?: (value: string) => void
inspectionField?: string
onInspectionFieldChange?: (value: string) => void
inspectionKind?: string
onInspectionKindChange?: (value: string) => void
reportDocumentType?: string
onReportDocumentTypeChange?: (value: string) => void
reportDocumentTypeOptionsList?: { value: string; label: string }[]
groupFilter?: string
onGroupFilterChange?: (value: string) => void
groupOptions?: { value: string; label: string }[]
onSearch: () => void
rightContent?: React.ReactNode
}

const TEXT_CLASS = "text-gray-800"
const INPUT_CLASS = `h-[32px] md:h-[36px] border border-[var(--border)] rounded-[8px] px-2 md:px-3 bg-white focus:outline-none focus:border-[var(--primary)] text-xs md:text-sm font-normal ${TEXT_CLASS} placeholder:text-gray-500`

const courseOptions = [
{ value: "", label: "교육과정 선택" },
{ value: "정기교육", label: "정기교육" },
{ value: "채용 시 교육", label: "채용 시 교육" },
{ value: "작업내용 변경 시 교육", label: "작업내용 변경 시 교육" },
{ value: "특별교육", label: "특별교육" },
{ value: "신규교육", label: "신규교육" },
{ value: "보수교육", label: "보수교육" },
{ value: "최초 노무제공 시 교육", label: "최초 노무제공 시 교육" },
{ value: "건설업 기초안전보건교육", label: "건설업 기초안전보건교육" }
]

const targetOptions = [
{ value: "", label: "교육대상 선택" },
{ value: "근로자 교육", label: "근로자 교육" },
{ value: "관리자 교육", label: "관리자 교육" },
{ value: "기타 교육", label: "기타 교육" }
]

export const inspectionFieldOptions = [
{ value: "", label: "점검분야 선택" },
{ value: "시설물", label: "시설물" },
{ value: "자산(설비)", label: "자산(설비)" },
{ value: "자율점검", label: "자율점검" }
]

export const inspectionKindOptions = [
{ value: "", label: "점검종류 선택" },
{ value: "정기점검", label: "정기점검" },
{ value: "수시점검", label: "수시점검" },
{ value: "특별점검", label: "특별점검" },
{ value: "일일점검", label: "일일점검" }
]

export const reportDocumentTypeOptions = [
{ value: "", label: "문서종류 선택" },
{ value: "TBM", label: "TBM" },
{ value: "안전보건교육", label: "안전보건교육" },
{ value: "점검표", label: "점검표" },
{ value: "아차사고", label: "아차사고" },
{ value: "안전보이스", label: "안전보이스" },
{ value: "작업중지요청", label: "작업중지요청" },
{ value: "대응매뉴얼", label: "대응매뉴얼" },
{ value: "위험성평가", label: "위험성평가" }
]

export const contractorDocumentTypeOptions = [
{ value: "", label: "문서종류 선택" },
{ value: "안전보건수준 평가", label: "안전보건수준 평가" },
{ value: "안전보건협의체 회의록", label: "안전보건협의체 회의록" },
{ value: "협동 안전보건점검", label: "협동 안전보건점검" }
]

const renderSelect = (value: string, onChange: (v: string) => void, options: { value: string; label: string }[]) => (
<select className={`${INPUT_CLASS} w-full sm:w-[220px] appearance-none pr-6 md:pr-8`} value={value} onChange={e => onChange(e.target.value)}>
{options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
</select>
)

const FilterBar: React.FC<FilterBarProps> = ({
showDateRange = true,
startDate,
endDate,
onStartDate,
onEndDate,
showMonthPicker,
selectedMonth,
onMonthChange,
keyword,
onKeywordChange,
searchText,
onSearchText,
educationCourse,
onEducationCourseChange,
educationTarget,
onEducationTargetChange,
inspectionField,
onInspectionFieldChange,
inspectionKind,
onInspectionKindChange,
reportDocumentType,
onReportDocumentTypeChange,
reportDocumentTypeOptionsList,
groupFilter,
onGroupFilterChange,
groupOptions,
onSearch,
rightContent
}) => {
const shouldShowDate = Boolean(showDateRange && startDate !== undefined && endDate !== undefined && onStartDate && onEndDate)
const shouldShowMonth = Boolean(showMonthPicker && selectedMonth !== undefined && onMonthChange)

const handlePrevMonth = () => {
  if (!selectedMonth || !onMonthChange) return
  const [year, month] = selectedMonth.split("-").map(Number)
  const prevDate = new Date(year, month - 2, 1)
  onMonthChange(`${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`)
}

const handleNextMonth = () => {
  if (!selectedMonth || !onMonthChange) return
  const [year, month] = selectedMonth.split("-").map(Number)
  const nextDate = new Date(year, month, 1)
  onMonthChange(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`)
}

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split("-")
  return `${year}년 ${parseInt(month)}월`
}

const hasSearchInput = (keyword !== undefined && onKeywordChange) || (searchText !== undefined && onSearchText)

return (
<section className="tbm-filter w-full flex flex-wrap items-center justify-between gap-2 px-2 md:px-3 py-2 md:py-3 mb-2 md:mb-3 bg-white border border-[var(--border)] rounded-[10px]">
<div className="flex flex-wrap items-center gap-2 min-w-0">
{shouldShowMonth && (
<div className="flex items-center gap-1 shrink-0">
<button
  onClick={handlePrevMonth}
  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-600"
>
  <ChevronLeft size={18} />
</button>
<span className="text-sm font-medium text-gray-800 min-w-[90px] text-center select-none">
  {formatMonth(selectedMonth!)}
</span>
<button
  onClick={handleNextMonth}
  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-600"
>
  <ChevronRight size={18} />
</button>
</div>
)}

{shouldShowDate && (
<div className="flex items-center gap-1 md:gap-2 w-full sm:w-auto min-w-0">
<span className="text-xs md:text-sm font-medium text-gray-800 whitespace-nowrap shrink-0">기간</span>
<div className="flex items-center gap-1 md:gap-2 flex-1 sm:flex-none w-full sm:w-auto">
<input type="date" className={`${INPUT_CLASS} flex-1 sm:w-[130px] w-full`} value={startDate} onChange={e => onStartDate!(e.target.value)} />
<span className={`text-xs md:text-sm font-normal ${TEXT_CLASS} select-none shrink-0`}>~</span>
<input type="date" className={`${INPUT_CLASS} flex-1 sm:w-[130px] w-full`} value={endDate} onChange={e => onEndDate!(e.target.value)} />
</div>
</div>
)}

{((educationCourse !== undefined && onEducationCourseChange) || (educationTarget !== undefined && onEducationTargetChange)) && (
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
{educationCourse !== undefined && onEducationCourseChange && renderSelect(educationCourse, onEducationCourseChange, courseOptions)}
{educationTarget !== undefined && onEducationTargetChange && renderSelect(educationTarget, onEducationTargetChange, targetOptions)}
</div>
)}

{((inspectionField !== undefined && onInspectionFieldChange) || (inspectionKind !== undefined && onInspectionKindChange)) && (
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
{inspectionKind !== undefined && onInspectionKindChange && renderSelect(inspectionKind, onInspectionKindChange, inspectionKindOptions)}
{inspectionField !== undefined && onInspectionFieldChange && renderSelect(inspectionField, onInspectionFieldChange, inspectionFieldOptions)}
</div>
)}

{reportDocumentType !== undefined && onReportDocumentTypeChange && (
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
{renderSelect(reportDocumentType, onReportDocumentTypeChange, reportDocumentTypeOptionsList || reportDocumentTypeOptions)}
</div>
)}

{groupFilter !== undefined && onGroupFilterChange && groupOptions && (
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
{renderSelect(groupFilter, onGroupFilterChange, groupOptions)}
</div>
)}

{hasSearchInput ? (
<div className="flex items-center gap-1 md:gap-2 w-full sm:w-auto min-w-0">
<div className="flex items-center gap-1 md:gap-2 w-full sm:w-auto">
<input
type="text"
className={`${INPUT_CLASS} flex-1 w-full sm:w-[250px]`}
placeholder="검색어 입력"
value={keyword ?? searchText ?? ""}
onChange={e => { if (onKeywordChange) onKeywordChange(e.target.value); else if (onSearchText) onSearchText(e.target.value) }}
/>
<Button variant="primary" className="h-[32px] md:h-[36px] px-3 md:px-5 text-xs md:text-sm shrink-0" onClick={onSearch}>검색</Button>
</div>
</div>
) : (
<div className="flex items-center gap-1 flex-shrink-0 w-full sm:w-auto">
<Button variant="primary" className="h-[32px] md:h-[36px] px-3 md:px-5 text-xs md:text-sm w-full sm:w-auto" onClick={onSearch}>검색</Button>
</div>
)}
</div>

{rightContent && (
<div className="flex items-center shrink-0">
{rightContent}
</div>
)}
</section>
)
}

export default FilterBar