import React, { useState, useEffect } from "react"
import Button from "@/components/common/base/Button"
import { Tag } from "@/components/common/base/Badge"
import { X, ChevronRight } from "lucide-react"
import { useApprovalStore } from "@/stores/approvalStore"

const TEXT_PRIMARY = "text-gray-800"

interface ApprovalConfirmDialogProps {
isOpen: boolean
documentType: string
approvalLineName: string
approvers: string
defaultContent?: string
onConfirm: (content: string) => void
onCancel: () => void
}

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
<>
<div className="font-medium text-gray-500">{label}</div>
<div>{children}</div>
</>
)

export default function ApprovalConfirmDialog({
isOpen,
documentType,
approvalLineName,
approvers,
defaultContent = "",
onConfirm,
onCancel
}: ApprovalConfirmDialogProps) {
const [content, setContent] = useState(defaultContent)
const { currentUser } = useApprovalStore()

const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

useEffect(() => {
if (isOpen) {
setContent(defaultContent)
}
}, [isOpen, defaultContent])

if (!isOpen) return null

const approverList = approvers.split(" → ")

const handleConfirm = () => {
if (!content.trim()) {
alert("결재내용을 입력해주세요.")
return
}
onConfirm(content)
}

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[500px] md:max-w-full p-4 md:p-6 shadow-2xl h-screen md:h-auto md:max-h-[90vh] flex flex-col overflow-y-auto">
<div className="flex items-center justify-between mb-4 shrink-0">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>결재 요청</h2>
<button onClick={onCancel} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className="space-y-4">
<div className="bg-gray-50 rounded-lg p-4">
<div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
<InfoRow label="요청일">{today}</InfoRow>
<InfoRow label="결재유형">{documentType}</InfoRow>
<InfoRow label="기안자">{currentUser.name}</InfoRow>
<InfoRow label="결재선">
<div className="flex items-center flex-wrap gap-1">
{approverList.map((approver, idx) => (
<span key={idx} className="flex items-center">
<Tag>{approver}</Tag>
{idx < approverList.length - 1 && (
<ChevronRight size={14} className="text-gray-400 mx-1.5" />
)}
</span>
))}
</div>
</InfoRow>
</div>
</div>

<div>
<p className="text-sm font-medium text-gray-700 mb-2">결재내용</p>
<textarea
value={content}
onChange={(e) => setContent(e.target.value)}
placeholder="결재내용을 입력하세요"
className="w-full rounded-lg p-3 text-sm bg-white text-gray-800 border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none min-h-[120px]"
/>
</div>

<div className="flex justify-center gap-1 pt-2">
<Button variant="primaryOutline" onClick={onCancel}>취소</Button>
<Button variant="primary" onClick={handleConfirm}>결재 요청</Button>
</div>
</div>
</div>
</div>
)
}