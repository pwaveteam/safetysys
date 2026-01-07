import React,{useEffect,useMemo,useRef,useState,useCallback}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import PageTitle from"@/components/common/base/PageTitle"
import Button from"@/components/common/base/Button"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TemplateSelectDialog from"@/components/dialog/TemplateSelectDialog"
import ApprovalConfirmDialog from"@/components/dialog/ApprovalConfirmDialog"
import{CirclePlus,Trash2,GripVertical,Check,X}from"lucide-react"
import Sortable from"sortablejs"
import ToggleSwitch from"@/components/common/base/ToggleSwitch"
import{inspectionFieldOptions,inspectionKindOptions}from"@/components/common/base/FilterBar"
import useApproval from"@/hooks/useApproval"

type ItemRow=DataRow&{id:number;content:string;isEditing?:boolean;draft?:string;__no?:number}
type LocationState={mode?:"create"|"edit"}|null

const BORDER_CLASS="border-[var(--border)]"
const INPUT_CLASS="border rounded-lg px-2 sm:px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400"
const LABEL_CLASS="text-xs sm:text-sm font-medium text-gray-800 whitespace-nowrap"
const BTN_CLASS="inline-flex items-center justify-center rounded-md hover:bg-gray-50"
const TEXT_SECONDARY="text-gray-500"
const TEXT_PRIMARY="text-gray-800"

const InspectionChecklistRegister:React.FC=()=>{
const navigate=useNavigate()
const location=useLocation()
const state=location.state as LocationState
const isEdit=state?.mode==="edit"

const[field,setField]=useState<string>("")
const[kind,setKind]=useState<string>("")
const[useYn,setUseYn]=useState<boolean>(false)
const[templateName,setTemplateName]=useState<string>("")
const[rows,setRows]=useState<ItemRow[]>([])
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[isTemplateOpen,setIsTemplateOpen]=useState<boolean>(false)
const tableWrapRef=useRef<HTMLDivElement|null>(null)
const nextIdRef=useRef<number>(1)

const{isDialogOpen,approvalLineName,approvers,defaultContent:approvalDefaultContent,checkAndSave,handleConfirmApproval,handleCancel}=useApproval({documentType:"안전점검"})

const tableData=useMemo<ItemRow[]>(()=>rows.map((r,idx)=>({...r,__no:idx+1})),[rows])

useEffect(()=>{
if(rows.length===0&&!isEdit){
const initialRows:ItemRow[]=Array.from({length:5},(_,i)=>({id:nextIdRef.current++,content:"",isEditing:false}))
setRows(initialRows)
}
},[])

const startEdit=useCallback((id:number)=>{setRows(prev=>prev.map(r=>r.id===id?{...r,isEditing:true,draft:r.content}:r))},[])
const changeDraft=useCallback((id:number,value:string)=>{setRows(prev=>prev.map(r=>r.id===id?{...r,draft:value}:r))},[])
const commitEdit=useCallback((id:number)=>{setRows(prev=>prev.map(r=>r.id===id?{...r,content:(r.draft??"").trim(),draft:undefined,isEditing:false}:r))},[])
const cancelEdit=useCallback((id:number,isNew:boolean)=>{setRows(prev=>isNew?prev.filter(r=>r.id!==id):prev.map(r=>r.id===id?{...r,isEditing:false,draft:undefined}:r))},[])

const focusInput=(id:number)=>{requestAnimationFrame(()=>{const el=tableWrapRef.current?.querySelector<HTMLInputElement>(`[data-row-id="${id}"] input[data-edit="true"]`);el?.focus()})}

const columns=useMemo<Column<ItemRow>[]>(
()=>[
{key:"__no",label:"번호",minWidth:40,maxWidth:60},
{key:"content",label:"점검세부내용",minWidth:200,renderCell:(row:ItemRow)=>{
if(row.isEditing){
const isNew=row.content===""
return(
<div className="flex items-center gap-1 sm:gap-2 min-h-[40px]" data-row-id={row.id}>
<span className="drag-handle inline-flex items-center justify-center cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing select-none" title="드래그하여 순서 변경" aria-label="드래그 핸들"><GripVertical size={14} className="sm:w-4 sm:h-4"/></span>
<input data-edit="true" className={`${INPUT_CLASS} ${BORDER_CLASS} flex-1 h-7 sm:h-8`} placeholder="점검 세부내용을 입력하세요" value={row.draft??""} onChange={e=>changeDraft(row.id,e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){commitEdit(row.id)}if(e.key==="Escape"){cancelEdit(row.id,isNew)}}}/>
<button type="button" aria-label="저장" className={`${BTN_CLASS} ${BORDER_CLASS} p-0.5 sm:p-1`} onClick={()=>commitEdit(row.id)} title="저장"><Check size={14} className="sm:w-4 sm:h-4"/></button>
<button type="button" aria-label="취소" className={`${BTN_CLASS} ${BORDER_CLASS} p-0.5 sm:p-1`} onClick={()=>cancelEdit(row.id,isNew)} title="취소"><X size={14} className="sm:w-4 sm:h-4"/></button>
</div>
)
}
return(
<button type="button" className="w-full text-left" onClick={()=>startEdit(row.id)} title="클릭하여 편집">
<div className="flex items-center gap-1 sm:gap-2 min-h-[40px]">
<span className="drag-handle inline-flex items-center justify-center cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing select-none" title="드래그하여 순서 변경" aria-label="드래그 핸들"><GripVertical size={14} className="sm:w-4 sm:h-4"/></span>
<span className={`text-left text-xs sm:text-sm ${TEXT_PRIMARY}`}>{row.content||<span className={TEXT_SECONDARY}>빈 행 - 클릭하여 입력</span>}</span>
</div>
</button>
)
}}
],
[changeDraft,commitEdit,cancelEdit,startEdit]
)

