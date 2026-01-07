import { PTWGroupItem, WorkPermitItem, JSAItem, SiteEvaluationItem, TBMItem, PTWDocumentType } from "@/types/ptw"
import { DataRow } from "@/components/common/tables/DataTable"

// 랜덤 현장사진 생성 (3~6장)
const getRandomPhotos = (seed: number): string[] => {
  const photoCount = 3 + (seed % 4) // 3~6장
  const allPhotos = Array.from({ length: 11 }, (_, i) => `/images/photo${i + 1}.jpg`)
  const shuffled = [...allPhotos].sort(() => 0.5 - Math.sin(seed * 9999))
  return shuffled.slice(0, photoCount)
}

// 체크리스트 템플릿
export type ChecklistTemplate = { id: number; name: string; items: string[] }


// PTW
export const ptwGroupMockData: PTWGroupItem[] = [
  { id: 1, ptwName: "Master Roller 어큐뮬레이터 교체 패키지", createdAt: "2025-10-28(화)", registrant: "최승휴", updatedAt: "2025-10-28(화)" },
  { id: 2, ptwName: "소형밀 내부 점검 및 오일 작업 패키지", createdAt: "2025-10-26(일)", registrant: "문반장", updatedAt: "2025-10-27(월)" },
  { id: 3, ptwName: "10월 설비 LOTOTO 필수 작업 패키지", createdAt: "2025-10-25(토)", registrant: "양강현", updatedAt: "2025-10-29(수)" },
  { id: 4, ptwName: "인렛 슈트 코팅 제거 일일 패키지", createdAt: "2025-10-27(월)", registrant: "이호성", updatedAt: "2025-10-27(월)" },
  { id: 5, ptwName: "11월 유압 시스템 긴급 점검 패키지", createdAt: "2025-11-20(목)", registrant: "최정비", updatedAt: "2025-11-25(화)" },
  { id: 6, ptwName: "12월 슬래그 밀 정기 정비 패키지", createdAt: "2025-12-01(월)", registrant: "홍길동", updatedAt: "2025-12-05(금)" }

]
export const workPermitMockData: WorkPermitItem[] = [
  { id: 1, workName: "밀 실 주변 전기 배선 절연 보강 작업", workDate: "2025-12-03(화)", workLocation: "Slag Mill 실 전기실", workPersonnel: "2명", workType: "전기, 고소", applicant: "(주)전기안전/김민수", applicationDate: "2025-12-01(일)", signatureStatus: { text: "1/4", color: "red" }, sitePhotos: getRandomPhotos(1), fileAttach: false },
  { id: 2, workName: "컨베이어 벨트 교체 용접 작업", workDate: "2025-12-01(월)", workLocation: "Slag Mill 실 주변", workPersonnel: "3명", workType: "화기, LOTOTO", applicant: "(주)건설/김철수", applicationDate: "2025-11-29(토)", signatureStatus: { text: "4/4", color: "blue" }, sitePhotos: getRandomPhotos(2), fileAttach: true },
  { id: 3, workName: "HSLM 유압 오일 보충 및 라인 점검", workDate: "2025-12-12(목)", workLocation: "Slag Mill 실 유압장치", workPersonnel: "2명", workType: "LOTOTO, 고압", applicant: "(주)관리팀/이정아", applicationDate: "2025-12-10(화)", signatureStatus: { text: "3/4", color: "red" }, sitePhotos: getRandomPhotos(3), fileAttach: true },
  { id: 4, workName: "소형밀 내부 잔류물 긁어내기 및 청소", workDate: "2025-12-13(금)", workLocation: "소형밀 실", workPersonnel: "2명", workType: "밀폐공간, 분진", applicant: "(주)생산협력/문반장", applicationDate: "2025-12-11(수)", signatureStatus: { text: "4/4", color: "blue" }, sitePhotos: getRandomPhotos(4), fileAttach: false },
  { id: 5, workName: "Master Roller 어큐뮬레이터 교체 작업", workDate: "2025-12-17(화)", workLocation: "Slag Mill 실 Roller 구역", workPersonnel: "3명", workType: "고소, 중량물", applicant: "(주)보전서비스/최정비", applicationDate: "2025-12-15(일)", signatureStatus: { text: "4/4", color: "blue" }, sitePhotos: getRandomPhotos(5), fileAttach: true },
  { id: 6, workName: "슬래그 밀 내부 인렛 슈트 코팅 제거", workDate: "2025-12-10(화)", workLocation: "Slag Mill 실 내부", workPersonnel: "2명", workType: "밀폐공간", applicant: "(주)엔지니어링/박현우", applicationDate: "2025-12-08(일)", signatureStatus: { text: "2/4", color: "red" }, sitePhotos: getRandomPhotos(6), fileAttach: true }
]

export const jsaMockData: JSAItem[] = [
  { id: 1, jsaNo: "SPS&A-JSA-001", workName: "컨베이어 벨트 교체 및 LOTOTO 점검", workDate: "2025-12-01(월)", team: "설비보전팀", applicationDate: "2025-11-28(금)", sitePhotos: getRandomPhotos(11), fileAttach: true },
  { id: 2, jsaNo: "SPS&A-JSA-002", workName: "밀 실 주변 전기 배선 절연 보강", workDate: "2025-12-03(화)", team: "전기팀", applicationDate: "2025-12-01(일)", sitePhotos: getRandomPhotos(12), fileAttach: false },
  { id: 3, jsaNo: "SPS&A-JSA-003", workName: "소형밀 내부 잔류물 긁어내기 및 청소", workDate: "2025-12-13(금)", team: "생산지원팀", applicationDate: "2025-12-11(수)", sitePhotos: getRandomPhotos(13), fileAttach: true },
  { id: 4, jsaNo: "SPS&A-JSA-004", workName: "HSLM 유압 오일 보충 및 라인 점검", workDate: "2025-12-12(목)", team: "설비보전팀", applicationDate: "2025-12-10(화)", sitePhotos: getRandomPhotos(14), fileAttach: true },
  { id: 5, jsaNo: "SPS&A-JSA-005", workName: "Master Roller 어큐뮬레이터 교체", workDate: "2025-12-17(화)", team: "협력사(보전)", applicationDate: "2025-12-15(일)", sitePhotos: getRandomPhotos(15), fileAttach: true },
  { id: 6, jsaNo: "SPS&A-JSA-006", workName: "슬래그 밀 내부 인렛 슈트 코팅 제거", workDate: "2025-12-10(화)", team: "생산지원팀", applicationDate: "2025-12-08(일)", sitePhotos: getRandomPhotos(16), fileAttach: true },
  { id: 7, jsaNo: "SPS&A-JSA-007", workName: "유압 라인 고압/고온 작업 위험 분석", workDate: "2025-12-11(수)", team: "설비보전팀", applicationDate: "2025-12-09(월)", sitePhotos: getRandomPhotos(17), fileAttach: false },
  { id: 8, jsaNo: "SPS&A-JSA-008", workName: "중량물 운반 2인 1조 준수 점검", workDate: "2025-12-04(수)", team: "안전팀", applicationDate: "2025-12-02(월)", sitePhotos: getRandomPhotos(18), fileAttach: false },
  { id: 9, jsaNo: "SPS&A-JSA-009", workName: "밀 실 주변 협소/고소 작업 안전 수칙 점검", workDate: "2025-12-19(목)", team: "안전팀", applicationDate: "2025-12-17(화)", sitePhotos: getRandomPhotos(19), fileAttach: false }
]


