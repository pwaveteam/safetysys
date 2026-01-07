import React, { useState, useEffect } from "react"
import Button from "@/components/common/base/Button"
import Checkbox from "@/components/common/base/Checkbox"
import { X, Search, Eye, Download } from "lucide-react"
import RadioGroup from "@/components/common/base/RadioGroup"

export const INSPECTION_CYCLE_OPTIONS = [
{ value: "상시", label: "상시" },
{ value: "주간", label: "주간" },
{ value: "월간", label: "월간" },
{ value: "분기", label: "분기" },
{ value: "연간", label: "연간" },
{ value: "2년", label: "2년" },
{ value: "3년", label: "3년" }
]

export type Field = {
label: string | React.ReactNode
name: string
type?:
| "text"
| "select"
| "password"
| "email"
| "readonly"
| "phone"
| "custom"
| "signature"
| "date"
| "singleDatetime"
| "datetime"
| "daterange"
| "timeRange"
| "textarea"
| "fileUpload"
| "photoUpload"
| "tags"
| "quantityUnit"
| "quantity"
| "autocomplete"
| "radio"
| "inspectionCycle"
placeholder?: string
options?: { value: string; label: string }[]
customRender?: React.ReactNode
buttonRender?: React.ReactNode
required?: boolean
showPlusOne?: boolean
disabled?: boolean
error?: string
hasError?: boolean
hasUnitError?: boolean
successMessage?: string
onSignatureEdit?: () => void
signatureEditable?: boolean
}

export type FormScreenProps = {
fields: Field[]
values: { [key: string]: string }
onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
onTagRemove?: (name: string, valueToRemove: string) => void
onEmailDomainSelect?: (domain: string) => void
onRepeatChange?: (checked: boolean) => void
onClose: () => void
onSave: () => void
onSubmit?: () => void
isModal?: boolean
notifyEnabled?: boolean
repeatEnabled?: boolean
}

