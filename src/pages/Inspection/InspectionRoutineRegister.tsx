import React, { useState, useRef } from "react"
import Button from "@/components/common/base/Button"
import { X, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"

interface InspectionRoutineRegisterProps {
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
signature: string
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

const CELL_CLASS = "border border-[var(--border)] px-2 py-1.5 text-xs"
const HEADER_CELL_CLASS = `${CELL_CLASS} bg-[var(--neutral-bg)] font-semibold text-center text-gray-700`
const INPUT_CELL_CLASS = "w-full h-full bg-transparent text-center text-xs outline-none border border-[var(--border)] rounded"
const RESULT_BTN_CLASS = "w-5 h-5 rounded text-[10px] font-medium transition-all"

export default function InspectionRoutineRegister({ open, onClose, mode, data }: InspectionRoutineRegisterProps) {
const printRef = useRef<HTMLDivElement>(null)
const [formData, setFormData] = useState<{ [day: string]: { [itemId: string]: "O" | "X" | "△" | "" } }>({})
const [inspectors, setInspectors] = useState<{ [day: string]: string }>({})
const [signatures, setSignatures] = useState<{ [day: string]: string }>({})
const [headcounts, setHeadcounts] = useState<{ [day: string]: string }>({})
const [notes, setNotes] = useState("")
const [managerInstructions, setManagerInstructions] = useState("")
const [location, setLocation] = useState("사업장 전체")
const [checkDates, setCheckDates] = useState<{ [day: string]: string }>({})

const handlePrint = useReactToPrint({
contentRef: printRef,
documentTitle: "안전순회 점검일지",
})

const handleItemClick = (itemId: string, day: string, value: "O" | "X" | "△") => {
if (mode === "view") return
setFormData(prev => {
const dayData = prev[day] || {}
const currentValue = dayData[itemId]
const newValue = currentValue === value ? "" : value
return {
...prev,
[day]: { ...dayData, [itemId]: newValue }
}
})
}

const getItemValue = (day: string, itemId: string): "O" | "X" | "△" | "" => {
return formData[day]?.[itemId] || ""
}

if (!open) return null

let itemIndex = 0

return (
<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
<div className="bg-white rounded-none md:rounded-2xl w-full md:w-[1200px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[95vh] flex flex-col relative">
<div className="flex items-center justify-end mb-4 shrink-0 print:hidden">
<button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
<X size={24} />
</button>
</div>

<div className="flex-1 overflow-auto" ref={printRef}>
<div className="min-w-[900px]">

{/* 헤더: 제목 + 결재란 */}
<div className="flex items-start mb-4">
<div className="flex-1" />
<h1 className="text-2xl font-semibold text-gray-900 text-center flex-1">안전순회 점검일지</h1>
<div className="flex-1 flex justify-end">
<table className="border-collapse">
<thead>
<tr>
<th className={`${HEADER_CELL_CLASS} w-20`}>담당</th>
<th className={`${HEADER_CELL_CLASS} w-20`}>결재</th>
<th className={`${HEADER_CELL_CLASS} w-20`}>관리책임자</th>
</tr>
</thead>
<tbody>
<tr>
<td className={`${CELL_CLASS} h-14 w-20`}></td>
<td className={`${CELL_CLASS} h-14 w-20`}></td>
<td className={`${CELL_CLASS} h-14 w-20`}></td>
</tr>
</tbody>
</table>
</div>
</div>

{/* 메인 테이블 */}
<table className="w-full border-collapse border border-[var(--border)]">
<tbody>
{/* 첫 번째 행: 점검장소, 점검일 */}
<tr>
<td className={`${HEADER_CELL_CLASS} w-20`}>점검장소</td>
<td className={`${CELL_CLASS} w-28 text-center`}>사업장 전체</td>
<td className={`${HEADER_CELL_CLASS} w-12`}>점검일</td>
{DAYS.map(day => (
<td key={day} className={`${CELL_CLASS} text-center w-[80px]`}>
<div className="flex items-center justify-center gap-1">
{mode === "edit" ? (
<input
type="text"
value={checkDates[day] || ""}
onChange={e => {
const value = e.target.value.replace(/[^0-9]/g, "")
setCheckDates(prev => ({ ...prev, [day]: value }))
}}
className="w-10 h-5 text-center text-xs border border-[var(--border)] rounded outline-none"
placeholder=""
/>
) : (
<span className="text-xs">{checkDates[day] || ""}</span>
)}
<span className="text-xs text-gray-500">/{day}</span>
</div>
</td>
))}
</tr>

{/* 두 번째~네 번째 행: 안내문구 + 점검자/서명/출력인원 */}
<tr>
<td rowSpan={3} colSpan={2} className={`${CELL_CLASS} text-xs text-gray-600 align-middle text-center leading-relaxed`}>
※건설기계 등<br/>중장비 작업 시<br/>별도 점검일지 사용
</td>
<td className={`${HEADER_CELL_CLASS} w-12`}>점검자</td>
{DAYS.map(day => (
<td key={day} className={`${CELL_CLASS} text-center`}>
{mode === "edit" ? (
<input
type="text"
value={inspectors[day] || ""}
onChange={e => setInspectors(prev => ({ ...prev, [day]: e.target.value }))}
className="w-full h-6 text-center text-xs border border-[var(--border)] rounded outline-none"
/>
) : (
<span className="text-xs">{data?.dailyData?.[day]?.inspector || ""}</span>
)}
</td>
))}
</tr>
<tr>
<td className={`${HEADER_CELL_CLASS} w-12`}>서명</td>
{DAYS.map(day => (
<td key={day} className={`${CELL_CLASS} text-center h-10`}>
{mode === "edit" ? (
<input
type="text"
value={signatures[day] || ""}
onChange={e => setSignatures(prev => ({ ...prev, [day]: e.target.value }))}
className="w-full h-6 text-center text-xs border border-[var(--border)] rounded outline-none"
/>
) : (
<span className="text-xs">{data?.dailyData?.[day]?.signature || ""}</span>
)}
</td>
))}
</tr>
<tr>
<td className={`${HEADER_CELL_CLASS} w-14`}>출력인원</td>
{DAYS.map(day => (
<td key={day} className={`${CELL_CLASS} text-center`}>
{mode === "edit" ? (
<div className="flex items-center justify-center gap-1">
<input
type="text"
value={headcounts[day] || ""}
onChange={e => {
const value = e.target.value.replace(/[^0-9]/g, "")
setHeadcounts(prev => ({ ...prev, [day]: value }))
}}
className="w-8 h-5 text-center text-xs border border-[var(--border)] rounded outline-none"
/>
<span className="text-xs text-gray-500">명</span>
</div>
) : (
<span className="text-xs">{data?.dailyData?.[day]?.headcount ? `${data.dailyData[day].headcount}명` : ""}</span>
)}
</td>
))}
</tr>

{/* 점검항목 헤더 */}
<tr>
<td colSpan={2} className={`${HEADER_CELL_CLASS}`}>점 검 항 목</td>
<td colSpan={8} className={`${HEADER_CELL_CLASS} text-left pl-3`}>
점검결과 표시방법 (O:양호 / X:불량 / △:해당없음)
</td>
</tr>

{/* 점검항목 서브헤더 */}
<tr>
<td className={`${HEADER_CELL_CLASS} w-16`}>분류</td>
<td colSpan={2} className={`${HEADER_CELL_CLASS} min-w-[350px]`}>점검항목 내용</td>
{DAYS.map(day => (
<td key={day} className={`${HEADER_CELL_CLASS} w-[80px]`}>{day}</td>
))}
</tr>

{/* 체크리스트 행들 */}
{CHECKLIST_ITEMS.map((section) => (
section.items.map((item, idx) => {
const currentItemIndex = itemIndex++
const itemId = `item-${currentItemIndex}`
return (
<tr key={itemId}>
{idx === 0 && (
<td rowSpan={section.items.length} className={`${HEADER_CELL_CLASS} align-middle w-16`}>
{section.category}
</td>
)}
<td colSpan={2} className={`${CELL_CLASS} text-xs text-left whitespace-nowrap`}>{item}</td>
{DAYS.map(day => {
const value = getItemValue(day, itemId)
return (
<td key={day} className={`${CELL_CLASS} text-center`}>
{mode === "edit" ? (
<div className="flex items-center justify-center gap-0.5">
<button
onClick={() => handleItemClick(itemId, day, "O")}
className={`${RESULT_BTN_CLASS} ${value === "O" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500 hover:bg-blue-50"}`}
>O</button>
<button
onClick={() => handleItemClick(itemId, day, "X")}
className={`${RESULT_BTN_CLASS} ${value === "X" ? "bg-rose-700 text-white" : "bg-gray-200 text-gray-500 hover:bg-rose-50"}`}
>X</button>
<button
onClick={() => handleItemClick(itemId, day, "△")}
className={`${RESULT_BTN_CLASS} ${value === "△" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}
>△</button>
</div>
) : (
<span className={`text-xs font-medium ${value === "O" ? "text-blue-700" : value === "X" ? "text-rose-700" : value === "△" ? "text-gray-600" : "text-gray-500"}`}>
{value}
</span>
)}
</td>
)
})}
</tr>
)
})
))}

{/* 특이사항 */}
<tr>
<td colSpan={2} className={`${HEADER_CELL_CLASS} text-left pl-2`}>
특이사항 및 위험요인<br/><span className="font-normal text-gray-500">(일자, 장소 표시 후 기록)</span>
</td>
<td colSpan={8} className={`${CELL_CLASS} align-top`}>
{mode === "edit" ? (
<textarea
value={notes}
onChange={e => setNotes(e.target.value)}
className="w-full h-16 text-xs outline-none resize-none border border-[var(--border)] rounded p-2"
placeholder="내용을 입력하세요"
/>
) : (
<span className="text-xs whitespace-pre-wrap">{data?.notes || notes || ""}</span>
)}
</td>
</tr>

{/* 관리책임자 지시사항 */}
<tr>
<td colSpan={2} className={`${HEADER_CELL_CLASS} text-left pl-2`}>
관리책임자 안전점검 지시사항
</td>
<td colSpan={8} className={`${CELL_CLASS} align-top`}>
{mode === "edit" ? (
<textarea
value={managerInstructions}
onChange={e => setManagerInstructions(e.target.value)}
className="w-full h-16 text-xs outline-none resize-none border border-[var(--border)] rounded p-2"
placeholder="지시사항을 입력하세요"
/>
) : (
<span className="text-xs whitespace-pre-wrap">{data?.managerInstructions || managerInstructions || ""}</span>
)}
</td>
</tr>
</tbody>
</table>

</div>
</div>

{/* 하단 버튼 영역 */}
<div className="shrink-0 pt-4 border-t border-[var(--border)] flex items-center justify-end gap-1 print:hidden">
<Button variant="action" onClick={() => handlePrint()} className="flex items-center gap-1 text-xs">
<Printer size={14} />인쇄
</Button>
{mode === "edit" && (
<button
onClick={() => { alert("저장되었습니다."); onClose(); }}
className="relative flex items-center justify-center gap-1 select-none whitespace-nowrap font-medium transition-opacity duration-200 hover:opacity-80 px-3 py-1.5 text-xs md:text-sm rounded-lg bg-[var(--primary)] text-white border border-[var(--primary)]"
>
제출하기
</button>
)}
</div>

<style>{`
@media print {
@page { size: A4 landscape; margin: 3mm; }
body {
-webkit-print-color-adjust: exact !important;
print-color-adjust: exact !important;
}
.print\\:hidden { display: none !important; }
.min-w-\\[900px\\] {
min-width: auto !important;
width: 100% !important;
transform: scale(0.85);
transform-origin: top left;
}
table {
width: 100% !important;
table-layout: fixed !important;
font-size: 8px !important;
}
td, th {
padding: 1px 3px !important;
font-size: 8px !important;
line-height: 1.2 !important;
}
h1 { font-size: 14px !important; font-weight: 600 !important; }
textarea, input { font-size: 8px !important; }
.text-xs { font-size: 8px !important; }
.text-xl { font-size: 12px !important; }
.h-16 { height: 25px !important; }
.h-14 { height: 30px !important; }
.h-10 { height: 20px !important; }
.mb-4 { margin-bottom: 8px !important; }
.mb-6 { margin-bottom: 10px !important; }
.p-4, .p-6, .md\\:p-6 { padding: 0 !important; }
}
`}</style>
</div>
</div>
)
}
