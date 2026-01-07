import Checkbox from "@/components/common/base/Checkbox"
import FilterBar from "@/components/common/base/FilterBar"
import useFilterBar from "@/hooks/useFilterBar"

const BORDER_CLASS = "border-[var(--border)]"
const HEADER_BG_CLASS = "bg-[var(--neutral-bg)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_TH = "text-sm"
const TEXT_SIZE_TD = "text-xs md:text-[13px]"
const CELL_PADDING = "px-2 md:px-4 py-2"
const TH_PADDING = "px-2 md:px-4 py-2 md:py-3"

type IndustryRow = {
id: number
main: string
mid: string
small: string
detail: string
standardMain: string
standardMid: string
standardSmall: string
}

type IndustrySelectDialogProps = {
selectedIndustry: IndustryRow | null
setSelectedIndustry: (item: IndustryRow | null) => void
}

const mockData: IndustryRow[] = Array.from({ length: 25 }, (_, i) => ({
id: i + 1,
main: "광업",
mid: i < 5 ? "석탄광업및채석업" : i < 10 ? "석탄, 원유 및 천연가스 광업" : i < 15 ? "비금속광물 광업" : i < 20 ? "석회석·금속·비금속광업및기타광업" : "기타 비금속광물 광업",
small: i % 5 === 0 ? "갈탄광업" : i % 5 === 1 ? "유연탄광업" : i % 5 === 2 ? "아탄광업" : i % 5 === 3 ? "기타석탄광업" : "암석채굴·채취업",
detail: i % 5 === 0 ? "갈탄 채굴/채취업" : i % 5 === 1 ? "유연탄 채굴/채취업" : i % 5 === 2 ? "아탄 채굴/채취업" : i % 5 === 3 ? "이탄/역청탄 등 채굴/채취업" : "벤토나이트 가공업",
standardMain: "광업",
standardMid: i < 10 ? "석탄 광업" : i < 20 ? "토사석 광업" : "기타 광업",
standardSmall: i % 3 === 0 ? "광업 일반" : i % 3 === 1 ? "비금속 광업" : "금속 광업"
}))

export default function IndustrySelectDialog({ selectedIndustry, setSelectedIndustry }: IndustrySelectDialogProps) {
const { searchText, setSearchText, filteredData } = useFilterBar<IndustryRow>({ data: mockData, searchKeys: ["main", "mid", "small", "detail"] })

const handleSelect = (row: IndustryRow) => {
setSelectedIndustry(selectedIndustry?.id === row.id ? null : row)
}

return (
<>
<div className="mb-4">
<FilterBar
showDateRange={false}
searchText={searchText}
onSearchText={setSearchText}
onSearch={() => {}}
/>
</div>

<div className={`border ${BORDER_CLASS} rounded-lg overflow-x-auto overflow-y-auto max-h-[55vh] md:max-h-[65vh]`}>
<table className="min-w-[1000px] w-full border-separate border-spacing-0">
<thead className="sticky top-0 z-10">
<tr className={HEADER_BG_CLASS}>
<th rowSpan={2} className={`border-b ${BORDER_CLASS} border-r ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-center align-middle w-14`} />
<th colSpan={4} className={`border-b ${BORDER_CLASS} border-r ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-center align-middle`}>산재업종분류</th>
<th colSpan={3} className={`border-b ${BORDER_CLASS} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-center align-middle`}>표준산업분류</th>
</tr>
<tr className={HEADER_BG_CLASS}>
{["대분류", "중분류", "소분류", "세부작업", "대분류", "중분류", "소분류"].map((label, i) => (
<th
key={i}
className={`border-b ${BORDER_CLASS} ${i < 6 ? `border-r ${BORDER_CLASS}` : ""} ${TH_PADDING} ${TEXT_SIZE_TH} font-medium ${TEXT_SECONDARY} text-center align-middle ${i < 4 ? "min-w-[140px]" : "min-w-[100px]"}`}
>
{label}
</th>
))}
</tr>
</thead>
<tbody className="bg-white">
{filteredData.length > 0 ? (
filteredData.map((row) => (
<tr key={row.id} className="hover:bg-gray-50 transition-colors">
<td className={`border-b ${BORDER_CLASS} border-r ${BORDER_CLASS} ${CELL_PADDING} text-center align-middle`}>
<Checkbox checked={selectedIndustry?.id === row.id} onChange={() => handleSelect(row)} />
</td>
{(["main", "mid", "small", "detail", "standardMain", "standardMid", "standardSmall"] as const).map((key, i) => (
<td
key={i}
className={`border-b ${BORDER_CLASS} ${i < 6 ? `border-r ${BORDER_CLASS}` : ""} ${CELL_PADDING} ${TEXT_SIZE_TD} ${TEXT_PRIMARY} text-center align-middle truncate max-w-[150px]`}
title={row[key]}
>
{row[key]}
</td>
))}
</tr>
))
) : (
<tr>
<td colSpan={8} className={`p-12 ${TEXT_SIZE_TD} text-gray-400 text-center`}>
{searchText ? "검색 결과가 없습니다." : "등록된 업종이 없습니다."}
</td>
</tr>
)}
</tbody>
</table>
</div>
</>
)
}