export default function FormScreen({
fields,
values,
onChange,
onTagRemove,
onEmailDomainSelect,
onRepeatChange,
onClose,
onSave,
isModal = false,
notifyEnabled = true,
repeatEnabled = false,
}: FormScreenProps) {
const BORDER_STYLE = { borderWidth: "1px", borderStyle: "solid" as const, borderColor: "var(--border)" }

const FONT_SM_BASE = "text-xs md:text-base"

const headerFont = { fontWeight: 600, color: "var(--tertiary)" }
const bodyFont = { fontWeight: 400, color: "#666" }

const BG_WHITE = "bg-white"
const BG_READONLY = "bg-gray-100"
const BG_PASSWORD = "bg-gray-50"

const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-600"
const TEXT_DISABLED = "text-gray-500"

const BORDER_CLASS = "rounded-lg"
const PLACEHOLDER_CLASS = "placeholder:font-normal placeholder:text-gray-500 placeholder:text-xs md:placeholder:text-base"
const TEXT_BASE_CLASS = "text-xs md:text-base font-medium"
const INPUT_BASE_CLASS = `${BORDER_CLASS} px-2 py-2 w-full appearance-none ${PLACEHOLDER_CLASS} ${TEXT_BASE_CLASS}`

const INPUT_EDITABLE = `${INPUT_BASE_CLASS} ${BG_WHITE} ${TEXT_PRIMARY}`
const INPUT_READONLY = `${INPUT_BASE_CLASS} ${BG_READONLY} ${TEXT_DISABLED}`
const INPUT_PASSWORD = `${INPUT_BASE_CLASS} ${BG_PASSWORD} ${TEXT_PRIMARY}`

const TEXTAREA_CLASS = `${BORDER_CLASS} ${PLACEHOLDER_CLASS} ${TEXT_BASE_CLASS} p-2 w-full min-h-[150px] ${BG_WHITE} ${TEXT_PRIMARY}`
const FILE_WRAPPER_CLASS = `w-full h-10 ${BORDER_CLASS} flex items-center justify-center ${TEXT_BASE_CLASS}`
const FILE_BTN_CLASS = `h-8 flex items-center px-3 bg-gray-100 rounded ${FONT_SM_BASE} ${TEXT_PRIMARY} cursor-pointer`
const FILE_TEXT_CLASS = `${FONT_SM_BASE} ${TEXT_SECONDARY} flex-1 truncate`
const FILE_LIST_CLASS = `rounded-md p-2 max-h-[120px] overflow-auto text-xs md:text-base ${TEXT_PRIMARY}`

const TAG_CONTAINER_CLASS = `w-full max-w-full ${BG_WHITE} px-1 py-0.5 ${BORDER_CLASS} h-10 flex items-center`
const TAG_ITEM_CLASS = `flex items-center ${TEXT_PRIMARY} text-xs md:text-sm ${BORDER_CLASS} px-2 py-1`
const TAG_PLACEHOLDER_CLASS = `${FONT_SM_BASE} font-normal ${TEXT_SECONDARY} select-none ml-2`

const SELECT_PADDING = "pr-8"

const [tagItems, setTagItems] = useState<{ value: string; label: string }[]>([])
const [tagsOpen, setTagsOpen] = useState(false)
const [isCustomEmail, setIsCustomEmail] = useState(false)
const [photoPreviewUrls, setPhotoPreviewUrls] = useState<{ name: string; url: string }[]>([])

useEffect(() => {
fetch("/api/processes")
.then(res => res.json())
.then((data: { value: string; label: string }[]) => setTagItems(data))
.catch(() => setTagItems([]))
}, [])

useEffect(() => {
if (values.emailDomainSelect === "__custom") {
setIsCustomEmail(true)
}
}, [values.emailDomainSelect])

useEffect(() => {
return () => {
photoPreviewUrls.forEach(p => URL.revokeObjectURL(p.url))
}
}, [])

const toggleTag = (name: string, v: string) => {
const existing = (values[name] || "").split(",").filter(Boolean)
const next = existing.includes(v)
? existing.filter(x => x !== v)
: [...existing, v]
onChange({
target: { name, value: next.join(",") },
} as React.ChangeEvent<HTMLInputElement>)
}

const addOneDay = (fieldName: string) => {
const currentDate = values[fieldName]
if (!currentDate) return
const date = new Date(currentDate)
date.setDate(date.getDate() + 1)
const newDate = date.toISOString().split("T")[0]
onChange({
target: { name: fieldName, value: newDate },
} as React.ChangeEvent<HTMLInputElement>)
}

const formatPhoneNumber = (value: string) => {
const numbers = value.replace(/[^\d]/g, "")
if (numbers.length <= 3) return numbers
if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const formatted = formatPhoneNumber(e.target.value)
onChange({
target: { name: e.target.name, value: formatted },
} as React.ChangeEvent<HTMLInputElement>)
}

const handleEmailDomainChange = (value: string) => {
if (value === "__custom") {
setIsCustomEmail(true)
onEmailDomainSelect?.("")
} else {
setIsCustomEmail(false)
onEmailDomainSelect?.(value)
}
}

const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const filtered = e.target.value.replace(/[^a-zA-Z0-9._-]/g, "")
onChange({
target: { name: e.target.name, value: filtered },
} as React.ChangeEvent<HTMLInputElement>)
}

