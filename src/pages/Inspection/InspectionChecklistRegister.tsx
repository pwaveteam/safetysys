import React, { useState, useMemo, useCallback, useRef, useEffect } from "react"
import Button from "@/components/common/base/Button"
import { X, CirclePlus, Trash2, GripVertical, Check, Plus, Search } from "lucide-react"
import { inspectionChecklistMockData, checklistTemplateMockData } from "@/data/mockData"
import Sortable from "sortablejs"

interface ChecklistRow {
id: number | string
template: string
}

type ItemRow = { id: number; content: string; isEditing?: boolean; draft?: string }

type EditingChecklist = {
id?: number | string
templateName: string
items: ItemRow[]
}

interface InspectionChecklistRegisterProps {
open: boolean
onClose: () => void
}

const BORDER_CLASS = "border-[var(--border)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const INPUT_CLASS = "border rounded-lg px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm text-gray-800 placeholder:text-gray-500"
const BTN_CLASS = "inline-flex items-center justify-center rounded-md hover:bg-gray-50"

const initialData: ChecklistRow[] = (inspectionChecklistMockData as any[]).map(row => ({
id: row.id,
template: row.template
}))

export default function InspectionChecklistRegister({ open, onClose }: InspectionChecklistRegisterProps) {
const [data, setData] = useState<ChecklistRow[]>(initialData)
const [selectedId, setSelectedId] = useState<number | string | null>(null)
const [editingData, setEditingData] = useState<EditingChecklist | null>(null)
const [editSelectedIds, setEditSelectedIds] = useState<(number | string)[]>([])
const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)
const [templateSearch, setTemplateSearch] = useState("")
const [listSearch, setListSearch] = useState("")
const [templateNameError, setTemplateNameError] = useState(false)
const tableWrapRef = useRef<HTMLDivElement | null>(null)
const nextIdRef = useRef(1)

useEffect(() => {
if (open) {
setSelectedId(null)
setEditingData(null)
setSelectedTemplateId(null)
setTemplateSearch("")
setListSearch("")
setTemplateNameError(false)
}
}, [open])

const filteredData = useMemo(() => {
if (!listSearch.trim()) return data
const search = listSearch.toLowerCase()
return data.filter(row => row.template.toLowerCase().includes(search))
}, [data, listSearch])

const filteredTemplates = useMemo(() => {
if (!templateSearch.trim()) return checklistTemplateMockData
const search = templateSearch.toLowerCase()
return checklistTemplateMockData.filter(t => t.name.toLowerCase().includes(search))
}, [templateSearch])

const selectedTemplate = useMemo(() =>
checklistTemplateMockData.find(t => t.id === selectedTemplateId) ?? null
, [selectedTemplateId])

const handleSelectRow = (row: ChecklistRow) => {
setSelectedId(row.id)
setEditingData({
id: row.id,
templateName: row.template,
items: Array.from({ length: 3 }, () => ({ id: nextIdRef.current++, content: "샘플 점검 항목", isEditing: false }))
})
setEditSelectedIds([])
setSelectedTemplateId(null)
setTemplateNameError(false)
}

const handleCreate = () => {
setSelectedId(null)
setEditingData({
templateName: "",
items: []
})
setEditSelectedIds([])
setSelectedTemplateId(checklistTemplateMockData[0]?.id ?? null)
setTemplateSearch("")
setTemplateNameError(false)
}

