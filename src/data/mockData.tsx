import { DataRow } from "@/components/common/tables/DataTable"

// 랜덤 현장사진 생성 (3~6장)
const getRandomPhotos = (seed: number): string[] => {
  const photoCount = 3 + (seed % 4) // 3~6장
  const allPhotos = Array.from({ length: 11 }, (_, i) => `/images/photo${i + 1}.jpg`)
  const shuffled = [...allPhotos].sort(() => 0.5 - Math.sin(seed * 9999))
  return shuffled.slice(0, photoCount)
}

export const checklistTemplateMockData: { id: number; name: string; items: string[] }[] = [
  { id: 1, name: "밀폐공간 작업", items: [
    "질식위험공간에 출입전 산소 및 유해가스 농도를 측정한다. (적정공기:산소 18%~23.5%, 탄산가스 1.5% 미만, 일산화탄소 30ppm 미만, 황화수소 10ppm 미만)",
    "적정공기 상태가 유지되도록 작업전·작업중 지속적으로 환기한다.",
    "구조작업 시 공기호흡기 등 보호 장비를 착용할 수 있도록 작업장 주변에 비치하였다.",
    "근로자가 수행하는 밀폐공간작업이 존재한다.",
    "밀폐공간 유해가스, 산소결핍, 화재·폭발 위험 등에 대하여 사전 조사하였다.",
    "밀폐공간 보건작업 프로그램을 수립하여 시행하였다.",
    "작업 시작하는 경우 사전에 산소 및 유해가스농도 측정에 관한 사항, 응급조치요령, 환기설비 가동 등 안전작업방법, 보호구사용 등에 대한 사항을 작업 근로자에게 교육 등을 통해 알리고 있다.",
    "산소농도, 유해가스측정기, 환기팬, 공기호흡기와 송기마스크 등 호흡용 보호구, 안전대, 구명밧줄, 안전장비 등 사전에 필요한 장비준비/점검/사용법 숙지를 하였다.",
    "긴급 상황 대비 무전기 등 통신장비를 구비하여 연락체계를 갖추었다.",
    "감시인은 작업자가 내부에 있을 때는 항상 정위치하며, 필요한 보호 장비와 구조장비를 갖추고 있다.",
    "관계근로자가 아닌 사람의 출입을 금지하고, 그 내용을 보기 쉬운 장소에 게시하였다.",
    "밀폐공간 작업장소에 근로자를 입장 및 퇴장시킬 때마다 인원을 점검하였다.",
    "작업을 위해 허가자에게 밀폐공간작업 허가를 받고 있다.",
    "관리감독자가 밀폐공간 안전보건조치 사항을 지휘, 점검 등의 업무를 하고 있다."
  ]},
  { id: 2, name: "소방시설 외관점검표", items: [
    "잘 보이는 위치에 소화기 설치여부",
    "보행거리 적정 설치여부",
    "소화기 용기 변형/손상/부식 여부",
    "안전핀 고정 여부",
    "가압식 소화기(폐기 대상, 압력계 미부착 분말 소화기)비치 여부",
    "소화 약제 용기 지시압력치 적정여부",
    "수신부의 설치장소 및 음량장치의 음량 적정여부",
    "감지기 작동여부 및 설치위치의 적정여부",
    "소화약제 방출 시 장애물 존재여부",
    "가스차단밸브 변형/손상/부식 여부"
  ]},
  { id: 3, name: "공용공간 점검표", items: [
    "유리의 금감/깨짐",
    "교실 바닥의 안전상태(바닥균열/마감재 탈락 및 노후화, 보행 장애물 여부)",
    "벽체 안전상태(균열 및 기울임 여부)",
    "벽체 부착물의 안전상태(칠판, 게시판, 선풍기 등의 고정상태)",
    "콘센트의 안전상태(먼지/탄 자국, 고정 불량, 문어발식 사용여부)",
    "출입문 안전상태(레일, 손 끼임 방지, 부착물 등 상태)",
    "창호 안전상태(유리, 추락방지 보호시설의 고정상태)",
    "창호 개폐상태(레일, 창틀의 손상여부)",
    "천장의 마감재 안전상태(처짐, 파손, 누수흔적 등 상태)",
    "천장 부착물 안전상태(전등, 선풍기, 냉난방설비, 빔 프로젝트 고정 상태)",
    "복도바닥의 안전상태(피난관련시설 등 상태 여부)",
    "책걸상 관리상태(파손, 동작 등 상태여부)"
  ]},
  { id: 4, name: "통학로/통학버스 점검표", items: [
    "교내 차량 통행로 및 통학로 안전상태(인도와 차도 구분, 도로파손, 보행 장애물 상태)",
    "학교 앞 통학로/도로 안전상태(보행 장애물, 도로/보도블록/과속방지턱 상태)",
    "학교 앞 교통시설물 안전상태(교통표지판 시야확보, 볼록거울, 안전 휀스 상태)",
    "어린이통학버스 등록차량 여부 및 차량 앞 유리에 통학버스 신고필증 부착 상태",
    "차내 모든 좌석의 안전벨트 또는 안전시트의 설치 및 정상 작동 상태",
    "광각 후사경 설치유무(의무사항) 및 고정상태",
    "차량 내 날카로운 곳 또는 불필요한 물건의 존치 상태",
    "정기적 차량 안전점검 실시 및 기록상태, 안전수칙 부착여부, 안전교육 실시여부"
  ]},
  { id: 5, name: "외부공간 점검표", items: [
    "운동장 안전 상태(패임, 장애물, 트랙 주변 단 차이 메꾸기)",
    "운동장 배수로 안전상태(파손, 패임, 퇴적물의 청소상태)",
    "옹벽, 석축, 담장의 안전 상태(균열, 처짐, 기울어짐, 침하 등)",
    "교문 안전상태(돌붙임 균열, 탈락, 용접부 상태이상 등)",
    "포장 안전상태(침하, 균열, 파손 여부 등)",
    "CCTV안전상태(파손, 고정, 작동상태)",
    "맨홀 뚜껑 탈락, 파손여부",
    "울타리, 의자, 가로등, 표지판, 식수대 상태"
  ]},
  { id: 6, name: "공통필수확인(작업전)", items: [
    "[TBM] 작업 전 위험요인 및 대책 공유가 완료되었는가?",
    "[TBM] 작업자 전원의 건강 상태(음주, 피로 등)를 확인했는가?",
    "[필수 보호구 착용] 안전모, 안전화, 보안경 착용 완료여부",
    "[필수 보호구 착용] 방진마스크 (분진 발생 구역 등급 확인) 및 귀마개 착용여부",
    "[작업허가서 승인] 화기 / 밀폐공간 / 고소 / 중장비 작업 허가 승인을 득하였는가?",
    "[LOTOTO 관리] 정비 대상 설비의 동력(전기) 차단 및 잠금 장치를 체결했는가?",
    "[LOTOTO 관리] 조작 금지 표지판(Tag)을 부착했는가?",
    "[2인1조 원칙] 단독 작업을 금지하고, 감시인 또는 동료 작업자가 배치되었는가?"
  ]},
  { id: 7, name: "설비 정비 및 기계 안전", items: [
    "[잔압 제거] 유압/공압 라인 분해 전, 압력 게이지가 \"0\" Bar임을 확인했는가?",
    "[잔압 제거] 어큐뮬레이터(축압기) 내부 압력을 완전히 제거했는가?",
    "[고압 가스 취급] 고압 가스 충전용 호스 및 레귤레이터 상태는 양호한가?",
    "[고압 가스 취급] 가스 용기는 전도되지 않도록 체인 등으로 고정되어 있는가?",
    "[협착 및 끼임 방지] 시운전 시 회전체 반경 내 접근 금지 조치가 되어 있는가?",
    "[협착 및 끼임 방지] 정비 중 불시 가동을 방지할 물리적 조치가 확실한가?",
    "[화상 및 누유 방지] 고온의 오일/설비 접촉 방지를 위해 충분히 냉각되었는가?",
    "[화상 및 누유 방지] 오일 드레인(Drain) 시 바닥 오염 및 미끄럼 방지(흡착포) 조치를 했는가?"
  ]},
  { id: 8, name: "화재, 폭발", items: [
    "발생하는 화염 또는 스파크 등이 인근 공정설비에 영향이 있다고 판단되는 범위의 지역을 작업구역으로 표시하는가?",
    "화기·용접작업 장소에 근로자의 통행·출입을 제한하는가?",
    "화기작업 전에 작업 대상기기 및 작업구역 내에서 인화성 물질 및 독성 물질의 가스 농도를 측정하여 허가서에 기록하는가?",
    "불꽃을 발생하는 내연설비의 장비나 차량 등은 작업구역 내 근로자의 출입을 통제하는가?",
    "화기작업을 수행하기 위하여 밸브를 차단하거나 맹판을 설치할 때에는 차단하는 밸브에 밸브 잠금 표지 및 맹판 설치 표지를 부착하는가?",
    "화학설비 등의 내부에서 화기작업을 수행할 경우에는 배관 및 설비 내의 위험물질을 완전히 비우고 세정한 후에 작업을 수행하는가?",
    "밀폐(제한)공간에서의 작업을 수행할 때에는 작업 전에 밀폐공간 내의 공기를 외부의 신선한 공기로 충분히 치환하는 등의 조치(강제 환기 등)를 실시하는가?",
    "용접불티 비산방지 덮개 또는 용접 방화포 등 불꽃 비산 방지조치를 하고 개방된 맨홀과 하수구(Sewer) 등은 덮거나 닫는가?",
    "화재감시자를 지정하여 화기작업을 시작하기 전과 작업 도중 안전 상태를 확인하는가?",
    "화기작업 중에 수시로 가스 농도를 측정하는가? (분진이 있는 장소는 분진농도를 추가로 측정)",
    "화기작업 전에 이동식 소화기 등을 비치하는가?",
    "화학물질을 화기나 그 밖에 점화원이 될 우려가 있는 것에 접근, 가열, 마찰시키는 등의 행위를 하지 않는가?",
    "인화성물질을 취급하는 구역은 폭발위험장소로 구분하고 적정한 방폭설비가 설치되어 있는가?",
    "인화성액체의 증기, 가스에 의한 화재 폭발을 감지하기 위한 가스 검지 및 경보장치가 설치되어 있는가?",
    "가스경보기가 작동할 경우 조치사항을 근로자에게 교육하고 있는가?",
    "배관 연결부, 밸브 등의 연결부에서 화학물질의 누출 여부를 정기적으로 점검하는가?"
  ]},
  { id: 9, name: "정비 등 작업 시 운전정지", items: [
    "현장에서 사용하는 위험기계에 적합한 방호장치를 설치하고 있으며, 안전인증·안전검사 대상인 경우 관련 인증·검사를 받고 사용하고 있는가?",
    "안전인증·안전검사를 받을 당시의 방호조치 등의 기능이 잘 유지되고 있는가?",
    "기계·기구 또는 설비에 설치한 방호장치를 임의 해체하거나 기능을 해제한 상태로 사용하지 않도록 관리하고 있는가?",
    "끼임 위험이 있는 원동기, 회전축, 기어 및 체인 등에 대하여 방지조치(덮개, 울 등 설치)를 적정하게 하고 있는가?",
    "동력으로 작동되는 기계에 스위치, 클러치, 벨트이동장치 등 동력 차단장치를 설치하고 있는가?",
    "사용 중인 기계·기구 또는 설비에 대한 정비 등 작업 시 운전정지 등의 조치절차를 수립 및 이행하고 있는가?",
    "기계·기구 또는 설비 사용 중 고장 등 이상 발생 시 운전정지 등의 조치 절차를 이행하고 있는가?",
    "후진경보기와 경광등을 갖춘 지게차를 자격 보유자가 조종하는가?",
    "근로자는 개인보호구(안전대, 안전모, 안전화)를 올바르게 착용하고 있는가?"
  ]},
  { id: 10, name: "전기작업", items: [
    "작업 전로 차단, 잠금장치 및 꼬리표(LOTO) 부착하고 검전기를 이용하여 충전여부를 확인하는가?",
    "전기기구 취급작업 시 전기설비로부터 폭 70cm 이상의 작업공간을 확보하고 있는가?",
    "전기기계·기구 및 설비의 전원 접속부인 충전부가 노출되어 있지 않은가?",
    "전기기계·기구 및 설비의 금속재, 철재 등의 외함에 접지시설이 되어있는가?",
    "전기기기 외함에 접지된 접지선이 접지극과 직접 연결되어 있는가? (접지 연속성 유무)",
    "누전여부 체크를 위해 주기적으로 절연저항을 측정하고 기록하는가?",
    "주기적으로 접지저항을 측정하고, 접지 저항값이 기준에 적합한가?",
    "용접선, 배선, 이동전선 등 절연전선의 피복이 손상되어 있지 않은가?",
    "정전작업 중 타 작업자의 개폐기 오조작 방지를 위하여 분전반 또는 개폐기에 잠금장치나 표지판을 설치하는가?",
    "변전실 등 특별고압 충전전로에 접근한계거리 표지판이 부착되어 있는가?",
    "근접장소에서의 청소 등의 작업 시 접근한계거리를 유지하여 작업하도록 관리하는가?",
    "물 등의 도전성이 높은 액체가 있는 습윤한 장소에서의 이동전선 등은 충분한 절연효과가 있는가?",
    "정전기에 의한 화재, 폭발 등의 위험이 있는 경우 해당 설비에 대하여 확실한 방법으로 접지, 도전성 재료 사용, 제전장치 등 정전기 제거 조치를 하는가?",
    "전기기계·기구 또는 전로의 설치·해체·정비·점검 등의 전기작업(50V초과 또는 전기에너지가 250VA를 넘는 경우)시 작업계획서를 작성하고 그 계획에 따라 작업하는가?",
    "충전전로 등의 전기 작업을 할 때에는 절연용 보호구, 절연용 방호구 등을 근로자에게 지급·착용토록 하는가?"
  ]},
  { id: 11, name: "일반사항(공통)", items: [
    "작업에 적합한 보호구 지급·착용 여부",
    "작업자 안전보건교육 실시여부 (위험요인, 안전작업방법, 작업 특기사항)",
    "작업별 안전수칙 준수여부 (위험요인 확인·제거, 절차 준수, 안전시설 설치 등)",
    "안전보건표지 부착(위험장소, 설비 등) 여부",
    "위험물질 사용 및 보관 등 관리상태 적정 여부 (가스, 가연성·발화성 물질, 위험보관소 등)",
    "가설 전기설비 설치 및 관리상태 적정 여부 (임시분전반, 케이블 등)",
    "개구부 및 고소작업 등 추락방지 조치 여부 (작업비계, 생명줄, 안전난간, 방호망 등 설치)",
    "화재예방 조치상태 (소화기 비치, 불꽃방지커버 및 방염포 설치 등)",
    "건설기계 작업 안전수칙 준수여부 (사전점검, 전도방지 조치, 신호수 배치 등)",
    "작업장 안전통로 설치 및 동선 확보 상태 (가설계단, 가설통로 등)",
    "사다리 작업 시 안전 수칙 준수 여부 (아웃트리거 설치, 2인1조 작업 등)",
    "작업장 소음 및 조도의 적정 상태",
    "작업현장 정리정돈 상태",
    "긴급 상황 대비 비상연락망 관리 상태"
  ]}
]