const renderInput = (field: Field) => {
const isRO = field.type === "readonly"
const isPW = field.name === "currentPassword"
const inputClass = isPW ? INPUT_PASSWORD : isRO ? INPUT_READONLY : INPUT_EDITABLE

const isRequired = !["fileUpload", "photoUpload", "tags"].includes(field.type || "") && field.required === true

const requiredAttrs = isRequired ? { required: true } : {}

const errorBorderStyle = field.hasError
  ? { borderWidth: "1px", borderStyle: "solid" as const, borderColor: "#dc2626" }
  : BORDER_STYLE

if (field.type === "custom" && field.customRender) return field.customRender

if (field.type === "signature") {
return (
<div className="py-0">
<div
className={`${BG_WHITE} p-4 ${BORDER_CLASS} w-64 h-32 relative`}
style={BORDER_STYLE}
>
{field.signatureEditable && (
<span
onClick={field.onSignatureEdit}
className="absolute top-2 right-2 text-xs text-gray-600 underline cursor-pointer hover:text-gray-800"
>
서명하기
</span>
)}
<div className="w-full h-full flex items-center justify-center">
{values[field.name] ? (
<img
src={values[field.name]}
alt="서명 이미지"
className="max-w-full max-h-full object-contain"
/>
) : (
<span className={`${TEXT_SECONDARY} ${FONT_SM_BASE}`}>서명 이미지 없음</span>
)}
</div>
</div>
</div>
)
}

if (field.type === "radio" && field.options) {
return (
<RadioGroup
name={field.name}
value={values[field.name] || ""}
options={field.options}
onChange={e => onChange(e as React.ChangeEvent<HTMLInputElement>)}
className=""
/>
)
}

if (field.type === "select" && field.options) {
return (
<div className="relative w-full md:max-w-xs">
<select
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} ${(field.disabled || (field.name === "notifyWhen" && !notifyEnabled)) ? "cursor-not-allowed text-gray-400" : ""}`}
style={errorBorderStyle}
{...requiredAttrs}
disabled={field.disabled || (field.name === "notifyWhen" && !notifyEnabled)}
>
{!values[field.name] && <option value="">{field.placeholder || "선택"}</option>}
{field.options.map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>
</div>
)
}

if (field.type === "autocomplete") {
return (
<div className="relative w-full">
<input
type="text"
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder || "Search"}
className={`${INPUT_EDITABLE} pr-8`}
style={errorBorderStyle}
{...requiredAttrs}
/>
<Search className={`absolute right-2 top-1/2 -translate-y-1/2 ${TEXT_DISABLED} w-5 h-5 pointer-events-none`} />
</div>
)
}

const renderDateInput = (name: string, value: string, required = false, disabled = false, hasError = false) => (
<input
type="date"
name={name}
value={value}
onChange={onChange}
className={`${disabled ? INPUT_READONLY : INPUT_EDITABLE} w-full`}
style={hasError ? { borderWidth: "1px", borderStyle: "solid" as const, borderColor: "#dc2626" } : BORDER_STYLE}
disabled={disabled}
{...(required ? { required: true } : {})}
/>
)

const renderTimeSelect = (name: string, value: string, type: "hour" | "minute", required = false) => (
<select
name={name}
value={value}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} flex-1 min-w-0`}
style={BORDER_STYLE}
{...(required ? { required: true } : {})}
>
<option value="">{type === "hour" ? "시" : "분"}</option>
{type === "hour"
? [...Array(24).keys()].map(h => <option key={h} value={String(h)}>{h}시</option>)
: ["00", "10", "20", "30", "40", "50"].map(m => <option key={m} value={m}>{m}분</option>)
}
</select>
)

if (field.type === "date") {
return (
<div className="flex flex-row items-center gap-2 w-full">
{renderDateInput(field.name, values[field.name] || "", field.required !== false, field.disabled, field.hasError)}
{field.showPlusOne !== false && (
<Button variant="action" onClick={() => addOneDay(field.name)} className="h-9 px-3 shrink-0">
+1일
</Button>
)}
</div>
)
}

if (field.type === "singleDatetime") {
return (
<div className="flex flex-col gap-2 w-full">
<div className="w-full">
{renderDateInput("startDate", values.startDate || "", true)}
</div>
<div className="flex items-center gap-1 w-full">
{renderTimeSelect("startHour", values.startHour || "", "hour", true)}
{renderTimeSelect("startMinute", values.startMinute || "", "minute", true)}
<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY} px-1 shrink-0`}>~</span>
{renderTimeSelect("endHour", values.endHour || "", "hour", true)}
{renderTimeSelect("endMinute", values.endMinute || "", "minute", true)}
</div>
</div>
)
}

if (field.type === "timeRange") {
const timeErrorStyle = field.hasError ? { borderWidth: "1px", borderStyle: "solid" as const, borderColor: "#dc2626" } : BORDER_STYLE
return (
<div className="flex flex-col gap-2 w-full">
<div className="flex items-center gap-1 w-full">
<select
name="startHour"
value={values.startHour || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} flex-1 min-w-0`}
style={timeErrorStyle}
>
<option value="">시</option>
{[...Array(19).keys()].map(h => {
const hour = h + 6
return (
<option key={hour} value={String(hour)}>
{hour}시
</option>
)
})}
</select>
<select
name="startMinute"
value={values.startMinute || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} flex-1 min-w-0`}
style={timeErrorStyle}
>
<option value="">분</option>
{["00", "15", "30", "45"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>
</div>

<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY}`}>~</span>

