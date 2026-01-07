import React, { useState, useEffect, useMemo } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import useForm, { ValidationRules } from "@/hooks/useForm"
import { DataRow } from "@/components/common/tables/DataTable"
import { AttendeeData, AttendeeGroup } from "@/data/mockBusinessData"

type AttendeeRegisterModalProps = {
isOpen: boolean
onClose: () => void
onSave: (attendee: Partial<AttendeeData>) => void
editData?: DataRow | null
groups: AttendeeGroup[]
}

const initialFormData = {
name: "",
group: "기본그룹",
position: "",
phone: "",
remark: ""
}

export default function AttendeeRegisterModal({ isOpen, onClose, onSave, editData, groups }: AttendeeRegisterModalProps) {
const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormData)

const groupOptions = useMemo(() => [
{ value: "기본그룹", label: "기본그룹" },
...groups.map(g => ({ value: g.name, label: g.name }))
], [groups])

useEffect(() => {
if (isOpen) {
if (editData) {
setFormData({
name: String(editData.name || ""),
group: String(editData.group || "기본그룹"),
position: String(editData.position || ""),
phone: String(editData.phone || ""),
remark: String(editData.remark || "")
})
} else {
setFormData(initialFormData)
}
}
}, [isOpen, editData])

const validationRules = useMemo<ValidationRules>(() => ({
name: { required: true },
phone: { required: true }
}), [])

const { validateForm, isFieldInvalid } = useForm(validationRules)

const handleSave = () => {
if (!validateForm(formData)) return
onSave(formData)
}

const fields: Field[] = [
{ label: "이름", name: "name", type: "text", placeholder: "이름 입력", required: true, hasError: isFieldInvalid("name") },
{ label: "연락처", name: "phone", type: "phone", placeholder: "연락처 입력", required: true, hasError: isFieldInvalid("phone") },
{ label: "그룹", name: "group", type: "select", options: groupOptions, required: false },
{ label: "직급", name: "position", type: "text", placeholder: "직급 입력", required: false },
{ label: "비고", name: "remark", type: "text", placeholder: "비고 입력", required: false }
]

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
const { name, value } = e.target
setFormData(prev => ({ ...prev, [name]: value }))
}

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-2xl font-semibold tracking-wide mb-3">
{editData ? "참석자 수정" : "참석자 추가"}
</h2>
<FormScreen fields={fields} values={formData} onChange={handleChange} onClose={onClose} onSave={handleSave} isModal={true} />
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}
