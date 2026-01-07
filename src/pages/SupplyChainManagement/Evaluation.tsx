import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import useFilterBar from"@/hooks/useFilterBar"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import useHandlers from"@/hooks/useHandlers"
import useTabNavigation from"@/hooks/useTabNavigation"
import EvaluationRegister from"./EvaluationRegister"
import{CirclePlus,Download,Trash2,FileSpreadsheet,Printer}from"lucide-react"
import{evaluationMockData}from"@/data/mockData"
import{DocumentTemplate}from"@/components/snippetDocument/printDocument"

type EvaluationRow=DataRow&{id:number|string;company:string;evaluationName:string;evaluationType:string;contractPeriod:string;evaluator:string;externalEvaluator:string}

const TAB_LABELS=["수급업체 관리","안전보건수준 평가","안전보건협의체 회의록","협동 안전보건점검","안전보건 교육/훈련"]
const TAB_PATHS=["/supply-chain-management/partners","/supply-chain-management/evaluation","/supply-chain-management/committee","/supply-chain-management/siteaudit","/supply-chain-management/training"]

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"company",label:"업체명"},
{key:"evaluationName",label:"평가명"},
{key:"evaluationType",label:"평가종류"},
{key:"contractPeriod",label:"평가기간"},
{key:"evaluator",label:"평가자"},
{key:"externalEvaluator",label:"외부 평가업체"},
{key:"evaluationFile",label:"평가지",type:"download"},
{key:"attachmentFile",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const createEvaluationTemplate=(row:EvaluationRow):DocumentTemplate=>({
id:`evaluation-${row.id}`,
title:"안전보건수준 평가",
companyName:"",
documentNumber:`EVL_${String(row.id).padStart(8,"0")}`,
createdAt:row.contractPeriod,
fields:[
{label:"업체명",value:row.company,type:"text",section:"overview"},
{label:"평가명",value:row.evaluationName,type:"text",section:"overview"},
{label:"평가종류",value:row.evaluationType,type:"text",section:"overview"},
{label:"평가기간",value:row.contractPeriod,type:"text",section:"overview"},
{label:"평가자",value:row.evaluator,type:"text",section:"overview"},
{label:"외부 평가업체",value:row.externalEvaluator||"-",type:"text",section:"overview"}
]
})

export default function Evaluation(){
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const[data,setData]=useState<EvaluationRow[]>(evaluationMockData as EvaluationRow[])
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[isModalOpen,setIsModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"contractPeriod",searchKeys:["company","evaluator"]})
const{currentPage,totalPages,currentData,onPageChange}=usePagination<EvaluationRow>(filteredData as EvaluationRow[],30)

const{handleDelete,handleExcelDownload,handlePrint,isDownloading,isPrinting}=useHandlers<EvaluationRow>({
data:filteredData as EvaluationRow[],
checkedIds,
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id))),
createTemplate:createEvaluationTemplate
})

const handleSave=(item:Partial<EvaluationRow>)=>{
const nextId=Math.max(...data.map(r=>Number(r.id)),0)+1
setData(prev=>[{id:nextId,company:"",evaluationName:"",evaluationType:"",contractPeriod:"",evaluator:"",externalEvaluator:"",...item} as EvaluationRow,...prev])
setIsModalOpen(false)
setIsEditMode(false)
}

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>
<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
searchText={searchText}
onSearchText={setSearchText}
onSearch={handleSearch}
/>
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>

<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action"onClick={()=>{setIsEditMode(false);setIsModalOpen(true)}}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"loading={isPrinting}onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"loading={isDownloading}onClick={handleExcelDownload}className="flex items-center gap-1"><FileSpreadsheet size={16}/>Excel</Button>
<Button variant="action"onClick={()=>{}}className="flex items-center gap-1"><Download size={16}/>평가지 양식</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={currentData}
onCheckedChange={setCheckedIds}
onManageClick={()=>{
setIsEditMode(true)
setIsModalOpen(true)
}}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{isModalOpen&&(
<EvaluationRegister
isOpen={isModalOpen}
onClose={()=>{
setIsModalOpen(false)
setIsEditMode(false)
}}
onSave={handleSave}
isEdit={isEditMode}
/>
)}
</section>
)
}