<div className="flex items-center gap-1 w-full">
<select
name="endHour"
value={values.endHour || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} flex-1 min-w-0`}
style={timeErrorStyle}
>
<option value="">시</option>
{[...Array(19).keys()].map(h => {
const hour = h + 6
return (
<option key={hour} value={String(hour)}>
{hour}시
</option>
)
})}
</select>
<select
name="endMinute"
value={values.endMinute || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} flex-1 min-w-0`}
style={timeErrorStyle}
>
<option value="">분</option>
{["00", "15", "30", "45"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>
</div>

<div className="flex items-center">
<span className="text-xs md:text-sm font-medium text-gray-600">
진행시간:&nbsp;
{(() => {
const sh = values.startHour && values.startHour !== "" ? parseInt(values.startHour) : null
const sm = values.startMinute && values.startMinute !== "" ? parseInt(values.startMinute) : null
const eh = values.endHour && values.endHour !== "" ? parseInt(values.endHour) : null
const em = values.endMinute && values.endMinute !== "" ? parseInt(values.endMinute) : null

if (sh === null || sm === null || eh === null || em === null || isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
return "-"
}

const startTotal = sh * 60 + sm
const endTotal = eh * 60 + em
const diff = endTotal - startTotal

if (diff < 0) {
return <span className="text-red-600">⚠ 종료시간이 시작시간보다 빠릅니다</span>
}

if (diff === 0) {
return <span className="text-red-600">⚠ 시작시간과 종료시간이 같습니다</span>
}

const h = Math.floor(diff / 60)
const m = diff % 60

if (h === 0) {
return `${m}분`
} else if (m === 0) {
return `${h}시간`
} else {
return `${h}시간 ${m}분`
}
})()}
</span>
</div>
</div>
)
}

if (field.type === "daterange") {
return (
<div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
<div className="flex-1">
{renderDateInput("startDate", values.startDate || "", false, false, field.hasError)}
</div>
<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY} shrink-0 hidden md:inline`}>~</span>
<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY} shrink-0 md:hidden`}>~</span>
<div className="flex-1">
{renderDateInput("endDate", values.endDate || "", false, false, field.hasError)}
</div>
</div>
)
}

if (field.type === "phone") {
return (
<div className="flex items-center gap-2 w-full">
<input
type="tel"
name={field.name}
value={values[field.name] || ""}
onChange={handlePhoneChange}
placeholder="010-0000-0000"
maxLength={13}
inputMode="numeric"
className={`${inputClass} w-full md:max-w-[250px]`}
style={errorBorderStyle}
{...requiredAttrs}
/>
{field.buttonRender}
</div>
)
}

