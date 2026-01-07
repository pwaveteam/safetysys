import React, { useState, useMemo } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import Editor from "@/components/common/base/Editor"
import useHandlers from "@/hooks/useHandlers"
import useForm, { ValidationRules } from "@/hooks/useForm"

type FormDataState = {
title: string
author: string
content: string
fileUpload: string
}

type Props = {
isOpen: boolean
onClose: () => void
onSave: (data: FormDataState) => void
userName: string
isEdit?: boolean
}

export default function ResponseManualRegister({
isOpen,
onClose,
onSave,
userName,
isEdit
}: Props): React.ReactElement | null {
const [formData, setFormData] = useState<FormDataState>({
title: "",
author: userName,
content: "",
fileUpload: ""
})

const validationRules = useMemo<ValidationRules>(() => ({
title: { required: true },
content: { required: true }
}), [])

const { validateForm, isFieldInvalid } = useForm(validationRules)

const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
): void => {
const { name, value } = e.target
setFormData(prev => ({ ...prev, [name]: value }))
}

const handleContentChange = (value: string): void => {
setFormData(prev => ({ ...prev, content: value }))
}

const { handleSave: handleTableSave } = useHandlers<FormDataState>({
data: [formData],
checkedIds: [],
onSave: (): void => {
onSave(formData)
}
})

const handleSave = (): void => {
if (!validateForm(formData)) return
handleTableSave()
}

const fields: Field[] = [
{ label: "제목", name: "title", type: "text", placeholder: "제목 입력", required: true, hasError: isFieldInvalid("title") },
{ label: "작성자", name: "author", type: "readonly", required: true },
{
label: "내용",
name: "content",
type: "custom",
required: true,
hasError: isFieldInvalid("content"),
customRender: (
<Editor
value={formData.content}
onChange={handleContentChange}
className={`min-h-[300px] ${isFieldInvalid("content") ? "border border-red-600 rounded-lg" : ""}`}
/>
)
},
{ label: "첨부파일", name: "fileUpload", type: "fileUpload", required: false }
]

if (!isOpen) return null

const valuesForForm: { [key: string]: string } = {
title: formData.title,
author: formData.author,
content: formData.content,
fileUpload: formData.fileUpload
}

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-xl font-semibold tracking-wide mb-3">
대응매뉴얼 {isEdit ? "편집" : "등록"}
</h2>
<FormScreen
fields={fields}
values={valuesForForm}
onChange={handleChange}
onClose={onClose}
onSave={handleSave}
isModal
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>
닫기
</Button>
<Button variant="primary" onClick={handleSave}>
저장하기
</Button>
</div>
</div>
</div>
)
}