import React,{useState,useMemo}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import ToggleSwitch from"@/components/common/base/ToggleSwitch"
import useHandlers from"@/hooks/useHandlers"
import useForm,{ValidationRules}from"@/hooks/useForm"

type SafeVoiceFormData={
content:string
photo:string
anonymous:boolean
}

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:SafeVoiceFormData)=>void
}

export default function SafeVoiceRegisterModal({isOpen,onClose,onSave}:Props){
const[formData,setFormData]=useState<SafeVoiceFormData>({content:"",photo:"",anonymous:false})

const validationRules=useMemo<ValidationRules>(()=>({
content:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{
const{name,value}=e.target
setFormData(prev=>({...prev,[name]:value}))
}

const AnonymousToggle=(
<ToggleSwitch
checked={formData.anonymous}
onChange={checked=>setFormData(prev=>({...prev,anonymous:checked}))}
/>
)

const fields:Field[]=[
{label:"내용",name:"content",type:"textarea",placeholder:"내용을 입력하세요",required:true,hasError:isFieldInvalid("content")},
{label:"현장사진",name:"photo",type:"photoUpload",required:false},
{label:"익명",name:"anonymous",type:"custom",customRender:AnonymousToggle,required:false}
]

const{handleSave:handleTableSave}=useHandlers<SafeVoiceFormData>({
data:[formData],
checkedIds:[],
onSave:()=>onSave(formData),
saveMessage:"저장되었습니다"
})

const handleSave=()=>{
if(!validateForm({content:formData.content}))return
handleTableSave()
}

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-xl font-semibold tracking-wide mb-3">안전보이스 등록</h2>
<FormScreen
fields={fields}
values={{...formData,anonymous:formData.anonymous?"true":"false"}as{[key:string]:string}}
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