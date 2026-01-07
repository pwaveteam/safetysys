import { DocumentTemplate, DocumentField } from "@/components/snippetDocument/printDocument"

export type DocumentType = "TBM" | "안전보건교육" | "점검표" | "아차사고" | "안전보이스" | "작업중지요청" | "대응매뉴얼" | "안전보건수준 평가" | "안전보건협의체 회의록" | "협동 안전보건점검" | "위험성평가"

export type RiskAssessmentMethod = "빈도·강도법" | "위험성수준 3단계 판단법" | "화학물질 평가법" | "체크리스트법"

export interface DocumentData {
[key: string]: any
}

const DEFAULT_COMPANY = "(주)에스피에스엔에이 당진슬래그공장"

const generateDocNumber = (prefix: string, dateStr?: string) => {
const date = dateStr ? new Date(dateStr) : new Date()
const year = date.getFullYear()
const month = String(date.getMonth() + 1).padStart(2, "0")
const day = String(date.getDate()).padStart(2, "0")
const num = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
return `${prefix}_${year}${month}${day}_${num}`
}

export const createTBMTemplate = (data: DocumentData): DocumentTemplate => ({
id: "tbm",
title: "TBM (Tool Box Meeting)",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("TBM", data.date),
createdAt: data.date || new Date().toISOString().split("T")[0],
fields: [
{ label: "TBM 장소", value: data.location || "", type: "text", section: "overview" },
{ label: "TBM 일자", value: data.date || "", type: "date", section: "overview" },
{ label: "진행시간", value: data.timeRange || "", type: "text", section: "overview" },
{ label: "관리감독자", value: data.supervisor || "", type: "text", section: "overview" },
{ label: "작업명", value: data.tbmName || "", type: "text", section: "overview" },
{ label: "위험성평가표", value: data.processes || [], type: "tags", section: "content" },
{ label: "작업내용", value: data.content || "", type: "textarea", section: "content" },
{ label: "비고", value: data.remark || "", type: "textarea", section: "content" },
{ label: "현장사진", value: data.sitePhotos || [], type: "photos" },
{ label: "첨부파일", value: data.files || [], type: "files", section: "content" },
],
participants: data.participants || []
})

export const createSafetyEducationTemplate = (data: DocumentData): DocumentTemplate => ({
id: "safety-education",
title: "안전보건교육",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("EDU", data.startDate || data.date),
createdAt: data.startDate || data.date || new Date().toISOString().split("T")[0],
fields: [
{ label: "교육대상", value: data.category || data.targetGroup || "", type: "text", section: "overview" },
{ label: "교육과정", value: data.course || "", type: "text", section: "overview" },
{ label: "교육명", value: data.eduName || "", type: "text", section: "overview" },
{ label: "교육기간", value: data.educationPeriod || (data.startDate && data.endDate ? `${data.startDate} ~ ${data.endDate}` : data.date || ""), type: "text", section: "overview" },
{ label: "교육시간", value: data.educationTime || data.timeRange || "", type: "text", section: "overview" },
{ label: "교육방식", value: data.educationMethod || "", type: "text", section: "overview" },
{ label: "교육담당자", value: data.assigner || "", type: "text", section: "overview" },
{ label: "외부강사", value: data.trainer || "", type: "text", section: "overview" },
{ label: "위험성평가", value: data.linkedRiskAssessment ? [data.linkedRiskAssessment] : [], type: "tags", section: "content" },
{ label: "교육자료", value: data.eduMaterial ? (Array.isArray(data.eduMaterial) ? data.eduMaterial : [data.eduMaterial]) : [], type: "files", section: "content" },
{ label: "첨부파일", value: data.fileUpload ? (Array.isArray(data.fileUpload) ? data.fileUpload : [data.fileUpload]) : [], type: "files", section: "content" },
{ label: "비고", value: data.note || "", type: "textarea", section: "content" },
{ label: "현장사진", value: data.sitePhotos || [], type: "photos" },
],
participants: data.participants || []
})

export const createInspectionTemplate = (data: DocumentData): DocumentTemplate => ({
id: "inspection",
title: "안전점검",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("INS", data.inspectedAt?.split(" ")[0]),
createdAt: data.inspectedAt?.split(" ")[0] || new Date().toISOString().split("T")[0],
fields: [
{ label: "점검표", value: data.template || "", type: "text", section: "overview" },
{ label: "점검장소", value: data.workplace || "", type: "text", section: "overview" },
{ label: "점검분야", value: data.field || "", type: "text", section: "overview" },
{ label: "점검종류", value: data.kind || "", type: "text", section: "overview" },
{ label: "점검자", value: data.inspector || "", type: "text", section: "overview" },
{ label: "점검일시", value: data.inspectedAt || "", type: "datetime", section: "overview" },
{ label: "확인여부", value: data.confirmed ? "확인완료" : "미확인", type: "text", section: "overview" },
{ label: "점검결과 및 비고", value: data.notes || "", type: "textarea", section: "content" },
]
})

