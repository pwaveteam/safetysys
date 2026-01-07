import React,{useState,useMemo}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import useForm,{ValidationRules}from"@/hooks/useForm"

type ContractFormData={
contractDate:string
startHour:string
startMinute:string
endHour:string
endMinute:string
meetingPlace:string
attendeeClient:string
attendeeSubcontractor:string
note:string
contractFile:string
fileUpload:string
}

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:ContractFormData)=>void
isEdit?:boolean
}

export default function ContractDocumentRegister({isOpen,onClose,onSave,isEdit}:Props){
const[formData,setFormData]=useState<ContractFormData>({
contractDate:"",
startHour:"",
startMinute:"",
endHour:"",
endMinute:"",
meetingPlace:"",
attendeeClient:"",
attendeeSubcontractor:"",
note:"",
contractFile:"",
fileUpload:""
})

const validationRules=useMemo<ValidationRules>(()=>({
contractDate:{required:true},
startHour:{required:true},
meetingPlace:{required:true},
note:{required:true},
contractFile:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const handleFormChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
const{name,value}=e.target
setFormData(prev=>({...prev,[name]:value}))
}

const handleSave=()=>{
if(!validateForm(formData))return
if(!window.confirm("저장하시겠습니까?"))return
onSave(formData)
}

const fields:Field[]=[
{label:"회의일",name:"contractDate",type:"date",placeholder:"날짜 선택",required:true,hasError:isFieldInvalid("contractDate")},
{label:"회의시간",name:"contractTime",type:"timeRange",placeholder:"시간 선택",required:true,hasError:isFieldInvalid("startHour")},
{label:"회의장소",name:"meetingPlace",type:"text",placeholder:"회의장소 입력",required:true,hasError:isFieldInvalid("meetingPlace")},
{label:"참석자(도급인)",name:"attendeeClient",type:"text",placeholder:"도급인 참석자 입력",required:false},
{label:"참석자(수급인)",name:"attendeeSubcontractor",type:"text",placeholder:"수급인 참석자 입력",required:false},
{label:"회의내용",name:"note",type:"textarea",placeholder:"회의내용 입력",required:true,hasError:isFieldInvalid("note")},
{label:"회의록",name:"contractFile",type:"fileUpload",placeholder:"파일명 입력",required:true,hasError:isFieldInvalid("contractFile")},
{label:"현장사진",name:"fileUpload",type:"photoUpload",required:false}
]

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[900px] max-w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
<h2 className="text-xl font-semibold tracking-wide mb-3">
안전보건협의체 회의록 {isEdit?"편집":"등록"}
</h2>
<FormScreen
fields={fields}
values={formData}
onChange={handleFormChange}
onClose={onClose}
onSave={handleSave}
isModal
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline"onClick={onClose}>닫기</Button>
<Button variant="primary"onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}
