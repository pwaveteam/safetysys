import { DataRow } from "@/components/common/tables/DataTable"

export const reportManagementMockData: DataRow[] = [
  {
    id: 1,
    documentType: { text: "TBM", color: "blue" },
    documentCategory: "-",
    registrant: "이호성",
    createdAt: "2025-12-10",
    detailData: {
      location: "Slag Mill 실",
      date: "2025-12-10",
      timeRange: "08:30 ~ 09:00",
      tbmName: "밀폐공간 진입 안전수칙 및 감시인 역할 교육",
      processes: ["밀폐공간 작업 위험성평가", "분진 작업 위험성평가"],
      supervisor: "이호성",
      content: "인렛슈트 내부 코팅 제거 작업 전 안전교육 실시\n- 밀폐공간 진입 절차 확인\n- 분진 마스크 착용 확인\n- 감시인 배치 확인",
      remark: "작업 완료 후 환기 필수",
      sitePhotos: ["/images/photo1.jpg", "/images/photo2.jpg", "/images/photo3.jpg"],
      files: ["TBM_체크리스트.pdf"],
      participants: [
        { name: "이호성", contact: "010-1234-5678" },
        { name: "김민수", contact: "010-2345-6789" },
        { name: "박철수", contact: "010-3456-7890" },
        { name: "최정비", contact: "010-4567-8901" }
      ]
    }
  },
  {
    id: 2,
    documentType: { text: "안전보건교육", color: "green" },
    documentCategory: "근로자 교육",
    registrant: "김안전",
    createdAt: "2025-12-08",
    detailData: {
      category: "근로자 교육",
      course: "작업내용 변경 시 교육",
      eduName: "밀폐공간 작업 특별 안전 교육",
      startDate: "2025-12-08",
      endDate: "2025-12-08",
      educationTime: "14:00 ~ 16:00",
      educationMethod: "자체교육",
      assigner: "김안전",
      trainer: "",
      linkedRiskAssessment: "밀폐공간 작업 위험성평가",
      eduMaterial: ["밀폐공간_안전지침.pdf"],
      fileUpload: [],
      note: "인렛슈트 코팅 제거 작업 전 필수 교육",
      sitePhotos: ["/images/photo4.jpg", "/images/photo5.jpg", "/images/photo6.jpg", "/images/photo7.jpg"],
      participants: [
        { name: "홍길동", contact: "010-1111-2222" },
        { name: "김영수", contact: "010-2222-3333" },
        { name: "이정아", contact: "010-3333-4444" },
        { name: "박현우", contact: "010-4444-5555" },
        { name: "최승휴", contact: "010-5555-6666" }
      ]
    }
  },
  {
    id: 3,
    documentType: { text: "점검표", color: "yellow" },
    documentCategory: "특별점검",
    registrant: "윤영광",
    createdAt: "2025-12-02",
    detailData: {
      template: "컨베이어 LOTOTO 최종 점검표",
      workplace: "Slag Mill 실",
      field: "자산(설비)",
      kind: "특별점검",
      inspector: "윤영광",
      inspectedAt: "2025-12-02 10:00",
      confirmed: false,
      notes: "LOTOTO 해제 전 3단계 확인 미흡."
    }
  },
  {
    id: 4,
    documentType: { text: "아차사고", color: "red" },
    documentCategory: "미채택",
    registrant: "최정비",
    createdAt: "2025-12-10",
    detailData: {
      place: "Slag Mill 실 (2층)",
      content: "호이스트 작업 중 인양물이 흔들리며 낙하할 뻔한 상황 발생. 작업자가 아래 통로를 지나가던 중이었으나 다행히 사고로 이어지지 않음.",
      date: "2025-12-10",
      registrant: "최정비",
      result: "미채택",
      reason: "해당 구간 작업 전 통제 계획 이미 수립되어 있음",
      sitePhotos: ["/images/photo8.jpg", "/images/photo9.jpg", "/images/photo10.jpg"]
    }
  },
  {
    id: 5,
    documentType: { text: "안전보이스", color: "purple" },
    documentCategory: "조치",
    registrant: "김근로",
    createdAt: "2025-12-11",
    detailData: {
      content: "유압 장치 점검 맨홀 덮개가 무거워 2인 1조 표시 요청",
      registrant: "김근로",
      date: "2025-12-11",
      status: "조치 완료",
      reason: "중량물 경고 스티커 및 2인 1조 문구 부착 완료",
      sitePhotos: ["/images/photo11.jpg", "/images/photo1.jpg", "/images/photo2.jpg", "/images/photo3.jpg"]
    }
  },
  {
    id: 6,
    documentType: { text: "작업중지요청", color: "orange" },
    documentCategory: "-",
    registrant: "이호성",
    createdAt: "2025-12-08",
    detailData: {
      workType: "밀폐공간 진입",
      workerCount: "2명",
      hazardLevel: "높음",
      workPeriod: "2025-12-10 ~ 2025-12-10",
      registrationDate: "2025-12-08",
      approvalStatus: { text: "완료", color: "blue" },
      attachment: "밀폐_PTW.pdf",
      manage: "인렛 슈트 내부 청소"
    }
  },
  {
    id: 7,
    documentType: { text: "대응매뉴얼", color: "gray" },
    documentCategory: "-",
    registrant: "박대응",
    createdAt: "2025-12-12",
    detailData: {
      title: "밀폐공간 사고 발생 시 비상대응 매뉴얼",
      date: "2025-12-12",
      author: "박대응",
      content: "1. 사고 발생 시 즉시 119 신고\n2. 관리감독자에게 즉시 보고\n3. 2차 피해 방지를 위한 접근 통제\n4. 공기호흡기 착용 후 구조 활동\n5. 의료진 도착 전 응급처치 실시\n6. 사고 상황 기록 및 보존",
      attachments: ["비상대응_매뉴얼_v2.pdf", "응급처치_가이드.pdf"]
    }
  },
  {
    id: 8,
    documentType: { text: "위험성평가", color: "cyan" },
    documentCategory: "빈도·강도법",
    registrant: "이효성",
    createdAt: "2025-01-20",
    detailData: {
      year: 2025,
      title: "슬래그 밀 설비 라이너 교체 위험성 평가",
      type: "정기평가",
      method: "빈도·강도법",
      regulation: "산안법 제37조",
      registered: "2025-01-20",
      modified: "2025-01-22",
      completed: "2025-01-25",
      status: { text: "완료", color: "blue" }
    }
  },
  {
    id: 9,
    documentType: { text: "위험성평가", color: "cyan" },
    documentCategory: "3단계 판단법",
    registrant: "김안전",
    createdAt: "2025-02-01",
    detailData: {
      year: 2025,
      title: "유압라인 분해/조립 특별 위험성 평가",
      type: "수시평가",
      method: "위험성수준 3단계 판단법",
      regulation: "산안법 제37조",
      registered: "2025-02-01",
      modified: "2025-02-03",
      completed: "2025-02-04",
      status: { text: "완료", color: "blue" }
    }
  },
  {
    id: 10,
    documentType: { text: "위험성평가", color: "cyan" },
    documentCategory: "체크리스트법",
    registrant: "최정비",
    createdAt: "2025-02-08",
    detailData: {
      year: 2025,
      title: "인렛 슈트 밀폐공간 진입 최초 평가",
      type: "최초평가",
      method: "체크리스트법",
      regulation: "산안법 제37조",
      registered: "2025-02-08",
      modified: "2025-02-09",
      completed: "2025-02-10",
      status: { text: "완료", color: "blue" }
    }
  },
  {
    id: 11,
    documentType: { text: "위험성평가", color: "cyan" },
    documentCategory: "화학물질 평가법",
    registrant: "박화학",
    createdAt: "2025-03-11",
    detailData: {
      year: 2025,
      title: "고농도 분진 발생 작업 수시 평가",
      type: "수시평가",
      method: "화학물질 평가법",
      regulation: "산안법 제37조",
      registered: "2025-03-11",
      modified: "2025-03-12",
      completed: "2025-03-13",
      status: { text: "완료", color: "blue" }
    }
  },
  {
    id: 12,
    documentType: { text: "위험성평가", color: "cyan" },
    documentCategory: "빈도·강도법",
    registrant: "윤영광",
    createdAt: "2025-05-01",
    detailData: {
      year: 2025,
      title: "위험물 저장소(유압유/솔벤트) 정기 평가",
      type: "정기평가",
      method: "빈도·강도법",
      regulation: "산안법 제37조",
      registered: "2025-05-01",
      modified: "2025-05-03",
      completed: "2025-05-05",
      status: { text: "완료", color: "blue" }
    }
  },
  {
    id: 13,
    documentType: { text: "위험성평가", color: "cyan" },
    documentCategory: "화학물질 평가법",
    registrant: "이호성",
    createdAt: "2025-10-20",
    detailData: {
      year: 2025,
      title: "유해화학물질 취급 공정 위험성 평가 (MEK/Toluene)",
      type: "정기평가",
      method: "화학물질 평가법",
      regulation: "산안법 제37조",
      registered: "2025-10-20",
      modified: "2025-10-21",
      completed: "2025-10-23",
      status: { text: "완료", color: "blue" }
    }
  }
]

