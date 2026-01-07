import React,{useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
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
import CommitteeRegister from"./CommitteeRegister"
import{CirclePlus,Download,Trash2,Upload,ShieldAlert,FileSpreadsheet,Printer}from"lucide-react"
import{committeeMockData}from"@/data/mockData"
import{DocumentTemplate}from"@/components/snippetDocument/printDocument"

type CommitteeRow=DataRow&{id:number|string;completionDate:string;meetingPlace:string;sitePhotos:string[]}

const TAB_LABELS=["수급업체 관리","안전보건수준 평가","안전보건협의체 회의록","협동 안전보건점검","안전보건 교육/훈련"]
const TAB_PATHS=["/supply-chain-management/partners","/supply-chain-management/evaluation","/supply-chain-management/committee","/supply-chain-management/siteaudit","/supply-chain-management/training"]

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"completionDate",label:"회의일시"},
{key:"meetingPlace",label:"회의장소"},
{key:"sitePhotos",label:"현장사진",type:"photo"},
{key:"proof",label:"회의록",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

const createCommitteeTemplate=(row:CommitteeRow):DocumentTemplate=>({
id:`committee-${row.id}`,
title:"안전보건협의체 회의록",
companyName:"",
documentNumber:`COM_${String(row.id).padStart(8,"0")}`,
createdAt:row.completionDate,
fields:[
{label:"회의일시",value:row.completionDate,type:"date",section:"overview"},
{label:"회의장소",value:row.meetingPlace,type:"text",section:"overview"},
...(row.sitePhotos?.length?[{label:"현장사진",value:row.sitePhotos,type:"photos"as const,section:"content"as const}]:[])
]
})

export default function Committee(){
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const[data,setData]=useState<CommitteeRow[]>(committeeMockData as CommitteeRow[])
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"completionDate",searchKeys:["meetingPlace"]})

const{currentPage,totalPages,currentData,onPageChange}=usePagination<CommitteeRow>(filteredData as CommitteeRow[],30)

const{handleDelete,handleExcelDownload,handlePrint,isDownloading,isPrinting}=useHandlers<CommitteeRow>({
data:filteredData as CommitteeRow[],
checkedIds,
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id))),
createTemplate:createCommitteeTemplate
})

const handleSave=(item:Partial<CommitteeRow>)=>{
const nextId=Math.max(...data.map(r=>Number(r.id)),0)+1
setData(prev=>[
{id:nextId,completionDate:"",meetingPlace:"",sitePhotos:[],...item} as CommitteeRow,
...prev
])
setModalOpen(false)
setIsEditMode(false)
}

const hasOrganization=false

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

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>

<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action"onClick={()=>{setIsEditMode(false);setModalOpen(true)}}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"loading={isPrinting}onClick={handlePrint}className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action"loading={isDownloading}onClick={handleExcelDownload}className="flex items-center gap-1"><FileSpreadsheet size={16}/>Excel</Button>
<Button variant="action"onClick={()=>{}}className="flex items-center gap-1"><Download size={16}/>회의록 양식</Button>
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
setModalOpen(true)
}}
/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

<PageTitle className="mt-8 mb-3">도급협의체 조직도</PageTitle>

{!hasOrganization?(
<div className="flex flex-col items-center text-center text-gray-600 mt-16 mb-16">
<div className="mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
<ShieldAlert size={24}className="sm:w-8 sm:h-8 w-6 h-6 text-gray-500"/>
</div>
<h3 className="text-sm sm:text-lg font-semibold mb-1">도급협의체 조직도가 등록되지 않았습니다.</h3>
<p className="text-xs sm:text-sm text-gray-500 mb-5">조직도 이미지를 업로드한 후 조직관리를 시작해보세요</p>
<Button variant="action"className="flex items-center justify-center gap-1 px-6">
<Upload size={16}className="text-gray-500"/>
조직도 이미지 업로드
</Button>
</div>
):(
<div className="flex justify-center mb-6"></div>
)}

{modalOpen&&(
<CommitteeRegister
isOpen={modalOpen}
onClose={()=>{
setModalOpen(false)
setIsEditMode(false)
}}
onSave={handleSave}
isEdit={isEditMode}
/>
)}
</section>
)
}
