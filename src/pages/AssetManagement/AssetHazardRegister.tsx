import React,{useCallback,useState,useMemo}from"react"
import Button from"@/components/common/base/Button"
import FormScreen,{Field}from"@/components/common/forms/FormScreen"
import ToggleSwitch from"@/components/common/base/ToggleSwitch"
import RadioGroup from"@/components/common/base/RadioGroup"
import ChemicalAutocomplete from"@/components/common/inputs/ChemicalAutocomplete"
import useForm,{ValidationRules}from"@/hooks/useForm"

type AlertWhen="1일 전"|"1주일 전"|"1개월 전"

type FormDataState={
chemicalName:string
casNo:string
exposureLimitValue:string
exposureLimitUnit:string
exposureLimitUnitCustom:string
dailyUsageValue:string
dailyUsageUnit:string
dailyUsageUnitCustom:string
storageAmountValue:string
storageAmountUnit:string
storageAmountUnitCustom:string
corrosive:"예"|"아니오"
toxicity:string
adverseReaction:string
registrationDate:string
inspectionCycle:string
msds:string
note:string
notify:boolean
notifyWhen:AlertWhen
repeat:boolean
}

type Props={
isOpen:boolean
onClose:()=>void
onSave:(data:FormDataState)=>void
isEdit?:boolean
}

type Option={value:string;label:string}

const concentrationUnits:Option[]=[
{value:"ppb",label:"ppb"},
{value:"ppm",label:"ppm"},
{value:"mg/m³",label:"mg/m³"},
{value:"µg/m³",label:"µg/m³"},
{value:"mg/L",label:"mg/L"},
{value:"µg/L",label:"µg/L"}
]

const usageUnits:Option[]=[
{value:"µL",label:"µL"},
{value:"mL",label:"mL"},
{value:"L",label:"L"},
{value:"cm³",label:"cm³"},
{value:"m³",label:"m³"},
{value:"µg",label:"µg"},
{value:"mg",label:"mg"},
{value:"g",label:"g"},
{value:"kg",label:"kg"}
]

const storageUnits:Option[]=[
{value:"ng",label:"ng"},
{value:"µg",label:"µg"},
{value:"mg",label:"mg"},
{value:"g",label:"g"},
{value:"kg",label:"kg"},
{value:"t",label:"t"},
{value:"µL",label:"µL"},
{value:"mL",label:"mL"},
{value:"L",label:"L"},
{value:"cm³",label:"cm³"},
{value:"m³",label:"m³"}
]

const alertTimingOptions:Option[]=[
{value:"1일 전",label:"1일 전"},
{value:"1주일 전",label:"1주일 전"},
{value:"1개월 전",label:"1개월 전"}
]