useEffect(()=>{
const tbody=tableWrapRef.current?.querySelector("tbody")
if(!tbody)return
const sortable=Sortable.create(tbody as HTMLElement,{
animation:150,
handle:".drag-handle",
ghostClass:"opacity-60",
onEnd:evt=>{
const oldIndex=evt.oldIndex??-1
const newIndex=evt.newIndex??-1
if(oldIndex<0||newIndex<0||oldIndex===newIndex)return
setRows(prev=>{
const next=[...prev]
const[moved]=next.splice(oldIndex,1)
next.splice(newIndex,0,moved)
return next
})
}
})
return()=>sortable.destroy()
},[])

const addItem=useCallback(()=>{const newId=nextIdRef.current++;setRows(prev=>[{id:newId,content:"",isEditing:true,draft:""},...prev]);focusInput(newId)},[])
const deleteSelected=useCallback(()=>{if(checkedIds.length===0){alert("삭제할 항목을 선택하세요");return}if(window.confirm("선택한 항목을 삭제하시겠습니까?")){setRows(prev=>prev.filter(r=>!checkedIds.includes(r.id)));setCheckedIds([]);alert("삭제되었습니다.")}},[checkedIds])
const addFromTemplate=useCallback(()=>setIsTemplateOpen(true),[])
const handleTemplateConfirm=useCallback((items:string[])=>{setIsTemplateOpen(false);if(!items.length)return;setRows(prev=>{const newRows:ItemRow[]=items.map(content=>({id:nextIdRef.current++,content}));return[...newRows,...prev]})},[])
const doSave=useCallback(()=>{const useYnValue=useYn?"사용":"미사용";console.log({field,kind,useYn:useYnValue,templateName,rows});alert(isEdit?"수정되었습니다.":"저장되었습니다.");navigate("/inspection/checklist")},[field,kind,useYn,templateName,rows,isEdit,navigate])

const handleSave=useCallback(()=>{if(!field||!kind){alert("점검분야/점검종류를 선택하세요.");return}if(!templateName.trim()){alert("점검표명을 입력하세요.");return}if(rows.length===0){alert("최소 1개 이상의 점검세부내용을 추가하세요.");return}if(rows.some(r=>r.isEditing)){alert("편집 중인 항목을 먼저 저장하거나 취소하세요.");return}checkAndSave(doSave,templateName)},[field,kind,templateName,rows,checkAndSave,doSave])

return(
<section className="w-full bg-white">
<PageTitle>점검표(체크리스트) {isEdit?"편집":"등록"}</PageTitle>
<div className={`w-full px-2 md:px-3 py-3 mb-4 bg-gray-50 ${BORDER_CLASS} rounded-lg`}>
<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
<span className={LABEL_CLASS}>점검분야 <span className="text-red-600">*</span></span>
<select className={`${INPUT_CLASS} ${BORDER_CLASS} w-full h-8 sm:h-9`} value={field} onChange={e=>setField(e.target.value)}>
{inspectionFieldOptions.map(opt=>(
<option key={opt.value}value={opt.value}>{opt.label}</option>
))}
</select>
</div>
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
<span className={LABEL_CLASS}>점검종류 <span className="text-red-600">*</span></span>
<select className={`${INPUT_CLASS} ${BORDER_CLASS} w-full h-8 sm:h-9`} value={kind} onChange={e=>setKind(e.target.value)}>
{inspectionKindOptions.map(opt=>(
<option key={opt.value}value={opt.value}>{opt.label}</option>
))}
</select>
</div>
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
<span className={LABEL_CLASS}>사용여부</span>
<div className="flex items-center gap-2">
<ToggleSwitch checked={useYn}onChange={setUseYn}/>
<span className={`text-xs sm:text-sm ${TEXT_PRIMARY}`}>{useYn?"사용":"미사용"}</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 gap-3 mt-3">
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0">
<span className={`${LABEL_CLASS} shrink-0`}>점검표명 <span className="text-red-600">*</span></span>
<input className={`${INPUT_CLASS} ${BORDER_CLASS} w-full sm:flex-1 h-8 sm:h-9`} placeholder="점검표명 입력" value={templateName} onChange={e=>setTemplateName(e.target.value)}/>
</div>
</div>
</div>
<div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
<span className={`${TEXT_SECONDARY} text-sm leading-none pt-1 mt-2 sm:mt-0`}>총 {rows.length}건</span>
<div className="flex flex-wrap gap-1 w-full sm:w-auto justify-end">
<Button variant="action"onClick={addFromTemplate}>템플릿으로 추가</Button>
<Button variant="action"onClick={addItem}className="flex items-center gap-1"><CirclePlus size={16}/>직접추가</Button>
<Button variant="action"onClick={deleteSelected}className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<div className="overflow-x-auto bg-white mb-4" ref={tableWrapRef}>
<DataTable<ItemRow> columns={columns} data={tableData} onCheckedChange={setCheckedIds}/>
{rows.length===0&&(
<div className={`py-16 text-center text-sm ${TEXT_SECONDARY}`}>등록된 항목이 없습니다.</div>
)}
</div>
<div className="flex justify-end mt-4 mb-6">
<Button variant="primary" onClick={handleSave}>
저장하기
</Button>
</div>
{isTemplateOpen&&(
<TemplateSelectDialog onClose={()=>setIsTemplateOpen(false)} onConfirm={handleTemplateConfirm}/>
)}
<ApprovalConfirmDialog isOpen={isDialogOpen} documentType="안전점검" approvalLineName={approvalLineName} approvers={approvers} defaultContent={approvalDefaultContent} onConfirm={handleConfirmApproval} onCancel={handleCancel}/>
</section>
)
}

export default InspectionChecklistRegister