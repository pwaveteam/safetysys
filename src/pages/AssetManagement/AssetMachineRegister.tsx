import React,{useCallback,useMemo,useState}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import ToggleSwitch from"@/components/common/base/ToggleSwitch"
import MachineAutocomplete from"@/components/common/inputs/MachineAutocomplete"
import useForm,{ValidationRules}from"@/hooks/useForm"

type AlertWhen="1일 전"|"1주일 전"|"1개월 전"

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:FormDataState)=>void
isEdit?:boolean
}

type FormDataState={
name:string
capacityValue:string
capacityUnit:string
capacityUnitCustom:string
quantity:string
location:string
inspectionCycle:string
inspectionDate:string
purpose:string
proof:string
notify:boolean
notifyWhen:AlertWhen
repeat:boolean
}

type Option={value:string;label:string}

const unitOptions:Option[]=[
{value:"bar",label:"bar"},
{value:"kg",label:"kg"},
{value:"ton",label:"ton"},
{value:"m³",label:"m³"},
{value:"L",label:"L"}
]

const alertTimingOptions:Option[]=[
{value:"1일 전",label:"1일 전"},
{value:"1주일 전",label:"1주일 전"},
{value:"1개월 전",label:"1개월 전"}
]

export default function AssetMachineRegister({isOpen,onClose,onSave,isEdit}:Props):React.ReactElement|null{
const[formData,setFormData]=useState<FormDataState>({
name:"",
capacityValue:"",
capacityUnit:"",
capacityUnitCustom:"",
quantity:"",
location:"",
inspectionCycle:"상시",
inspectionDate:"",
purpose:"",
proof:"",
notify:false,
notifyWhen:"1주일 전",
repeat:false
})

const validationRules=useMemo<ValidationRules>(()=>({
name:{required:true},
capacity_value:{required:true},
capacity_unit:{required:true},
quantity:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const numericNames=useMemo(()=>new Set(["quantity","capacity_value"]),[])

const handleChange=useCallback((e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>):void=>{
const{name,value,type,checked}=e.target as HTMLInputElement
if(numericNames.has(name)&&value!==""&&!/^\d*\.?\d*$/.test(value))return
if(type==="checkbox"){
setFormData(prev=>({...prev,[name]:checked}))
return
}
if(name==="fileUpload"){
setFormData(prev=>({...prev,proof:value}))
return
}
if(name==="capacity_value"){
setFormData(prev=>({...prev,capacityValue:value}))
return
}
if(name==="capacity_unit"){
setFormData(prev=>({...prev,capacityUnit:value,capacityUnitCustom:value==="직접입력"?"":prev.capacityUnitCustom}))
return
}
if(name==="capacity_unit_custom"){
setFormData(prev=>({...prev,capacityUnitCustom:value}))
return
}
if(name==="inspectionCycle"){
setFormData(prev=>({...prev,inspectionCycle:value,repeat:value==="상시"?false:prev.repeat}))
return
}
setFormData(prev=>({...prev,[name]:value}))
},[numericNames])

const valuesForForm:{[key:string]:string}={
name:formData.name,
capacity_value:formData.capacityValue,
capacity_unit:formData.capacityUnit,
capacity_unit_custom:formData.capacityUnitCustom,
quantity:formData.quantity,
location:formData.location,
inspectionDate:formData.inspectionDate,
purpose:formData.purpose,
inspectionCycle:formData.inspectionCycle,
fileUpload:formData.proof,
notify:formData.notify?"true":"",
notifyWhen:formData.notifyWhen
}

const fields:Field[]=[
{
label:"기계/기구/설비명",
name:"name",
type:"custom",
required:true,
hasError:isFieldInvalid("name"),
customRender:(
<MachineAutocomplete
id="machineName"
value={formData.name}
placeholder="기계명 입력 또는 선택"
onChange={v=>setFormData(prev=>({...prev,name:v}))}
onSelect={opt=>setFormData(prev=>({...prev,name:opt.label}))}
className={`w-full ${isFieldInvalid("name")?"[&_input]:border-red-500":""}`}
/>
)
},
{
label:"용량/단위",
name:"capacity",
type:"quantityUnit",
placeholder:"용량 입력",
options:unitOptions,
required:true,
hasError:isFieldInvalid("capacity_value"),
hasUnitError:isFieldInvalid("capacity_unit")
},
{
label:"수량",
name:"quantity",
type:"quantity",
placeholder:"수량 입력",
required:true,
hasError:isFieldInvalid("quantity")
},
{label:"설치/작업장소",name:"location",type:"text",placeholder:"장소 입력",required:false},
{label:"점검일",name:"inspectionDate",type:"date",placeholder:"점검일 선택",required:false},
{label:"용도",name:"purpose",type:"text",placeholder:"용도 입력",required:false},
{label:"점검주기",name:"inspectionCycle",type:"inspectionCycle",required:false},
{
label:"알림 전송여부",
name:"notify",
type:"custom",
required:false,
customRender:(
<ToggleSwitch checked={formData.notify}onChange={checked=>setFormData(prev=>({...prev,notify:checked}))}/>
)
},
{
label:"알림 발송시점",
name:"notifyWhen",
type:"select",
required:false,
options:alertTimingOptions,
placeholder:"알림 발송시점 선택"
},
{
label:"첨부파일",
name:"fileUpload",
type:"fileUpload",
required:false
}
]

const handleSave=():void=>{
const unitValue=formData.capacityUnit==="직접입력"?formData.capacityUnitCustom:formData.capacityUnit
const validationValues={...valuesForForm,capacity_unit:unitValue}
if(!validateForm(validationValues))return
if(!window.confirm("저장하시겠습니까?"))return
onSave(formData)
}

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-xl font-semibold tracking-wide mb-3">
위험기계/기구/설비 {isEdit?"편집":"등록"}
</h2>
<FormScreen
fields={fields}
values={valuesForForm}
onChange={handleChange}
onClose={onClose}
onSave={handleSave}
isModal
notifyEnabled={formData.notify}
repeatEnabled={formData.repeat}
onRepeatChange={checked=>setFormData(prev=>({...prev,repeat:checked}))}
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="primaryOutline"onClick={onClose}>닫기</Button>
<Button variant="primary"onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}
