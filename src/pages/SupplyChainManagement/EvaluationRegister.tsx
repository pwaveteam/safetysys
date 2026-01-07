import React,{useState,useMemo}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import useHandlers from"@/hooks/useHandlers"
import useForm,{ValidationRules}from"@/hooks/useForm"

type FormDataState={
company:string
evaluationName:string
evaluationType:string
startDate:string
endDate:string
externalEvaluator:string
evaluationFile:string
fileUpload:string
}

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:FormDataState)=>void
isEdit?:boolean
}

export default function PartnerEvaluationRegister({isOpen,onClose,onSave,isEdit}:Props){
const[formData,setFormData]=useState<FormDataState>({
company:"",
evaluationName:"",
evaluationType:"",
startDate:"",
endDate:"",
externalEvaluator:"",
evaluationFile:"",
fileUpload:""
})

const validationRules=useMemo<ValidationRules>(()=>({
company:{required:true},
evaluationName:{required:true},
evaluationType:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
const{name,value}=e.target
setFormData(prev=>({...prev,[name]:value}))
}

const valuesForForm:{[key:string]:string}={
company:formData.company,
evaluationName:formData.evaluationName,
evaluationType:formData.evaluationType,
startDate:formData.startDate,
endDate:formData.endDate,
externalEvaluator:formData.externalEvaluator,
evaluationFile:formData.evaluationFile,
fileUpload:formData.fileUpload
}

const fields:Field[]=[
{label:"업체명",name:"company",type:"text",placeholder:"업체명 입력",required:true,hasError:isFieldInvalid("company")},
{label:"평가명",name:"evaluationName",type:"text",placeholder:"평가명 입력",required:true,hasError:isFieldInvalid("evaluationName")},
{
label:"평가종류",
name:"evaluationType",
type:"select",
options:[
{value:"선정평가",label:"선정평가"},
{value:"정기평가",label:"정기평가"},
{value:"재평가",label:"재평가"},
{value:"수시평가",label:"수시평가"},
{value:"기타",label:"기타"}
],
required:true,
hasError:isFieldInvalid("evaluationType")
},
{label:"평가기간",name:"contractPeriod",type:"daterange",placeholder:"계약기간 입력",required:false},
{label:"외부 평가업체",name:"externalEvaluator",type:"text",placeholder:"외부 평가업체 입력",required:false},
{label:"평가지",name:"evaluationFile",type:"fileUpload",placeholder:"파일명 입력",required:false},
{label:"첨부파일",name:"fileUpload",type:"fileUpload",required:false}
]

const{handleSave:handleTableSave}=useHandlers<FormDataState>({
data:[formData],
checkedIds:[],
onSave:()=>onSave(formData)
})

const handleSave=()=>{
if(!validateForm(valuesForForm))return
handleTableSave()
}

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-xl font-semibold tracking-wide mb-3">
안전보건수준 평가 {isEdit?"편집":"등록"}
</h2>
<FormScreen
fields={fields}
values={valuesForForm}
onChange={handleChange}
onClose={onClose}
onSave={handleSave}
isModal
/>
<div className="flex justify-center gap-1 mt-6">
<Button variant="primaryOutline"onClick={onClose}>닫기</Button>
<Button variant="primary"onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}
