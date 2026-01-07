import React, { useState } from "react"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import InfoBox from "@/components/common/base/InfoBox"
import YearPicker from "@/components/common/inputs/YearPicker"
import BudgetTable, { BudgetItem } from "@/components/snippetBusiness/BudgetTable"
import InspectionTable, { InspectionItem } from "@/components/snippetBusiness/InspectionTable"
import Button from "@/components/common/base/Button"
import ApprovalConfirmDialog from "@/components/dialog/ApprovalConfirmDialog"
import useApproval from "@/hooks/useApproval"
import { Trash2 } from "lucide-react"
import { useBudgetHandlers } from "@/hooks/useHandlers"
import { inspectionItemsMockData, budgetItemsMockData } from "@/data/mockBusinessData"

const TAB_LABELS = ["예산/목표"]
const currentYear = new Date().getFullYear().toString()

export default function Budget() {
const [inspItems, setInspItems] = useState<InspectionItem[]>(inspectionItemsMockData)
const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(budgetItemsMockData)
const [inspCheckedIds, setInspCheckedIds] = useState<(number | string)[]>([])
const [budgetCheckedIds, setBudgetCheckedIds] = useState<(number | string)[]>([])
const [activeQuarter, setActiveQuarter] = useState<number>(1)
const [selectedYear, setSelectedYear] = useState<string>(currentYear)
const [budgetYear, setBudgetYear] = useState<string>(currentYear)

const {
  handleInspAdd,
  handleBudgetAdd,
  handleInspChange,
  handleBudgetChange,
  handleInspDelete,
  handleBudgetDelete,
  isQuarterEnabled,
  formatCurrency
} = useBudgetHandlers({
  inspItems,
  budgetItems,
  setInspItems,
  setBudgetItems,
  inspCheckedIds,
  budgetCheckedIds,
  selectedYear,
  budgetYear,
  activeQuarter
})

const filteredInspItems = inspItems.filter(item => item.year === selectedYear)
const yearFilteredBudgetItems = budgetItems.filter(item => item.year === budgetYear)
const filteredBudgetItems = yearFilteredBudgetItems.filter(item => item.quarter === activeQuarter)

const yearBudgetSummary = yearFilteredBudgetItems.reduce((acc, item) => {
  const budget = parseInt(item.budget.replace(/[^0-9]/g, ""), 10) || 0
  const spent = parseInt(item.spent.replace(/[^0-9]/g, ""), 10) || 0
  const remaining = parseInt(item.remaining.replace(/[^0-9]/g, ""), 10) || 0
  return {
    totalBudget: acc.totalBudget + budget,
    totalSpent: acc.totalSpent + spent,
    totalRemaining: acc.totalRemaining + remaining
  }
}, { totalBudget: 0, totalSpent: 0, totalRemaining: 0 })

const goalApproval = useApproval({ documentType: "안전보건 목표 및 추진계획" })
const budgetApproval = useApproval({ documentType: "안전보건예산" })

const handleSaveGoalWithApproval = () => {
  goalApproval.checkAndSave(
    () => alert("목표 및 추진계획이 저장되었습니다"),
    `${selectedYear}년 안전보건 목표 및 추진계획`
  )
}

const handleSaveBudgetWithApproval = () => {
  budgetApproval.checkAndSave(
    () => alert("안전보건예산이 저장되었습니다"),
    `${budgetYear}년 안전보건예산`
  )
}

return (
<section className="mypage-content w-full bg-white">
<PageTitle>예산/목표</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={0} onTabClick={() => {}} className="mb-6" />

<div className="mb-6">
<InfoBox message="연간 안전보건 목표와 분기별 예산 집행현황을 한 화면에서 관리할 수 있습니다." />
</div>

<div className="border border-[#DDDDDD] rounded-[13px] p-5 mb-6 bg-white">
<div className="flex justify-between items-center mb-4 border-b border-[#DDDDDD] pb-3">
<h2 className="text-base font-semibold text-[#333]">안전보건 목표 및 추진계획</h2>
<YearPicker year={selectedYear} onChange={setSelectedYear} />
</div>

<div className="flex justify-between items-center mb-3">
<span className="text-gray-600 text-sm">총 {filteredInspItems.length}건</span>
<div className="flex gap-1">
<Button variant="action" onClick={handleInspDelete} className="flex items-center gap-1">
<Trash2 size={16} />삭제
</Button>
</div>
</div>
<div className="overflow-x-auto bg-white rounded-lg">
<InspectionTable items={filteredInspItems} onChangeField={handleInspChange} onCheckedChange={setInspCheckedIds} />
<div className="mt-3 flex justify-start">
<Button variant="rowAdd" onClick={handleInspAdd}>+ 추가</Button>
</div>
</div>
<div className="flex justify-end mt-4">
<Button variant="primary" onClick={handleSaveGoalWithApproval}>저장하기</Button>
</div>
</div>

<div className="border border-[#DDDDDD] rounded-[13px] p-5 bg-white">
<div className="flex justify-between items-center mb-4 border-b border-[#DDDDDD] pb-3">
<h2 className="text-base font-semibold text-[#333]">안전보건예산</h2>
<YearPicker year={budgetYear} onChange={setBudgetYear} />
</div>

<div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
<div className="flex items-center gap-2">
<span className="text-sm text-gray-500">총 예산:</span>
<span className="text-sm font-semibold text-[#333]">{formatCurrency(yearBudgetSummary.totalBudget)}</span>
</div>
<div className="w-px h-5 bg-gray-300 hidden sm:block" />
<div className="flex items-center gap-2">
<span className="text-sm text-gray-500">집행액:</span>
<span className="text-sm font-semibold text-[#555]">{formatCurrency(yearBudgetSummary.totalSpent)}</span>
</div>
<div className="w-px h-5 bg-gray-300 hidden sm:block" />
<div className="flex items-center gap-2">
<span className="text-sm text-gray-500">잔액:</span>
<span className="text-sm font-semibold text-[#333]">{formatCurrency(yearBudgetSummary.totalRemaining)}</span>
</div>
</div>

<div className="flex gap-2 mb-4">
{["1분기", "2분기", "3분기", "4분기"].map((q, idx) => {
const quarter = idx + 1
const enabled = isQuarterEnabled(quarter)
return (
<button
key={q}
onClick={() => enabled && setActiveQuarter(quarter)}
disabled={!enabled}
className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
!enabled
? "bg-gray-100 text-gray-300 cursor-not-allowed"
: activeQuarter === quarter
? "bg-[#0E4A84] text-white"
: "bg-gray-100 text-gray-600 hover:bg-gray-200"
}`}
>
{q}
</button>
)
})}
</div>

<div className="flex justify-between items-center mb-3">
<span className="text-gray-600 text-sm">총 {filteredBudgetItems.length}건</span>
<div className="flex gap-1">
<Button variant="action" onClick={handleBudgetDelete} className="flex items-center gap-1">
<Trash2 size={16} />삭제
</Button>
</div>
</div>
<div className="overflow-x-auto bg-white rounded-lg">
<BudgetTable items={filteredBudgetItems} onChangeField={handleBudgetChange} onCheckedChange={setBudgetCheckedIds} />
<div className="mt-3 flex justify-start">
<Button variant="rowAdd" onClick={handleBudgetAdd}>+ 추가</Button>
</div>
</div>
<div className="flex justify-end mt-4">
<Button variant="primary" onClick={handleSaveBudgetWithApproval}>저장하기</Button>
</div>
</div>

<ApprovalConfirmDialog
  isOpen={goalApproval.isDialogOpen}
  documentType="안전보건 목표 및 추진계획"
  approvalLineName={goalApproval.approvalLineName}
  approvers={goalApproval.approvers}
  defaultContent={goalApproval.defaultContent}
  onConfirm={goalApproval.handleConfirmApproval}
  onCancel={goalApproval.handleCancel}
/>
<ApprovalConfirmDialog
  isOpen={budgetApproval.isDialogOpen}
  documentType="안전보건예산"
  approvalLineName={budgetApproval.approvalLineName}
  approvers={budgetApproval.approvers}
  defaultContent={budgetApproval.defaultContent}
  onConfirm={budgetApproval.handleConfirmApproval}
  onCancel={budgetApproval.handleCancel}
/>
</section>
)
}
