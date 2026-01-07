import React from "react"
import { Loader2 } from "lucide-react"

type ButtonVariant=
"primary"|
"primaryOutline"|
"secondary"|
"secondaryOutline"|
"action"|
"actionPrimary"|
"support"|
"warning"|
"rowAdd"|
"delete"|
"mutedGray"|
"mutedBlue"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
children?:React.ReactNode
variant?:ButtonVariant
className?:string
icon?:React.ReactNode
loading?:boolean
onClick?:React.MouseEventHandler<HTMLButtonElement>
}

const defaultTextByVariant:Record<ButtonVariant,React.ReactNode>={
primary:null,
primaryOutline:null,
secondary:null,
secondaryOutline:null,
action:null,
actionPrimary:null,
support:null,
warning:null,
rowAdd:"+ 새항목 추가",
delete:null,
mutedGray:null,
mutedBlue:null
}

const Button:React.FC<ButtonProps>=({
children,
variant="primary",
className="",
icon,
loading=false,
onClick,
disabled,
...props
})=>{
const isDisabled=disabled||loading
const base="relative flex items-center justify-center gap-1 select-none whitespace-nowrap font-medium transition-opacity duration-200 hover:opacity-80 px-3 py-1.5 text-xs md:text-sm rounded-lg"
let colors=""

switch(variant){
case "primary":
colors="bg-[var(--primary)] text-white px-6 py-3"
break
case "primaryOutline":
colors="bg-white text-[var(--primary)] border border-[var(--primary)] px-6 py-3"
break
case "delete":
colors="bg-gray-800 text-white px-6 py-3"
break
case "secondary":
colors="bg-[var(--secondary)] text-white"
break
case "secondaryOutline":
colors="bg-white text-[var(--secondary)] border border-[var(--secondary)]"
break
case "action":
colors="bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
break
case "actionPrimary":
colors="bg-[var(--tertiary)] text-white"
break
case "support":
colors="bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
break
case "warning":
colors="bg-[#FDEDED] text-[#901C1C] border border-[#D19EA3]"
break
case "rowAdd":
colors="bg-white text-[#161616] border border-[#161616]"
break
case "mutedGray":
colors="border-gray-300 text-gray-400 bg-gray-50 cursor-default"
break
case "mutedBlue":
colors="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--neutral-bg)]"
break
default:
colors="bg-[var(--primary)] text-white"
}

return(
<button
type={props.type||"button"}
className={`${base} ${colors} ${className}`}
onClick={onClick}
disabled={isDisabled}
{...props}
>
{loading && (
  <Loader2 size={16} className="absolute animate-spin"/>
)}
<span className={`flex items-center gap-1 ${loading ? "invisible" : ""}`}>
  {icon && <span className="flex items-center">{icon}</span>}
  {children||defaultTextByVariant[variant]}
</span>
</button>
)
}

export default Button
