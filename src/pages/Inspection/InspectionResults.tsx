import React,{useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import useHandlers from"@/hooks/useHandlers"
import useTabNavigation from"@/hooks/useTabNavigation"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import{Trash2,FileSpreadsheet,Printer}from"lucide-react"
import{inspectionResultsMockData}from"@/data/mockData"
import{DocumentTemplate}from"@/components/snippetDocument/printDocument"

const TAB_LABELS=["점검일정","점검결과","점검표(체크리스트)"]
const TAB_PATHS=["/inspection/plan","/inspection/results","/inspection/checklist"]
const PAGE_SIZE=30

type ResultRow=DataRow&{
id:number|string
template:string
workplace:string
field:string
kind:string
inspector:string
inspectedAt:string
confirmed:boolean
notes:string
}

const createInspectionResultTemplate=(row:ResultRow):DocumentTemplate=>({
id:`inspection-result-${row.id}`,
title:"점검결과",
companyName:"",
documentNumber:`IR_${String(row.id).padStart(8,"0")}`,
createdAt:row.inspectedAt,
fields:[
{label:"점검표명",value:row.template,type:"text",section:"overview"},
{label:"장소",value:row.workplace,type:"text",section:"overview"},
{label:"점검분야",value:row.field,type:"text",section:"overview"},
{label:"점검종류",value:row.kind,type:"text",section:"overview"},
{label:"점검일",value:row.inspectedAt,type:"date",section:"overview"},
{label:"점검자",value:row.inspector,type:"text",section:"overview"},
{label:"비고",value:row.notes||"-",type:"textarea",section:"content"}
]
})

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"template",label:"점검표명"},
{key:"workplace",label:"장소"},
{key:"field",label:"점검분야"},
{key:"kind",label:"점검종류"},
{key:"inspectedAt",label:"점검일"},
{key:"inspector",label:"점검자"},
{key:"resultView",label:"점검결과",type:"resultView"}
]

export default function InspectionResults(){
const navigate=useNavigate()
const location=useLocation()

const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const[data,setData]=useState<ResultRow[]>(inspectionResultsMockData as ResultRow[])
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])

const{
searchText,
setSearchText,
inspectionField,
setInspectionField,
inspectionKind,
setInspectionKind,
filteredData,
handleSearch
}=useFilterBar({data,dateKey:"inspectedAt",searchKeys:["template","workplace","field","kind","inspector"]})

const{currentPage,totalPages,currentData:pagedData,onPageChange}=usePagination(filteredData as ResultRow[],PAGE_SIZE)

const{handleDelete,handleExcelDownload,handlePrint,isDownloading,isPrinting}=useHandlers<ResultRow>({
data:filteredData as ResultRow[],
checkedIds,
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id))),
createTemplate:createInspectionResultTemplate
})

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>

<div className="mb-3">
<FilterBar
inspectionField={inspectionField}
onInspectionFieldChange={setInspectionField}
inspectionKind={inspectionKind}
onInspectionKindChange={setInspectionKind}
searchText={searchText}
onSearchText={setSearchText}
onSearch={handleSearch}
/>
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"loading={isPrinting}onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"loading={isDownloading}onClick={handleExcelDownload}className="flex items-center gap-1"><FileSpreadsheet size={16}/>Excel</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"loading={isPrinting}onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"loading={isDownloading}onClick={handleExcelDownload}className="flex items-center gap-1"><FileSpreadsheet size={16}/>Excel</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable
columns={columns}
data={pagedData}
onCheckedChange={setCheckedIds}
onManageClick={row=>navigate(`/inspection/results/${row.id}`)}
/>
</div>

<div className="mt-4 flex justify-center">
<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
</div>
</section>
)
}