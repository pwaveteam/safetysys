import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import Pagination from"@/components/common/base/Pagination"
import usePagination from"@/hooks/usePagination"
import useFilterBar from"@/hooks/useFilterBar"
import useHandlers from"@/hooks/useHandlers"
import useTabNavigation from"@/hooks/useTabNavigation"
import TrainingRegister from"./TrainingRegister"
import{CirclePlus,Trash2}from"lucide-react"
import{trainingMockData}from"@/data/mockData"

const TAB_LABELS=["수급업체 관리","안전보건수준 평가","안전보건협의체 회의록","협동 안전보건점검","안전보건 교육/훈련"]
const TAB_PATHS=["/supply-chain-management/partners","/supply-chain-management/evaluation","/supply-chain-management/committee","/supply-chain-management/siteaudit","/supply-chain-management/training"]

export interface PartnerStatus extends DataRow{
id:number
name:string
riskAssessment:{text:string;color:string}
hazardousMaterial:{text:string;color:string}
responseManual:{text:string;color:string}
allSigned:{text:string;color:string}
updatedAt:string|null
}

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"name",label:"도급협의체명"},
{key:"riskAssessment",label:"위험성평가 확인",type:"badge"},
{key:"hazardousMaterial",label:"유해물질 확인",type:"badge"},
{key:"responseManual",label:"대응매뉴얼 확인",type:"badge"},
{key:"allSigned",label:"전체서류 서명",type:"badge"},
{key:"updatedAt",label:"최종 등록일"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

export default function PartnerTraining(){
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const[data,setData]=useState<DataRow[]>(trainingMockData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"updatedAt",searchKeys:["name"]})
const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(filteredData,30)

const{handleCreate,handleDelete}=useHandlers({
data,
checkedIds,
onCreate:()=>{
setIsEditMode(false)
setModalOpen(true)
},
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

const handleSave=(item:{name:string;riskAssessment:boolean;hazardousMaterial:boolean;responseManual:boolean;allSigned:boolean})=>{
const toBadge=(v:boolean)=>v?{text:"완료",color:"gray"}:{text:"미완료",color:"red"}
if(isEditMode){
setModalOpen(false)
setIsEditMode(false)
return
}
setData(prev=>[
{
id:prev.length+1,
name:item.name,
riskAssessment:toBadge(item.riskAssessment),
hazardousMaterial:toBadge(item.hazardousMaterial),
responseManual:toBadge(item.responseManual),
allSigned:toBadge(item.allSigned),
updatedAt:new Date().toISOString().slice(0,10)
},
...prev
])
setModalOpen(false)
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
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
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
{modalOpen&&(
<TrainingRegister
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