export const checklistTemplateMockData: ChecklistTemplate[] = [
  { id: 1, name: "공통필수확인(작업전)", items: ["[TBM] 작업 전 위험요인 및 대책 공유가 완료되었는가?", "[TBM] 작업자 전원의 건강 상태(음주, 피로 등)를 확인했는가?", "[필수 보호구 착용] 안전모, 안전화, 보안경 착용 완료여부", "[필수 보호구 착용] 방진마스크 (분진 발생 구역 등급 확인) 및 귀마개 착용여부", "[작업허가서 승인] 화기 / 밀폐공간 / 고소 / 중장비 작업 허가 승인을 득하였는가?", "[LOTOTO 관리] 정비 대상 설비의 동력(전기) 차단 및 잠금 장치를 체결했는가?", "[LOTOTO 관리] 조작 금지 표지판(Tag)을 부착했는가?", "[2인1조 원칙] 단독 작업을 금지하고, 감시인 또는 동료 작업자가 배치되었는가?"] },
  { id: 2, name: "설비 정비 및 기계 안전", items: ["[잔압 제거] 유압/공압 라인 분해 전, 압력 게이지가 \"0\" Bar임을 확인했는가?", "[잔압 제거] 어큐뮬레이터(축압기) 내부 압력을 완전히 제거했는가?", "[고압 가스 취급] 고압 가스 충전용 호스 및 레귤레이터 상태는 양호한가?", "[고압 가스 취급] 가스 용기는 전도되지 않도록 체인 등으로 고정되어 있는가?", "[협착 및 끼임 방지] 시운전 시 회전체 반경 내 접근 금지 조치가 되어 있는가?", "[협착 및 끼임 방지] 정비 중 불시 가동을 방지할 물리적 조치가 확실한가?", "[화상 및 누유 방지] 고온의 오일/설비 접촉 방지를 위해 충분히 냉각되었는가?", "[화상 및 누유 방지] 오일 드레인(Drain) 시 바닥 오염 및 미끄럼 방지(흡착포) 조치를 했는가?"] },
  { id: 3, name: "작업 환경 및 보건 (밀폐/분진)", items: ["[적정 조도 확보] 맨홀 내부, 설비 하부 등 어두운 곳의 작업등(방폭 등)은 설치되었는가?", "[호흡기 보호] 슬래그/코팅 제거 작업 시 발생하는 분진에 대비해 특급/1급 마스크를 착용했는가?", "[밀폐공간 안전] 밀폐공간(Chute, Bin) 진입 전 산소 및 유해가스 농도를 측정했는가?", "[밀폐공간 안전] 밀폐공간 입구에 감시인을 배치했는가?", "[근골격계 보호] 중량물 취급 시 무리한 자세를 피하고, 보조 도구(체인블럭 등)를 사용하는가?"] },
  { id: 4, name: "기구 및 공구 안전", items: ["[수공구/전동공구 점검] 스패너, 렌치 등 수공구의 마모나 균열은 없는가?", "[수공구/전동공구 점검] 전동공구(그라인더 등)의 전선 피복 손상 및 접지 상태는 양호한가?", "[작업 발판 및 사다리] A형 사다리는 평탄한 곳에 설치하고 전도 방지 조치를 했는가?", "[작업 발판 및 사다리] 고소 작업 시 안전대 걸이 시설이 확보되어 있는가?"] },
  { id: 5, name: "소방시설 외관점검표", items: ["불 보이는 위치에 소화기 설치여부", "불량기계 적정 설치여부", "소화기 용기 변형/손상/부식 여부", "가연성 물질 근처 비치 여부", "소화기 표시사항(제조연월, 사용방법) 훼손 여부", "압력게이지 정상범위 여부", "사용기간 초과 여부", "소화기 거치대, 받침대, 고정상태 이상 여부", "표시사항 훼손 여부", "기초사항(제조번호/제조연월/형식승인) 확인"] },
  { id: 6, name: "공용공간 점검표", items: ["바닥 마감재 변형, 균열, 파손 여부", "벽체 균열, 누수 흔적 여부", "천장 마감재 탈락, 누수 흔적 여부", "창문/출입문 개폐상태 이상 여부", "계단 난간 흔들림 여부", "복도/통로 장애물 방치 여부", "비상구 표지등 점등 여부", "피난통로 확보 상태", "피난계단 안전상태 이상 여부", "피난통로 및 계단의 조도 부족 여부"] },
  { id: 7, name: "횡단보도/횡방나스 점검표", items: ["차량 유도선 훼손 여부", "노면 균열, 파손 여부", "차량 진입 방지봉 설치 상태", "차량 안전시설 유지관리 상태", "횡단보도 차선 표시 선명 여부", "교통신호등 작동 여부", "과속방지턱 상태", "교통안전 시설물 설치 기준 적정 여부", "보행자 통행 안전 확보 상태", "보행자 신호 준수 여부"] },
  { id: 8, name: "외부공간 점검표", items: ["조경수, 잔디, 가로수 관리 상태", "휴게시설, 의자, 파고라 관리상태", "벤치, 운동기구, 체육시설 관리상태", "조명시설 작동 여부", "CCTV 작동 여부", "보행로 균열, 파손 여부", "배수로 막힘 여부", "기타 안전시설 관리 상태"] },
  { id: 9, name: "어린이놀이시설 및 체육시설 점검표", items: ["놀이기구 설치기준 충족 여부", "부품 탈락 여부", "충돌 방지 매트 상태", "볼트, 너트 풀림 여부", "표시사항 부착 여부", "철제시설 녹 발생 여부", "기초 콘크리트 균열 여부", "안전펜스 설치 상태", "놀이시설 관리대장 작성 여부"] },
  { id: 10, name: "소방/전기/승강기 점검표", items: ["소화전 압력 정상 여부", "소화펌프 작동 여부", "스프링클러 작동 여부", "비상발전기 작동 여부", "누전차단기 정상 동작 여부", "분전반 차단기 접속상태 양호 여부", "승강기 비상벨 작동 여부", "승강기 안전센서 작동 여부", "승강기 정지층 정확성 여부", "승강기 표기 부착 상태"] }
]

export const siteEvaluationMockData: SiteEvaluationItem[] = [
  { id: 1, workTeam: "자체(생산지원)", workerName: "이호성", workDate: "2025-12-02", author: "김감독", signatureStatus: { text: "완료", color: "blue" }, sitePhotos: getRandomPhotos(21), fileAttach: true },
  { id: 2, workTeam: "자체(설비보전)", workerName: "최승휴", workDate: "2025-12-05", author: "박안전", signatureStatus: { text: "완료", color: "blue" }, sitePhotos: getRandomPhotos(22), fileAttach: true },
  { id: 3, workTeam: "협력사(전기)", workerName: "김민수", workDate: "2025-12-03", author: "최감독", signatureStatus: { text: "미완료", color: "red" }, sitePhotos: getRandomPhotos(23), fileAttach: false },
  { id: 4, workTeam: "자체(생산지원)", workerName: "양강현", workDate: "2025-12-10", author: "정관리", signatureStatus: { text: "완료", color: "blue" }, sitePhotos: getRandomPhotos(24), fileAttach: true },
  { id: 5, workTeam: "협력사(보전)", workerName: "최정비", workDate: "2025-12-17", author: "문감독", signatureStatus: { text: "완료", color: "blue" }, sitePhotos: getRandomPhotos(25), fileAttach: true },
  { id: 6, workTeam: "자체(생산지원)", workerName: "이호성", workDate: "2025-12-13", author: "배안전", signatureStatus: { text: "미완료", color: "red" }, sitePhotos: getRandomPhotos(26), fileAttach: false },
  { id: 7, workTeam: "협력사(엔지니어링)", workerName: "박현우", workDate: "2025-12-12", author: "김안전", signatureStatus: { text: "완료", color: "blue" }, sitePhotos: getRandomPhotos(27), fileAttach: true },
  { id: 8, workTeam: "자체(설비보전)", workerName: "최승휴", workDate: "2025-12-09", author: "오관리", signatureStatus: { text: "완료", color: "blue" }, sitePhotos: getRandomPhotos(28), fileAttach: false },
  { id: 9, workTeam: "자체(안전팀)", workerName: "정안전", workDate: "2025-12-19", author: "홍감독", signatureStatus: { text: "미완료", color: "red" }, sitePhotos: getRandomPhotos(29), fileAttach: true }
]

