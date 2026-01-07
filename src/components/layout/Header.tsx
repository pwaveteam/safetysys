import React,{useEffect,useState,useCallback}from"react"
import{useNavigate}from"react-router-dom"
import{BuildingOfficeIcon}from"@heroicons/react/24/outline"
import{useApprovalStore}from"@/stores/approvalStore"
import{useCompanyStore}from"@/stores/companyStore"

type HeaderProps={
platformName?:string
onMenuToggle?:()=>void
isMobileMenuOpen?:boolean
}

const Header:React.FC<HeaderProps>=({
platformName="중대재해처벌법 대응 스마트 안전관리",
onMenuToggle,
isMobileMenuOpen=false
})=>{
const{factoryName}=useCompanyStore()
const navigate=useNavigate()
const{currentUser}=useApprovalStore()
const[date,setDate]=useState<string>("")
const[time,setTime]=useState<string>("")

const handleLogout=()=>{
if(window.confirm("로그아웃 하시겠습니까?")){
alert("로그아웃되었습니다")
navigate("/login")
}
}

const updateDateTime=useCallback(()=>{
const n=new Date()
setDate(n.toLocaleDateString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit"}))
const h=String(n.getHours()).padStart(2,'0')
const m=String(n.getMinutes()).padStart(2,'0')
const s=String(n.getSeconds()).padStart(2,'0')
setTime(`${h}:${m}:${s}`)
},[])

useEffect(()=>{
updateDateTime()
const i=setInterval(updateDateTime,1000)
return()=>clearInterval(i)
},[updateDateTime])

const HEADER_H=60
const AVATAR_SIZE=20

return(
<>
{/* Desktop & Tablet */}
<div
className="hidden md:flex"
style={{
height:HEADER_H,
background:"var(--frame-bg)",
alignItems:"center",
position:"fixed",
top:0,
left:0,
width:"100vw",
zIndex:101,
padding:"0 16px 0 16px"
}}
>
<div
className="w-[150px] lg:w-[190px] shrink-0"
style={{display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}}
onClick={()=>navigate("/dashboard")}
>
<img src="/logo.png"alt="logo"style={{height:24}}/>
</div>
<div className="hidden lg:block text-sm text-[#CBCBCB] truncate max-w-[320px]">{factoryName}</div>
<div className="hidden xl:flex absolute top-0 left-0 w-full h-full items-center justify-center pointer-events-none">
<strong style={{fontSize:20,color:"#fff",fontWeight:600}}>{platformName}</strong>
</div>
<div className="flex items-center ml-auto gap-3 lg:gap-5 pr-4">
<div className="flex items-center gap-1.5">
<img
src="/ico/ico-avatar.svg"
alt="avatar"
style={{width:AVATAR_SIZE,height:AVATAR_SIZE,borderRadius:"50%"}}
className="cursor-pointer"
onClick={()=>navigate("/mypage")}
/>
<span className="text-[13px] text-[#B1B1B1] hidden lg:inline items-center gap-2" style={{display:"inline-flex"}}>
<span><span className="font-semibold cursor-pointer" onClick={()=>navigate("/mypage")}>{currentUser.name}</span> 님</span>
<span className="text-[11px] text-[#999] border border-[#666] rounded-full px-2 py-0.5">{currentUser.position}</span>
</span>
</div>
<button
type="button"
onClick={()=>navigate("/business-management")}
className="hidden lg:flex items-center gap-1.5 px-3 h-[30px] rounded-[30px] border border-[#C6C6C6] bg-transparent text-white text-[13px] font-semibold cursor-pointer"
>
<BuildingOfficeIcon className="w-4 h-4"/>내 사업장관리
</button>
<div className="hidden lg:block">
<p className="leading-[20px] text-[13px] text-[#B1B1B1] m-0 whitespace-nowrap">
{date}
<span className="ml-2.5 text-white font-bold inline-block min-w-[0px] tabular-nums">{time}</span>
</p>
</div>
<button
onClick={handleLogout}
className="px-3 rounded-[20px] flex items-center h-[30px] text-[13px] font-semibold text-white bg-[#717171] cursor-pointer border-none"
>
로그아웃
</button>
</div>
</div>

{/* Mobile */}
<div
className="flex md:hidden justify-between"
style={{
height:HEADER_H,
background:"var(--frame-bg)",
alignItems:"center",
position:"fixed",
top:0,
left:0,
right:0,
zIndex:101,
padding:"0 16px"
}}
>
<button
type="button"
aria-label={isMobileMenuOpen?"메뉴 닫기":"메뉴 열기"}
onClick={onMenuToggle}
className="rounded-md text-white hover:text-slate-200"
style={{transition:"all 0.2s ease-out"}}
>
<div style={{position:"relative",width:24,height:24}}>
<svg
className="w-6 h-6 absolute inset-0"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
style={{
opacity:isMobileMenuOpen?0:1,
transform:isMobileMenuOpen?"translateX(-8px)":"translateX(0)",
transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
}}
>
<path strokeLinecap="round"strokeLinejoin="round"strokeWidth={2}d="M4 6h16M4 12h16M4 18h12"/>
</svg>
<svg
className="w-6 h-6 absolute inset-0"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
style={{
opacity:isMobileMenuOpen?1:0,
transform:isMobileMenuOpen?"translateX(0)":"translateX(8px)",
transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
}}
>
<path strokeLinecap="round"strokeLinejoin="round"strokeWidth={2}d="M6 18L18 6M6 6l12 12"/>
</svg>
</div>
</button>
<div style={{position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
<img
src="/logo.png"
alt="logo"
style={{height:30,cursor:"pointer"}}
onClick={()=>navigate("/dashboard")}
/>
</div>
</div>
</>
)}
export default Header