import React,{useState,useMemo}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import ToggleSwitch from"@/components/common/base/ToggleSwitch"
import useForm,{ValidationRules}from"@/hooks/useForm"

type TrainingStatusFormData={
name:string
riskAssessment:boolean
hazardousMaterial:boolean
responseManual:boolean
allSigned:boolean
updatedAt:string
fileUpload:string
remarks:string
}

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:TrainingStatusFormData)=>void
isEdit?:boolean
}

export default function PartnerTrainingRegister({isOpen,onClose,onSave,isEdit}:Props){
const[formData,setFormData]=useState<TrainingStatusFormData>({
name:"",
riskAssessment:false,
hazardousMaterial:false,
responseManual:false,
allSigned:false,
updatedAt:"",
fileUpload:"",
remarks:""
})

const validationRules=useMemo<ValidationRules>(()=>({
name:{required:true},
riskAssessment:{required:true,custom:v=>v==="true"},
hazardousMaterial:{required:true,custom:v=>v==="true"},
responseManual:{required:true,custom:v=>v==="true"},
allSigned:{required:true,custom:v=>v==="true"},
updatedAt:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>):void=>{
const{name,type,checked,value}=e.target as HTMLInputElement
if(type==="checkbox"){
setFormData(prev=>({...prev,[name]:checked}))
return
}
setFormData(prev=>({...prev,[name]:value}))
}

const renderToggle=(fieldName:keyof Pick<TrainingStatusFormData,"riskAssessment"|"hazardousMaterial"|"responseManual"|"allSigned">):React.ReactNode=>{
const hasError=isFieldInvalid(fieldName)
return(
<div className="flex flex-col gap-1">
<ToggleSwitch
checked={formData[fieldName]}
onChange={checked=>setFormData(prev=>({...prev,[fieldName]:checked}))}
/>
{hasError&&<span className="text-red-600 text-xs">필수 입력 항목입니다.</span>}
</div>
)
}

const valuesForForm:{[key:string]:string}={
name:formData.name,
riskAssessment:formData.riskAssessment?"true":"false",
hazardousMaterial:formData.hazardousMaterial?"true":"false",
responseManual:formData.responseManual?"true":"false",
allSigned:formData.allSigned?"true":"false",
updatedAt:formData.updatedAt,
fileUpload:formData.fileUpload,
remarks:formData.remarks
}

const fields:Field[]=[
{label:"도급협의체명",name:"name",type:"text",placeholder:"도급협의체명을 입력하세요",required:true,hasError:isFieldInvalid("name")},
{label:"위험성평가 확인",name:"riskAssessment",type:"custom",customRender:renderToggle("riskAssessment"),required:true},
{label:"유해물질 확인",name:"hazardousMaterial",type:"custom",customRender:renderToggle("hazardousMaterial"),required:true},
{label:"대응매뉴얼 확인",name:"responseManual",type:"custom",customRender:renderToggle("responseManual"),required:true},
{label:"전체서류 서명",name:"allSigned",type:"custom",customRender:renderToggle("allSigned"),required:true},
{label:"최종 등록일",name:"updatedAt",type:"date",required:true,hasError:isFieldInvalid("updatedAt")},
{label:"첨부파일",name:"fileUpload",type:"fileUpload",required:false},
{label:"비고",name:"remarks",type:"textarea",placeholder:"비고를 입력하세요",required:false}
]

const handleSave=():void=>{
if(!validateForm(valuesForForm))return
if(!window.confirm("저장하시겠습니까?"))return
onSave(formData)
onClose()
}

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-xl font-semibold tracking-wide mb-3">
안전보건 교육/훈련 {isEdit?"편집":"등록"}
</h2>
<FormScreen
fields={fields}
values={valuesForForm}
onChange={handleChange}
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
