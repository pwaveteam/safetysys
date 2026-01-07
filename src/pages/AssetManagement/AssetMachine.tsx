import React,{useState}from"react"
import Button from"@/components/common/base/Button"
import FilterBar from"@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import AssetMachineRegister from"./AssetMachineRegister"
import Pagination from"@/components/common/base/Pagination"
import useHandlers from"@/hooks/useHandlers"
import usePagination from"@/hooks/usePagination"
import useTabNavigation from"@/hooks/useTabNavigation"
import useFilterBar from"@/hooks/useFilterBar"
import{CirclePlus,Download,Trash2}from"lucide-react"
import{assetMachineMockData}from"@/data/mockData"

const TAB_LABELS=["위험기계/기구/설비","유해/위험물질"]
const TAB_PATHS=["/asset-management/machine","/asset-management/hazard"]

const machineColumns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"name",label:"기계/기구/설비명"},
{key:"capacity",label:"용량/단위"},
{key:"quantity",label:"수량"},
{key:"location",label:"설치/작업장소"},
{key:"inspectionDate",label:"점검일"},
{key:"purpose",label:"용도"},
{key:"inspectionCycle",label:"점검주기"},
{key:"attachments",label:"첨부파일",type:"download"},
{key:"manage",label:"관리",type:"manage"}
]

export default function AssetManagement(){
const[machineData,setMachineData]=useState<DataRow[]>(assetMachineMockData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[isModalOpen,setIsModalOpen]=useState(false)
const[isEditMode,setIsEditMode]=useState(false)

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data:machineData,dateKey:"inspectionDate",searchKeys:["name","location","purpose"]})
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)

const{currentPage,totalPages,currentData,onPageChange}=usePagination<DataRow>(filteredData,30)

const{
handleCreate,
handleDelete
}=useHandlers({
data:machineData,
checkedIds,
onCreate:()=>{
setIsEditMode(false)
setIsModalOpen(true)
},
onDeleteSuccess:(ids)=>setMachineData(prev=>prev.filter(row=>!ids.includes(row.id)))
})

const handleSave=(newItem:Partial<DataRow>)=>{
setMachineData(prev=>[{id:prev.length+1,...newItem},...prev])
setIsModalOpen(false)
setIsEditMode(false)
}

return(
<section className="asset-management-content w-full bg-white">
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
<Button variant="action"onClick={handleCreate}className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"onClick={()=>{}}className="flex items-center gap-1"><Download size={16}/>안전검사신청서 양식</Button>
<Button variant="action"onClick={handleDelete}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={machineColumns}data={currentData}onCheckedChange={setCheckedIds}onManageClick={()=>{setIsEditMode(true);setIsModalOpen(true)}}/>
</div>

<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>

{isModalOpen&&(
<AssetMachineRegister
isOpen={isModalOpen}
onClose={()=>{setIsModalOpen(false);setIsEditMode(false)}}
onSave={handleSave}
isEdit={isEditMode}
/>
)}
</section>
)
}
