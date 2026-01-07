import React from "react"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import{CirclePlus,Trash2,QrCode,FileSpreadsheet,Printer}from"lucide-react"
import TabMenu from"@/components/common/base/TabMenu"
import PageTitle from"@/components/common/base/PageTitle"
import NearMissRegisterModal from"@/pages/NearMiss/NearMissRegister"
import QRDialog from"@/components/QR/QRDialog"
import Pagination from"@/components/common/base/Pagination"
import useFilterBar from"@/hooks/useFilterBar"
import useTabNavigation from"@/hooks/useTabNavigation"
import usePagination from"@/hooks/usePagination"
import useHandlers from"@/hooks/useHandlers"
import{nearMissMockData}from"@/data/mockData"
import{DocumentTemplate}from"@/components/snippetDocument/printDocument"

type NearMissRow=DataRow&{id:number|string;danger:string;place:string;registrant:string;date:string;result:string;reason:string;sitePhotos:string[]}

const TAB_LABELS=["아차사고","안전보이스"]
const TAB_PATHS=["/nearmiss/incident","/nearmiss/safevoice"]

const nearMissColumns:Column[]=[
{key:"index",label:"번호",type:"index"},
{key:"place",label:"장소"},
{key:"danger",label:"유해위험요인"},
{key:"registrant",label:"등록인"},
{key:"date",label:"등록일"},
{key:"sitePhotos",label:"현장사진",type:"photo"},
{key:"result",label:"처리결과",type:"stateToggleNearMiss",stateOptions:{left:{text:"채택",color:"sky"},right:{text:"미채택",color:"red"}}},
{key:"reason",label:"미처리 사유",type:"textarea",disabledWhenKey:"result",disabledWhenValue:"채택"}
]

const createNearMissTemplate=(row:NearMissRow):DocumentTemplate=>({
id:`nearmiss-${row.id}`,
title:"아차사고 보고서",
companyName:"",
documentNumber:`NM_${String(row.id).padStart(8,"0")}`,
createdAt:row.date,
fields:[
{label:"장소",value:row.place,type:"text",section:"overview"},
{label:"등록인",value:row.registrant,type:"text",section:"overview"},
{label:"등록일",value:row.date,type:"date",section:"overview"},
{label:"처리결과",value:{text:row.result,color:row.result==="채택"?"blue":"red"},type:"badge",section:"overview"},
{label:"유해위험요인",value:row.danger,type:"textarea",section:"content"},
{label:"미처리 사유",value:row.reason||"-",type:"textarea",section:"content"},
...(row.sitePhotos?.length?[{label:"현장사진",value:row.sitePhotos,type:"photos"as const,section:"content"as const}]:[])
]
})

export default function NearMiss(){
const[data,setData]=React.useState<NearMissRow[]>(nearMissMockData as NearMissRow[])
const[checkedIds,setCheckedIds]=React.useState<(number|string)[]>([])
const[modalOpen,setModalOpen]=React.useState(false)
const[qrDialogOpen,setQrDialogOpen]=React.useState(false)
const[qrUrl,setQrUrl]=React.useState("")

const{startDate,endDate,searchText,setStartDate,setEndDate,setSearchText,filteredData,handleSearch}=useFilterBar({data,dateKey:"date",searchKeys:["danger","place","registrant"]})
const{currentIndex,handleTabClick}=useTabNavigation(TAB_PATHS)
const{currentPage,totalPages,currentData,onPageChange}=usePagination<NearMissRow>(filteredData as NearMissRow[],30)
const{handleDelete,handleSave,handleExcelDownload,handlePrint,isDownloading,isPrinting}=useHandlers<NearMissRow>({
data:filteredData as NearMissRow[],
checkedIds,
onDeleteSuccess:ids=>setData(prev=>prev.filter(row=>!ids.includes(row.id))),
onSave:()=>{console.log("아차사고 저장",data)},
createTemplate:createNearMissTemplate
})

const handleOpenQR=()=>{setQrUrl(`${window.location.origin}/public/nearmiss`);setQrDialogOpen(true)}
const handleStateToggle=(id:number|string,newValue:string)=>setData(prev=>prev.map(r=>r.id===id?{...r,result:newValue,reason:newValue==="채택"?"채택 완료":r.reason}:r))
const handleInputChange=(id:number|string,key:string,value:string)=>setData(prev=>prev.map(r=>r.id===id?{...r,[key]:value}:r))
const handleSaveRow=(newItem:Partial<NearMissRow>)=>{const nextId=Math.max(...data.map(r=>Number(r.id)))+1;setData([{id:nextId,result:"미채택",reason:"",sitePhotos:[],danger:"",place:"",registrant:"",date:"",...newItem},...data]);setModalOpen(false)}

return(
<section className="nearmiss-content w-full bg-white">
<PageTitle>{TAB_LABELS[currentIndex]}</PageTitle>
<TabMenu tabs={TAB_LABELS}activeIndex={currentIndex}onTabClick={handleTabClick}className="mb-6"/>
<div className="mb-3"><FilterBar startDate={startDate}endDate={endDate}onStartDate={setStartDate}onEndDate={setEndDate}searchText={searchText}onSearchText={setSearchText}onSearch={handleSearch}/></div>
<div className="mb-3 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-2">
<span className="text-sm text-gray-600 leading-none mt-2 sm:mt-0">총 {filteredData.length}건</span>
<div className="flex gap-1 justify-end w-full sm:w-auto">
<Button variant="action"onClick={()=>setModalOpen(true)}className="flex gap-1 items-center"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action"loading={isPrinting}onClick={handlePrint}className="flex gap-1 items-center"><Printer size={16}/>인쇄</Button>
<Button variant="action"loading={isDownloading}onClick={handleExcelDownload}className="flex gap-1 items-center"><FileSpreadsheet size={16}/>Excel</Button>
<Button variant="action"onClick={handleOpenQR}className="flex gap-1 items-center"><QrCode size={16}/>QR</Button>
<Button variant="action"onClick={handleDelete}className="flex gap-1 items-center"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<div className="overflow-x-auto bg-white"><DataTable columns={nearMissColumns}data={currentData}onCheckedChange={setCheckedIds}onStateToggleChange={handleStateToggle}onInputChange={handleInputChange}/></div>
<Pagination currentPage={currentPage}totalPages={totalPages}onPageChange={onPageChange}/>
<div className="flex justify-end mt-5"><Button variant="primary"onClick={handleSave}>저장하기</Button></div>
{modalOpen&&<NearMissRegisterModal isOpen={modalOpen}onClose={()=>setModalOpen(false)}onSave={handleSaveRow}/>}
<QRDialog open={qrDialogOpen} onClose={()=>setQrDialogOpen(false)} url={qrUrl} title="아차사고 QR코드"/>
</section>
)
}