if (field.type === "email") {
return (
<div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
<input
type="text"
name="emailId"
value={values.emailId || ""}
onChange={handleEmailIdChange}
placeholder="이메일"
className={`${inputClass} w-full md:max-w-[250px]`}
style={BORDER_STYLE}
/>
<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY} shrink-0 hidden md:inline`}>@</span>
{isCustomEmail ? (
<div className="flex items-center gap-2 w-full md:flex-1">
<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY} shrink-0 md:hidden`}>@</span>
<input
type="text"
name="emailDomain"
value={values.emailDomain || ""}
onChange={onChange}
placeholder="도메인 입력"
className={`${inputClass} flex-1`}
style={BORDER_STYLE}
/>
<button
type="button"
onClick={() => setIsCustomEmail(false)}
className="text-sm text-gray-500 underline shrink-0"
>
선택
</button>
</div>
) : (
<div className="flex items-center gap-2 w-full">
<span className={`${FONT_SM_BASE} ${TEXT_PRIMARY} shrink-0 md:hidden`}>@</span>
<select
name="emailDomainSelect"
value={values.emailDomainSelect || ""}
onChange={e => handleEmailDomainChange(e.target.value)}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full md:max-w-[250px]`}
style={BORDER_STYLE}
>
<option value="">선택</option>
<option value="gmail.com">gmail.com</option>
<option value="naver.com">naver.com</option>
<option value="hanmail.net">hanmail.net</option>
<option value="nate.com">nate.com</option>
<option value="__custom">직접입력</option>
</select>
</div>
)}
</div>
)
}

if (field.type === "textarea") {
return (
<textarea
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder ?? `${field.label} 입력`}
className={TEXTAREA_CLASS}
style={errorBorderStyle}
/>
)
}

if (field.type === "fileUpload") {
  const handlePreview = (fileName: string) => {
    window.open(`/api/files/preview/${encodeURIComponent(fileName)}`, '_blank')
  }

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a')
    link.href = `/api/files/download/${encodeURIComponent(fileName)}`
    link.download = fileName
    link.click()
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className={`${FILE_WRAPPER_CLASS} relative p-1 gap-2`} style={errorBorderStyle}>
        <span className={FILE_BTN_CLASS} style={BORDER_STYLE}>
          파일 선택
        </span>
        <span className={FILE_TEXT_CLASS}>
          {values[field.name] && values[field.name].trim()
            ? `${values[field.name].split(",").map(f => f.trim()).filter(Boolean).length}개 파일 선택됨`
            : "선택된 파일 없음"}
        </span>
        <input
          type="file"
          name={field.name}
          multiple
          accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.pdf,.doc,.docx,.hwp,.xls,.xlsx,.ppt,.pptx,.txt"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={e => {
            const files = Array.from((e.target as HTMLInputElement).files || [])
            const allowed = /\.(jpg|jpeg|png|gif|bmp|svg|webp|pdf|doc|docx|hwp|xls|xlsx|ppt|pptx|txt)$/i
            const validFiles = files.filter(f => allowed.test(f.name))
            if (validFiles.length !== files.length) {
              alert("이미지 및 문서 파일만 업로드할 수 있습니다.")
              return
            }
            const existingFiles = values[field.name] ? values[field.name].split(",").map(f => f.trim()).filter(Boolean) : []
            const newFileNames = validFiles.map(f => f.name)
            const combinedFiles = [...existingFiles, ...newFileNames]
            if (combinedFiles.length > 10) {
              alert("최대 10개 파일까지만 업로드할 수 있습니다.")
              return
            }
            const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
            const maxSize = 50 * 1024 * 1024
            if (totalSize > maxSize) {
              alert("전체 파일 용량이 50MB를 초과합니다.")
              return
            }
            onChange({ target: { name: field.name, value: combinedFiles.join(",") } } as React.ChangeEvent<HTMLInputElement>)
            e.target.value = ""
          }}
        />
      </label>
      {values[field.name] && values[field.name].trim() && (
        <ul className={FILE_LIST_CLASS} style={BORDER_STYLE}>
          {values[field.name].split(",").map(f => f.trim()).filter(Boolean).map((fname: string, idx: number) => (
            <li key={idx} className="flex items-center justify-between gap-2 py-1">
              <span className="truncate flex-1">• {fname}</span>
              <div className="flex items-center gap-3 shrink-0 pr-1">
                <button
                  type="button"
                  onClick={() => handlePreview(fname)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="미리보기"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(fname)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="다운로드"
                >
                  <Download size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const files = values[field.name].split(",").map(f => f.trim()).filter(Boolean)
                    files.splice(idx, 1)
                    onChange({ target: { name: field.name, value: files.join(",") } } as React.ChangeEvent<HTMLInputElement>)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="삭제"
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// if (field.type === "photoUpload") {
//   const handlePreview = (fileName: string) => {
//     window.open(`/api/files/preview/${encodeURIComponent(fileName)}`, '_blank')
//   }

//   const handleDownload = (fileName: string) => {
//     const link = document.createElement('a')
//     link.href = `/api/files/download/${encodeURIComponent(fileName)}`
//     link.download = fileName
//     link.click()
//   }

//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <label className={`${FILE_WRAPPER_CLASS} relative p-1 gap-2`} style={errorBorderStyle}>
//         <span className={FILE_BTN_CLASS} style={BORDER_STYLE}>
//           사진 선택
//         </span>
//         <span className={FILE_TEXT_CLASS}>
//           {values[field.name] && values[field.name].trim()
//             ? `${values[field.name].split(",").map(f => f.trim()).filter(Boolean).length}개 파일 선택됨`
//             : "선택된 파일 없음"}
//         </span>
//         <input
//           type="file"
//           name={field.name}
//           multiple
//           accept="image/*"
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           onChange={e => {
//             const files = Array.from((e.target as HTMLInputElement).files || [])
//             const existingFiles = values[field.name] ? values[field.name].split(",").map(f => f.trim()).filter(Boolean) : []
//             const newFileNames = files.map(f => f.name)
//             const combinedFiles = [...existingFiles, ...newFileNames]
//             if (combinedFiles.length > 10) {
//               alert("최대 10개 파일까지만 업로드할 수 있습니다.")
//               return
//             }
//             const totalSize = files.reduce((sum, file) => sum + file.size, 0)
//             const maxSize = 100 * 1024 * 1024
//             if (totalSize > maxSize) {
//               alert("전체 파일 용량이 100MB를 초과합니다.")
//               return
//             }
//             onChange({ target: { name: field.name, value: combinedFiles.join(",") } } as React.ChangeEvent<HTMLInputElement>)
//             e.target.value = ""
//           }}
//         />
//       </label>
//       {values[field.name] && values[field.name].trim() && (
//         <ul className={FILE_LIST_CLASS} style={BORDER_STYLE}>
//           {values[field.name].split(",").map(f => f.trim()).filter(Boolean).map((fname: string, idx: number) => (
//             <li key={idx} className="flex items-center justify-between gap-2 py-1">
//               <span className="truncate flex-1">• {fname}</span>
//               <div className="flex items-center gap-3 shrink-0 pr-1">
//                 <button
//                   type="button"
//                   onClick={() => handlePreview(fname)}
//                   className="text-gray-400 hover:text-gray-600"
//                   aria-label="미리보기"
//                 >
//                   <Eye size={16} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleDownload(fname)}
//                   className="text-gray-400 hover:text-gray-600"
//                   aria-label="다운로드"
//                 >
//                   <Download size={16} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const files = values[field.name].split(",").map(f => f.trim()).filter(Boolean)
//                     files.splice(idx, 1)
//                     onChange({ target: { name: field.name, value: files.join(",") } } as React.ChangeEvent<HTMLInputElement>)
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                   aria-label="삭제"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }



if (field.type === "photoUpload") {
  const handleDownload = (fileName: string, url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className={`${FILE_WRAPPER_CLASS} relative p-1 gap-2`} style={errorBorderStyle}>
        <span className={FILE_BTN_CLASS} style={BORDER_STYLE}>
          사진 선택
        </span>
        <span className={FILE_TEXT_CLASS}>
          {photoPreviewUrls.length > 0
            ? `${photoPreviewUrls.length}개 파일 선택됨`
            : "선택된 파일 없음"}
        </span>
        <input
          type="file"
          name={field.name}
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={e => {
            const files = Array.from((e.target as HTMLInputElement).files || [])
            if (photoPreviewUrls.length + files.length > 10) {
              alert("최대 10개 파일까지만 업로드할 수 있습니다.")
              return
            }
            const totalSize = files.reduce((sum, file) => sum + file.size, 0)
            const maxSize = 100 * 1024 * 1024
            if (totalSize > maxSize) {
              alert("전체 파일 용량이 100MB를 초과합니다.")
              return
            }
            const newPreviews = files.map(file => ({
              name: file.name,
              url: URL.createObjectURL(file)
            }))
            const combined = [...photoPreviewUrls, ...newPreviews]
            setPhotoPreviewUrls(combined)
            onChange({ target: { name: field.name, value: combined.map(p => p.name).join(",") } } as React.ChangeEvent<HTMLInputElement>)
            e.target.value = ""
          }}
        />
      </label>
      {photoPreviewUrls.length > 0 && (
        <div className="flex flex-col gap-2">
          <ul className={FILE_LIST_CLASS} style={BORDER_STYLE}>
            {photoPreviewUrls.map((preview, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2 py-1">
                <span className="truncate flex-1">• {preview.name}</span>
                <div className="flex items-center gap-3 shrink-0 pr-1">
                  <button
                    type="button"
                    onClick={() => handleDownload(preview.name, preview.url)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="다운로드"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(preview.url)
                      const newPreviews = photoPreviewUrls.filter((_, i) => i !== idx)
                      setPhotoPreviewUrls(newPreviews)
                      onChange({ target: { name: field.name, value: newPreviews.map(p => p.name).join(",") } } as React.ChangeEvent<HTMLInputElement>)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="삭제"
                  >
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2 p-2 rounded-lg" style={BORDER_STYLE}>
            {photoPreviewUrls.map((preview, idx) => (
              <div key={idx} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(preview.url)
                    const newPreviews = photoPreviewUrls.filter((_, i) => i !== idx)
                    setPhotoPreviewUrls(newPreviews)
                    onChange({ target: { name: field.name, value: newPreviews.map(p => p.name).join(",") } } as React.ChangeEvent<HTMLInputElement>)
                  }}
                  className="absolute -top-1 -right-1 z-10 bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 rounded-full p-0.5 shadow-sm"
                  aria-label="삭제"
                >
                  <X size={14} />
                </button>
                <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}




if (field.type === "quantity") {
return (
<div className="w-full md:max-w-[150px]">
<input
type="number"
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder || ""}
className={`${INPUT_EDITABLE} w-full`}
style={errorBorderStyle}
min={0}
/>
</div>
)
}

if (field.type === "quantityUnit") {
const unitErrorStyle = field.hasUnitError
  ? { borderWidth: "1px", borderStyle: "solid" as const, borderColor: "#dc2626" }
  : BORDER_STYLE
const isDirectInput = values[field.name + "_unit"] === "직접입력"
return (
<div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:max-w-xs">
<input
type="number"
name={field.name + "_value"}
value={values[field.name + "_value"] || ""}
placeholder={field.placeholder || "값"}
className={`${INPUT_EDITABLE} w-full md:flex-1`}
style={errorBorderStyle}
onChange={onChange}
/>
{isDirectInput ? (
<input
type="text"
name={field.name + "_unit_custom"}
value={values[field.name + "_unit_custom"] || ""}
placeholder="단위 입력"
className={`${INPUT_EDITABLE} w-full md:flex-1`}
style={unitErrorStyle}
onChange={onChange}
/>
) : (
<select
name={field.name + "_unit"}
value={values[field.name + "_unit"] || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-full md:flex-1`}
style={unitErrorStyle}
>
<option value="">단위</option>
{field.options?.map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
<option value="직접입력">직접입력</option>
</select>
)}
</div>
)
}

