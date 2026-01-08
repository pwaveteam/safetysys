import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { initKakao } from "./services/kakaoMessageService"
import { useLoadingStore } from "./stores/loadingStore"
import Spinner from "./components/common/base/Spinner"

import MainLayout from "./components/layout/MainLayout"
import RiskAssessmentLayout from "./components/layout/RiskAssessmentLayout"
import BusinessManagementLayout from "./components/layout/BusinessManagementLayout"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard/Dashboard"

import Inspection from "./pages/Inspection/Inspection"

import TBM from "./pages/TBM/TBM"
import TBMRegister from "./pages/TBM/TBMRegister"

import BasicManagement from "./pages/BusinessManagement/BasicManagement"
import PolicyGoal from "./pages/BusinessManagement/PolicyGoal"
import Budget from "./pages/BusinessManagement/Budget"
import Organization from "./pages/BusinessManagement/Organization"
import ApprovalLine from "./pages/BusinessManagement/ApprovalLine"
import Attendee from "./pages/BusinessManagement/Attendee"

import EvaluationList from "./pages/RiskAssessment/EvaluationList"

import FrequencyStep1 from "./pages/RiskAssessment/methods/Frequency/FrequencyStep1"
import FrequencyStep2 from "./pages/RiskAssessment/methods/Frequency/FrequencyStep2"
import FrequencyStep3 from "./pages/RiskAssessment/methods/Frequency/FrequencyStep3"

import Checklist from "./pages/RiskAssessment/methods/Checklist/Checklist"

import ThreeStep1 from "./pages/RiskAssessment/methods/ThreeStep/ThreeStep1"
import ThreeStep2 from "./pages/RiskAssessment/methods/ThreeStep/ThreeStep2"
import ThreeStep3 from "./pages/RiskAssessment/methods/ThreeStep/ThreeStep3"

import Chemical from "./pages/RiskAssessment/methods/Chemical/Chemical"

import NearMiss from "./pages/NearMiss/NearMiss"
import SafeVoice from "./pages/NearMiss/SafeVoice"

import EducationList from "./pages/SafetyEducation/Education"
import EducationRegister from "./pages/SafetyEducation/EducationRegister"
import EducationCertificate from "./pages/SafetyEducation/EducationCertificate"

import AssetMachine from "./pages/AssetManagement/AssetMachine"
import AssetHazard from "./pages/AssetManagement/AssetHazard"

import Partners from "./pages/SupplyChainManagement/Partners"
import Evaluation from "./pages/SupplyChainManagement/Evaluation"
import Committee from "./pages/SupplyChainManagement/Committee"
import SiteAudit from "./pages/SupplyChainManagement/SiteAudit"
import Training from "./pages/SupplyChainManagement/Training"

import SafetyWorkPermit from "./pages/SafetyWorkPermit/SafetyWorkPermit"
import ResponseManual from "./pages/ResponseManual/ResponseManual"
import NoticeList from "./pages/NoticeBoard/NoticeList"
import ResourcesList from "./pages/NoticeBoard/ResourcesList"
import LawBoard from "./pages/NoticeBoard/LawBoard"

import ReceivedApproval from "./pages/ApprovalBox/ReceivedApproval"
import SentApproval from "./pages/ApprovalBox/SentApproval"

import QRManagement from "./pages/QRManagement/QR"
import MyPage from "./pages/MyPage/MyPage"
import Support from "./pages/Support/Support"
import UserGuide from "./pages/UserGuide/UserGuide"

import PublicInspectionList from "./components/QR/PublicInspectionList"
import PublicInspectionExecute from "./components/QR/PublicInspectionExecute"
import PublicSiteEvaluation from "./components/QR/PublicSiteEvaluation"
import PublicTBM from "./components/QR/PublicTBM"
import PublicNearMiss from "./components/QR/PublicNearMiss"
import PublicSafeVoice from "./components/QR/PublicSafeVoice"
import PublicCertificate from "./components/QR/PublicCertificate"

