import React, { useState, useMemo, useCallback, useEffect } from "react"
import Button from "@/components/common/base/Button"
import { X, Search, Plus } from "lucide-react"
import { inspectionFieldOptions, inspectionKindOptions } from "@/components/common/base/FilterBar"
import { inspectionChecklistMockData } from "@/data/mockData"
import useForm, { ValidationRules } from "@/hooks/useForm"

interface InspectionPlanRegisterProps {
open: boolean
onClose: () => void
onSave?: (data: FormData) => void
}

interface FormData {
location: string
field: string
kind: string
scheduleStart: string
scheduleEnd: string
templateId: number | string | null
templateName: string
inspectorName: string
inspectorPhone: string
repeatType: "daily" | "weekly" | "monthly" | null
weeklyDays: string[]
monthlyDates: number[]
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"]
const INPUT_CLASS = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors bg-white placeholder:text-gray-500"
const INPUT_ERROR_CLASS = "border-red-500"
const INPUT_NORMAL_CLASS = "border-[var(--border)]"
const LABEL_CLASS = "block text-sm font-medium text-gray-700 mb-1"
const REQUIRED_MARK = <span className="text-red-500 ml-0.5">*</span>

const initialFormData: FormData = {
location: "",
field: "",
kind: "",
scheduleStart: "",
scheduleEnd: "",
templateId: null,
templateName: "",
inspectorName: "",
inspectorPhone: "",
repeatType: null,
weeklyDays: [],
monthlyDates: []
}

export default function InspectionPlanRegister({ open, onClose, onSave }: InspectionPlanRegisterProps) {
const [formData, setFormData] = useState<FormData>(initialFormData)
const [isTemplateSearchOpen, setIsTemplateSearchOpen] = useState(false)
const [templateSearchText, setTemplateSearchText] = useState("")
const [newMonthlyDate, setNewMonthlyDate] = useState("")
const [monthlyDateError, setMonthlyDateError] = useState("")

const validationRules = useMemo<ValidationRules>(() => ({
location: { required: true },
field: { required: true },
kind: { required: true },
scheduleStart: { required: true },
scheduleEnd: { required: true },
templateName: { required: true }
}), [])

const formValues = useMemo(() => ({
location: formData.location,
field: formData.field,
kind: formData.kind,
scheduleStart: formData.scheduleStart,
scheduleEnd: formData.scheduleEnd,
templateName: formData.templateName
}), [formData])

const { validateForm, isFieldInvalid, getFieldError, clearErrors } = useForm(validationRules, formValues)

useEffect(() => {
if (open) {
setFormData(initialFormData)
setTemplateSearchText("")
setNewMonthlyDate("")
setMonthlyDateError("")
clearErrors()
}
}, [open, clearErrors])

const filteredTemplates = useMemo(() => {
if (!templateSearchText.trim()) return inspectionChecklistMockData
const search = templateSearchText.toLowerCase()
return inspectionChecklistMockData.filter((item: any) =>
item.template.toLowerCase().includes(search)
)
}, [templateSearchText])

const handleChange = (field: keyof FormData, value: any) => {
setFormData(prev => ({ ...prev, [field]: value }))
}

const formatPhoneNumber = (value: string) => {
const numbers = value.replace(/[^\d]/g, "")
if (numbers.length <= 3) return numbers
if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const formatted = formatPhoneNumber(e.target.value)
setFormData(prev => ({ ...prev, inspectorPhone: formatted }))
}

const handleStartDateChange = useCallback((date: string) => {
setFormData(prev => {
if (prev.scheduleEnd && date > prev.scheduleEnd) {
return { ...prev, scheduleStart: date, scheduleEnd: date }
}
return { ...prev, scheduleStart: date }
})
}, [])

const handleEndDateChange = useCallback((date: string) => {
setFormData(prev => {
if (prev.scheduleStart && date < prev.scheduleStart) {
return { ...prev, scheduleStart: date, scheduleEnd: date }
}
return { ...prev, scheduleEnd: date }
})
}, [])

const handleRepeatTypeChange = (type: "daily" | "weekly" | "monthly") => {
setFormData(prev => ({
...prev,
repeatType: prev.repeatType === type ? null : type,
weeklyDays: type === "weekly" ? prev.weeklyDays : [],
monthlyDates: type === "monthly" ? prev.monthlyDates : []
}))
setMonthlyDateError("")
}

const handleWeeklyDayToggle = (day: string) => {
setFormData(prev => ({
...prev,
weeklyDays: prev.weeklyDays.includes(day)
? prev.weeklyDays.filter(d => d !== day)
: [...prev.weeklyDays, day]
}))
}

const handleAddMonthlyDate = () => {
const dateNum = parseInt(newMonthlyDate)
if (isNaN(dateNum) || dateNum < 1 || dateNum > 31) {
setMonthlyDateError("1~31 사이의 숫자를 입력하세요")
return
}
if (formData.monthlyDates.includes(dateNum)) {
setMonthlyDateError("이미 추가된 날짜입니다")
return
}
setMonthlyDateError("")
setFormData(prev => ({
...prev,
monthlyDates: [...prev.monthlyDates, dateNum].sort((a, b) => a - b)
}))
setNewMonthlyDate("")
}

const handleRemoveMonthlyDate = (date: number) => {
setFormData(prev => ({
...prev,
monthlyDates: prev.monthlyDates.filter(d => d !== date)
}))
}

const handleSelectTemplate = (template: any) => {
setFormData(prev => ({
...prev,
templateId: template.id,
templateName: template.template
}))
setIsTemplateSearchOpen(false)
setTemplateSearchText("")
}

const handleSave = () => {
if (!validateForm(formValues)) return
onSave?.(formData)
onClose()
}

const getInputClass = (fieldName: string) => {
return `${INPUT_CLASS} ${isFieldInvalid(fieldName) ? INPUT_ERROR_CLASS : INPUT_NORMAL_CLASS}`
}

if (!open) return null

return (
<>
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[600px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-auto md:max-h-[90vh] flex flex-col relative">
<div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 shrink-0">
<h2 className="text-base md:text-xl font-bold tracking-tight text-gray-800">점검일정 등록</h2>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className="flex-1 overflow-auto space-y-4">
<div>
<label className={LABEL_CLASS}>장소 {REQUIRED_MARK}</label>
<input
type="text"
value={formData.location}
onChange={e => handleChange("location", e.target.value)}
placeholder="점검장소 입력"
className={getInputClass("location")}
/>
{isFieldInvalid("location") && <p className="text-red-500 text-xs mt-1">{getFieldError("location")}</p>}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className={LABEL_CLASS}>점검분야 {REQUIRED_MARK}</label>
<select
value={formData.field}
onChange={e => handleChange("field", e.target.value)}
className={getInputClass("field")}
>
{inspectionFieldOptions.map(opt => (
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>
{isFieldInvalid("field") && <p className="text-red-500 text-xs mt-1">{getFieldError("field")}</p>}
</div>
<div>
<label className={LABEL_CLASS}>점검종류 {REQUIRED_MARK}</label>
<select
value={formData.kind}
onChange={e => handleChange("kind", e.target.value)}
className={getInputClass("kind")}
>
{inspectionKindOptions.map(opt => (
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>
{isFieldInvalid("kind") && <p className="text-red-500 text-xs mt-1">{getFieldError("kind")}</p>}
</div>
</div>

<div>
<label className={LABEL_CLASS}>점검일정 {REQUIRED_MARK}</label>
<div className="flex items-center gap-2">
<input
type="date"
value={formData.scheduleStart}
onChange={e => handleStartDateChange(e.target.value)}
className={`${getInputClass("scheduleStart")} flex-1`}
/>
<span className="text-gray-500">~</span>
<input
type="date"
value={formData.scheduleEnd}
onChange={e => handleEndDateChange(e.target.value)}
className={`${getInputClass("scheduleEnd")} flex-1`}
/>
</div>
{(isFieldInvalid("scheduleStart") || isFieldInvalid("scheduleEnd")) && <p className="text-red-500 text-xs mt-1">{getFieldError("scheduleStart") || getFieldError("scheduleEnd")}</p>}
</div>

<div>
<label className={LABEL_CLASS}>점검표(체크리스트) {REQUIRED_MARK}</label>
<div className="relative">
<input
type="text"
value={formData.templateName}
readOnly
placeholder="점검표를 검색하여 선택하세요"
className={`${getInputClass("templateName")} pr-10 cursor-pointer bg-gray-50`}
onClick={() => setIsTemplateSearchOpen(true)}
/>
<button
onClick={() => setIsTemplateSearchOpen(true)}
className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition"
>
<Search size={18} className="text-gray-500" />
</button>
</div>
{isFieldInvalid("templateName") && <p className="text-red-500 text-xs mt-1">{getFieldError("templateName")}</p>}
</div>

<div>
<label className={LABEL_CLASS}>점검자</label>
<div className="grid grid-cols-2 gap-2">
<input
type="text"
value={formData.inspectorName}
onChange={e => handleChange("inspectorName", e.target.value)}
placeholder="점검자명"
className={`${INPUT_CLASS} ${INPUT_NORMAL_CLASS}`}
/>
<input
type="tel"
value={formData.inspectorPhone}
onChange={handlePhoneChange}
placeholder="010-0000-0000"
maxLength={13}
inputMode="numeric"
className={`${INPUT_CLASS} ${INPUT_NORMAL_CLASS}`}
/>
</div>
</div>

<div className="border border-[var(--border)] rounded-lg p-4 bg-gray-50">
<p className="text-xs text-gray-500 mb-3">반복 점검을 설정하려면 주기를 선택하세요</p>

<div className="mb-4">
<label className="flex items-center gap-2 cursor-pointer mb-2">
<input
type="radio"
name="repeatType"
checked={formData.repeatType === "daily"}
onChange={() => handleRepeatTypeChange("daily")}
className="w-4 h-4 text-[var(--primary)]"
/>
<span className={LABEL_CLASS} style={{ marginBottom: 0 }}>매일</span>
</label>
</div>

<div className="mb-4">
<label className="flex items-center gap-2 cursor-pointer mb-2">
<input
type="radio"
name="repeatType"
checked={formData.repeatType === "weekly"}
onChange={() => handleRepeatTypeChange("weekly")}
className="w-4 h-4 text-[var(--primary)]"
/>
<span className={LABEL_CLASS} style={{ marginBottom: 0 }}>주간 점검요일 지정</span>
</label>
{formData.repeatType === "weekly" && (
<div className="flex flex-wrap gap-2 ml-6">
{DAYS.map(day => (
<label
key={day}
className={`flex items-center justify-center w-10 h-10 border rounded-lg cursor-pointer transition-all ${
formData.weeklyDays.includes(day)
? "bg-[var(--primary)] text-white border-[var(--primary)]"
: "bg-white text-gray-700 border-[var(--border)] hover:border-[var(--primary)]"
}`}
>
<input
type="checkbox"
checked={formData.weeklyDays.includes(day)}
onChange={() => handleWeeklyDayToggle(day)}
className="hidden"
/>
<span className="text-sm font-medium">{day}</span>
</label>
))}
</div>
)}
</div>

<div>
<label className="flex items-center gap-2 cursor-pointer mb-2">
<input
type="radio"
name="repeatType"
checked={formData.repeatType === "monthly"}
onChange={() => handleRepeatTypeChange("monthly")}
className="w-4 h-4 text-[var(--primary)]"
/>
<span className={LABEL_CLASS} style={{ marginBottom: 0 }}>월별 점검일자 지정</span>
</label>
{formData.repeatType === "monthly" && (
<div className="ml-6">
<div className="flex items-center gap-2 mb-2">
<input
type="number"
min="1"
max="31"
value={newMonthlyDate}
onChange={e => {
setNewMonthlyDate(e.target.value)
setMonthlyDateError("")
}}
placeholder="일자 (1~31)"
className={`${INPUT_CLASS} ${monthlyDateError ? INPUT_ERROR_CLASS : INPUT_NORMAL_CLASS} w-32`}
onKeyDown={e => {
if (e.key === "Enter") {
e.preventDefault()
handleAddMonthlyDate()
}
}}
/>
<Button variant="action" onClick={handleAddMonthlyDate} className="flex items-center gap-1">
<Plus size={16} />추가
</Button>
</div>
{monthlyDateError && (
<p className="text-xs text-red-500 mb-2">{monthlyDateError}</p>
)}
{formData.monthlyDates.length > 0 && (
<div className="flex flex-wrap gap-2">
{formData.monthlyDates.map(date => (
<span
key={date}
className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
>
매월 {date}일
<button onClick={() => handleRemoveMonthlyDate(date)} className="p-0.5 hover:bg-gray-200 rounded">
<X size={14} />
</button>
</span>
))}
</div>
)}
</div>
)}
</div>
</div>
</div>

<div className="flex justify-center mt-4 pt-3 border-t border-gray-200 shrink-0 gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>

{isTemplateSearchOpen && (
<div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50">
<div className="bg-white rounded-lg w-full max-w-md mx-4 p-4 shadow-2xl max-h-[70vh] flex flex-col">
<div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
<h3 className="text-base font-bold text-gray-800">점검표 검색</h3>
<button
onClick={() => {
setIsTemplateSearchOpen(false)
setTemplateSearchText("")
}}
className="p-1 hover:bg-gray-100 rounded"
>
<X size={20} />
</button>
</div>

<div className="mb-3">
<div className="relative">
<input
type="text"
value={templateSearchText}
onChange={e => setTemplateSearchText(e.target.value)}
placeholder="점검표명 검색..."
className={`${INPUT_CLASS} ${INPUT_NORMAL_CLASS} pr-10`}
autoFocus
/>
<Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
</div>
</div>

<div className="flex-1 overflow-auto border border-[var(--border)] rounded-lg">
{filteredTemplates.length > 0 ? (
<ul className="divide-y divide-[var(--border)]">
{filteredTemplates.map((template: any) => (
<li
key={template.id}
onClick={() => handleSelectTemplate(template)}
className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition"
>
<div className="text-sm font-medium text-gray-800">{template.template}</div>
</li>
))}
</ul>
) : (
<div className="p-8 text-center text-gray-400 text-sm">검색 결과가 없습니다</div>
)}
</div>
</div>
</div>
)}
</>
)
}