const handleDelete = () => {
if (!selectedId) {
alert("삭제할 점검표를 선택하세요.")
return
}
if (window.confirm("선택한 점검표를 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => row.id !== selectedId))
setSelectedId(null)
setEditingData(null)
}
}

const handleSave = () => {
if (!editingData) return

let hasError = false
if (!editingData.templateName.trim()) {
setTemplateNameError(true)
hasError = true
}
if (hasError) return

if (editingData.items.some(r => r.isEditing)) {
alert("편집 중인 항목을 먼저 저장하거나 취소하세요.")
return
}

if (editingData.id) {
setData(prev => prev.map(row =>
row.id === editingData.id
? { ...row, template: editingData.templateName }
: row
))
} else {
const newRow: ChecklistRow = {
id: Date.now(),
template: editingData.templateName
}
setData(prev => [newRow, ...prev])
setSelectedId(newRow.id)
setEditingData({ ...editingData, id: newRow.id })
}
onClose()
}

const handleTemplateNameChange = (value: string) => {
setEditingData(prev => prev ? { ...prev, templateName: value } : null)
if (value.trim()) setTemplateNameError(false)
}

const startEdit = useCallback((id: number) => {
setEditingData(prev => prev ? { ...prev, items: prev.items.map(r => r.id === id ? { ...r, isEditing: true, draft: r.content } : r) } : null)
}, [])

const changeDraft = useCallback((id: number, value: string) => {
setEditingData(prev => prev ? { ...prev, items: prev.items.map(r => r.id === id ? { ...r, draft: value } : r) } : null)
}, [])

const commitEdit = useCallback((id: number) => {
setEditingData(prev => prev ? { ...prev, items: prev.items.map(r => r.id === id ? { ...r, content: (r.draft ?? "").trim(), draft: undefined, isEditing: false } : r) } : null)
}, [])

const cancelEdit = useCallback((id: number, isNew: boolean) => {
setEditingData(prev => {
if (!prev) return null
if (isNew) return { ...prev, items: prev.items.filter(r => r.id !== id) }
return { ...prev, items: prev.items.map(r => r.id === id ? { ...r, isEditing: false, draft: undefined } : r) }
})
}, [])

const addItem = useCallback(() => {
const newId = nextIdRef.current++
setEditingData(prev => prev ? { ...prev, items: [...prev.items, { id: newId, content: "", isEditing: true, draft: "" }] } : null)
}, [])

const deleteSelectedItems = useCallback(() => {
if (editSelectedIds.length === 0) {
alert("삭제할 항목을 선택하세요")
return
}
if (window.confirm("선택한 항목을 삭제하시겠습니까?")) {
setEditingData(prev => prev ? { ...prev, items: prev.items.filter(r => !editSelectedIds.includes(r.id)) } : null)
setEditSelectedIds([])
}
}, [editSelectedIds])

const addFromTemplate = useCallback((items: string[]) => {
setEditingData(prev => {
if (!prev) return null
const newRows: ItemRow[] = items.map(content => ({ id: nextIdRef.current++, content }))
return { ...prev, items: [...prev.items, ...newRows] }
})
}, [])

const addAllTemplateItems = useCallback(() => {
if (!selectedTemplate) return
addFromTemplate(selectedTemplate.items)
}, [selectedTemplate, addFromTemplate])

const addSingleTemplateItem = useCallback((item: string) => {
addFromTemplate([item])
}, [addFromTemplate])

useEffect(() => {
if (!editingData) return
const tbody = tableWrapRef.current?.querySelector("tbody")
if (!tbody) return
const sortable = Sortable.create(tbody as HTMLElement, {
animation: 150,
handle: ".drag-handle",
ghostClass: "opacity-60",
onEnd: evt => {
const oldIndex = evt.oldIndex ?? -1
const newIndex = evt.newIndex ?? -1
if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return
setEditingData(prev => {
if (!prev) return null
const next = [...prev.items]
const [moved] = next.splice(oldIndex, 1)
next.splice(newIndex, 0, moved)
return { ...prev, items: next }
})
}
})
return () => sortable.destroy()
}, [editingData?.items.length])

if (!open) return null

return (
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[1200px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[85vh] flex flex-col relative">
<div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
<h2 className={`text-base md:text-xl font-bold tracking-tight ${TEXT_PRIMARY}`}>점검표(체크리스트)관리</h2>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
<div className="w-[280px] flex flex-col min-h-0 shrink-0">
<div className="flex items-center justify-between mb-2">
<span className={`text-sm font-semibold ${TEXT_PRIMARY}`}>점검표 목록</span>
<div className="flex gap-1">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1 text-xs h-7 px-2">
<CirclePlus size={14} />등록
</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1 text-xs h-7 px-2">
<Trash2 size={14} />삭제
</Button>
</div>
</div>
<div className="mb-2">
<div className="relative">
<input
type="text"
value={listSearch}
onChange={e => setListSearch(e.target.value)}
placeholder="점검표 검색"
className={`${INPUT_CLASS} ${BORDER_CLASS} h-9 w-full pr-9`}
/>
<Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
</div>
</div>
<div className={`flex-1 border ${BORDER_CLASS} rounded-lg overflow-auto`}>
{filteredData.map(row => (
<div
key={row.id}
onClick={() => handleSelectRow(row)}
className={`cursor-pointer px-3 py-2.5 border-b ${BORDER_CLASS} transition-colors ${
row.id === selectedId ? "bg-[var(--primary)]/10 border-l-2 border-l-[var(--primary)]" : "hover:bg-gray-50"
}`}
>
<div className={`text-sm font-medium ${row.id === selectedId ? "text-[var(--primary)]" : TEXT_PRIMARY} truncate`}>
{row.template}
</div>
</div>
))}
{filteredData.length === 0 && (
<div className="p-4 text-center text-sm text-gray-400">점검표가 없습니다</div>
)}
</div>
</div>

{editingData ? (
<div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
<div className="w-[260px] flex flex-col min-h-0 shrink-0 hidden md:flex">
<div className="flex items-center justify-between mb-2">
<span className={`text-sm font-semibold ${TEXT_PRIMARY}`}>템플릿</span>
<span className={`text-xs ${TEXT_SECONDARY}`}>세부항목</span>
</div>
<div className={`flex-1 border ${BORDER_CLASS} rounded-lg overflow-hidden flex flex-col min-h-0`}>
<div className="p-2 border-b border-[var(--border)]">
<div className="relative">
<input
type="text"
value={templateSearch}
onChange={e => setTemplateSearch(e.target.value)}
placeholder="검색"
className={`${INPUT_CLASS} ${BORDER_CLASS} h-8 w-full pr-8`}
/>
<Search size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
</div>
</div>
<div className="flex-1 overflow-auto">
{filteredTemplates.map(t => (
<div
key={t.id}
onClick={() => setSelectedTemplateId(t.id)}
className={`cursor-pointer px-3 py-2 border-b ${BORDER_CLASS} transition-colors ${t.id === selectedTemplateId ? "bg-[var(--primary)]/10" : "hover:bg-gray-50"}`}
>
<div className={`text-sm ${t.id === selectedTemplateId ? "font-medium text-[var(--primary)]" : TEXT_PRIMARY}`}>
{t.name}
</div>
</div>
))}
</div>
<div className="h-[160px] overflow-auto bg-gray-50 border-t border-[var(--border)]">
{selectedTemplate ? (
<div className="p-2">
<div className="flex items-center justify-between mb-2 px-0.5">
<span className="text-xs text-gray-500">{selectedTemplate.items.length}개</span>
<button onClick={addAllTemplateItems} className="text-xs text-[var(--primary)] hover:underline flex items-center gap-0.5">
<Plus size={12} />전체추가
</button>
</div>
<ul className="space-y-1">
{selectedTemplate.items.map((item, idx) => (
<li
key={idx}
onClick={() => addSingleTemplateItem(item)}
className="text-xs text-gray-600 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors flex items-center gap-1"
>
<Plus size={12} className="text-gray-400 shrink-0" />
<span className="line-clamp-1">{item}</span>
</li>
))}
</ul>
</div>
) : (
<div className="h-full flex items-center justify-center text-xs text-gray-400">
템플릿 선택
</div>
)}
</div>
</div>
</div>

<div className="flex-1 flex flex-col min-h-0">
<div className="flex items-center justify-between gap-2 mb-2">
<span className={`text-sm font-semibold ${TEXT_PRIMARY}`}>점검 항목</span>
<div className="flex gap-1 shrink-0">
<Button variant="action" onClick={addItem} className="flex items-center gap-1 text-xs h-7 px-2">
<CirclePlus size={14} />추가
</Button>
<Button variant="action" onClick={deleteSelectedItems} className="flex items-center gap-1 text-xs h-7 px-2">
<Trash2 size={14} />삭제
</Button>
</div>
</div>
<div className={`flex-1 overflow-auto border ${BORDER_CLASS} rounded-lg`} ref={tableWrapRef}>
<table className="w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10 bg-[var(--neutral-bg)]">
<tr>
<th className={`border-b ${BORDER_CLASS} px-2 py-2 text-sm font-medium ${TEXT_SECONDARY} w-10 text-center`}>
<input type="checkbox" checked={editingData.items.length ? editingData.items.every(r => editSelectedIds.includes(r.id)) : false} onChange={() => {
const allIds = editingData.items.map(r => r.id)
const allSel = allIds.every(id => editSelectedIds.includes(id))
setEditSelectedIds(allSel ? [] : allIds)
}} className="w-4 h-4 rounded border-gray-300" />
</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-2 py-2 text-sm font-medium ${TEXT_SECONDARY} w-12 text-center`}>No</th>
<th className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-3 py-2 text-sm font-medium ${TEXT_SECONDARY} text-left`}>점검세부내용</th>
</tr>
</thead>
<tbody className="bg-white">
{editingData.items.map((row, idx) => (
<tr key={row.id} className="hover:bg-gray-50">
<td className={`border-b ${BORDER_CLASS} px-2 py-2 text-center`}>
<input type="checkbox" checked={editSelectedIds.includes(row.id)} onChange={() => setEditSelectedIds(prev => prev.includes(row.id) ? prev.filter(x => x !== row.id) : [...prev, row.id])} className="w-4 h-4 rounded border-gray-300" />
</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-2 py-2 text-sm ${TEXT_PRIMARY} text-center`}>{idx + 1}</td>
<td className={`border-b ${BORDER_CLASS} border-l ${BORDER_CLASS} px-3 py-2 text-sm ${TEXT_PRIMARY}`}>
{row.isEditing ? (
<div className="flex items-center gap-2">
<span className="drag-handle cursor-grab text-gray-400 hover:text-gray-600"><GripVertical size={16} /></span>
<input className={`${INPUT_CLASS} ${BORDER_CLASS} flex-1 h-8`} placeholder="점검 세부내용 입력" value={row.draft ?? ""} onChange={e => changeDraft(row.id, e.target.value)} onKeyDown={e => { if (e.key === "Enter") commitEdit(row.id); if (e.key === "Escape") cancelEdit(row.id, row.content === "") }} autoFocus />
<button type="button" className={`${BTN_CLASS} border ${BORDER_CLASS} p-1`} onClick={() => commitEdit(row.id)}><Check size={14} /></button>
<button type="button" className={`${BTN_CLASS} border ${BORDER_CLASS} p-1`} onClick={() => cancelEdit(row.id, row.content === "")}><X size={14} /></button>
</div>
) : (
<button type="button" className="w-full text-left flex items-center gap-2" onClick={() => startEdit(row.id)}>
<span className="drag-handle cursor-grab text-gray-400 hover:text-gray-600"><GripVertical size={16} /></span>
<span>{row.content || <span className={TEXT_SECONDARY}>클릭하여 입력</span>}</span>
</button>
)}
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
) : (
<div className="flex-1 flex items-center justify-center text-sm text-gray-400">
왼쪽 목록에서 점검표를 선택하거나<br />등록 버튼을 눌러 새로 만드세요
</div>
)}
</div>

<div className="mt-3 pt-3 border-t border-gray-200 shrink-0">
{editingData && (
<div className="flex items-center justify-center gap-2 mb-3">
<span className={`text-sm font-medium ${TEXT_PRIMARY} shrink-0`}>점검표명</span>
<input
className={`${INPUT_CLASS} ${templateNameError ? "border-red-500" : BORDER_CLASS} h-8 w-80`}
placeholder="점검표명 입력"
value={editingData.templateName}
onChange={e => handleTemplateNameChange(e.target.value)}
/>
{templateNameError && (
<span className="text-xs text-red-500">필수 입력 항목입니다</span>
)}
</div>
)}
<div className="flex justify-center gap-1">
<Button variant="primaryOutline" onClick={onClose}>닫기</Button>
{editingData && <Button variant="primary" onClick={handleSave}>저장하기</Button>}
</div>
</div>
</div>
</div>
)
}