if (field.type === "inspectionCycle") {
const isRepeatDisabled = values[field.name] === "상시"
return (
<div className="flex items-center gap-2">
<select
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
className={`${INPUT_EDITABLE} ${SELECT_PADDING} w-[70px] md:w-[80px]`}
style={BORDER_STYLE}
>
<option value="">선택</option>
{INSPECTION_CYCLE_OPTIONS.map(opt => (
<option key={opt.value} value={opt.value}>{opt.label}</option>
))}
</select>
<span className="text-xs md:text-sm text-[#333639] whitespace-nowrap">반복여부</span>
<Checkbox
checked={repeatEnabled && !isRepeatDisabled}
disabled={isRepeatDisabled}
onChange={() => onRepeatChange?.(!repeatEnabled)}
/>
</div>
)
}

if (field.type === "tags") {
const tags = (values[field.name] || "").split(",").filter(Boolean)
return (
<section className={TAG_CONTAINER_CLASS} style={BORDER_STYLE}>
<div className="relative flex flex-wrap items-center gap-1 w-full">
{tags.length === 0 ? (
<span className={TAG_PLACEHOLDER_CLASS}>
선택된 태그가 없습니다
</span>
) : (
tags.map(t => (
<span
key={t}
className={TAG_ITEM_CLASS}
style={{ backgroundColor: "var(--neutral-bg)", ...BORDER_STYLE }}
>
{t}
<button
className="ml-1 text-gray-600 hover:text-gray-800"
onClick={() => onTagRemove?.(field.name, t)}
type="button"
>
<X size={11} />
</button>
</span>
))
)}
</div>
</section>
)
}

