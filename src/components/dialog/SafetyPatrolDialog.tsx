import React, { useState, useRef, useMemo } from "react"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import InfoBox from "@/components/common/base/InfoBox"
import { X, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"

interface SafetyPatrolDialogProps {
open: boolean
onClose: () => void
mode: "view" | "edit"
data?: PatrolData
}

interface PatrolData {
id: number
weekStart: string
location: string
dailyData: {
[key: string]: {
inspector: string
headcount: number
items: { [itemId: string]: "O" | "X" | "" }
}
}
notes: string
managerInstructions: string
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"]

const CHECKLIST_ITEMS = [
{ category: "보호구", items: [
"작업에 적합한 보호구 준비 및 착용 여부",
"안전검사에 합격한 보호구 지급 및 성능 여부",
"작업관련 장비 점검여부"
]},
{ category: "관리", items: [
"안전작업 연장 승인 여부 (일정, 야간작업)",
"안전교육 미필자 작업투입 여부",
"미승인 화학물질 사용 여부",
"사고 발생 시 대처요령 숙지 여부",
"안전작업계획서 존재 및 준수 여부",
"작업에 적합한 인원배치 및 자격조건 확인",
"위험물/고압가스용기 전도방지장치 및 점검",
"위험 및 제한구역 임의 출입 여부",
"위험기계기구 사용 허가 여부"
]},
{ category: "전기", items: [
"전원 Cable의 손상 및 절연상태",
"콘센트, 기계기구의 접지 상태",
"절연공구 사용 및 감전예방조치 상태",
"과부하상태로 용접기 등 전기제품 사용 여부",
"임시배선작업에 의한 전기작업 여부",
"미사용 기계기구/장비 전원차단 여부",
"작업에 적합한 계측기 준비 및 사용 여부",
"전기 계측기의 안전보건공단 등급 만족 여부"
]},
{ category: "추락", items: [
"고소작업(1.8M)에서의 안전대, 안전모 착용",
"이동식 사다리의 기능 상태",
"고소작업장비에 대한 안전점검 실시 여부"
]},
{ category: "화재예방", items: [
"소화기 비치 및 사용가능 여부",
"불티비산 방지조치 및 화재감시자 배치 여부",
"작업 중 흡연 또는 금연장소에서의 흡연 여부",
"기름걸레 방치 등 자연발화 예방조치 여부",
"인화성물질 관리 상태"
]},
{ category: "LOTOTO", items: [
"잔류 에너지(공기, 전기, 유압 등) 제거 여부",
"LOTOTO 설치 여부"
]},
{ category: "MSDS", items: [
"MSDS 자료집 게시 상태",
"MSDS 경고 표지 부착 상태"
]},
{ category: "질식", items: [
"밀폐공간 존재 및 산소농도 관리 상태"
]},
{ category: "운반", items: [
"지게차 등의 운전자격 여부",
"운전장비의 안전장치 부착 및 기능 여부",
"과적 여부 및 적재방법의 적합성 여부",
"사내교통안전 (주차, 일방통행) 준수 여부"
]},
{ category: "정리정돈", items: [
"공구, 전선, 자재 등의 정리정돈 상태",
"비상통로, 소방통로 등의 확보 여부",
"창고, 야적장 정리정돈 상태",
"낙하 위험 구역에서의 낙하물 방지조치 상태"
]},
{ category: "기타", items: [
"2인 이상 작업 시 커뮤니케이션 장비 존재",
"기타 안전보건에 위반되는 행위 및 상태"
]}
]

const flattenChecklistItems = (): DataRow[] => {
const rows: DataRow[] = []
let id = 1
CHECKLIST_ITEMS.forEach((section) => {
section.items.forEach((item, idx) => {
rows.push({
id,
category: idx === 0 ? section.category : "",
categoryRowSpan: idx === 0 ? section.items.length : 0,
content: item,
월: "", 화: "", 수: "", 목: "", 금: "", 토: "", 일: ""
})
id++
})
})
return rows
}

const INPUT_CLASS = "w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"

export default function SafetyPatrolDialog({ open, onClose, mode, data }: SafetyPatrolDialogProps) {
const printRef = useRef<HTMLDivElement>(null)
const [formData, setFormData] = useState<{ [key: string]: { [itemId: string]: "O" | "X" | "" } }>({})
const [inspectors, setInspectors] = useState<{ [day: string]: string }>({})
const [headcounts, setHeadcounts] = useState<{ [day: string]: string }>({})
const [notes, setNotes] = useState("")
const [managerInstructions, setManagerInstructions] = useState("")
const [location, setLocation] = useState("사업장 전체")
const [weekStart, setWeekStart] = useState("")

const handlePrint = useReactToPrint({
contentRef: printRef,
documentTitle: "안전순회 점검일지",
})

const handleItemClick = (itemId: number, day: string, value: "O" | "X") => {
if (mode === "view") return
setFormData(prev => {
const dayData = prev[day] || {}
const currentValue = dayData[itemId]
return {
...prev,
[day]: {
...dayData,
[itemId]: currentValue === value ? "" : value
}
}
})
}

const getItemValue = (day: string, itemId: number): "O" | "X" | "" => {
return formData[day]?.[itemId] || ""
}

const checklistData = useMemo(() => flattenChecklistItems(), [])

const columns: Column<DataRow>[] = useMemo(() => {
const baseColumns: Column<DataRow>[] = [
{
key: "category",
label: "분류",
minWidth: 80,
maxWidth: 80,
align: "center",
renderCell: (row) => {
if (!row.category) return null
return <span className="font-medium text-gray-700">{row.category}</span>
}
},
{
key: "content",
label: "점검항목",
minWidth: 300,
align: "left"
}
]

const dayColumns: Column<DataRow>[] = DAYS.map(day => ({
key: day,
label: day,
minWidth: 70,
maxWidth: 70,
align: "center" as const,
renderCell: (row: DataRow) => {
const value = getItemValue(day, row.id as number)
if (mode === "view") {
return (
<span className={`text-xs font-medium ${value === "O" ? "text-[var(--primary)]" : value === "X" ? "text-red-500" : ""}`}>
{value}
</span>
)
}
return (
<div className="flex justify-center gap-0.5">
<button
onClick={() => handleItemClick(row.id as number, day, "O")}
className={`w-5 h-5 rounded text-[10px] font-medium transition-all ${value === "O" ? "bg-[var(--primary)] text-white" : "bg-gray-100 text-gray-400 hover:bg-[var(--primary)]/10"}`}
>
O
</button>
<button
onClick={() => handleItemClick(row.id as number, day, "X")}
className={`w-5 h-5 rounded text-[10px] font-medium transition-all ${value === "X" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-red-50"}`}
>
X
</button>
</div>
)
}
}))

return [...baseColumns, ...dayColumns]
}, [mode, formData])

if (!open) return null

return (
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[1200px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[95vh] flex flex-col relative">
<div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 shrink-0">
<h2 className="text-base md:text-xl font-bold tracking-tight text-gray-800">
{mode === "view" ? "안전순회 점검일지" : "안전순회 점검하기"}
</h2>
<div className="flex items-center gap-2">
<Button variant="action" onClick={() => handlePrint()} className="flex items-center gap-1 text-xs">
<Printer size={14} />인쇄
</Button>
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>
</div>

<div className="flex-1 overflow-auto" ref={printRef}>

<div className="mb-4">
<InfoBox message="점검결과 표시방법: O(양호), X(불량-상세기록), 미표시(해당없음)" />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">점검장소</label>
{mode === "edit" ? (
<input
type="text"
value={location}
onChange={e => setLocation(e.target.value)}
className={INPUT_CLASS}
placeholder="점검장소 입력"
/>
) : (
<div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{data?.location || location}</div>
)}
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">점검주차</label>
{mode === "edit" ? (
<input
type="week"
value={weekStart}
onChange={e => setWeekStart(e.target.value)}
className={INPUT_CLASS}
/>
) : (
<div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">{data?.weekStart || weekStart}</div>
)}
</div>
</div>

<div className="mb-6">
<h3 className="text-sm font-semibold text-gray-800 mb-2">일자별 점검자 정보</h3>
<div className="overflow-x-auto">
<table className="w-full border border-[var(--border)] rounded-lg text-sm">
<thead>
<tr className="bg-[var(--neutral-bg)]">
<th className="border-b border-r border-[var(--border)] px-3 py-2 text-center font-medium text-gray-600 w-24">구분</th>
{DAYS.map(day => (
<th key={day} className="border-b border-r border-[var(--border)] px-3 py-2 text-center font-medium text-gray-600 w-20">{day}</th>
))}
</tr>
</thead>
<tbody>
<tr>
<td className="border-b border-r border-[var(--border)] px-3 py-2 text-center font-medium text-gray-600 bg-[var(--neutral-bg)]">점검자</td>
{DAYS.map(day => (
<td key={day} className="border-b border-r border-[var(--border)] px-2 py-1 text-center">
{mode === "edit" ? (
<input
type="text"
value={inspectors[day] || ""}
onChange={e => setInspectors(prev => ({ ...prev, [day]: e.target.value }))}
className="w-full h-8 text-center text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
placeholder=""
/>
) : (
<span className="text-xs">{data?.dailyData?.[day]?.inspector || ""}</span>
)}
</td>
))}
</tr>
<tr>
<td className="border-r border-[var(--border)] px-3 py-2 text-center font-medium text-gray-600 bg-[var(--neutral-bg)]">출역인원</td>
{DAYS.map(day => (
<td key={day} className="border-r border-[var(--border)] px-2 py-1 text-center">
{mode === "edit" ? (
<input
type="text"
value={headcounts[day] || ""}
onChange={e => setHeadcounts(prev => ({ ...prev, [day]: e.target.value }))}
className="w-full h-8 text-center text-xs border border-[var(--border)] rounded focus:outline-none focus:border-[var(--primary)]"
placeholder="명"
/>
) : (
<span className="text-xs">{data?.dailyData?.[day]?.headcount ? `${data.dailyData[day].headcount}명` : ""}</span>
)}
</td>
))}
</tr>
</tbody>
</table>
</div>
</div>

<div className="mb-6">
<h3 className="text-sm font-semibold text-gray-800 mb-2">점검항목</h3>
<DataTable
columns={columns}
data={checklistData}
selectable={false}
/>
</div>

<div className="mb-4">
<h3 className="text-sm font-semibold text-gray-800 mb-2">특이사항 및 위험요인</h3>
{mode === "edit" ? (
<textarea
value={notes}
onChange={e => setNotes(e.target.value)}
className={`${INPUT_CLASS} h-20 resize-none`}
placeholder="일자, 장소 표시 후 기록"
/>
) : (
<div className="px-3 py-2 bg-gray-50 rounded-lg text-sm min-h-[60px] whitespace-pre-wrap">
{data?.notes || notes || "-"}
</div>
)}
</div>

<div className="mb-4">
<h3 className="text-sm font-semibold text-gray-800 mb-2">관리책임자 안전점검 지시사항</h3>
{mode === "edit" ? (
<textarea
value={managerInstructions}
onChange={e => setManagerInstructions(e.target.value)}
className={`${INPUT_CLASS} h-20 resize-none`}
placeholder="지시사항을 입력하세요"
/>
) : (
<div className="px-3 py-2 bg-gray-50 rounded-lg text-sm min-h-[60px] whitespace-pre-wrap">
{data?.managerInstructions || managerInstructions || "-"}
</div>
)}
</div>
</div>

{mode === "edit" && (
<div className="flex justify-center mt-4 pt-3 border-t border-gray-200 shrink-0 gap-1">
<Button variant="primaryOutline" onClick={onClose}>취소</Button>
<Button variant="primary" onClick={() => { alert("저장되었습니다."); onClose(); }}>저장하기</Button>
</div>
)}
</div>

<style>{`
@media print {
@page { size: A4 landscape; margin: 10mm; }
body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
`}</style>
</div>
)
}
