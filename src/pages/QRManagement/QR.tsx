import React, { useState, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Download } from "lucide-react"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"

const QR_ITEMS = [
{ id: 1, qrName: "안전점검", desc: "점검 일정 확인 및 실행", path: "/public/inspection", useStatus: true },
{ id: 2, qrName: "현장 위험성평가(JSA)", desc: "현장 안전 평가 양식", path: "/public/site-evaluation", useStatus: true },
{ id: 3, qrName: "TBM", desc: "TBM 안전회의 기록", path: "/public/tbm", useStatus: true },
{ id: 4, qrName: "아차사고", desc: "아차사고 등록", path: "/public/nearmiss", useStatus: true },
{ id: 5, qrName: "안전보이스", desc: "안전 관련 의견 제출", path: "/public/safevoice", useStatus: true },
{ id: 6, qrName: "이수증 제출", desc: "안전교육 이수증 제출", path: "/public/certificate", useStatus: true },
]

export default function QRManagement() {
const [items, setItems] = useState(QR_ITEMS)
const qrRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({})

const getFullUrl = (path: string) => `${window.location.origin}${path}`
const handleToggle = (id: number) => setItems(prev => prev.map(item => item.id === id ? { ...item, useStatus: !item.useStatus } : item))

const handleDownload = (id: number, name: string) => {
const canvas = qrRefs.current[id]
if (canvas) {
const url = canvas.toDataURL("image/png")
const link = document.createElement("a")
link.download = `QR_${name}.png`
link.href = url
link.click()
}
}

return (
<section className="qr-management-content w-full bg-white">
<PageTitle>QR관리</PageTitle>
<TabMenu tabs={["QR 관리"]} activeIndex={0} onTabClick={() => {}} className="mb-6" />
<div className="flex justify-between items-center mb-3">
<span className="text-gray-600 text-sm">총 {items.length}건</span>
</div>
<div className="overflow-x-auto bg-white">
<table className="w-full text-xs md:text-base">
<thead className="bg-gray-100 border-y border-gray-300">
<tr>
<th className="p-2 text-center font-medium">QR항목</th>
<th className="p-2 text-center font-medium">설명</th>
<th className="p-2 text-center font-medium">QR코드</th>
<th className="p-2 text-center font-medium">이미지 저장</th>
<th className="p-2 text-center font-medium">사용여부</th>
</tr>
</thead>
<tbody>
{items.map(item => (
<tr key={item.id} className="border-b border-gray-200">
<td className="p-3 text-center font-medium">{item.qrName}</td>
<td className="p-3 text-center text-gray-500">{item.desc}</td>
<td className="p-3 text-center">
<div className="flex justify-center">
<QRCodeCanvas value={getFullUrl(item.path)} size={50} ref={(el) => { if (el) qrRefs.current[item.id] = el }} />
</div>
</td>
<td className="p-3 text-center">
<button onClick={() => handleDownload(item.id, item.qrName)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"><Download size={14} />다운로드</button>
</td>
<td className="p-3 text-center">
<div className="flex justify-center"><ToggleSwitch checked={item.useStatus} onChange={() => handleToggle(item.id)} /></div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
)
}