const App: React.FC = () => {
const { isLoading } = useLoadingStore()

useEffect(() => {
initKakao()
}, [])

return (
<>
{isLoading && <Spinner fullscreen />}

<BrowserRouter>
<Routes>
<Route path="/login" element={<Login />} />

<Route path="/public/inspection" element={<PublicInspectionList />} />
<Route path="/public/inspection/:id/execute" element={<PublicInspectionExecute />} />
<Route path="/public/site-evaluation" element={<PublicSiteEvaluation />} />
<Route path="/public/tbm" element={<PublicTBM />} />
<Route path="/public/nearmiss" element={<PublicNearMiss />} />
<Route path="/public/safevoice" element={<PublicSafeVoice />} />
<Route path="/public/certificate" element={<PublicCertificate />} />

<Route element={<MainLayout />}>
<Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="/dashboard" element={<Dashboard />} />

<Route path="/inspection" element={<Inspection />} />
<Route path="/inspection/results" element={<Inspection />} />

<Route path="/tbm" element={<TBM />} />
<Route path="/tbm/register" element={<TBMRegister />} />

<Route path="/nearmiss" element={<Navigate to="/nearmiss/incident" replace />} />
<Route path="/nearmiss/incident" element={<NearMiss />} />
<Route path="/nearmiss/safevoice" element={<SafeVoice />} />

<Route path="/safety-education" element={<Navigate to="/safety-education/education" replace />} />
<Route path="/safety-education/education" element={<EducationList />} />
<Route path="/safety-education/register" element={<EducationRegister />} />
<Route path="/safety-education/certificate" element={<EducationCertificate />} />

<Route path="/asset-management" element={<Navigate to="/asset-management/machine" replace />} />
<Route path="/asset-management/machine" element={<AssetMachine />} />
<Route path="/asset-management/hazard" element={<AssetHazard />} />

<Route path="/supply-chain-management" element={<Navigate to="/supply-chain-management/partners" replace />} />
<Route path="/supply-chain-management/partners" element={<Partners />} />
<Route path="/supply-chain-management/evaluation" element={<Evaluation />} />
<Route path="/supply-chain-management/committee" element={<Committee />} />
<Route path="/supply-chain-management/siteaudit" element={<SiteAudit />} />
<Route path="/supply-chain-management/training" element={<Training />} />

<Route path="/notice-board" element={<Navigate to="/notice-board/notice" replace />} />
<Route path="/notice-board/notice" element={<NoticeList />} />
<Route path="/notice-board/resources" element={<ResourcesList />} />
<Route path="/notice-board/law" element={<LawBoard />} />

<Route path="/safety-work-permit" element={<SafetyWorkPermit />} />
<Route path="/response-manual" element={<ResponseManual />} />

<Route path="/approval-box" element={<Navigate to="/approval-box/received" replace />} />
<Route path="/approval-box/received" element={<ReceivedApproval />} />
<Route path="/approval-box/sent" element={<SentApproval />} />

<Route path="/qr-management" element={<QRManagement />} />
<Route path="/mypage" element={<MyPage />} />
<Route path="/support" element={<Support />} />
<Route path="/user-guide" element={<UserGuide />} />
</Route>

<Route element={<BusinessManagementLayout />}>
<Route path="/business-management" element={<Navigate to="/business-management/basic" replace />} />
<Route path="/business-management/basic" element={<BasicManagement />} />
<Route path="/business-management/policy-goal" element={<PolicyGoal />} />
<Route path="/business-management/budget" element={<Budget />} />
<Route path="/business-management/organization" element={<Organization />} />
<Route path="/business-management/approval-line" element={<ApprovalLine />} />
<Route path="/business-management/attendee" element={<Attendee />} />
</Route>

<Route element={<RiskAssessmentLayout />}>
<Route path="/risk-assessment" element={<Navigate to="/risk-assessment/list" replace />} />
<Route path="/risk-assessment/list" element={<EvaluationList />} />
<Route path="/risk-assessment/methods/frequency/step1" element={<FrequencyStep1 />} />
<Route path="/risk-assessment/methods/frequency/step2" element={<FrequencyStep2 />} />
<Route path="/risk-assessment/methods/frequency/step3" element={<FrequencyStep3 />} />
<Route path="/risk-assessment/methods/checklist" element={<Checklist />} />
<Route path="/risk-assessment/methods/threestep/step1" element={<ThreeStep1 />} />
<Route path="/risk-assessment/methods/threestep/step2" element={<ThreeStep2 />} />
<Route path="/risk-assessment/methods/threestep/step3" element={<ThreeStep3 />} />
<Route path="/risk-assessment/methods/chemical" element={<Chemical />} />
</Route>
</Routes>
</BrowserRouter>
</>
)
}

export default App