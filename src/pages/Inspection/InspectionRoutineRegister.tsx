import React, { useState, useRef } from "react"
import Button from "@/components/common/base/Button"
import { X, Circle, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { routineChecklistItemsMockData } from "@/data/mockData"

interface InspectionRoutineRegisterProps {
  open?: boolean
  onClose?: () => void
  mode: "view" | "edit"
  data?: PatrolData
}

interface PatrolData {
  id: number
  weekStart: string
  location: string
  dailyData: {
    [key: string]: {
      inspector: string
      signature: string
      headcount: number
      items: { [itemId: string]: "O" | "X" | "" }
    }
  }
  notes: string
  managerInstructions: string
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"]

const BORDER_CLASS = "border-[var(--border)]"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_XS = "text-xs"
const CELL_CLASS = `border ${BORDER_CLASS} px-2 py-1.5 ${TEXT_SIZE_XS}`
const HEADER_CELL_CLASS = `${CELL_CLASS} bg-gray-50 font-medium text-center ${TEXT_SECONDARY}`
const CELL_HOVER = "cursor-pointer hover:bg-gray-50"

export default function InspectionRoutineRegister({ open, onClose, mode, data }: InspectionRoutineRegisterProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<{ [day: string]: { [itemId: string]: "O" | "X" | "" } }>({})
  const [inspectors, setInspectors] = useState<{ [day: string]: string }>({})
  const [signatures, setSignatures] = useState<{ [day: string]: string }>({})
  const [headcounts, setHeadcounts] = useState<{ [day: string]: string }>({})
  const [notes, setNotes] = useState("")
  const [managerInstructions, setManagerInstructions] = useState("")
  const [location, setLocation] = useState("사업장 전체")
  const [checkDates, setCheckDates] = useState<{ [day: string]: string }>({})

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "안전순회 점검일지",
  })

  const handleItemClick = (itemId: string, day: string, value: "O" | "X") => {
    if (mode === "view") return
    setFormData(prev => {
      const dayData = prev[day] || {}
      const currentValue = dayData[itemId]
      const newValue = currentValue === value ? "" : value
      return {
        ...prev,
        [day]: { ...dayData, [itemId]: newValue }
      }
    })
  }

  const getItemValue = (day: string, itemId: string): "O" | "X" | "" => {
    return formData[day]?.[itemId] || ""
  }

  if (!open) return null

  const isEditMode = mode === "edit"
  let itemIndex = 0

  const formContent = (
    <div ref={printRef}>
      <div>

            <div className="flex items-center mb-4">
              <div className="flex-1 flex justify-center items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">안전순회 점검일지</h1>
                <span className={`${TEXT_SIZE_XS} px-2 py-0.5 rounded ${isEditMode ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                  {isEditMode ? "작성중" : "완료"}
                </span>
              </div>
              <table className={`border-collapse border ${BORDER_CLASS} shrink-0`}>
                <tbody>
                  <tr>
                    <td rowSpan={2} className={`border ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium text-gray-700 text-center align-middle bg-gray-50 w-8`}>
                      <div className="flex flex-col items-center gap-2.5">
                        <span>결</span>
                        <span>재</span>
                      </div>
                    </td>
                    <td className={`border ${BORDER_CLASS} bg-gray-50 px-3 py-1 ${TEXT_SIZE_XS} font-medium text-gray-600 text-center w-16`}>담당</td>
                    <td className={`border ${BORDER_CLASS} bg-gray-50 px-3 py-1 ${TEXT_SIZE_XS} font-medium text-gray-600 text-center w-16`}>검토</td>
                    <td className={`border ${BORDER_CLASS} bg-gray-50 px-2 py-1 ${TEXT_SIZE_XS} font-medium text-gray-600 text-center whitespace-nowrap`}>관리책임자</td>
                  </tr>
                  <tr>
                    <td className={`border ${BORDER_CLASS} h-10 w-16`}></td>
                    <td className={`border ${BORDER_CLASS} h-10 w-16`}></td>
                    <td className={`border ${BORDER_CLASS} h-10 w-16`}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <table className={`w-full border-collapse border ${BORDER_CLASS}`}>
              <tbody>
                <tr>
                  <td className={`${HEADER_CELL_CLASS}`} style={{ width: '8%' }}>점검장소</td>
                  <td className={`${CELL_CLASS} text-center`} style={{ width: '10%' }}>사업장 전체</td>
                  <td className={`${HEADER_CELL_CLASS}`} style={{ width: '6%' }}>점검일</td>
                  {DAYS.map(day => (
                    <td key={day} className={`${CELL_CLASS} text-center`} style={{ width: `${76 / 7}%` }}>
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={checkDates[day] || ""}
                            onChange={e => {
                              const value = e.target.value.replace(/[^0-9]/g, "")
                              setCheckDates(prev => ({ ...prev, [day]: value }))
                            }}
                            className={`w-10 h-5 text-center ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none`}
                            placeholder=""
                          />
                        ) : (
                          <span className={TEXT_SIZE_XS}>{checkDates[day] || ""}</span>
                        )}
                        <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>/{day}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td rowSpan={3} colSpan={2} className={`${CELL_CLASS} ${TEXT_SIZE_XS} text-gray-600 align-middle text-center leading-relaxed`}>
                    ※건설기계 등<br/>중장비 작업 시<br/>별도 점검일지 사용
                  </td>
                  <td className={`${HEADER_CELL_CLASS}`} style={{ width: '6%' }}>점검자</td>
                  {DAYS.map(day => (
                    <td key={day} className={`${CELL_CLASS} text-center`}>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={inspectors[day] || ""}
                          onChange={e => setInspectors(prev => ({ ...prev, [day]: e.target.value }))}
                          className={`w-full h-6 text-center ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none`}
                        />
                      ) : (
                        <span className={TEXT_SIZE_XS}>{data?.dailyData?.[day]?.inspector || ""}</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={`${HEADER_CELL_CLASS}`} style={{ width: '6%' }}>서명</td>
                  {DAYS.map(day => (
                    <td key={day} className={`${CELL_CLASS} text-center h-10`}>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={signatures[day] || ""}
                          onChange={e => setSignatures(prev => ({ ...prev, [day]: e.target.value }))}
                          className={`w-full h-6 text-center ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none`}
                        />
                      ) : (
                        <span className={TEXT_SIZE_XS}>{data?.dailyData?.[day]?.signature || ""}</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={`${HEADER_CELL_CLASS}`} style={{ width: '6%' }}>출력인원</td>
                  {DAYS.map(day => (
                    <td key={day} className={`${CELL_CLASS} text-center`}>
                      {isEditMode ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            value={headcounts[day] || ""}
                            onChange={e => {
                              const value = e.target.value.replace(/[^0-9]/g, "")
                              setHeadcounts(prev => ({ ...prev, [day]: value }))
                            }}
                            className={`w-8 h-5 text-center ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none`}
                          />
                          <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>명</span>
                        </div>
                      ) : (
                        <span className={TEXT_SIZE_XS}>{data?.dailyData?.[day]?.headcount ? `${data.dailyData[day].headcount}명` : ""}</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td colSpan={3} className={HEADER_CELL_CLASS}>점 검 항 목</td>
                  <td colSpan={7} className={`${HEADER_CELL_CLASS} text-left pl-3`}>
                    점검결과 표시방법 <span className="inline-flex items-center gap-2 ml-2 px-2 py-0.5 bg-white rounded border border-gray-200 text-gray-700 font-normal"><span className="text-[var(--primary)] font-medium">O</span>:양호 / <span className="text-red-600 font-medium">X</span>:불량</span>
                  </td>
                </tr>

                <tr>
                  <td className={`${HEADER_CELL_CLASS}`} style={{ width: '8%' }}>구분</td>
                  <td colSpan={2} className={`${HEADER_CELL_CLASS}`} style={{ width: '16%' }}>점검내용</td>
                  {DAYS.map(day => (
                    <td key={day} className={`${HEADER_CELL_CLASS}`} style={{ width: `${76 / 7}%` }}>{day}</td>
                  ))}
                </tr>

                {routineChecklistItemsMockData.map((section) => (
                  section.items.map((item, idx) => {
                    const currentItemIndex = itemIndex++
                    const itemId = `item-${currentItemIndex}`
                    return (
                      <tr key={itemId}>
                        {idx === 0 && (
                          <td rowSpan={section.items.length} className={`${HEADER_CELL_CLASS} align-middle`} style={{ width: '8%' }}>
                            {section.category}
                          </td>
                        )}
                        <td colSpan={2} className={`${CELL_CLASS} ${TEXT_SIZE_XS} text-left whitespace-nowrap`}>{item}</td>
                        {DAYS.map(day => {
                          const value = getItemValue(day, itemId)
                          return (
                            <td key={day} className={`${CELL_CLASS} text-center`}>
                              {isEditMode ? (
                                <div className="flex items-center justify-center gap-1">
                                  <div
                                    onClick={() => handleItemClick(itemId, day, "O")}
                                    className={`flex items-center justify-center w-6 h-6 rounded ${CELL_HOVER}`}
                                  >
                                    <Circle size={14} className={`transition-colors ${value === "O" ? "text-[var(--primary)]" : "text-gray-300"}`} strokeWidth={2.5} />
                                  </div>
                                  <div
                                    onClick={() => handleItemClick(itemId, day, "X")}
                                    className={`flex items-center justify-center w-6 h-6 rounded ${CELL_HOVER}`}
                                  >
                                    <X size={14} className={`transition-colors ${value === "X" ? "text-red-700" : "text-gray-300"}`} strokeWidth={2.5} />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center">
                                  {value === "O" && <Circle size={14} className="text-[var(--primary)]" strokeWidth={2.5} />}
                                  {value === "X" && <X size={14} className="text-red-700" strokeWidth={2.5} />}
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                ))}

                <tr>
                  <td colSpan={2} className={`${HEADER_CELL_CLASS} text-center align-middle`}>
                    특이사항 및 위험요인<br/>(일자, 장소 표시 후 기록)
                  </td>
                  <td colSpan={8} className={`${CELL_CLASS} align-top`}>
                    {isEditMode ? (
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className={`w-full h-14 ${TEXT_SIZE_XS} outline-none resize-none border ${BORDER_CLASS} rounded p-2`}
                      />
                    ) : (
                      <span className={`${TEXT_SIZE_XS} whitespace-pre-wrap`}>{data?.notes || notes || "-"}</span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${HEADER_CELL_CLASS} text-center align-middle`}>
                    관리책임자<br/>안전점검 지시사항
                  </td>
                  <td colSpan={8} className={`${CELL_CLASS} align-top`}>
                    {isEditMode ? (
                      <textarea
                        value={managerInstructions}
                        onChange={e => setManagerInstructions(e.target.value)}
                        className={`w-full h-14 ${TEXT_SIZE_XS} outline-none resize-none border ${BORDER_CLASS} rounded p-2`}
                      />
                    ) : (
                      <span className={`${TEXT_SIZE_XS} whitespace-pre-wrap`}>{data?.managerInstructions || managerInstructions || "-"}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
    </div>
  )

  const printStyles = (
    <style>{`
      @media print {
        @page { size: A4 landscape; margin: 3mm; }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print\\:hidden { display: none !important; }
        .min-w-\\[900px\\] {
          min-width: auto !important;
          width: 100% !important;
          transform: scale(0.85);
          transform-origin: top left;
        }
        table {
          width: 100% !important;
          table-layout: fixed !important;
          font-size: 8px !important;
        }
        td, th {
          padding: 1px 3px !important;
          font-size: 8px !important;
          line-height: 1.2 !important;
        }
        h1 { font-size: 14px !important; font-weight: 600 !important; }
        textarea, input { font-size: 8px !important; }
        .text-xs { font-size: 8px !important; }
        .text-xl { font-size: 12px !important; }
        .h-16 { height: 25px !important; }
        .h-14 { height: 30px !important; }
        .h-10 { height: 20px !important; }
        .mb-4 { margin-bottom: 8px !important; }
        .mb-6 { margin-bottom: 10px !important; }
        .p-4, .p-6, .md\\:p-6 { padding: 0 !important; }
      }
    `}</style>
  )

  const DAYS_KEYS = ["월", "화", "수", "목", "금", "토", "일"]

  const handleSave = () => {
    const missingDays = DAYS_KEYS.filter(day => !checkDates[day] || checkDates[day].trim() === "")
    if (missingDays.length > 0) {
      alert("점검일은 필수값입니다.")
      return
    }
    alert("저장되었습니다.")
    onClose?.()
  }

  const actionButtons = (
    <div className={`shrink-0 px-4 py-3 pt-4 border-t ${BORDER_CLASS} flex items-center justify-end gap-1 print:hidden`}>
      <Button variant="action" onClick={() => handlePrint()} className="flex items-center gap-1 text-xs">
        <Printer size={14} />인쇄
      </Button>
      {isEditMode && (
        <button
          onClick={handleSave}
          className="relative flex items-center justify-center gap-1 select-none whitespace-nowrap font-medium transition-opacity duration-200 hover:opacity-80 px-3 py-1.5 text-xs md:text-sm rounded-lg bg-[var(--primary)] text-white border border-[var(--primary)]"
        >
          저장하기
        </button>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-none md:rounded-2xl w-full md:w-[900px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[95vh] flex flex-col relative">
        <div className="flex items-center justify-end mb-2 shrink-0 print:hidden">
          <button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {formContent}
        </div>
        {actionButtons}
        {printStyles}
      </div>
    </div>
  )
}