export default function AssetHazardRegister({isOpen,onClose,onSave,isEdit}:Props):React.ReactElement|null{
const[formData,setFormData]=useState<FormDataState>({
chemicalName:"",
casNo:"",
exposureLimitValue:"",
exposureLimitUnit:"",
exposureLimitUnitCustom:"",
dailyUsageValue:"",
dailyUsageUnit:"",
dailyUsageUnitCustom:"",
storageAmountValue:"",
storageAmountUnit:"",
storageAmountUnitCustom:"",
corrosive:"예",
toxicity:"",
adverseReaction:"",
registrationDate:"",
inspectionCycle:"",
msds:"",
note:"",
notify:false,
notifyWhen:"1일 전",
repeat:false
})

const validationRules=useMemo<ValidationRules>(()=>({
chemicalName:{required:true},
casNo:{required:true},
exposureLimit_value:{required:true},
exposureLimit_unit:{required:true},
dailyUsage_value:{required:true},
dailyUsage_unit:{required:true},
storageAmount_value:{required:true},
storageAmount_unit:{required:true}
}),[])

const{validateForm,isFieldInvalid}=useForm(validationRules)

const handleChange=useCallback((e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>):void=>{
const{name,value,type,checked}=e.target as HTMLInputElement

if(name.endsWith("Value")&&value!==""&&!/^\d*\.?\d*$/.test(value))return

if(type==="checkbox"){
setFormData(prev=>({...prev,[name]:checked}))
return
}

if(name==="msds"){
setFormData(prev=>({...prev,msds:value}))
return
}

if(name==="exposureLimit_value"){
setFormData(prev=>({...prev,exposureLimitValue:value}))
return
}
if(name==="dailyUsage_value"){
setFormData(prev=>({...prev,dailyUsageValue:value}))
return
}
if(name==="storageAmount_value"){
setFormData(prev=>({...prev,storageAmountValue:value}))
return
}

if(name==="exposureLimit_unit"){
setFormData(prev=>({...prev,exposureLimitUnit:value,exposureLimitUnitCustom:value==="직접입력"?"":prev.exposureLimitUnitCustom}))
return
}
if(name==="exposureLimit_unit_custom"){
setFormData(prev=>({...prev,exposureLimitUnitCustom:value}))
return
}
if(name==="dailyUsage_unit"){
setFormData(prev=>({...prev,dailyUsageUnit:value,dailyUsageUnitCustom:value==="직접입력"?"":prev.dailyUsageUnitCustom}))
return
}
if(name==="dailyUsage_unit_custom"){
setFormData(prev=>({...prev,dailyUsageUnitCustom:value}))
return
}
if(name==="storageAmount_unit"){
setFormData(prev=>({...prev,storageAmountUnit:value,storageAmountUnitCustom:value==="직접입력"?"":prev.storageAmountUnitCustom}))
return
}
if(name==="storageAmount_unit_custom"){
setFormData(prev=>({...prev,storageAmountUnitCustom:value}))
return
}
if(name==="inspectionCycle"){
setFormData(prev=>({...prev,inspectionCycle:value,repeat:value==="상시"?false:prev.repeat}))
return
}

setFormData(prev=>({...prev,[name]:value}))
},[])

const valuesForForm:{[key:string]:string}={
chemicalName:formData.chemicalName,
casNo:formData.casNo,
exposureLimit_value:formData.exposureLimitValue,
exposureLimit_unit:formData.exposureLimitUnit,
exposureLimit_unit_custom:formData.exposureLimitUnitCustom,
dailyUsage_value:formData.dailyUsageValue,
dailyUsage_unit:formData.dailyUsageUnit,
dailyUsage_unit_custom:formData.dailyUsageUnitCustom,
storageAmount_value:formData.storageAmountValue,
storageAmount_unit:formData.storageAmountUnit,
storageAmount_unit_custom:formData.storageAmountUnitCustom,
corrosive:formData.corrosive,
toxicity:formData.toxicity,
adverseReaction:formData.adverseReaction,
registrationDate:formData.registrationDate,
inspectionCycle:formData.inspectionCycle,
msds:formData.msds,
note:formData.note,
notify:formData.notify?"true":"",
notifyWhen:formData.notifyWhen
}

const fields:Field[]=[
{
label:"화학물질명",
name:"chemicalName",
type:"custom",
required:true,
hasError:isFieldInvalid("chemicalName"),
customRender:(
<ChemicalAutocomplete
id="chemicalName"
value={formData.chemicalName}
placeholder="화학물질명 입력 또는 선택"
onChange={v=>setFormData(prev=>({...prev,chemicalName:v}))}
onSelect={opt=>setFormData(prev=>({...prev,chemicalName:opt.label}))}
className={`w-full ${isFieldInvalid("chemicalName")?"[&_input]:border-red-500":""}`}
/>
)
},
{label:"CAS No",name:"casNo",type:"text",placeholder:"CAS No 입력",required:true,hasError:isFieldInvalid("casNo")},
{label:"노출기준",name:"exposureLimit",type:"quantityUnit",placeholder:"0",options:concentrationUnits,required:true,hasError:isFieldInvalid("exposureLimit_value"),hasUnitError:isFieldInvalid("exposureLimit_unit")},
{label:"일일사용량",name:"dailyUsage",type:"quantityUnit",placeholder:"0",options:usageUnits,required:true,hasError:isFieldInvalid("dailyUsage_value"),hasUnitError:isFieldInvalid("dailyUsage_unit")},
{label:"저장량",name:"storageAmount",type:"quantityUnit",placeholder:"0",options:storageUnits,required:true,hasError:isFieldInvalid("storageAmount_value"),hasUnitError:isFieldInvalid("storageAmount_unit")},
{
label:"부식성 유무",
name:"corrosive",
type:"custom",
required:false,
customRender:(
<RadioGroup
name="corrosive"
value={formData.corrosive}
options={[
{value:"예",label:"예"},
{value:"아니오",label:"아니오"}
]}
onChange={handleChange}
/>
)
},
{label:"독성치",name:"toxicity",type:"text",placeholder:"독성치 입력",required:false},
{label:"이상반응",name:"adverseReaction",type:"text",placeholder:"이상반응 입력",required:false},
{label:"등록일",name:"registrationDate",type:"date",placeholder:"등록일 선택",required:false},
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
options:alertTimingOptions,
placeholder:"알림 발송시점 선택",
required:false
},
{label:"첨부파일 (MSDS)",name:"msds",type:"fileUpload",required:false}
]

const handleSave=():void=>{
const exposureLimitUnitValue=formData.exposureLimitUnit==="직접입력"?formData.exposureLimitUnitCustom:formData.exposureLimitUnit
const dailyUsageUnitValue=formData.dailyUsageUnit==="직접입력"?formData.dailyUsageUnitCustom:formData.dailyUsageUnit
const storageAmountUnitValue=formData.storageAmountUnit==="직접입력"?formData.storageAmountUnitCustom:formData.storageAmountUnit
const validationValues={
...valuesForForm,
exposureLimit_unit:exposureLimitUnitValue,
dailyUsage_unit:dailyUsageUnitValue,
storageAmount_unit:storageAmountUnitValue
}
if(!validateForm(validationValues))return
if(!window.confirm("저장하시겠습니까?"))return
onSave(formData)
}

if(!isOpen)return null

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-xl font-semibold tracking-wide mb-3">
유해/위험물질 {isEdit?"편집":"등록"}
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