export const createNearMissTemplate = (data: DocumentData): DocumentTemplate => {
const resultFields: DocumentField[] = [
{ label: "처리결과", value: data.result ? { text: data.result, color: data.result === "채택" ? "blue" : "red" } : { text: "-", color: "gray" }, type: "badge", section: "result" },
]

if (data.result === "미채택" && data.reason) {
resultFields.push({ label: "미채택 사유", value: data.reason || "", type: "textarea", section: "result" })
}

return {
id: "nearmiss",
title: "아차사고",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("NM", data.date),
createdAt: data.date || new Date().toISOString().split("T")[0],
fields: [
{ label: "장소", value: data.place || "", type: "text", section: "overview" },
{ label: "등록일자", value: data.date || "", type: "date", section: "overview" },
{ label: "등록인", value: data.registrant || "", type: "text", section: "overview" },
{ label: "내용", value: data.content || "", type: "textarea", section: "content" },
{ label: "현장사진", value: data.sitePhotos || data.photos || [], type: "photos" },
...resultFields,
]
}
}

export const createSafeVoiceTemplate = (data: DocumentData): DocumentTemplate => {
const resultFields: DocumentField[] = [
{ label: "조치상태", value: data.status ? { text: data.status, color: data.status === "조치 완료" ? "green" : data.status === "조치 예정" ? "yellow" : "gray" } : { text: "-", color: "gray" }, type: "badge", section: "result" },
]

if (data.status === "미조치" && data.reason) {
resultFields.push({ label: "미조치 사유", value: data.reason || "", type: "textarea", section: "result" })
} else if (data.reason) {
resultFields.push({ label: "조치내용", value: data.reason || "", type: "textarea", section: "result" })
}

return {
id: "safevoice",
title: "안전보이스",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("SV", data.date),
createdAt: data.date || new Date().toISOString().split("T")[0],
fields: [
{ label: "등록자", value: data.registrant || "", type: "text", section: "overview" },
{ label: "등록일자", value: data.date || "", type: "date", section: "overview" },
{ label: "제안내용", value: data.content || "", type: "textarea", section: "content" },
{ label: "현장사진", value: data.sitePhotos || [], type: "photos" },
...resultFields,
]
}
}

export const createWorkStopRequestTemplate = (data: DocumentData): DocumentTemplate => ({
id: "work-stop-request",
title: "작업중지요청",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("WSR", data.registrationDate),
createdAt: data.registrationDate || new Date().toISOString().split("T")[0],
fields: [
{ label: "작업유형", value: data.workType || "", type: "text", section: "overview" },
{ label: "작업인원", value: data.workerCount || "", type: "text", section: "overview" },
{ label: "위험수준", value: data.hazardLevel ? { text: data.hazardLevel, color: data.hazardLevel === "높음" ? "red" : data.hazardLevel === "중간" ? "yellow" : "green" } : { text: "-", color: "gray" }, type: "badge", section: "overview" },
{ label: "작업기간", value: data.workPeriod || "", type: "text", section: "overview" },
{ label: "등록일자", value: data.registrationDate || "", type: "date", section: "overview" },
{ label: "승인상태", value: data.approvalStatus || { text: "미완료", color: "gray" }, type: "badge", section: "overview" },
{ label: "첨부파일", value: data.attachment ? [data.attachment] : [], type: "files", section: "content" },
{ label: "비고", value: data.manage || "", type: "textarea", section: "content" },
]
})

export const createSafetyLevelEvaluationTemplate = (data: DocumentData): DocumentTemplate => ({
id: "safety-level-evaluation",
title: "안전보건수준 평가",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("SLE", data.contractPeriod?.split(" ~ ")[0]),
createdAt: data.contractPeriod?.split(" ~ ")[0] || new Date().toISOString().split("T")[0],
fields: [
{ label: "업체명", value: data.company || "", type: "text", section: "overview" },
{ label: "평가종류", value: data.evaluationType || "", type: "text", section: "overview" },
{ label: "평가기간", value: data.contractPeriod || "", type: "text", section: "overview" },
{ label: "외부 평가업체", value: data.externalEvaluator || "", type: "text", section: "overview" },
{ label: "평가명", value: data.evaluationName || "", type: "text", section: "overview" },
{ label: "평가지", value: data.evaluationFile ? [data.evaluationFile] : [], type: "files", section: "content" },
{ label: "첨부파일", value: data.fileUpload ? (Array.isArray(data.fileUpload) ? data.fileUpload : [data.fileUpload]) : [], type: "files", section: "content" },
]
})

export const createCommitteeMeetingTemplate = (data: DocumentData): DocumentTemplate => ({
id: "committee-meeting",
title: "안전보건협의체 회의록",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("CMT", data.contractDate),
createdAt: data.contractDate || new Date().toISOString().split("T")[0],
fields: [
{ label: "회의일", value: data.contractDate || "", type: "date", section: "overview" },
{ label: "회의시간", value: data.contractTime || "", type: "text", section: "overview" },
{ label: "회의장소", value: data.meetingPlace || "", type: "text", section: "overview" },
{ label: "회의내용", value: data.note || "", type: "textarea", section: "content" },
{ label: "참석자(도급인)", value: data.attendeeClient || "", type: "text", section: "content" },
{ label: "참석자(수급인)", value: data.attendeeSubcontractor || "", type: "text", section: "content" },
{ label: "회의록", value: data.contractFile ? [data.contractFile] : [], type: "files", section: "content" },
{ label: "현장사진", value: data.fileUpload || data.sitePhotos || [], type: "photos" },
]
})