export const tbmMockData: TBMItem[] = [
  { id: 1, processName: "인렛슈트 코팅 제거 작업 TBM", meetingDate: "2025-12-10(화)", meetingTime: "08:30~09:00", manager: "이호성", participants: "2명", sitePhotos: getRandomPhotos(31), fileAttach: true },
  { id: 2, processName: "소형밀 내부 점검 및 오일 주입 TBM", meetingDate: "2025-12-13(금)", meetingTime: "08:40~09:10", manager: "문반장", participants: "3명", sitePhotos: getRandomPhotos(32), fileAttach: false },
  { id: 3, processName: "Master Roller 어큐뮬레이터 교체 TBM", meetingDate: "2025-12-17(화)", meetingTime: "13:00~13:30", manager: "최승휴", participants: "4명", sitePhotos: getRandomPhotos(33), fileAttach: true },
  { id: 4, processName: "HSLM 오일 보충 작업 TBM", meetingDate: "2025-12-12(목)", meetingTime: "14:00~14:30", manager: "양강현", participants: "2명", sitePhotos: getRandomPhotos(34), fileAttach: true },
  { id: 5, processName: "컨베이어 벨트 교체 작업 TBM", meetingDate: "2025-12-01(월)", meetingTime: "07:30~08:00", manager: "김철수", participants: "5명", sitePhotos: getRandomPhotos(35), fileAttach: true },
  { id: 6, processName: "밀 실 주변 전기 배선 절연 보강 TBM", meetingDate: "2025-12-03(화)", meetingTime: "10:00~10:20", manager: "김민수", participants: "2명", sitePhotos: getRandomPhotos(36), fileAttach: false },
  { id: 7, processName: "유압 라인 고압/고온 작업 TBM", meetingDate: "2025-12-11(수)", meetingTime: "09:30~10:00", manager: "오감독", participants: "3명", sitePhotos: getRandomPhotos(37), fileAttach: true },
  { id: 8, processName: "중량물 운반 및 양중 안전 TBM", meetingDate: "2025-12-04(수)", meetingTime: "08:00~08:30", manager: "장감독", participants: "4명", sitePhotos: getRandomPhotos(38), fileAttach: false }
]

