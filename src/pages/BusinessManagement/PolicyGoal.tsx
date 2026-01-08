import React,{useState,useRef} from "react"
import FormScreen from "@/components/common/forms/FormScreen"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import YearPicker from "@/components/common/inputs/YearPicker"
import ApprovalConfirmDialog from "@/components/dialog/ApprovalConfirmDialog"
import useApproval from "@/hooks/useApproval"
import { Upload, Download, Printer, Trash2, X, FileSpreadsheet } from "lucide-react"
import useHandlers from "@/hooks/useHandlers"
import { DocumentTemplate } from "@/components/snippetDocument/printDocument"
import { DataRow } from "@/components/common/tables/DataTable"
import { policyGoalMockData } from "@/data/mockBusinessData"

type PolicyRow = DataRow & { id: number | string; year: string; goalTitle: string; content: string }

type Field={label:string,name:string,type:"text"|"textarea"|"custom",placeholder?:string,style?:React.CSSProperties,customRender?:React.ReactNode}

const createPolicyTemplate = (row: PolicyRow): DocumentTemplate => ({
id: `policy-${row.id}`,
title: "경영방침",
companyName: "",
documentNumber: `POL_${String(row.id).padStart(8, "0")}`,
createdAt: row.year,
showApproval: false,
fields: [
{ label: "연도", value: row.year, type: "text", section: "overview" },
{ label: "방침목표명", value: row.goalTitle, type: "text", section: "overview" },
{ label: "내용", value: row.content, type: "textarea", section: "content" }
]
})

const PolicyGoal:React.FC=()=>{
const[values,setValues]=useState<{[key:string]:string}>({
year: policyGoalMockData.year,
goalTitle: policyGoalMockData.goalTitle,
content: policyGoalMockData.content,
uploadedFile:""
})
const fileInputRef=useRef<HTMLInputElement|null>(null)
const[uploadedFileUrl,setUploadedFileUrl]=useState<string>("")

const {
isDialogOpen,
approvalLineName,
approvers,
defaultContent,
checkAndSave,
handleConfirmApproval,
handleCancel
} = useApproval({ documentType: "경영방침" })

const policyData: PolicyRow[] = [{ id: 1, year: values.year, goalTitle: values.goalTitle, content: values.content }]

const { handleExcelDownload, handlePrint, isDownloading, isPrinting } = useHandlers<PolicyRow>({
data: policyData,
checkedIds: [1],
createTemplate: createPolicyTemplate
})

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{const{name,value}=e.target;setValues(prev=>({...prev,[name]:value}))}
const doSave=()=>{alert("저장되었습니다.")}
const handleSave=()=>{checkAndSave(doSave, `${values.year}년 ${values.goalTitle}`)}
const handleDeleteClick=()=>{alert("삭제 버튼 클릭됨")}
const openFileDialog=()=>{fileInputRef.current?.click()}
const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.files&&e.target.files.length>0){
const file=e.target.files[0]
const fileName=file.name
const fileUrl=URL.createObjectURL(file)
setValues(prev=>({...prev,uploadedFile:fileName}))
setUploadedFileUrl(fileUrl)
}
}
const handleFileDownload=()=>{
if(uploadedFileUrl){
const link=document.createElement("a")
link.href=uploadedFileUrl
link.download=values.uploadedFile
link.click()
}
}
const handleFileRemove=()=>{
setValues(prev=>({...prev,uploadedFile:""}))
setUploadedFileUrl("")
if(fileInputRef.current)fileInputRef.current.value=""
}

const fields:Field[]=[
{label:"방침목표명",name:"goalTitle",type:"text",placeholder:"방침목표명을 입력하세요"},
{
label:"내용",
name:"content",
type:"custom",
customRender:(
<textarea
name="content"
value={values.content}
onChange={handleChange}
placeholder="내용을 입력하세요"
className="border border-[#AAAAAA] rounded-[8px] p-2 w-full text-sm md:text-[15px] font-medium placeholder:font-normal placeholder:text-[#86939A] placeholder:text-sm md:placeholder:text-[15px] bg-white text-[#333639] h-[150px] md:h-[330px]"
/>
)
},
{
label:"양식 내려받기",
name:"downloadTemplate",
type:"custom",
customRender:(
<a href="/downloads/안전보건 경영방침.hwp" download className="inline-block">
<Button variant="action" style={{minWidth:120}} className="flex items-center gap-1">
<Download size={18}/>경영방침 양식
</Button>
</a>
)
},   
{
label:"경영방침 업로드",
name:"uploadFile",
type:"custom",
customRender:(
<div className="flex items-center gap-3">
<Button variant="action" onClick={openFileDialog} style={{minWidth:120}} className="flex items-center gap-1">
<Upload size={18}/>경영방침 업로드
</Button>
<input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".hwp,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif"/>
{values.uploadedFile&&(
<div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
<button onClick={handleFileDownload} className="text-sm font-medium hover:underline" style={{color:"var(--secondary)"}}>
{values.uploadedFile}
</button>
<button onClick={handleFileRemove} className="text-gray-400 hover:text-gray-600">
<X size={14}/>
</button>
</div>
)}
</div>
)
}
]

return (
<section className="mypage-content w-full">
<section>
<PageTitle>경영방침</PageTitle>
<TabMenu tabs={["경영방침 목록"]} activeIndex={0} onTabClick={()=>{}} className="mb-6" />
<div className="flex justify-between items-center mb-3">
<YearPicker year={values.year} onChange={year=>setValues(prev=>({...prev,year}))}/>
<div className="flex justify-end gap-1">
<Button variant="action" loading={isPrinting} onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" loading={isDownloading} onClick={handleExcelDownload} className="flex items-center gap-1"><FileSpreadsheet size={16}/>Excel</Button>
<Button variant="action" onClick={handleDeleteClick} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<FormScreen fields={fields} values={values} onChange={handleChange} onClose={()=>{}} onSave={handleSave} />
<div className="flex justify-end mt-3">
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</section>

<ApprovalConfirmDialog
isOpen={isDialogOpen}
documentType="경영방침"
approvalLineName={approvalLineName}
approvers={approvers}
defaultContent={defaultContent}
onConfirm={handleConfirmApproval}
onCancel={handleCancel}
/>
</section>
)
}
export default PolicyGoal