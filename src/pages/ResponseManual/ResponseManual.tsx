import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import PageTitle from"@/components/common/base/PageTitle"
import TabMenu from"@/components/common/base/TabMenu"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useHandlers from"@/hooks/useHandlers"
import ResponseManualRegister from"./ResponseManualRegister"
import{CirclePlus,ShieldAlert,Trash2}from"lucide-react"
import{responseManualMockData}from"@/data/mockData"

const TAB_LABELS=["대응매뉴얼 목록"]
const TAB_PATHS=["/response-manual"]

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"title",label:"제목",align:"left"},
{key:"author",label:"작성자"},
{key:"date",label:"작성일"},
{key:"views",label:"조회수"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

type FormDataState={
title:string
author:string
content:string
fileUpload:string
}

export default function ResponseManual(){
const[data,setData]=useState<DataRow[]>(responseManualMockData)
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"date",searchKeys:["title","author"]})
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)
const userName="김작성"

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(filteredData,30)

const{
handleCreate,
handleDelete
}=useHandlers({
data,
checkedIds,
onCreate:()=>{
setIsEditMode(false)
setModalOpen(true)
},
onDeleteSuccess:ids=>setData(prev=>prev.filter(r=>!ids.includes(r.id)))
})

const handleSave=(item:FormDataState)=>{
const newId=data.length>0?Math.max(...data.map(d=>Number(d.id)))+1:1
const today=new Date().toISOString().slice(0,10)
const newData:DataRow={
id:newId,
title:item.title,
author:item.author,
date:today,
views:0,
fileAttach:!!item.fileUpload
}
setData(prev=>[newData,...prev])
setModalOpen(false)
setIsEditMode(false)
}

return(
<section className="w-full bg-white">
<PageTitle>대응매뉴얼</PageTitle>

<TabMenu tabs={TAB_LABELS}activeIndex={0}onTabClick={()=>{}}className="mb-6"/>

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

<div className="mb-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2">
<span className="text-sm text-gray-600 leading-none mt-2 sm:mt-0">총 {filteredData.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action"onClick={handleCreate}className="flex gap-1 items-center"><CirclePlus size={16}/>신규등록</Button>
<Button variant="warning"onClick={()=>alert("비상대응체계 가이드 다운로드")}className="flex gap-1 items-center"><ShieldAlert size={16}/>비상대응체계 가이드</Button>
<Button variant="action"onClick={handleDelete}className="flex gap-1 items-center"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action"onClick={handleCreate}className="flex gap-1 items-center"><CirclePlus size={16}/>신규등록</Button>
<Button variant="warning"onClick={()=>alert("비상대응체계 가이드 다운로드")}className="flex gap-1 items-center"><ShieldAlert size={16}/>비상대응체계 가이드</Button>
<Button variant="action"onClick={handleDelete}className="flex gap-1 items-center"><Trash2 size={16}/>삭제</Button>
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
<ResponseManualRegister
isOpen={modalOpen}
onClose={()=>{
setModalOpen(false)
setIsEditMode(false)
}}
onSave={handleSave}
userName={userName}
isEdit={isEditMode}
/>
)}
</section>
)
}