export const inspectionPlanMockData: DataRow[] = [
  { id: 11, planName: "슬래그 밀 메인 베어링 오일 분석 및 윤활 상태 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "오영수", schedule: "2025/12/20 ~ 2025/12/22", registrant: "홍길동", progress: "미점검" },
  { id: 10, planName: "슬래그 밀 LOTO 시스템 정기 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "이안전", schedule: "2025/12/15 ~ 2025/12/16", registrant: "김민수", progress: "미점검" },
  { id: 9, planName: "인렛 슈트 코팅 제거 작업허가서(PTW) 확인", site: "Slag Mill 실", area: "자산(설비)", kind: "수시점검", inspector: "김현장", schedule: "2025/12/10 ~ 2025/12/10", registrant: "박현우", progress: "진행중" },
  { id: 8, planName: "마스터 롤러 어큐뮬레이터 교체 안전 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "최정비", schedule: "2025/12/17 ~ 2025/12/18", registrant: "이정아", progress: "완료" },
  { id: 7, planName: "HSLM 오일 보충 작업 위험성평가 확인", site: "Slag Mill 실", area: "자산(설비)", kind: "수시점검", inspector: "박관리", schedule: "2025/12/12 ~ 2025/12/12", registrant: "최준영", progress: "미점검" },
  { id: 6, planName: "협소/고소 작업 안전 수칙 준수 점검 (밀 실 주변)", site: "(주)에스피에스앤아이 당진 슬래그공장", area: "시설물", kind: "특별점검", inspector: "정안전", schedule: "2025/12/19 ~ 2025/12/19", registrant: "김철수", progress: "미점검" },
  { id: 5, planName: "유압 라인 고압/고온 작업 위험 분석 검토", site: "Slag Mill 실", area: "자산(설비)", kind: "수시점검", inspector: "오감독", schedule: "2025/12/11 ~ 2025/12/11", registrant: "이민지", progress: "진행중" },
  { id: 4, planName: "소형밀 내부 점검 및 오일 주입 안전 확인", site: "소형밀 실", area: "자산(설비)", kind: "특별점검", inspector: "문반장", schedule: "2025/12/13 ~ 2025/12/13", registrant: "박서준", progress: "미점검" },
  { id: 3, planName: "분진 발생 작업 호흡기 보호구 착용 점검", site: "(주)에스피에스앤아이 당진 슬래그공장", area: "시설물", kind: "수시점검", inspector: "배소장", schedule: "2025/12/05 ~ 2025/12/05", registrant: "정희원", progress: "완료" },
  { id: 2, planName: "중량물 운반 2인 1조 및 보조도구 준수 점검", site: "소형밀 실", area: "자산(설비)", kind: "특별점검", inspector: "장감독", schedule: "2025/12/03 ~ 2025/12/04", registrant: "김은정", progress: "완료" },
  { id: 1, planName: "컨베이어 벨트 교체 LOTOTO 실시 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "윤영광", schedule: "2025/12/01 ~ 2025/12/02", registrant: "최정수", progress: "완료" }
]

export const inspectionChecklistMockData: DataRow[] = [
  { id: 1, template: "공통 필수 확인 (작업 전) 점검표", field: "자율점검", kind: "특별점검", status: { text: "미사용", color: "red" }, registrant: "홍길동", registeredAt: "2025-10-10(금)" },
  { id: 2, template: "설비 정비 및 기계 안전 점검표", field: "자산(설비)", kind: "정기점검", status: { text: "사용", color: "blue" }, registrant: "최정비", registeredAt: "2025-11-15(토)" },
  { id: 3, template: "기구 및 공구 안전 점검표", field: "자율점검", kind: "수시점검", status: { text: "사용", color: "blue" }, registrant: "김안전", registeredAt: "2025-12-03(수)" },
  { id: 4, template: "작업 환경 및 보건 (밀폐/분진) 점검표", field: "시설물", kind: "수시점검", status: { text: "사용", color: "blue" }, registrant: "박현장", registeredAt: "2025-11-25(화)" },
  { id: 5, template: "중량물 취급 및 양중 안전 체크리스트", field: "자산(설비)", kind: "특별점검", status: { text: "사용", color: "blue" }, registrant: "이안전", registeredAt: "2025-12-01(월)" },
  { id: 6, template: "소방 및 비상 대응 설비 점검표", field: "시설물", kind: "정기점검", status: { text: "미사용", color: "red" }, registrant: "정관리", registeredAt: "2025-11-20(목)" }
]

export const inspectionResultsMockData: DataRow[] = [
  { id: 1, template: "컨베이어 LOTOTO 최종 점검표", workplace: "Slag Mill 실", field: "자산(설비)", kind: "특별점검", inspector: "윤영광", inspectedAt: "2025-12-02(화)", confirmed: false, notes: "LOTOTO 해제 전 3단계 확인 미흡." },
  { id: 2, template: "중량물 운반 작업 안전점검표", workplace: "소형밀 실", field: "자산(설비)", kind: "특별점검", inspector: "장감독", inspectedAt: "2025-12-04(목)", confirmed: true, notes: "2인 1조 작업 원칙 준수 확인." },
  { id: 3, template: "분진 작업 환경 측정 기록", workplace: "(주)에스피에스앤아이 당진 슬래그공장", field: "시설물", kind: "수시점검", inspector: "배소장", inspectedAt: "2025-12-05(금)", confirmed: true, notes: "분진 농도 기준치 이하 측정됨." },
  { id: 4, template: "소형밀 내부 점검 기록", workplace: "소형밀 실", field: "자산(설비)", kind: "특별점검", inspector: "문반장", inspectedAt: "2025-12-13(토)", confirmed: true, notes: "내부 잔류물 제거 및 지정 오일 주입 완료." },
  { id: 5, template: "유압 라인 점검 결과서", workplace: "Slag Mill 실", field: "자산(설비)", kind: "수시점검", inspector: "오감독", inspectedAt: "2025-12-11(목)", confirmed: true, notes: "고온 작업 후 냉각 상태 및 압력 정상 확인." },
  { id: 6, template: "협소/고소 작업 안전 점검표", workplace: "(주)에스피에스앤아이 당진 슬래그공장", field: "시설물", kind: "특별점검", inspector: "정안전", inspectedAt: "2025-12-19(금)", confirmed: false, notes: "안전벨트 체결 불량 1건 적발. 현장 교육 조치." },
  { id: 7, template: "HSLM 오일 보충 위험성평가 이행 결과", workplace: "Slag Mill 실", field: "자산(설비)", kind: "수시점검", inspector: "박관리", inspectedAt: "2025-12-12(금)", confirmed: true, notes: "고임목 설치 및 유출 오일 즉시 제거 완료." },
  { id: 8, template: "어큐뮬레이터 교체 완료 점검표", workplace: "Slag Mill 실", field: "자산(설비)", kind: "특별점검", inspector: "최정비", inspectedAt: "2025-12-18(목)", confirmed: true, notes: "질소 압력 및 유압 라인 누설 없음." },
  { id: 9, template: "작업허가서(PTW) 최종 확인 기록", workplace: "Slag Mill 실", field: "자산(설비)", kind: "수시점검", inspector: "김현장", inspectedAt: "2025-12-10(화)", confirmed: true, notes: "작업 완료 후 잔재물 및 안전 펜스 정리됨." },
  { id: 10, template: "LOTO 시스템 정기 점검표", workplace: "Slag Mill 실", field: "자산(설비)", kind: "특별점검", inspector: "이안전", inspectedAt: "2025-12-16(화)", confirmed: false, notes: "전기 차단점 1곳 태그 마모 확인. 재발급 조치 필요." },
  { id: 11, template: "슬래그 밀 메인 베어링 오일 분석 결과서", workplace: "Slag Mill 실", field: "자산(설비)", kind: "특별점검", inspector: "오영수", inspectedAt: "2025-12-22(월)", confirmed: true, notes: "마모 입자 없음. 오일 상태 양호." }
]

// Safety Education
export const safetyEducationMockData: DataRow[] = [
  { id: 1, course: "작업내용 변경 시 교육", targetGroup: "밀폐공간 진입 작업자", eduName: "밀폐공간 작업 특별 안전 교육", date: "2025-12-08(월)", trainer: "김안전", sitePhotos: getRandomPhotos(41), eduMaterial: "밀폐공간_안전지침.pdf", proof: "참석자 서명부", manage: "인렛슈트 코팅 제거 전" },
  { id: 2, course: "특별교육", targetGroup: "고소/중량물 작업자", eduName: "고소 및 중량물 취급 특별 안전 교육", date: "2025-12-15(월)", trainer: "박안전", sitePhotos: getRandomPhotos(42), eduMaterial: "고소작업_매뉴얼.pptx", proof: "평가 기록", manage: "어큐뮬레이터 교체 전" },
  { id: 3, course: "특별교육", targetGroup: "설비 정비 작업 근로자", eduName: "LOTOTO(잠금/표지) 특별 안전 교육", date: "2025-12-01(월)", trainer: "이안전", sitePhotos: getRandomPhotos(43), eduMaterial: "LOTOTO_절차서.pdf", proof: "이론/실습 평가", manage: "전기/기계 정비 필수" },
  { id: 4, course: "정기교육", targetGroup: "전체 협력업체 근로자", eduName: "협력업체 정기 안전보건 교육 (4분기)", date: "2025-12-10(화)", trainer: "홍길동", sitePhotos: getRandomPhotos(44), eduMaterial: "4분기_안전교육자료.pptx", proof: "참석자 명단", manage: "법정 정기 교육" },
  { id: 5, course: "채용 시 교육", targetGroup: "신규 채용 일용직 근로자", eduName: "신규 채용자 일반 안전보건교육", date: "2025-12-03(수)", trainer: "최안전", sitePhotos: getRandomPhotos(45), eduMaterial: "신규채용_기초안전.pdf", proof: "이수증", manage: "매월 초 시행" },
  { id: 6, course: "특별교육", targetGroup: "유압장치 취급 작업자", eduName: "유압/고압 설비 안전 및 잔압 제거 교육", date: "2025-12-11(목)", trainer: "김정비", sitePhotos: getRandomPhotos(46), eduMaterial: "유압_안전지침.pdf", proof: "서명부", manage: "HSLM 오일 보충 전" },
  { id: 7, course: "정기교육", targetGroup: "사무직 종사 근로자", eduName: "정기 안전보건 교육 (4분기)", date: "2025-12-05(금)", trainer: "박관리", sitePhotos: getRandomPhotos(47), eduMaterial: "사무직_안전.pptx", proof: "참석 확인", manage: "법정 정기 교육" },
  { id: 8, course: "작업내용 변경 시 교육", targetGroup: "소형밀 청소 작업자", eduName: "고농도 분진 발생 작업 안전 교육", date: "2025-12-12(금)", trainer: "이안전", sitePhotos: getRandomPhotos(48), eduMaterial: "분진_마스크_착용법.pdf", proof: "현장 사진", manage: "소형밀 청소 전" },
  { id: 9, course: "특별교육", targetGroup: "화기 작업 관련 근로자", eduName: "화기 작업 및 소화 설비 사용 특별 교육", date: "2025-11-29(토)", trainer: "최반장", sitePhotos: getRandomPhotos(49), eduMaterial: "화기_작업허가_절차.pptx", proof: "서명부", manage: "용접 작업 전" },
  { id: 10, course: "정기교육", targetGroup: "관리감독자", eduName: "관리감독자 정기 안전보건 교육", date: "2025-11-30(일)", trainer: "안전팀장", sitePhotos: getRandomPhotos(50), eduMaterial: "감독자_책임과_역할.pdf", proof: "이수 확인", manage: "법정 정기 교육" }
]

// TBM
export const tbmListMockData: DataRow[] = [
  { id: 1, tbm: "밀폐공간 진입 안전수칙 및 감시인 역할 교육", date: "2025-12-10(화)", start: "08:30", end: "09:00", targetCount: 4, participantsCount: 4, leader: "이호성", sitePhotos: getRandomPhotos(51), eduDate: "2025-12-10(화)", eduTime: "08:30 ~ 09:00 (30분)", targetText: "4명", participantsText: "4명", attachments: true },
  { id: 2, tbm: "LOTOTO 실시 절차 및 에너지 차단 확인 교육", date: "2025-12-01(월)", start: "07:30", end: "08:00", targetCount: 5, participantsCount: 5, leader: "김민수", sitePhotos: getRandomPhotos(52), eduDate: "2025-12-01(월)", eduTime: "07:30 ~ 08:00 (30분)", targetText: "5명", participantsText: "5명", attachments: false },
  { id: 3, tbm: "유압/고압 설비 작업 전 잔압 해제 교육", date: "2025-12-12(금)", start: "14:00", end: "14:30", targetCount: 3, participantsCount: 3, leader: "이정아", sitePhotos: getRandomPhotos(53), eduDate: "2025-12-12(금)", eduTime: "14:00 ~ 14:30 (30분)", targetText: "3명", participantsText: "3명", attachments: true },
  { id: 4, tbm: "소형밀 청소 작업 분진 발생 및 호흡기 보호 교육", date: "2025-12-13(토)", start: "08:40", end: "09:10", targetCount: 3, participantsCount: 2, leader: "문반장", sitePhotos: getRandomPhotos(54), eduDate: "2025-12-13(토)", eduTime: "08:40 ~ 09:10 (30분)", targetText: "3명", participantsText: "2명", attachments: false },
  { id: 5, tbm: "중량물 운반 시 2인 1조 및 보조도구 사용 교육", date: "2025-12-04(목)", start: "08:00", end: "08:30", targetCount: 4, participantsCount: 4, leader: "장감독", sitePhotos: getRandomPhotos(55), eduDate: "2025-12-04(목)", eduTime: "08:00 ~ 08:30 (30분)", targetText: "4명", participantsText: "4명", attachments: true },
  { id: 6, tbm: "어큐뮬레이터 교체 고소 및 낙하물 방지 교육", date: "2025-12-17(화)", start: "13:00", end: "13:30", targetCount: 5, participantsCount: 5, leader: "최정비", sitePhotos: getRandomPhotos(56), eduDate: "2025-12-17(화)", eduTime: "13:00 ~ 13:30 (30분)", targetText: "5명", participantsText: "5명", attachments: false },
  { id: 7, tbm: "화기 작업 전 소화기 비치 및 주변 인화물 제거 교육", date: "2025-12-01(월)", start: "15:30", end: "16:00", targetCount: 4, participantsCount: 4, leader: "김철수", sitePhotos: getRandomPhotos(57), eduDate: "2025-12-01(월)", eduTime: "15:30 ~ 16:00 (30분)", targetText: "4명", participantsText: "4명", attachments: true },
  { id: 8, tbm: "전기 설비 작업 전원 차단 및 절연 도구 사용 교육", date: "2025-12-03(수)", start: "10:00", end: "10:30", targetCount: 3, participantsCount: 3, leader: "김민수", sitePhotos: getRandomPhotos(58), eduDate: "2025-12-03(수)", eduTime: "10:00 ~ 10:30 (30분)", targetText: "3명", participantsText: "3명", attachments: false },
  { id: 9, tbm: "유압 라인 고온 작업 시 화상 예방 및 PPE 교육", date: "2025-12-11(목)", start: "09:30", end: "10:00", targetCount: 3, participantsCount: 3, leader: "오감독", sitePhotos: getRandomPhotos(59), eduDate: "2025-12-11(목)", eduTime: "09:30 ~ 10:00 (30분)", targetText: "3명", participantsText: "3명", attachments: true },
  { id: 10, tbm: "비상 상황 발생 시 대피 경로 및 비상 연락 체계 교육", date: "2025-12-19(금)", start: "08:00", end: "08:15", targetCount: 6, participantsCount: 6, leader: "정안전", sitePhotos: getRandomPhotos(60), eduDate: "2025-12-19(금)", eduTime: "08:00 ~ 08:15 (15분)", targetText: "6명", participantsText: "6명", attachments: false }
]

export const nearMissMockData: DataRow[] = [
  { id: 1, danger: "슬래그 분진 폭발 위험", place: "집진 설비 인근", registrant: "박안전", date: "2025-12-15(월)", result: "미채택", reason: "집진기 필터 교체 주기 단축 및 정전기 방지 조치 시행", sitePhotos: getRandomPhotos(61), manage: "" },
  { id: 2, danger: "호이스트 낙하물", place: "Slag Mill 실 (2층)", registrant: "최정비", date: "2025-12-10(화)", result: "미채택", reason: "해당 구간 작업 전 통제 계획 이미 수립되어 있음", sitePhotos: getRandomPhotos(62), manage: "" },
  { id: 3, danger: "유압 오일 분출", place: "유압 라인 주변", registrant: "홍길동", date: "2025-12-12(금)", result: "미채택", reason: "고압 호스 정기 검사 및 교체 예산 즉시 반영", sitePhotos: getRandomPhotos(63), manage: "" },
  { id: 4, danger: "밀폐 공간 질식", place: "인렛 슈트 입구", registrant: "김근로", date: "2025-12-08(월)", result: "미채택", reason: "감시인 배치 및 공기 측정 장비 추가 확보", sitePhotos: getRandomPhotos(64), manage: "" },
  { id: 5, danger: "지게차 충돌", place: "제품 출하장 통로", registrant: "이운전", date: "2025-12-04(목)", result: "미채택", reason: "운전자 시야 확보용 반사경 설치 완료되어 개선 효과 미미", sitePhotos: getRandomPhotos(65), manage: "" }
]

export const safeVoiceMockData: DataRow[] = [
  { id: 1, content: "슬래그 밀 주변 높은 소음으로 귀마개 등급 상향 필요", registrant: "익명", date: "2025-12-05(금)", status: "미조치", reason: "특수 방음 귀마개 품의 진행 중", sitePhotos: getRandomPhotos(71) },
  { id: 2, content: "유압 장치 점검 맨홀 덮개가 무거워 2인 1조 표시 요청", registrant: "김근로", date: "2025-12-11(목)", status: "미조치", reason: "중량물 경고 스티커 및 2인 1조 문구 부착 완료", sitePhotos: getRandomPhotos(72) },
  { id: 3, content: "협소 공간 작업 시 방폭 손전등 지급 요청", registrant: "익명", date: "2025-12-17(수)", status: "미조치", reason: "적정 사양의 방폭등 선정 위해 현장 조사 예정", sitePhotos: getRandomPhotos(73) },
  { id: 4, content: "출하장 바닥에 떨어진 미분으로 인한 미끄러짐 위험", registrant: "박안전", date: "2025-12-02(화)", status: "미조치", reason: "미분 제거 위한 이동식 집진 청소기 배치 완료", sitePhotos: getRandomPhotos(74) },
  { id: 5, content: "작업 허가서 승인 시 현장 사진 첨부 의무화 요청", registrant: "이감독", date: "2025-12-19(금)", status: "미조치", reason: "시스템 업데이트 관련 관리자 승인 대기 중", sitePhotos: getRandomPhotos(75) }
]

export const assetMachineMockData: DataRow[] = [
  { id: 1, name: "슬래그 밀 #1 (SM-1)", capacity: "200ton/h", quantity: 1, location: "Slag Mill 실", inspectionCycle: "1년", inspectionDate: "2025-11-01(토)", purpose: "슬래그 분쇄" },
  { id: 2, name: "Master Roller #3 (MR-3)", capacity: "100bar", quantity: 1, location: "Slag Mill 실", inspectionCycle: "6개월", inspectionDate: "2025-10-15(수)", purpose: "유압식 압력 조절" },
  { id: 3, name: "컨베이어 (BC-170)", capacity: "150m/min", quantity: 1, location: "원료 이송 구역", inspectionCycle: "6개월", inspectionDate: "2025-12-05(금)", purpose: "원료 운반" },
  { id: 4, name: "호이스트 (H-2-0050)", capacity: "5ton", quantity: 1, location: "Slag Mill 실", inspectionCycle: "6개월", inspectionDate: "2025-09-20(토)", purpose: "중량물 인양 (라이너 교체 등)" },
  { id: 5, name: "집진기 #2 (D-2-9000)", capacity: "2000m³/h", quantity: 1, location: "집진동", inspectionCycle: "1년", inspectionDate: "2025-03-02(일)", purpose: "분진 제거 (밀 실)" },
  { id: 6, name: "지게차 #1 (F-1-7000)", capacity: "3ton", quantity: 2, location: "물류창고", inspectionCycle: "6개월", inspectionDate: "2025-04-05(토)", purpose: "제품/원자재 운반" },
  { id: 7, name: "유압 펌프 유닛 (HP-1)", capacity: "250L/min", quantity: 1, location: "Slag Mill 실 유압장치", inspectionCycle: "3개월", inspectionDate: "2025-12-01(월)", purpose: "유압 시스템 구동" },
  { id: 8, name: "슬러지 이송 펌프 (SP-1)", capacity: "500L/min", quantity: 2, location: "폐수처리장", inspectionCycle: "1년", inspectionDate: "2025-03-15(토)", purpose: "폐수 처리" },
  { id: 9, name: "전기 패널 (MCC-1)", capacity: "440V", quantity: 1, location: "전기실", inspectionCycle: "1년", inspectionDate: "2025-01-20(월)", purpose: "전력 공급 및 제어" },
  { id: 10, name: "용접기 (W-3-1100)", capacity: "380V", quantity: 2, location: "제작동", inspectionCycle: "3개월", inspectionDate: "2025-02-18(화)", purpose: "금속 용접 및 보수" }
]

export const assetHazardMockData: DataRow[] = [
  { id: 1, chemicalName: "메틸알코올", casNo: "67-56-1", exposureLimit: "200 ppm", dailyUsage: "25 L", storageAmount: "1 m³", registrationDate: "2025-06-01(일)", msds: "MSDS-001.pdf", manage: "밀폐공간 사용 금지" },
  { id: 2, chemicalName: "공업용 솔벤트 (희석제)", casNo: "N/A", exposureLimit: "100 ppm", dailyUsage: "5 L", storageAmount: "300 L", registrationDate: "2025-07-15(화)", msds: "MSDS-002.pdf", manage: "환기 시설 확보" },
  { id: 3, chemicalName: "유압 작동유 (HSLM Oil)", casNo: "N/A", exposureLimit: "5 mg/m³", dailyUsage: "10 L", storageAmount: "5 t", registrationDate: "2025-01-10(금)", msds: "MSDS-003.pdf", manage: "누유 방지 대책" },
  { id: 4, chemicalName: "염산 (35%)", casNo: "7647-01-0", exposureLimit: "2 ppm", dailyUsage: "1 L", storageAmount: "50 L", registrationDate: "2025-09-01(월)", msds: "MSDS-004.pdf", manage: "산성 보호구 착용" },
  { id: 5, chemicalName: "아세톤", casNo: "67-64-1", exposureLimit: "500 ppm", dailyUsage: "0.5 L", storageAmount: "50 L", registrationDate: "2025-10-20(월)", msds: "MSDS-005.pdf", manage: "화기 엄금 (인화성)" },
  { id: 6, chemicalName: "분진 (슬래그 미분)", casNo: "N/A", exposureLimit: "10 mg/m³", dailyUsage: "N/A", storageAmount: "N/A", registrationDate: "2025-02-01(토)", msds: "MSDS-006.pdf", manage: "특급 방진마스크 착용" },
  { id: 7, chemicalName: "암모니아수", casNo: "1336-21-6", exposureLimit: "25 ppm", dailyUsage: "0.1 L", storageAmount: "10 L", registrationDate: "2025-08-10(일)", msds: "MSDS-007.pdf", manage: "밀폐된 공간 사용 금지" },
  { id: 8, chemicalName: "윤활 그리스", casNo: "N/A", exposureLimit: "5 mg/m³", dailyUsage: "1 kg", storageAmount: "500 kg", registrationDate: "2025-04-18(금)", msds: "MSDS-008.pdf", manage: "피부 접촉 주의" },
  { id: 9, chemicalName: "톨루엔", casNo: "108-88-3", exposureLimit: "50 ppm", dailyUsage: "10 kg", storageAmount: "700 L", registrationDate: "2025-05-20(화)", msds: "MSDS-009.pdf", manage: "유기용제 취급 교육 이수" },
  { id: 10, chemicalName: "질소 (고압가스)", casNo: "7727-37-9", exposureLimit: "N/A", dailyUsage: "N/A", storageAmount: "20 Cyl", registrationDate: "2025-03-30(일)", msds: "MSDS-010.pdf", manage: "용기 전도 방지 및 잔압 확인" }
]

// Supply Chain
export const partnersMockData: DataRow[] = [
  { id: 1, company: "대진설비보전", contractPeriod: "2025-04-01 ~ 2026-03-31", manager: "최정비", contact: "010-9999-1111", planFile: "계획서_대진.pdf", etcFile: "", manage: "슬래그 밀 정비 전담" },
  { id: 2, company: "동아하역물류", contractPeriod: "2025-07-01 ~ 2026-06-30", manager: "이하준", contact: "010-8888-2222", planFile: "계획서_동아.pdf", etcFile: "안전교육_동아.zip", manage: "슬래그 제품 운반" },
  { id: 3, company: "하나환경산업", contractPeriod: "2025-10-01 ~ 2025-12-31", manager: "김청소", contact: "010-7777-3333", planFile: "", etcFile: "", manage: "고소/밀폐공간 청소" },
  { id: 4, company: "세화전기안전", contractPeriod: "2025-01-01 ~ 2025-12-31", manager: "박전기", contact: "010-6666-4444", planFile: "계획서_세화.pdf", etcFile: "", manage: "전기 설비 정기 점검" },
  { id: 5, company: "미래건설기술", contractPeriod: "2025-03-01 ~ 2025-09-30", manager: "정건설", contact: "010-5555-5555", planFile: "", etcFile: "안전서약서_미래.pdf", manage: "유압라인 교체 작업" },
  { id: 6, company: "안전보건컨설팅", contractPeriod: "2025-08-01 ~ 2026-07-31", manager: "홍강사", contact: "010-4444-6666", planFile: "교육계획_안전보건.pdf", etcFile: "", manage: "특별 안전 교육 전담" }
]

export const evaluationMockData: DataRow[] = [
  { id: 1, company: "대진설비보전", evaluationName: "슬래그 밀 정비 협력사 신규평가", evaluationType: "신규평가", contractPeriod: "2025-04-01 ~ 2026-03-31", evaluator: "김안전", externalEvaluator: "한국안전기술원", evaluationFile: "대진_신규평가서.pdf", attachmentFile: "" },
  { id: 2, company: "동아하역물류", evaluationName: "제품 운반 협력사 재평가", evaluationType: "재평가", contractPeriod: "2024-07-01 ~ 2025-06-30", evaluator: "이감독", externalEvaluator: "한국산업안전협회", evaluationFile: "동아_재평가서.pdf", attachmentFile: "점검결과_동아.zip" },
  { id: 3, company: "하나환경산업", evaluationName: "고위험 작업(청소) 협력사 선정평가", evaluationType: "선정평가", contractPeriod: "2025-10-01 ~ 2025-12-31", evaluator: "박관리", externalEvaluator: "기술안전공단", evaluationFile: "하나_선정평가서.pdf", attachmentFile: "" },
  { id: 4, company: "세화전기안전", evaluationName: "전기 설비 협력사 정기평가", evaluationType: "정기평가", contractPeriod: "2025-01-01 ~ 2025-12-31", evaluator: "최현장", externalEvaluator: "안전보건기술(주)", evaluationFile: "세화_정기평가.pdf", attachmentFile: "" },
  { id: 5, company: "미래건설기술", evaluationName: "중대재해 발생 위험 작업 특별평가", evaluationType: "특별평가", contractPeriod: "2025-03-01 ~ 2025-09-30", evaluator: "정안전", externalEvaluator: "안전보건컨설팅", evaluationFile: "미래_특별평가.pdf", attachmentFile: "개선계획서.zip" }
]

export const committeeMockData: DataRow[] = [
  { id: 1, completionDate: "2025-12-10 10:00~11:30", meetingPlace: "본사 대회의실", sitePhotos: getRandomPhotos(81), proof: "회의록_251210.pdf", manage: "4분기 정기 회의" },
  { id: 2, completionDate: "2025-11-25 14:00~15:00", meetingPlace: "슬래그공장 회의실", sitePhotos: getRandomPhotos(82), proof: "회의록_251125.pdf", manage: "유압 설비 개선안 논의" },
  { id: 3, completionDate: "2025-10-30 13:00~15:00", meetingPlace: "본사 소회의실", sitePhotos: getRandomPhotos(83), proof: "회의록_251030.pdf", manage: "협력업체 평가 결과 공유" },
  { id: 4, completionDate: "2025-09-15 09:00~10:30", meetingPlace: "C동 교육장", sitePhotos: getRandomPhotos(84), proof: "회의록_250915.pdf", manage: "밀폐공간 작업 절차 수립" },
  { id: 5, completionDate: "2025-08-12 16:00~17:00", meetingPlace: "A공장 상황실", sitePhotos: getRandomPhotos(85), proof: "회의록_250812.pdf", manage: "TBM 시행 결과 보고" },
  { id: 6, completionDate: "2025-07-05 10:00~11:00", meetingPlace: "슬래그공장 회의실", sitePhotos: getRandomPhotos(86), proof: "회의록_250705.pdf", manage: "상반기 안전 목표 점검" }
]

export const siteAuditMockData: DataRow[] = [
  { id: 1, inspectionDate: "2025-12-05(금)", inspectionType: "특별점검", inspectionName: "슬래그 밀 LOTO 시스템 작동 및 태그 확인", inspectionResult: "중대 위험요인", note: "LOTO 해제 절차 미준수 2건 적발, 즉시 재교육", inspector: "최안전", sitePhotos: getRandomPhotos(91), fileAttach: "LOTO_Audit.pdf", manage: "위험작업 허가서 연계" },
  { id: 2, inspectionDate: "2025-12-10(화)", inspectionType: "합동점검", inspectionName: "밀폐공간 작업 전 산소/유해가스 농도 측정", inspectionResult: "이상없음", note: "산소 20.9%, H2S 0 ppm 확인", inspector: "박점검", sitePhotos: getRandomPhotos(92), fileAttach: "", manage: "인렛슈트 청소 작업" },
  { id: 3, inspectionDate: "2025-12-17(수)", inspectionType: "일반점검", inspectionName: "유압라인 분해/조립 시 잔압 제거 여부", inspectionResult: "시정조치 완료", note: "압력 게이지 '0' Bar 확인 후 작업 시작", inspector: "이점검", sitePhotos: getRandomPhotos(93), fileAttach: "", manage: "어큐뮬레이터 교체" },
  { id: 4, inspectionDate: "2025-11-28(금)", inspectionType: "정기점검", inspectionName: "중량물 인양 호이스트 와이어 로프 마모도", inspectionResult: "이상없음", note: "마모율 기준치 미만", inspector: "김감독", sitePhotos: getRandomPhotos(94), fileAttach: "호이스트_점검.xls", manage: "4분기 설비 점검" },
  { id: 5, inspectionDate: "2025-12-03(화)", inspectionType: "특별점검", inspectionName: "분진 작업 시 특급 방진마스크 착용 준수", inspectionResult: "시정조치 필요", note: "마스크 미착용 1건, 현장 경고 및 재착용 조치", inspector: "정안전", sitePhotos: getRandomPhotos(95), fileAttach: "", manage: "소형밀 청소 작업" }
]

export const trainingMockData: DataRow[] = [
  { id: 1, name: "협의체 A (정비)", riskAssessment: { text: "완료", color: "blue" }, hazardousMaterial: { text: "완료", color: "blue" }, responseManual: { text: "완료", color: "blue" }, allSigned: { text: "완료", color: "blue" }, updatedAt: "2025-12-01(월)" },
  { id: 2, name: "협의체 B (전기)", riskAssessment: { text: "완료", color: "blue" }, hazardousMaterial: { text: "미완료", color: "red" }, responseManual: { text: "완료", color: "blue" }, allSigned: { text: "미완료", color: "red" }, updatedAt: "2025-12-05(금)" },
  { id: 3, name: "협의체 C (청소)", riskAssessment: { text: "미완료", color: "red" }, hazardousMaterial: { text: "미완료", color: "red" }, responseManual: { text: "미완료", color: "red" }, allSigned: { text: "미완료", color: "red" }, updatedAt: null },
  { id: 4, name: "협의체 D (물류)", riskAssessment: { text: "완료", color: "blue" }, hazardousMaterial: { text: "완료", color: "blue" }, responseManual: { text: "미완료", color: "red" }, allSigned: { text: "완료", color: "blue" }, updatedAt: "2025-11-20(목)" },
  { id: 5, name: "협의체 E (건설)", riskAssessment: { text: "미완료", color: "red" }, hazardousMaterial: { text: "완료", color: "blue" }, responseManual: { text: "완료", color: "blue" }, allSigned: { text: "미완료", color: "red" }, updatedAt: "2025-10-15(수)" },
  { id: 6, name: "협의체 F (특수)", riskAssessment: { text: "완료", color: "blue" }, hazardousMaterial: { text: "미완료", color: "red" }, responseManual: { text: "미완료", color: "red" }, allSigned: { text: "완료", color: "blue" }, updatedAt: "2025-12-18(수)" }
]

// Notice
export const noticeMockData: DataRow[] = [
  { id: 1, title: "[필독] 12월 슬래그 밀 정기 정비 기간 안전 수칙 준수 강조", author: "홍길동", date: "2025-12-01(월)", views: 250, fileAttach: true },
  { id: 2, title: "[안내] 위험 작업 허가제(PTW) 시스템 개편에 따른 사용 교육 일정", author: "박관리", date: "2025-11-28(금)", views: 188, fileAttach: false },
  { id: 3, title: "[중요] 밀폐 공간(슈트/빈) 작업 전 유해가스 측정 의무화 안내", author: "김안전", date: "2025-11-20(목)", views: 310, fileAttach: true },
  { id: 4, title: "4분기 전 직원 정기 안전보건교육 이수 확인 요청", author: "최감독", date: "2025-11-15(토)", views: 405, fileAttach: false },
  { id: 5, title: "[공지] 협력업체 정기 안전보건수준 평가 결과 및 피드백 회신", author: "이안전", date: "2025-11-05(수)", views: 220, fileAttach: true }
]

export const resourcesMockData: DataRow[] = [
  { id: 1, title: "슬래그 밀 정비 시 LOTOTO(잠금/표지) 표준 절차서", author: "김정비", date: "2025-12-05(금)", fileAttach: true },
  { id: 2, title: "고소 작업 및 중량물 인양 작업 위험성평가 서식", author: "박안전", date: "2025-11-25(화)", fileAttach: true },
  { id: 3, title: "밀폐공간 출입 전 산소/유해가스 측정 기록부", author: "최감독", date: "2025-11-18(화)", fileAttach: true },
  { id: 4, title: "협력업체 정기 안전보건 교육 이수 확인 서식", author: "홍길동", date: "2025-11-07(금)", fileAttach: false },
  { id: 5, title: "유압라인 분해/조립 작업 시 안전수칙 TBM 자료", author: "이정아", date: "2025-12-11(목)", fileAttach: true }
]

export const lawMockData: DataRow[] = [
  { id: 1, title: "고압가스 안전관리법 개정안 주요 내용 안내", organization: "고용노동부", date: "2025-12-01(월)", content: "고압가스 안전관리법 일부개정법률안이 2025년 12월 1일부로 시행됩니다.\n\n주요 개정 내용:\n1. 고압가스 저장시설의 안전거리 기준 강화\n2. 정기검사 주기 단축 (3년 → 2년)\n3. 안전관리자 자격요건 상향\n4. 위반 시 과태료 상향 조정\n\n사업장에서는 개정 내용을 숙지하시고 해당 사항을 준수해 주시기 바랍니다.", fileAttach: true },
  { id: 2, title: "밀폐공간 보건 작업 프로그램 가이드라인 (최신판)", organization: "안전보건공단", date: "2025-11-25(화)", content: "밀폐공간 작업 시 준수해야 할 보건 작업 프로그램 가이드라인입니다.\n\n1. 작업 전 산소농도 및 유해가스 측정 필수\n2. 환기설비 가동 및 확인\n3. 감시인 배치 의무화\n4. 비상연락체계 수립\n5. 구조용 장비 비치\n\n밀폐공간 작업 시 반드시 본 가이드라인을 준수하여 주시기 바랍니다.", fileAttach: false },
  { id: 3, title: "화학물질 관리법 개정사항 및 MSDS 비치 의무 안내", organization: "환경부", date: "2025-11-10(월)", content: "화학물질관리법 개정에 따른 MSDS(물질안전보건자료) 비치 의무 안내입니다.\n\n1. 모든 화학물질 취급 장소에 MSDS 비치 필수\n2. 근로자가 쉽게 열람할 수 있는 위치에 게시\n3. 한글 MSDS 필수 (외국어 단독 불가)\n4. 5년마다 갱신 필요\n\n미준수 시 과태료가 부과될 수 있으니 유의하시기 바랍니다.", fileAttach: true },
  { id: 4, title: "산업안전보건기준에 관한 규칙(슬래그 밀 관련 조항 발췌)", organization: "고용노동부", date: "2025-10-30(목)", content: "산업안전보건기준에 관한 규칙 중 슬래그 밀 작업 관련 조항을 발췌하여 안내드립니다.\n\n제123조 (분진 발생 작업)\n- 분진 발생 작업 시 국소배기장치 설치\n- 방진마스크 지급 및 착용 의무화\n\n제245조 (고온 작업)\n- 고온 물체 취급 시 보호구 착용\n- 휴식시간 확보\n\n제312조 (밀폐공간 작업)\n- 산소농도 18% 이상 확인\n- 유해가스 농도 측정", fileAttach: true },
  { id: 5, title: "TBM(작업 전 안전점검 회의) 이행 가이드 및 기록 서식", organization: "안전보건공단", date: "2025-10-20(월)", content: "TBM(Tool Box Meeting) 이행 가이드입니다.\n\n1. 매일 작업 시작 전 실시\n2. 당일 작업 내용 및 위험요인 공유\n3. 안전수칙 및 보호구 착용 확인\n4. 비상시 대응절차 숙지\n5. 참석자 서명 필수\n\n첨부된 기록 서식을 활용하여 TBM을 실시해 주시기 바랍니다.", fileAttach: true }
]

export const receivedApprovalMockData: DataRow[] = [
  { id: 1, date: "2025-12-17(수)", type: "작업위험분석(JSA)", content: "Master Roller 어큐뮬레이터 교체 위험분석", drafter: "최정비", status: { text: "결재대기", color: "orange" } },
  { id: 2, date: "2025-12-13(토)", type: "현장위험성평가", content: "소형밀 내부 잔류물 청소 위험성평가", drafter: "문반장", status: { text: "결재대기", color: "orange" } },
  { id: 3, date: "2025-12-12(금)", type: "위험작업허가서", content: "HSLM 유압 오일 보충 작업 허가 요청", drafter: "이정아", status: { text: "결재완료", color: "blue" } },
  { id: 4, date: "2025-12-10(화)", type: "TBM 안전일지", content: "밀폐공간 진입 안전수칙 TBM 기록", drafter: "이호성", status: { text: "결재완료", color: "blue" } },
  { id: 5, date: "2025-12-05(금)", type: "위험작업허가서", content: "컨베이어 벨트 용접 작업 허가 요청", drafter: "김철수", status: { text: "반려", color: "red" } },
  { id: 6, date: "2025-12-04(목)", type: "점검결과 보고서", content: "중량물 운반 안전 점검 결과 보고", drafter: "장감독", status: { text: "결재완료", color: "blue" } },
  { id: 7, date: "2025-12-02(화)", type: "협력업체 평가서", content: "협력업체 B 안전보건수준 재평가서", drafter: "박안전", status: { text: "결재대기", color: "orange" } },
  { id: 8, date: "2025-11-20(목)", type: "TBM 안전일지", content: "전기 설비 정기 점검 TBM 기록", drafter: "김민수", status: { text: "결재완료", color: "blue" } }
]

export const sentApprovalMockData: DataRow[] = [
  { id: 1, date: "2025-12-19(금)", documentType: "회의록", document: "회의록", content: "4분기 산업안전보건위원회 회의록 승인 요청", status: { text: "결재대기", color: "orange" }, progress: "0/3", finalApprover: "최대표" },
  { id: 2, date: "2025-12-18(수)", documentType: "점검계획서", document: "점검계획서", content: "슬래그 밀 정기 점검 계획서 수정본", status: { text: "결재중", color: "green" }, progress: "1/4", finalApprover: "김공장장" },
  { id: 3, date: "2025-12-16(화)", documentType: "절차서", document: "절차서", content: "밀폐공간 작업 절차서 개정안", status: { text: "결재완료", color: "blue" }, progress: "3/3", finalApprover: "홍소장" },
  { id: 4, date: "2025-12-10(화)", documentType: "보고서", document: "보고서", content: "12월 안전 교육 이수 현황 보고서", status: { text: "결재중", color: "green" }, progress: "2/3", finalApprover: "박관리" },
  { id: 5, date: "2025-12-05(금)", documentType: "관리대장", document: "관리대장", content: "유해화학물질 관리 대장 업데이트 승인 요청", status: { text: "결재완료", color: "blue" }, progress: "2/2", finalApprover: "이환경" },
  { id: 6, date: "2025-11-30(일)", documentType: "안전보건예산", document: "안전보건예산", content: "2026년 안전보건 예산 및 인력 확보 계획서", status: { text: "결재대기", color: "orange" }, progress: "0/4", finalApprover: "최대표" },
  { id: 7, date: "2025-11-25(화)", documentType: "점검보고", document: "점검보고", content: "협력업체 안전보건 관리 실태 점검 보고", status: { text: "반려", color: "red" }, progress: "1/3", finalApprover: "김공장장" }
]

// Safety Work Permit
export const safetyWorkPermitMockData: DataRow[] = [
  { id: 1, workType: "용접 (화기 작업)", workerCount: "3명", hazardLevel: "높음", workPeriod: "2025-12-01 ~ 2025-12-02", registrationDate: "2025-11-29", approvalStatus: { text: "완료", color: "blue" }, attachment: "화기_PTW.pdf", manage: "컨베이어 벨트 보수" },
  { id: 2, workType: "밀폐공간 진입", workerCount: "2명", hazardLevel: "높음", workPeriod: "2025-12-10 ~ 2025-12-10", registrationDate: "2025-12-08", approvalStatus: { text: "완료", color: "blue" }, attachment: "밀폐_PTW.pdf", manage: "인렛 슈트 내부 청소" },
  { id: 3, workType: "고소 작업 (3m 이상)", workerCount: "4명", hazardLevel: "높음", workPeriod: "2025-12-17 ~ 2025-12-18", registrationDate: "2025-12-15", approvalStatus: { text: "미완료", color: "red" }, attachment: "", manage: "어큐뮬레이터 교체" },
  { id: 4, workType: "전기 작업 (LOTOTO)", workerCount: "2명", hazardLevel: "중간", workPeriod: "2025-12-03 ~ 2025-12-03", registrationDate: "2025-12-01", approvalStatus: { text: "완료", color: "blue" }, attachment: "전기_PTW.pdf", manage: "배선 절연 보강" },
  { id: 5, workType: "중량물 양중 작업", workerCount: "3명", hazardLevel: "중간", workPeriod: "2025-12-04 ~ 2025-12-04", registrationDate: "2025-12-03", approvalStatus: { text: "반려", color: "red" }, attachment: "", manage: "장비 이동/설치" }
]

// Response Manual
export const responseManualMockData: DataRow[] = [
  { id: 1, title: "(중대재해) 슬래그 밀 내부 협착/끼임 사고 발생 시 비상 대응 절차", author: "홍길동", date: "2025-12-05(금)", views: 860, fileAttach: true },
  { id: 2, title: "(밀폐공간) 인렛 슈트 및 사일로 밀폐공간 진입 및 구조 매뉴얼", author: "김안전", date: "2025-12-10(화)", views: 350, fileAttach: true },
  { id: 3, title: "(화재/폭발) 분진 폭발 대비 및 비상 소화 설비 사용 매뉴얼", author: "박관리", date: "2025-11-30(일)", views: 550, fileAttach: true },
  { id: 4, title: "(화학물질) 유압 작동유 및 위험물질 누출 시 긴급 방제 조치 지침", author: "최정비", date: "2025-12-12(금)", views: 280, fileAttach: true },
  { id: 5, title: "(산업안전) 작업 전 LOTOTO 실시 및 해제 단계별 표준 매뉴얼", author: "이감독", date: "2025-12-01(월)", views: 780, fileAttach: true }
]

// QR
export const qrManagementMockData = [
  { id: 5, qrName: "근로자 앱 사용 가이드 QR", link: "근로자용 사용법 안내", useStatus: true },
  { id: 4, qrName: "관리자 사용 가이드 QR", link: "관리자용 사용 설명서", useStatus: true },
  { id: 3, qrName: "종사자 의견청취 QR", link: "설문/건의 등 의견 수렴 폼 링크", useStatus: true },
  { id: 2, qrName: "관리자 페이지 접속 QR", link: "관리자용 웹페이지 링크", useStatus: true },
  { id: 1, qrName: "이수증 제출 QR", link: "안드로이드/iOS 다운로드 링크", useStatus: true }
]

// PTW Utilities
export const findPTWDataById = (id: number, type: PTWDocumentType): PTWGroupItem | WorkPermitItem | JSAItem | SiteEvaluationItem | TBMItem | undefined => {
  const dataMap = { "ptw-group": ptwGroupMockData, "work-permit": workPermitMockData, "jsa": jsaMockData, "site-evaluation": siteEvaluationMockData, "tbm": tbmMockData }
  return dataMap[type].find(item => item.id === id)
}

export const getDocumentTypeByTabIndex = (tabIndex: number): PTWDocumentType => {
  const typeMap: Record<number, PTWDocumentType> = { 0: "work-permit", 1: "jsa", 2: "site-evaluation", 3: "tbm" }
  return typeMap[tabIndex] || "work-permit"
}

export const getTabIndexByDocumentType = (type: PTWDocumentType): number => {
  const indexMap: Record<PTWDocumentType, number> = { "ptw-group": 0, "work-permit": 0, "jsa": 1, "site-evaluation": 2, "tbm": 3 }
  return indexMap[type] || 0
}

export { reportManagementMockData, reportContractorMockData } from "./mockReportData"