export const inspectionPlanMockData: DataRow[] = [
  { id: 11, planName: "슬래그 밀 메인 베어링 오일 분석 및 윤활 상태 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "오영수", schedule: "2026-01-15 ~ 2026-01-17", registrant: "홍길동", progress: "미점검" },
  { id: 10, planName: "슬래그 밀 LOTO 시스템 정기 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "이안전", schedule: "2026-01-10 ~ 2026-01-11", registrant: "김민수", progress: "미점검" },
  { id: 9, planName: "인렛 슈트 코팅 제거 작업허가서(PTW) 확인", site: "Slag Mill 실", area: "자산(설비)", kind: "수시점검", inspector: "김현장", schedule: "2026-01-05 ~ 2026-01-05", registrant: "박현우", progress: "진행중" },
  { id: 8, planName: "마스터 롤러 어큐뮬레이터 교체 안전 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "최정비", schedule: "2025-12-28 ~ 2025-12-29", registrant: "이정아", progress: "완료" },
  { id: 7, planName: "HSLM 오일 보충 작업 위험성평가 확인", site: "Slag Mill 실", area: "자산(설비)", kind: "수시점검", inspector: "박관리", schedule: "2026-01-08 ~ 2026-01-08", registrant: "최준영", progress: "미점검" },
  { id: 6, planName: "협소/고소 작업 안전 수칙 준수 점검 (밀 실 주변)", site: "(주)에스피에스앤아이 당진 슬래그공장", area: "시설물", kind: "특별점검", inspector: "정안전", schedule: "2026-01-12 ~ 2026-01-12", registrant: "김철수", progress: "미점검" },
  { id: 5, planName: "유압 라인 고압/고온 작업 위험 분석 검토", site: "Slag Mill 실", area: "자산(설비)", kind: "수시점검", inspector: "오감독", schedule: "2026-01-06 ~ 2026-01-06", registrant: "이민지", progress: "진행중" },
  { id: 4, planName: "소형밀 내부 점검 및 오일 주입 안전 확인", site: "소형밀 실", area: "자산(설비)", kind: "특별점검", inspector: "문반장", schedule: "2025-12-30 ~ 2025-12-30", registrant: "박서준", progress: "미점검" },
  { id: 3, planName: "분진 발생 작업 호흡기 보호구 착용 점검", site: "(주)에스피에스앤아이 당진 슬래그공장", area: "시설물", kind: "수시점검", inspector: "배소장", schedule: "2025-12-20 ~ 2025-12-20", registrant: "정희원", progress: "완료" },
  { id: 2, planName: "중량물 운반 2인 1조 및 보조도구 준수 점검", site: "소형밀 실", area: "자산(설비)", kind: "특별점검", inspector: "장감독", schedule: "2025-12-18 ~ 2025-12-19", registrant: "김은정", progress: "완료" },
  { id: 1, planName: "컨베이어 벨트 교체 LOTOTO 실시 점검", site: "Slag Mill 실", area: "자산(설비)", kind: "특별점검", inspector: "윤영광", schedule: "2025-12-15 ~ 2025-12-16", registrant: "최정수", progress: "완료" }
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
  { id: 1, tbm: "밀폐공간 진입 안전수칙 및 감시인 역할 교육", date: "2025-12-10(화)", start: "08:30", end: "09:00", leader: "이호성", sitePhotos: getRandomPhotos(51), eduDate: "2025-12-10(화)", eduTime: "08:30 ~ 09:00 (30분)", attachments: true, attendees: [{ name: "김철수", phone: "010-1234-5678", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-10 08:32" }, { name: "이영희", phone: "010-2345-6789", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-10 08:33" }, { name: "박민수", phone: "010-3456-7890", signed: false }, { name: "최정아", phone: "010-4567-8901", signed: true, signature: "/images/signature-3.png", signedAt: "2025-12-10 08:36" }, { name: "정대현", phone: "010-5678-9012", signed: false }] },
  { id: 2, tbm: "LOTOTO 실시 절차 및 에너지 차단 확인 교육", date: "2025-12-01(월)", start: "07:30", end: "08:00", leader: "김민수", sitePhotos: getRandomPhotos(52), eduDate: "2025-12-01(월)", eduTime: "07:30 ~ 08:00 (30분)", attachments: false, attendees: [{ name: "홍길동", phone: "010-1111-2222", signed: true, signature: "/images/signature-4.png", signedAt: "2025-12-01 07:32" }, { name: "김안전", phone: "010-2222-3333", signed: true, signature: "/images/signature-5.png", signedAt: "2025-12-01 07:34" }, { name: "이현장", phone: "010-3333-4444", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-01 07:35" }, { name: "박감독", phone: "010-4444-5555", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-01 07:37" }, { name: "최관리", phone: "010-5555-6666", signed: true, signature: "/images/signature-3.png", signedAt: "2025-12-01 07:38" }] },
  { id: 3, tbm: "유압/고압 설비 작업 전 잔압 해제 교육", date: "2025-12-12(금)", start: "14:00", end: "14:30", leader: "이정아", sitePhotos: getRandomPhotos(53), eduDate: "2025-12-12(금)", eduTime: "14:00 ~ 14:30 (30분)", attachments: true, attendees: [{ name: "정비원", phone: "010-6666-7777", signed: true, signature: "/images/signature-4.png", signedAt: "2025-12-12 14:05" }, { name: "김설비", phone: "010-7777-8888", signed: true, signature: "/images/signature-5.png", signedAt: "2025-12-12 14:07" }, { name: "이기술", phone: "010-8888-9999", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-12 14:08" }] },
  { id: 4, tbm: "소형밀 청소 작업 분진 발생 및 호흡기 보호 교육", date: "2025-12-13(토)", start: "08:40", end: "09:10", leader: "문반장", sitePhotos: getRandomPhotos(54), eduDate: "2025-12-13(토)", eduTime: "08:40 ~ 09:10 (30분)", attachments: false, attendees: [{ name: "김청소", phone: "010-1234-1234", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-13 08:42" }, { name: "이작업", phone: "010-2345-2345", signed: true, signature: "/images/signature-3.png", signedAt: "2025-12-13 08:44" }, { name: "박분진", phone: "010-3456-3456", signed: false }] },
  { id: 5, tbm: "중량물 운반 시 2인 1조 및 보조도구 사용 교육", date: "2025-12-04(목)", start: "08:00", end: "08:30", leader: "장감독", sitePhotos: getRandomPhotos(55), eduDate: "2025-12-04(목)", eduTime: "08:00 ~ 08:30 (30분)", attachments: true, attendees: [{ name: "김운반", phone: "010-4567-4567", signed: true, signature: "/images/signature-4.png", signedAt: "2025-12-04 08:03" }, { name: "이중량", phone: "010-5678-5678", signed: true, signature: "/images/signature-5.png", signedAt: "2025-12-04 08:05" }, { name: "박조장", phone: "010-6789-6789", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-04 08:06" }, { name: "최안전", phone: "010-7890-7890", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-04 08:08" }] },
  { id: 6, tbm: "어큐뮬레이터 교체 고소 및 낙하물 방지 교육", date: "2025-12-17(화)", start: "13:00", end: "13:30", leader: "최정비", sitePhotos: getRandomPhotos(56), eduDate: "2025-12-17(화)", eduTime: "13:00 ~ 13:30 (30분)", attachments: false, attendees: [{ name: "김고소", phone: "010-8901-8901", signed: true, signature: "/images/signature-3.png", signedAt: "2025-12-17 13:02" }, { name: "이정비", phone: "010-9012-9012", signed: false }, { name: "박교체", phone: "010-0123-0123", signed: true, signature: "/images/signature-4.png", signedAt: "2025-12-17 13:05" }, { name: "최낙하", phone: "010-1234-0000", signed: false }, { name: "정방지", phone: "010-2345-0000", signed: true, signature: "/images/signature-5.png", signedAt: "2025-12-17 13:08" }] },
  { id: 7, tbm: "화기 작업 전 소화기 비치 및 주변 인화물 제거 교육", date: "2025-12-01(월)", start: "15:30", end: "16:00", leader: "김철수", sitePhotos: getRandomPhotos(57), eduDate: "2025-12-01(월)", eduTime: "15:30 ~ 16:00 (30분)", attachments: true, attendees: [{ name: "김화기", phone: "010-3456-0000", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-01 15:32" }, { name: "이소방", phone: "010-4567-0000", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-01 15:34" }, { name: "박안전", phone: "010-5678-0000", signed: true, signature: "/images/signature-3.png", signedAt: "2025-12-01 15:35" }, { name: "최인화", phone: "010-6789-0000", signed: true, signature: "/images/signature-4.png", signedAt: "2025-12-01 15:37" }] },
  { id: 8, tbm: "전기 설비 작업 전원 차단 및 절연 도구 사용 교육", date: "2025-12-03(수)", start: "10:00", end: "10:30", leader: "김민수", sitePhotos: getRandomPhotos(58), eduDate: "2025-12-03(수)", eduTime: "10:00 ~ 10:30 (30분)", attachments: false, attendees: [{ name: "김전기", phone: "010-7890-0000", signed: true, signature: "/images/signature-5.png", signedAt: "2025-12-03 10:02" }, { name: "이설비", phone: "010-8901-0000", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-03 10:04" }, { name: "박절연", phone: "010-9012-0000", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-03 10:05" }] },
  { id: 9, tbm: "유압 라인 고온 작업 시 화상 예방 및 PPE 교육", date: "2025-12-11(목)", start: "09:30", end: "10:00", leader: "오감독", sitePhotos: getRandomPhotos(59), eduDate: "2025-12-11(목)", eduTime: "09:30 ~ 10:00 (30분)", attachments: true, attendees: [{ name: "김유압", phone: "010-0123-1111", signed: true, signature: "/images/signature-3.png", signedAt: "2025-12-11 09:33" }, { name: "이고온", phone: "010-1234-2222", signed: false }, { name: "박화상", phone: "010-2345-3333", signed: true, signature: "/images/signature-4.png", signedAt: "2025-12-11 09:36" }] },
  { id: 10, tbm: "비상 상황 발생 시 대피 경로 및 비상 연락 체계 교육", date: "2025-12-19(금)", start: "08:00", end: "08:15", leader: "정안전", sitePhotos: getRandomPhotos(60), eduDate: "2025-12-19(금)", eduTime: "08:00 ~ 08:15 (15분)", attachments: false, attendees: [{ name: "김비상", phone: "010-3456-4444", signed: true, signature: "/images/signature-5.png", signedAt: "2025-12-19 08:02" }, { name: "이대피", phone: "010-4567-5555", signed: false }, { name: "박연락", phone: "010-5678-6666", signed: true, signature: "/images/signature-1.png", signedAt: "2025-12-19 08:04" }, { name: "최경로", phone: "010-6789-7777", signed: false }, { name: "정체계", phone: "010-7890-8888", signed: true, signature: "/images/signature-2.png", signedAt: "2025-12-19 08:06" }, { name: "강안전", phone: "010-8901-9999", signed: false }] }
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

// Routine Checklist Items (안전순회 점검항목)
export const routineChecklistItemsMockData = [
  { category: "보호구", items: [
    "작업에 적합한 보호구 준비 및 착용 여부",
    "안전검사에 합격한 보호구 지급 및 성능 여부",
    "작업관련 장비 점검여부"
  ]},
  { category: "관리", items: [
    "안전작업 연장 승인 여부 (일정, 야간작업)",
    "안전교육 미필자 작업투입 여부",
    "미승인 화학물질 사용 여부",
    "사고 발생 시 대처요령 숙지 여부",
    "안전작업계획서 존재 및 준수 여부",
    "작업에 적합한 인원배치 및 자격조건 확인",
    "위험물/고압가스용기 전도방지장치 및 점검",
    "위험 및 제한구역 임의 출입 여부",
    "위험기계기구 사용 허가 여부"
  ]},
  { category: "전기", items: [
    "전원 Cable의 손상 및 절연상태",
    "콘센트, 기계기구의 접지 상태",
    "절연공구 사용 및 감전예방조치 상태",
    "과부하상태로 용접기 등 전기제품 사용 여부",
    "임시배선작업에 의한 전기작업 여부",
    "미사용 기계기구/장비 전원차단 여부",
    "작업에 적합한 계측기 준비 및 사용 여부",
    "전기 계측기의 안전보건공단 등급 만족 여부"
  ]},
  { category: "추락", items: [
    "고소작업(1.8M)에서의 안전대, 안전모 착용",
    "이동식 사다리의 기능 상태",
    "고소작업장비에 대한 안전점검 실시 여부"
  ]},
  { category: "화재예방", items: [
    "소화기 비치 및 사용가능 여부",
    "불티비산 방지조치 및 화재감시자 배치 여부",
    "작업 중 흡연 또는 금연장소에서의 흡연 여부",
    "기름걸레 방치 등 자연발화 예방조치 여부",
    "인화성물질 관리 상태"
  ]},
  { category: "LOTOTO", items: [
    "잔류 에너지(공기, 전기, 유압 등) 제거 여부",
    "LOTOTO 설치 여부"
  ]},
  { category: "MSDS", items: [
    "MSDS 자료집 게시 상태",
    "MSDS 경고 표지 부착 상태"
  ]},
  { category: "질식", items: [
    "밀폐공간 존재 및 산소농도 관리 상태"
  ]},
  { category: "운반", items: [
    "지게차 등의 운전자격 여부",
    "운전장비의 안전장치 부착 및 기능 여부",
    "과적 여부 및 적재방법의 적합성 여부",
    "사내교통안전 (주차, 일방통행) 준수 여부"
  ]},
  { category: "정리정돈", items: [
    "공구, 전선, 자재 등의 정리정돈 상태",
    "비상통로, 소방통로 등의 확보 여부",
    "창고, 야적장 정리정돈 상태",
    "낙하 위험 구역에서의 낙하물 방지조치 상태"
  ]},
  { category: "기타", items: [
    "2인 이상 작업 시 커뮤니케이션 장비 존재",
    "기타 안전보건에 위반되는 행위 및 상태"
  ]}
]