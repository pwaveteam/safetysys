import React from "react"
import { X } from "lucide-react"

interface Attendee {
name: string
phone: string
signed: boolean
signature?: string
signedAt?: string
}

interface AttendeeListDialogProps {
isOpen: boolean
onClose: () => void
attendees: Attendee[]
}

const BORDER_CLASS = "border-[var(--border)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"

export default function AttendeeListDialog({
isOpen,
onClose,
attendees
}: AttendeeListDialogProps) {
if (!isOpen) return null

const totalCount = attendees.length
const signedCount = attendees.filter(a => a.signed).length

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[420px] md:max-w-full p-4 md:p-6 shadow-2xl h-screen md:h-auto md:max-h-[85vh] flex flex-col relative">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-2 text-xs md:text-[13px] font-medium">
<span className={TEXT_SECONDARY}>
총 {totalCount}명
</span>
<span className={TEXT_SECONDARY}>|</span>
<span>
<span className="text-[var(--primary)]">서명완료</span>
<span className={`ml-1 ${TEXT_SECONDARY}`}>{signedCount}명</span>
</span>
</div>
<button
onClick={onClose}
className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]"
>
<X size={24} />
</button>
</div>

<div className="flex-1 overflow-auto">
{attendees.length > 0 ? (
<div className="space-y-2">
{attendees.map((attendee, index) => (
<div
key={index}
className={`border ${BORDER_CLASS} rounded-lg p-3`}
>
<div className="flex items-center justify-between gap-3">
<div className="flex-1 min-w-0">
<div className="flex items-center gap-2 mb-1">
<span className={`text-sm font-medium ${TEXT_PRIMARY}`}>{attendee.name}</span>
<span className={`text-xs ${TEXT_SECONDARY}`}>{attendee.phone}</span>
</div>
{attendee.signed ? (
<p className="text-xs flex items-center gap-2">
<span className="text-[var(--primary)] font-medium">서명완료</span>
{attendee.signedAt && (
<span className="text-gray-400 text-[11px]">{attendee.signedAt}</span>
)}
</p>
) : (
<p className="text-xs text-gray-400">서명대기</p>
)}
</div>
{attendee.signed && attendee.signature && (
<div className={`shrink-0 w-20 h-12 border ${BORDER_CLASS} rounded bg-white`}>
<img
src={attendee.signature}
alt="서명"
className="w-full h-full object-contain"
/>
</div>
)}
</div>
</div>
))}
</div>
) : (
<div className={`p-12 text-xs md:text-[13px] text-gray-400 text-center`}>
등록된 참석자가 없습니다.
</div>
)}
</div>
</div>
</div>
)
}
