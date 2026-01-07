import React,{useState,useMemo}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import useHandlers from"@/hooks/useHandlers"
import useForm,{ValidationRules}from"@/hooks/useForm"

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:{content:string;place:string;photo:string})=>void
}

type FormData={
content:string
place:string
photos:string
}

export default function NearMissRegisterModal({isOpen,onClose,onSave}:Props){
const[formData,setFormData]=useState<FormData>({content:"",place:"",photos:""})

const validationRules=useMemo<ValidationRules>(()=>({
place:{required:true},
content:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const fields:Field[]=[
{label:"장소",name:"place",type:"text",placeholder:"장소 입력",required:true,hasError:isFieldInvalid("place")},
{label:"내용",name:"content",type:"textarea",placeholder:"내용 입력",required:true,hasError:isFieldInvalid("content")},
{label:"현장사진",name:"photos",type:"photoUpload",required:false}
]

const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>{
const{name,value}=e.target
setFormData(prev=>({...prev,[name]:value}))
}

const{handleSave:handleTableSave}=useHandlers<FormData>({
data:[formData],
checkedIds:[],
onSave:()=>onSave({content:formData.content,place:formData.place,photo:formData.photos})
})

const handleSave=()=>{
if(!validateForm(formData))return
handleTableSave()
}

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-xl font-semibold tracking-wide mb-3">아차사고 등록</h2>
<FormScreen
fields={fields}
values={formData}
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
