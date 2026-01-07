// src/data/mockDocumentData.ts

export interface RiskRow {
    id: number
    task?: string
    hazard: string
    currentRisk: string
    measure: string
    improvedRisk?: string
    checked: boolean
    beforeImages?: string[]
    afterImages?: string[]
  }
  
  export interface InspectionRow {
    id: number
    time: string
    person: string
    note: string
  }
  
  export interface AttendeeRow {
    id: number
    name: string
    health: string
    isNew: boolean
    signature?: any
  }
  
  export interface ProposalRow {
    id: number
    hazard: string
    solution: string
    proposer: string
  }
  
  export interface NearMissRow {
    id: number
    content: string
    prevention: string
    proposer: string
  }
  
  export interface DocumentDetail {
    workplace?: string
    applicationDate?: string
    workTypes?: string[]
    requestDept?: string
    workerCount?: number
    workDate?: string
    applicantName?: string
    applicantSignature?: string
    workLocation?: string
    workType?: string
    otherSafety?: string
    safetyChecks?: Record<string, string | boolean>
    approvers?: Record<string, any>
    supervisor?: any
  
    no?: string
    team?: string
    teamName?: string
    date?: string
    rev?: string
    reason?: string
    tools?: string
    safetyDevices?: string
    workContent?: string
    workName?: string
    teamMember?: any
    sign_date?: string
    
    companyName?: string
    time?: string
    processName?: string
    manager?: string
    
    riskRows?: RiskRow[]
    inspectionRows?: InspectionRow[]
    attendeeRows?: AttendeeRow[]
    proposalRows?: ProposalRow[]
    nearMissRows?: NearMissRow[]
  }
  
  export const DOCUMENT_DETAILS: Record<string, DocumentDetail> = {

    "JSA-001": {
      no: "SPS&A-JSA-54",
      date: "2024-03-01",
      team: "신호등",
      teamName: "신호등",
      workName: "Slag Mill Inlet Chute 코팅 제거",
      tools: "전기드릴, 전원케이블, 작업 Lamp",
      safetyDevices: "안전모, 안전화, 보안경, 방진마스크, 귀마개, 안전벨트, 안전로프",
      workContent: "Slag Mill Inlet Chute 코팅 제거 작업",
      teamMember: { name: "작성자없음" }, 
      riskRows: [
        { id: 1, task: "1. 작업 전 설비(공구) 점검", hazard: "공구, 안전 보호구, 사람", currentRisk: "중", measure: "작업 전 필요 안전 보호구 착용 (방진 마스크 등)", improvedRisk: "하", checked: true },
        { id: 2, task: "2. 현장 이동", hazard: "현장 이동 중 전도 위험", currentRisk: "하", measure: "계단 이용 시 발이 걸리지 않게 조심", improvedRisk: "-", checked: false },
        { id: 3, task: "3. 점검 맨홀 Open", hazard: "공구 사용에 따른 위험", currentRisk: "중", measure: "공구 사용법을 숙지한다.", improvedRisk: "하", checked: true },
        { id: 4, task: "4. Inlet Chute 코팅 제거", hazard: "고소 작업, 협소 공간, 비산 물질", currentRisk: "상", measure: "안전벨트 착용, 2인 1조, 방진복 착용", improvedRisk: "하", checked: true }
      ]
    },
  
    "JSA-002": {
      no: "SPS&A-JSA-15",
      date: "2024-06-01",
      team: "그린존",
      teamName: "그린존",
      workName: "소형밀 롤러 오일 급유",
      tools: "파이프렌치, Oil급유 통 및 레벨게이지 등",
      safetyDevices: "1급 방진마스크, 안전모, 안전화, 안전조끼, 장갑, 보안경, 긴팔 착용",
      workContent: "소형밀 롤러 오일 급유 및 내부 점검",
      teamMember: { name: "작성자없음" },
      riskRows: [
        { id: 1, task: "1. 작업 전 설비 점검", hazard: "안전보호구 미착용, 설비 가동", currentRisk: "상", measure: "설비 LOTOTO 실시, 안전보호구 착용", improvedRisk: "하", checked: true },
        { id: 2, task: "2. 점검 맨홀 Open", hazard: "공구 사용시 타박상 위험", currentRisk: "중", measure: "규격에 맞는 공구 사용", improvedRisk: "하", checked: true },
        { id: 3, task: "3. B/F 가동 및 설비 내부", hazard: "회전체 위험, 화재위험, 협소공간", currentRisk: "상", measure: "2인 1조 작업, 화상 대비 안전복", improvedRisk: "하", checked: true },
        { id: 4, task: "8. 작업 마무리", hazard: "현장정리 미흡", currentRisk: "중", measure: "작업장 주변 정리정돈 실시", improvedRisk: "하", checked: true }
      ]
    },
  
    "JSA-003": {
      no: "SPS&A-JSA-22",
      date: "2024-07-15",
      team: "청정구역",
      teamName: "청정구역",
      workName: "컨베이어 벨트 교체 및 점검",
      tools: "몽키스패너, 드라이버 세트",
      safetyDevices: "안전모, 안전화, 안전장갑, 보안경",
      workContent: "노후 컨베이어 벨트 교체 작업",
      teamMember: { name: "박민수" },
      riskRows: [
        { id: 1, task: "1. 작업 준비", hazard: "작업 중 설비 불시 가동", currentRisk: "상", measure: "전원 차단 및 LOTOTO 실시", improvedRisk: "하", checked: true },
        { id: 2, task: "2. 벨트 분리", hazard: "협착 및 끼임 사고", currentRisk: "중", measure: "신체 일부가 말려들지 않도록 주의", improvedRisk: "하", checked: true },
        { id: 3, task: "3. 신규 벨트 설치", hazard: "중량물 운반에 의한 요통", currentRisk: "중", measure: "2인 1조 운반 및 보조도구 사용", improvedRisk: "하", checked: true }
      ]
    },
  
  
    "EVAL-001": {
      date: "2025-10-27",
      team: "자체",
      teamName: "자체",
      workName: "현장 위험성평가(JSA)",
      teamMember: { name: "이효성", image: "/images/signature-4.png" },
      safetyChecks: { "first_worker_no": true, "first_equipment_no": true, "sign_date": "2025-10-27" },
      riskRows: [
        { id: 1, task: "작업 준비", hazard: "작업 중 설비 가동 위험 (01-BC-180, 03-WF-020)", currentRisk: "중", measure: "LOTOTO 실시", checked: false },
        { id: 2, task: "점검맨홀 OPEN", hazard: "중량물에 의한 근골격계 질환", currentRisk: "하", measure: "2인 1조 작업 실시", checked: true },
        { id: 3, task: "SLAG BIN 내부 확인", hazard: "내부 조도 불량으로 시야 확보 어려움", currentRisk: "하", measure: "전등 설치", checked: true },
        { id: 4, task: "및 코팅 제거", hazard: "분진에 의한 호흡기 질환", currentRisk: "하", measure: "방진마스크 착용", checked: true },
        { id: 5, task: "함마드릴 사용시 타박상 위험", hazard: "올바른 자세로 안전하게 작업 및 공구 사용법 숙지 후 작업", currentRisk: "하", measure: "공구 사용법 숙지", checked: true }
      ]
    },
  
    "EVAL-002": {
      date: "2025-10-28",
      team: "자체",
      teamName: "자체",
      workName: "현장 위험성평가(JSA)",
      teamMember: { name: "최승휴", image: "/images/signature-2.png" },
      safetyChecks: { "first_worker_no": true, "first_equipment_no": true, "sign_date": "2025-10-28" },
      riskRows: [
        { id: 1, task: "전원차단", hazard: "", currentRisk: "", measure: "", checked: false },
        { id: 2, task: "유압 압력 해제", hazard: "교체 작업중 고압에 의한 사고", currentRisk: "중", measure: "고압 호스 배관에 걸려있는 압력 제거 '0' Bar 확인", checked: true },
        { id: 3, task: "어큐뮬레이터 질소압력 제거", hazard: "질소 압력 제거 중 고소작업 추락위험", currentRisk: "하", measure: "안전벨트 착용, 사다리 사용 전 점검", checked: true },
        { id: 4, task: "유압라인 분해", hazard: "오일 고온에 의한 화상 위험", currentRisk: "하", measure: "작업 전 오일 온도 확인, 적정온도 확인 후 작업", checked: true },
        { id: 5, task: "어큐뮬레이터 분리 및 제거", hazard: "어큐뮬레이터 중량물로 인한 사고 위험", currentRisk: "중", measure: "체인블럭 및 실링바 점검, 중량물 이동시 2인 1조 작업", checked: true }
      ],
      // ★ 일일순회점검 결과 추가됨
      inspectionRows: [
        { 
          id: 1, 
          time: "추가", 
          person: "최승휴", 
          note: "배관, 어큐뮬레이터 고정볼트 분리시 안면 보호구 착용 (오일 분사시 눈에 들어갈수 있음)" 
        }
      ]
    },
  
    "EVAL-003": {
      date: "2025-10-28",
      team: "자체",
      teamName: "자체",
      workName: "현장 위험성평가(JSA)",
      teamMember: { name: "최승휴", image: "/images/signature-2.png" },
      safetyChecks: { "first_worker_no": true, "first_equipment_no": true, "sign_date": "2025-10-28" },
      riskRows: [
        { id: 1, task: "질소가스 충전", hazard: "질소충전 중 고정불량으로 사고 위험", currentRisk: "중", measure: "질소충전 키트 고정상태 확인", checked: true },
        { id: 2, task: "유압펌프 가동/오일 공급", hazard: "유압공급 중 오일 분출로 사고 위험", currentRisk: "중", measure: "유압공급 시 주변 접근금지", checked: true },
        { id: 3, task: "공기 빼기 (무부하)", hazard: "이동 중 넘어짐 사고", currentRisk: "하", measure: "넘어짐 사고 주의", checked: true },
        { id: 4, task: "공기 빼기 (부하)", hazard: "유압실린더 동작 시 끼임사고", currentRisk: "중", measure: "끼임사고 주의", checked: true }
      ]
    },
  
    "EVAL-004": {
      date: "2025-10-29",
      team: "자체",
      teamName: "자체",
      workName: "현장 위험성평가(JSA)",
      teamMember: { name: "양재훈", image: "/images/signature-1.png" },
      safetyChecks: { "first_worker_no": true, "first_equipment_no": true, "sign_date": "2025-10-29" },
      riskRows: [
        { id: 1, task: "유류 창고에서 밀실로 드럼통 운반", hazard: "드럼통 운반시 굴러떨어질 위험", currentRisk: "하", measure: "핸드자키에 고임목 설치", checked: true },
        { id: 2, task: "오일 주입", hazard: "작업 중 설비가동으로 오일 역류 위험", currentRisk: "중", measure: "LOTOTO 실시", checked: false },
        { id: 3, task: "오일 주입", hazard: "바닥에 떨어진 오일로 전도 위험", currentRisk: "하", measure: "바닥 청소 실시", checked: false }
      ]
    },
  
    "EVAL-005": {
      date: "2025-10-29",
      team: "자체",
      teamName: "자체",
      workName: "현장 위험성평가(JSA)",
      teamMember: { name: "양재훈", image: "/images/signature-1.png" },
      safetyChecks: { "first_worker_no": true, "first_equipment_no": true, "sign_date": "2025-10-29" },
      riskRows: [
        { id: 1, task: "작업공간 확인 후 5S", hazard: "분진에 의한 호흡기 질환", currentRisk: "하", measure: "방진마스크 착용", checked: true },
        { id: 2, task: "작업공간 확인 후 5S", hazard: "분진에 의한 피부 질환", currentRisk: "하", measure: "긴 팔 및 방진복 착용", checked: true },
        { id: 3, task: "작업공간 확인 후 5S", hazard: "연속작업에 의한 근골격계 질환", currentRisk: "하", measure: "작업간 충분한 휴식 부여", checked: true }
      ]
    },
  
    
    "TBM-001": {
      workplace: "당진슬래그공장",
      date: "2025-10-27",
      time: "13:00",
      companyName: "에스피에스앤에이",
      processName: "SP생산",
      manager: "이효성",
      attendeeRows: [
        { id: 1, name: "이효성", health: "양호", isNew: false, signature: { name: "이효성", image: "/images/signature-4.png" } },
        { id: 2, name: "이경규", health: "양호", isNew: false, signature: { name: "이경규", image: "/images/signature-5.png" } }
      ],
      riskRows: [
        { id: 1, hazard: "작업중 설비 가동 위험", currentRisk: "중", measure: "LOTOTO 실시", checked: true },
        { id: 2, hazard: "조도불량에 따른 시야확보 불가", currentRisk: "하", measure: "내부 조명 설치", checked: true },
        { id: 3, hazard: "분진에 의한 호흡기 질환", currentRisk: "하", measure: "방진마스크 착용", checked: true },
        { id: 4, hazard: "중량물에 의한 근골격계 질환", currentRisk: "중", measure: "2인 1조 작업", checked: true },
        { id: 5, hazard: "함마드릴 사용에 의한 타박상 위험", currentRisk: "하", measure: "올바른 자세로 안전하게 작업", checked: true }
      ],
      proposalRows: [],
      nearMissRows: []
    },
  
    "TBM-002": {
      workplace: "당진슬래그공장",
      date: "2025-10-27",
      time: "10:00",
      companyName: "에스피에스앤에이",
      processName: "SP생산",
      manager: "이효성",
      attendeeRows: [
        { id: 1, name: "이효성", health: "양호", isNew: false, signature: { name: "이효성", image: "/images/signature-4.png" } },
        { id: 2, name: "이경규", health: "양호", isNew: false, signature: { name: "이경규", image: "/images/signature-5.png" } }
      ],
      riskRows: [
        { id: 1, hazard: "설비 가동에 의한 끼임 및 협착 위험", currentRisk: "중", measure: "LOTOTO 실시 및 2인 1조 작업 실시", checked: true },
        { id: 2, hazard: "안전보호구 미착용으로 인한 사고위험", currentRisk: "중", measure: "방진마스크,보안경 그 외 방진 목적 보호구 착용", checked: true },
        { id: 3, hazard: "공구 사용간 타박상 위험", currentRisk: "하", measure: "공구 사용법 숙지 및 규격에 맞는 공구 사용", checked: true },
        { id: 4, hazard: "오일 급유시 인화성 물질로 인한 화재 위험", currentRisk: "중", measure: "오일 누출 방지 및 주변 인화성 물질 이격", checked: true },
        { id: 5, hazard: "하부 오일에 의한 미끄러짐", currentRisk: "하", measure: "작업 전/후 바닥 청결 상태 유지", checked: true }
      ],
      proposalRows: [],
      nearMissRows: []
    },
  
    "TBM-003": {
      workplace: "당진슬래그공장",
      date: "2025-10-28",
      time: "08:00",
      companyName: "당진Slag 공장",
      processName: "SP생산",
      manager: "최승휴",
      attendeeRows: [
        { id: 1, name: "최승휴", health: "양호", isNew: false, signature: { name: "최승휴", image: "/images/signature-2.png" } },
        { id: 2, name: "윤영광", health: " ", isNew: false, signature: { name: "윤영광", image: "/images/signature-3.png" } },
        { id: 3, name: "양재훈", health: "양호", isNew: false, signature: { name: "양재훈", image: "/images/signature-1.png" } }
      ],
      riskRows: [
        { id: 1, hazard: "어큐뮬레이터 교체중 펌프 가동사고", currentRisk: "중", measure: "작업전 전원차단, Lototo 실시", checked: true },
        { id: 2, hazard: "유압호스 분해중 고압에 의한 사고", currentRisk: "중", measure: "작업전 유압 '0' Bar 확인후 작업", checked: true },
        { id: 3, hazard: "유압라인 분해중 고온에 화상위험", currentRisk: "하", measure: "분해전 유압유 온도 확인", checked: true },
        { id: 4, hazard: "질소가스충전 상태분해중 사고", currentRisk: "중", measure: "어큐뮬레이터 분해전 내부 질소가스 방출 '0' Bar", checked: true },
        { id: 5, hazard: "고소 작업으로 인한 추락위험", currentRisk: "중", measure: "안전벨트 착용, 추락주의", checked: true }
      ],
      proposalRows: [],
      nearMissRows: []
    },
  
    "TBM-004": {
      workplace: "당진슬래그공장",
      date: "2025-10-29",
      time: "13:00",
      companyName: "에스피에스앤에이",
      processName: "SP생산",
      manager: "양재훈",
      attendeeRows: [
        { id: 1, name: "양강현", health: "양호", isNew: false, signature: { name: "양강현", image: "/images/signature-1.png" } },
        { id: 2, name: "안재훈", health: "양호", isNew: false, signature: { name: "안재훈", image: "/images/signature-5.png" } }
      ],
      riskRows: [
        { id: 1, hazard: "중량물 운반시 허리 다침 위험", currentRisk: "하", measure: "핸들 자키 사용하며 부상방지", checked: true },
        { id: 2, hazard: "중량물 넘어짐 위험", currentRisk: "하", measure: "고임목 설치", checked: true },
        { id: 3, hazard: "누유로 인한 전도 위험", currentRisk: "하", measure: "누유 발생시 보루로 닦음", checked: true }
      ],
      proposalRows: [],
      nearMissRows: []
    }
  
  }