if (isRO) {
return (
<input
type="text"
name={field.name}
value={values[field.name] || ""}
disabled
className={INPUT_READONLY}
style={BORDER_STYLE}
/>
)
}

if (field.type === "password") {
return (
<div className="flex items-center gap-2 w-full">
<input
type="password"
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder}
disabled={field.disabled}
className={`${field.disabled ? INPUT_READONLY : inputClass} w-full md:max-w-[250px]`}
style={errorBorderStyle}
{...requiredAttrs}
/>
{field.buttonRender}
</div>
)
}

if (field.buttonRender) {
return (
<div className="flex items-center gap-2 w-full">
<input
type={field.type || "text"}
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder}
className={`${inputClass} w-full md:max-w-[250px]`}
style={errorBorderStyle}
{...requiredAttrs}
/>
{field.buttonRender}
</div>
)
}

return (
<input
type={field.type || "text"}
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder}
className={inputClass}
style={errorBorderStyle}
/>
)
}

const inputWrapperClass = isModal ? "w-full p-2" : "w-full md:w-[65%] p-2"

return (
<section className={`w-full max-w-full bg-white ${FONT_SM_BASE}`}>
<div className="overflow-x-auto">
<table
className="w-full border-collapse"
style={{ 
borderTop: "2.3px solid var(--tertiary)",
tableLayout: "fixed"
}}
>
<colgroup>
<col className="w-[90px] md:w-36" />
<col />
</colgroup>
<tbody>
{fields.map(f => (
<tr key={f.name} style={{ borderBottom: "1px solid var(--border)" }}>
<th
className={`py-2 md:py-3 px-2 md:px-3 font-semibold text-left ${FONT_SM_BASE} ${f.type === "textarea" ? "align-top pt-3 md:pt-4" : "align-middle"}`}
style={{
...headerFont,
backgroundColor: "var(--neutral-bg)",
borderRight: "1px solid var(--border)",
}}
>
{f.label}
{!["fileUpload", "photoUpload", "tags"].includes(f.type || "") && f.required === true && (
<span className="text-red-600 ml-1">*</span>
)}
</th>
<td
className={`px-0 bg-white ${FONT_SM_BASE} align-middle`}
style={{
...bodyFont,
borderLeft: "1px solid var(--border)"
}}
>
<div className="flex flex-col md:flex-row md:items-center h-full">
<div className={inputWrapperClass}>
{renderInput(f)}
{(f.hasError || f.error) && (
<p className="text-red-500 text-xs mt-1">{f.error || "필수 항목입니다."}</p>
)}
{f.successMessage && (
<p className="text-blue-600 text-xs mt-1">{f.successMessage}</p>
)}
</div>
{f.buttonRender && f.type !== "phone" && f.type !== "password" && f.type !== "text" && f.type !== undefined && (
<div className="w-full md:w-[35%] px-2 pb-2 md:pb-0 flex items-center justify-start">
{f.buttonRender}
</div>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
)
}