export const reportContractorMockData: DataRow[] = [
  {
    id: 1,
    documentType: { text: "안전보건수준 평가", color: "blue" },
    documentCategory: "정기평가",
    registrant: "박평가",
    createdAt: "2025-12-10",
    detailData: {
      company: "대진설비보전",
      evaluationName: "2024년 4분기 협력업체 안전보건수준 정기평가",
      evaluationType: "정기평가",
      contractPeriod: "2024-10-01 ~ 2024-12-31",
      externalEvaluator: "한국안전기술원",
      evaluationFile: "평가지_대진설비보전.pdf",
      fileUpload: ["평가결과서_대진설비보전.pdf"]
    }
  },
  {
    id: 2,
    documentType: { text: "안전보건협의체 회의록", color: "green" },
    documentCategory: "-",
    registrant: "이회의",
    createdAt: "2025-12-09",
    detailData: {
      contractDate: "2025-12-09",
      contractTime: "10:00 ~ 11:30",
      meetingPlace: "본사 대회의실",
      attendeeClient: "홍길동, 김안전",
      attendeeSubcontractor: "최정비, 이하준",
      note: "1. 전월 안전보건활동 실적 보고\n2. 금월 안전보건활동 계획\n3. 위험작업 협의 사항\n4. 기타 안전보건 관련 건의사항\n\n[결정사항]\n- 밀폐공간 작업 시 합동점검 실시\n- 동절기 안전관리 강화\n- 협력업체 특별안전교육 실시",
      contractFile: "회의록_251209.pdf",
      sitePhotos: ["/images/photo4.jpg", "/images/photo5.jpg", "/images/photo6.jpg"]
    }
  },
  {
    id: 3,
    documentType: { text: "협동 안전보건점검", color: "yellow" },
    documentCategory: "정기점검",
    registrant: "최점검",
    createdAt: "2025-12-08",
    detailData: {
      inspectionDate: "2025-12-08",
      inspectionType: "정기점검",
      inspectionName: "12월 정기 협동 안전보건점검",
      inspectionResult: "경미한 지적사항",
      note: "1. 일부 구역 안전통로 장애물 적치 - 즉시 제거 조치\n2. 휴대용 소화기 1대 압력 부족 - 교체 완료",
      inspector: "최점검",
      sitePhotos: ["/images/photo7.jpg", "/images/photo8.jpg", "/images/photo9.jpg", "/images/photo10.jpg"],
      fileUpload: ["점검결과서_251208.pdf"]
    }
  }
]
