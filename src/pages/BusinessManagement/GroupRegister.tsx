import React, { useState, useEffect } from "react"
import Button from "@/components/common/base/Button"
import { AttendeeGroup } from "@/data/mockBusinessData"
import { DataRow } from "@/components/common/tables/DataTable"
import { Trash2, X } from "lucide-react"
import { useGroupHandlers } from "@/hooks/useHandlers"

type GroupRegisterModalProps = {
isOpen: boolean
onClose: () => void
onSave: (groupName: string) => void
onDelete: (groupId: number) => void
existingGroups: AttendeeGroup[]
attendees: DataRow[]
}

export default function GroupRegisterModal({ isOpen, onClose, onSave, onDelete, existingGroups, attendees }: GroupRegisterModalProps) {
const [groupName, setGroupName] = useState("")

const { getGroupMemberCount, handleGroupSave, handleGroupDelete } = useGroupHandlers({
  groups: existingGroups,
  attendees,
  onGroupSave: onSave,
  onGroupDelete: onDelete
})

useEffect(() => {
if (isOpen) {
setGroupName("")
}
}, [isOpen])

const handleSave = () => {
if (handleGroupSave(groupName)) {
  setGroupName("")
}
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (e.nativeEvent.isComposing) return
if (e.key === " ") {
e.preventDefault()
}
if (e.key === "Enter") {
e.preventDefault()
handleSave()
}
}

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[500px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto relative">
<button
onClick={onClose}
className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
aria-label="닫기"
>
<X size={20} />
</button>

<h2 className="text-2xl font-semibold tracking-wide mb-5">그룹관리</h2>

<div className="mb-6">
<div className="flex items-center gap-2">
<input
type="text"
value={groupName}
onChange={(e) => setGroupName(e.target.value)}
onKeyDown={handleKeyDown}
placeholder="그룹명 입력"
className="flex-1 h-[36px] border border-[var(--border)] rounded-lg px-3 text-sm focus:outline-none focus:border-[var(--primary)]"
/>
<Button variant="primary" onClick={handleSave} className="h-[36px]">추가</Button>
</div>
</div>

<div className="border-t border-gray-200 pt-5">
<h3 className="text-sm font-medium text-gray-700 mb-2">목록</h3>
<div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
<div className="flex items-center justify-between px-4 py-3 bg-gray-50">
<div className="flex items-center gap-2">
<span className="text-sm text-gray-400">기본그룹</span>
<span className="text-xs text-gray-300">{getGroupMemberCount("기본그룹")}</span>
</div>
</div>
{existingGroups.map(group => (
<div key={group.id} className="flex items-center justify-between px-4 py-3">
<div className="flex items-center gap-2">
<span className="text-sm text-gray-800">{group.name}</span>
<span className="text-xs text-gray-400">{getGroupMemberCount(group.name)}</span>
</div>
<button
onClick={() => handleGroupDelete(group)}
className="text-gray-400 hover:text-[var(--primary)] transition-colors"
>
<Trash2 size={16} />
</button>
</div>
))}
</div>
</div>
</div>
</div>
)
}