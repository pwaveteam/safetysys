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
import PartnerRegister from"./PartnersRegister"
import{CirclePlus,Trash2}from"lucide-react"
import{partnersMockData}from"@/data/mockData"

const TAB_LABELS=["수급업체 관리","안전보건수준 평가","안전보건협의체 회의록","협동 안전보건점검","안전보건 교육/훈련"]
const TAB_PATHS=["/supply-chain-management/partners","/supply-chain-management/evaluation","/supply-chain-management/committee","/supply-chain-management/siteaudit","/supply-chain-management/training"]

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"company",label:"업체명"},
{key:"contractPeriod",label:"계약기간"},
{key:"manager",label:"현장관리자"},
{key:"contact",label:"연락처"},
{key:"planFile",label:"안전보건계획서",type:"download"},
{key:"etcFile",label:"계약서류",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

export default function Partners(){
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const[data,setData]=useState<DataRow[]>(partnersMockData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"contractPeriod",searchKeys:["company","manager","contact"]})
const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(filteredData,30)

const{handleCreate,handleDelete}=useHandlers({
data,
checkedIds,
onCreate:()=>{
setIsEditMode(false)
setModalOpen(true)
},
onDeleteSuccess:(ids)=>setData(prev=>prev.filter(row=>!ids.includes(row.id)))
})

const handleSave=(item:Partial<DataRow>)=>{
setData(prev=>[{id:prev.length+1,...item},...prev])
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

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
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
<PartnerRegister
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
