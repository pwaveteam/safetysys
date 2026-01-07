import React, { useState, useEffect, useMemo } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import useForm, { ValidationRules } from "@/hooks/useForm"
import { DataRow } from "@/components/common/tables/DataTable"
import { AlertCircle } from "lucide-react"

type Staff = {
name: string
safetyPosition: string
department: string
position: string
phone: string
entryDate: string
assignDate: string
appointmentCertificate?: string
}

type StaffRegisterModalProps = {
isOpen: boolean
onClose: () => void
onSave: (staff: Staff) => void
existingStaffs?: DataRow[]
}

const initialFormData = {
name: "",
safetyPosition: "해당없음",
department: "",
position: "",
phone: "",
phonePrefix: "010",
phoneMiddle: "",
phoneLast: "",
entryDate: "",
assignDate: "",
appointmentCertificate: ""
}

export default function StaffRegisterModal({ isOpen, onClose, onSave, existingStaffs = [] }: StaffRegisterModalProps) {
const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormData)
const [warningMessage, setWarningMessage] = useState<string>("")

const hasCeo = existingStaffs.some(s => s.safetyPosition === "경영책임자")
const hasSafetyOfficer = existingStaffs.some(s => s.safetyPosition === "안전보건관리책임자")
const safetyManagerCount = existingStaffs.filter(s => s.safetyPosition === "안전관리자").length
const healthManagerCount = existingStaffs.filter(s => s.safetyPosition === "보건관리자").length

const safetyPositionOptions = useMemo(() => [
{ value: "해당없음", label: "해당없음" },
{ value: "안전보건관리책임자", label: "안전보건관리책임자" },
{ value: "안전관리자", label: "안전관리자" },
{ value: "보건관리자", label: "보건관리자" },
{ value: "관리감독자", label: "관리감독자" },
{ value: "경영책임자", label: "경영책임자" }
], [])

useEffect(() => {
if (isOpen) {
setFormData(initialFormData)
setWarningMessage("")
}
}, [isOpen])

const isAssignDateDisabled = formData.safetyPosition === "해당없음"
const isEntryDateDisabled = formData.safetyPosition === "경영책임자"

const validationRules = useMemo<ValidationRules>(() => ({
name: { required: true },
phone: { required: true },
safetyPosition: { required: true }
}), [])

const { validateForm, isFieldInvalid } = useForm(validationRules)

const handleSave = () => {
if (!validateForm(formData)) return

if (formData.safetyPosition === "경영책임자" && hasCeo) {
setWarningMessage("목록 내 지정된 인원이 있습니다. 경영책임자는 1명만 지정 가능합니다.")
return
}

if (formData.safetyPosition === "안전보건관리책임자" && hasSafetyOfficer) {
setWarningMessage("목록 내 지정된 인원이 있습니다. 안전보건관리책임자는 1명만 지정 가능합니다.")
return
}

if (formData.safetyPosition === "안전관리자" && safetyManagerCount >= 10) {
setWarningMessage("안전관리자 지정인원이 초과되었습니다. (최대 10명)")
return
}

if (formData.safetyPosition === "보건관리자" && healthManagerCount >= 10) {
setWarningMessage("보건관리자 지정인원이 초과되었습니다. (최대 10명)")
return
}

onSave(formData as Staff)
}

const fields: Field[] = [
{ label: "이름", name: "name", type: "text", placeholder: "이름 입력", required: true, hasError: isFieldInvalid("name") },
{ label: "연락처", name: "phone", type: "phone", placeholder: "연락처 입력", required: true, hasError: isFieldInvalid("phone") },
{ label: "안전직위", name: "safetyPosition", type: "select", options: safetyPositionOptions, required: true, hasError: isFieldInvalid("safetyPosition") },
{ label: "안전직위 지정일", name: "assignDate", type: "date", required: false, disabled: isAssignDateDisabled },
{ label: "선임(신고서)", name: "appointmentCertificate", type: "fileUpload", required: false, disabled: isAssignDateDisabled },
{ label: "부서", name: "department", type: "text", placeholder: "부서 입력", required: false },
{ label: "직급", name: "position", type: "text", placeholder: "직급 입력", required: false },
{ label: "입사일", name: "entryDate", type: "date", required: false, disabled: isEntryDateDisabled }
]

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target
setWarningMessage("")

if (name === "safetyPosition") {
if (value === "해당없음") {
setFormData(prev => ({ ...prev, [name]: value, assignDate: "", appointmentCertificate: "" }))
} else if (value === "경영책임자") {
setFormData(prev => ({ ...prev, [name]: value, entryDate: "" }))
} else {
setFormData(prev => ({ ...prev, [name]: value }))
}
} else {
setFormData(prev => ({ ...prev, [name]: value }))
}
}

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-2xl font-semibold tracking-wide mb-3">인력 추가</h2>
{warningMessage && (
<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
<AlertCircle size={18} />
{warningMessage}
</div>
)}
<FormScreen fields={fields} values={formData} onChange={handleChange} onClose={onClose} onSave={handleSave} isModal={true} />
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}