import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import FilterBar from"@/components/common/base/FilterBar"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useHandlers from"@/hooks/useHandlers"
import NoticeRegister from"./NoticeRegister"
import{CirclePlus,Trash2}from"lucide-react"
import{noticeMockData}from"@/data/mockData"

const TAB_LABELS=["공지사항","자료실","중대재해처벌법"]
const TAB_PATHS=["/notice-board/notice","/notice-board/resources","/notice-board/law"]

const columns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"title",label:"제목"},
{key:"author",label:"작성자"},
{key:"date",label:"작성일"},
{key:"views",label:"조회수"},
{key:"fileAttach",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

export default function NoticeBoard(){
const[data,setData]=useState<DataRow[]>(noticeMockData)
const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"date",searchKeys:["title","author"]})
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)
const[editData,setEditData]=useState<DataRow|null>(null)

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

const handleSave=(item:{title:string;author:string;content:string;fileUpload:string})=>{
const newId=data.length>0?Math.max(...data.map(d=>Number(d.id)))+1:1
const today=new Date().toISOString().split('T')[0]
const newRow:DataRow={id:newId,title:item.title,author:item.author,date:today,views:0,fileAttach:!!item.fileUpload}
setData(prev=>[newRow,...prev])
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

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex flex-nowrap gap-1 justify-end">
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
<NoticeRegister
isOpen={modalOpen}
onClose={()=>{
setModalOpen(false)
setIsEditMode(false)
setEditData(null)
}}
onSave={handleSave}
userName="관리자"
isEdit={isEditMode}
initialData={editData}
/>
)}
</section>
)
}