export const createJointInspectionTemplate = (data: DocumentData): DocumentTemplate => {
const getResultColor = (result: string) => {
if (result === "이상없음" || result === "시정조치 완료") return "blue"
if (result === "경미한 지적사항") return "yellow"
if (result === "중대 위험요인") return "red"
return "gray"
}

return {
id: "joint-inspection",
title: "협동 안전보건점검",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("JIP", data.inspectionDate),
createdAt: data.inspectionDate || new Date().toISOString().split("T")[0],
fields: [
{ label: "점검일자", value: data.inspectionDate || "", type: "date", section: "overview" },
{ label: "점검종류", value: data.inspectionType || "", type: "text", section: "overview" },
{ label: "점검자", value: data.inspector || "", type: "text", section: "overview" },
{ label: "점검결과", value: data.inspectionResult ? { text: data.inspectionResult, color: getResultColor(data.inspectionResult) } : { text: "-", color: "gray" }, type: "badge", section: "overview" },
{ label: "점검계획명", value: data.inspectionName || "", type: "text", section: "overview" },
{ label: "비고사항", value: data.note || "", type: "textarea", section: "content" },
{ label: "현장사진", value: data.inspectionPlace || data.sitePhotos || [], type: "photos" },
{ label: "첨부자료", value: data.fileUpload ? (Array.isArray(data.fileUpload) ? data.fileUpload : [data.fileUpload]) : [], type: "files", section: "content" },
]
}
}

export const createResponseManualTemplate = (data: DocumentData): DocumentTemplate => ({
id: "response-manual",
title: "대응매뉴얼",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("RM", data.date),
createdAt: data.date || new Date().toISOString().split("T")[0],
fields: [
{ label: "제목", value: data.title || "", type: "text", section: "overview" },
{ label: "작성일자", value: data.date || "", type: "date", section: "overview" },
{ label: "작성자", value: data.author || "", type: "text", section: "overview" },
{ label: "내용", value: data.content || "", type: "textarea", section: "content" },
{ label: "첨부파일", value: data.attachments ? (Array.isArray(data.attachments) ? data.attachments : [data.attachments]) : [], type: "files", section: "content" },
]
})

export const createRiskAssessmentTemplate = (data: DocumentData): DocumentTemplate => {
const getStatusColor = (status: string) => {
if (status === "완료") return "blue"
if (status === "진행중") return "yellow"
return "gray"
}

return {
id: "risk-assessment",
title: "위험성평가",
companyName: DEFAULT_COMPANY,
documentNumber: generateDocNumber("RA", data.registered),
createdAt: data.registered || new Date().toISOString().split("T")[0],
fields: [
{ label: "년도", value: data.year ? String(data.year) : "", type: "text", section: "overview" },
{ label: "위험성평가명", value: data.title || "", type: "text", section: "overview" },
{ label: "평가구분", value: data.type || "", type: "text", section: "overview" },
{ label: "평가방법", value: data.method || "", type: "text", section: "overview" },
{ label: "실시규정", value: data.regulation || "", type: "text", section: "overview" },
{ label: "등록일", value: data.registered || "", type: "date", section: "overview" },
{ label: "최종수정일", value: data.modified || "", type: "date", section: "overview" },
{ label: "완료일", value: data.completed || "", type: "date", section: "overview" },
{ label: "진행상태", value: data.status ? { text: data.status.text || data.status, color: getStatusColor(data.status.text || data.status) } : { text: "-", color: "gray" }, type: "badge", section: "overview" },
{ label: "첨부파일", value: data.attachments ? (Array.isArray(data.attachments) ? data.attachments : [data.attachments]) : [], type: "files", section: "content" },
]
}
}

export const getDocumentTemplate = (type: DocumentType, data: DocumentData): DocumentTemplate => {
switch (type) {
case "TBM":
return createTBMTemplate(data)
case "안전보건교육":
return createSafetyEducationTemplate(data)
case "점검표":
return createInspectionTemplate(data)
case "아차사고":
return createNearMissTemplate(data)
case "안전보이스":
return createSafeVoiceTemplate(data)
case "작업중지요청":
return createWorkStopRequestTemplate(data)
case "대응매뉴얼":
return createResponseManualTemplate(data)
case "안전보건수준 평가":
return createSafetyLevelEvaluationTemplate(data)
case "안전보건협의체 회의록":
return createCommitteeMeetingTemplate(data)
case "협동 안전보건점검":
return createJointInspectionTemplate(data)
case "위험성평가":
return createRiskAssessmentTemplate(data)
default:
return createTBMTemplate(data)
}
}