import React, { useState, useRef } from "react"
import Button from "@/components/common/base/Button"
import { X, Circle, Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { routineChecklistItemsMockData } from "@/data/mockData"
import LoadListDialog, { RoutineListItem, ROUTINE_LIST_COLUMNS, ROUTINE_LIST_MOCK_DATA } from "@/components/dialog/LoadListDialog"

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

interface InspectionRoutineProps {
  listOpen: boolean
  onListClose: () => void
  registerOpen: boolean
  onRegisterClose: () => void
  mode: "view" | "edit"
  data?: PatrolData
}

export default function InspectionRoutine({
  listOpen,
  onListClose,
  registerOpen,
  onRegisterClose,
  mode,
  data,
}: InspectionRoutineProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const printViewRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<{ [day: string]: { [itemId: string]: "O" | "X" | "" } }>({})
  const [inspectors, setInspectors] = useState<{ [day: string]: string }>({})
  const [signatures, setSignatures] = useState<{ [day: string]: string }>({})
  const [headcounts, setHeadcounts] = useState<{ [day: string]: string }>({})
  const [notes, setNotes] = useState("")
  const [managerInstructions, setManagerInstructions] = useState("")
  const [checkDates, setCheckDates] = useState<{ [day: string]: string }>({})
  const [selectedPrintItem, setSelectedPrintItem] = useState<RoutineListItem | null>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "안전순회 점검일지",
  })

  const handlePrintView = useReactToPrint({
    contentRef: printViewRef,
    documentTitle: "안전순회 점검일지",
  })

  const handleItemClick = (itemId: string, day: string, value: "O" | "X") => {
    if (mode === "view") return
    setFormData(prev => {
      const dayData = prev[day] || {}
      const currentValue = dayData[itemId]
      const newValue = currentValue === value ? "" : value
      return { ...prev, [day]: { ...dayData, [itemId]: newValue } }
    })
  }

  const getItemValue = (day: string, itemId: string): "O" | "X" | "" => {
    return formData[day]?.[itemId] || ""
  }

  const handleSave = () => {
    const missingDays = DAYS.filter(day => !checkDates[day] || checkDates[day].trim() === "")
    if (missingDays.length > 0) {
      alert("점검일은 필수값입니다.")
      return
    }
    alert("저장되었습니다.")
    onRegisterClose()
  }

  const isEditMode = mode === "edit"
  let itemIndex = 0

  const handlePrintFromList = (id: string | number | (string | number)[] | null) => {
    if (id === null || Array.isArray(id)) return
    const item = ROUTINE_LIST_MOCK_DATA.find(i => i.id === id)
    if (item) {
      setSelectedPrintItem(item)
      setTimeout(() => {
        handlePrintView()
      }, 100)
    }
  }

  return (
    <>
      <LoadListDialog<RoutineListItem>
        isOpen={listOpen}
        items={ROUTINE_LIST_MOCK_DATA}
        onClose={onListClose}
        title="안전순회 점검일지"
        columns={ROUTINE_LIST_COLUMNS}
        emptyMessage="등록된 안전순회 점검일지가 없습니다."
        searchKeys={["inspector", "inspectionDate"]}
        actionLabel="인쇄"
        singleSelect={true}
        onChangeSelected={handlePrintFromList}
      />

      {registerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-none md:rounded-2xl w-full md:w-[900px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[95vh] flex flex-col relative">
            <div className="flex items-center justify-end mb-2 shrink-0 print:hidden">
              <button onClick={onRegisterClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden" ref={printRef}>
              <div className="print-content">
                <div className="flex items-center mb-4">
                  <div className="flex-1 flex justify-center items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">안전순회 점검일지</h1>
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
                      <td className={HEADER_CELL_CLASS} style={{ width: '8%' }}>점검장소</td>
                      <td className={`${CELL_CLASS} text-center`} style={{ width: '10%' }}>사업장 전체</td>
                      <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>점검일</td>
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
                      <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>점검자</td>
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
                      <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>서명</td>
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
                      <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>출력인원</td>
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
                      <td className={HEADER_CELL_CLASS} style={{ width: '8%' }}>구분</td>
                      <td colSpan={2} className={HEADER_CELL_CLASS} style={{ width: '16%' }}>점검내용</td>
                      {DAYS.map(day => (
                        <td key={day} className={HEADER_CELL_CLASS} style={{ width: `${76 / 7}%` }}>{day}</td>
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
                                {section.category.length === 4 ? (
                                  <>{section.category.slice(0, 2)}<br/>{section.category.slice(2)}</>
                                ) : section.category}
                              </td>
                            )}
                            <td colSpan={2} className={`${CELL_CLASS} ${TEXT_SIZE_XS} text-left whitespace-nowrap`}>{item}</td>
                            {DAYS.map(day => {
                              const value = getItemValue(day, itemId)
                              return (
                                <td key={day} className={`${CELL_CLASS} text-center`}>
                                  {isEditMode ? (
                                    <div className="flex items-center justify-center gap-1">
                                      <div onClick={() => handleItemClick(itemId, day, "O")} className={`flex items-center justify-center w-6 h-6 rounded ${CELL_HOVER}`}>
                                        <Circle size={14} className={`transition-colors ${value === "O" ? "text-[var(--primary)]" : "text-gray-300"}`} strokeWidth={2.5} />
                                      </div>
                                      <div onClick={() => handleItemClick(itemId, day, "X")} className={`flex items-center justify-center w-6 h-6 rounded ${CELL_HOVER}`}>
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

                    <tr className="notes-row">
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

                    <tr className="notes-row">
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

            <style>{`
              @media print {
                @page { size: A4 landscape; margin: 5mm; }
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                .print-content {
                  padding: 0 !important;
                  transform: scale(0.78);
                  transform-origin: top left;
                  width: 128%;
                }
                .print-content table { font-size: 9px !important; table-layout: fixed; }
                .print-content td, .print-content th { padding: 2px 3px !important; white-space: nowrap !important; }
                .print-content h1 { font-size: 16px !important; }
                .print-content .mb-4 { margin-bottom: 6px !important; }
                .print-content textarea, .print-content input { display: none; }
                .print-content .h-14 { height: 30px !important; }
                .print-content .h-10 { height: 22px !important; }
                .print-content .notes-row td { white-space: normal !important; }
                .print-content .notes-row th { white-space: normal !important; }
              }
            `}</style>
          </div>
        </div>
      )}

      {selectedPrintItem && (
        <div className="hidden">
          <div ref={printViewRef}>
            <div className="print-content-list">
              <div className="flex items-center mb-4">
                <div className="flex-1 flex justify-center items-center">
                  <h1 className="text-2xl font-semibold text-gray-900">안전순회 점검일지</h1>
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
                    <td className={HEADER_CELL_CLASS} style={{ width: '8%' }}>점검장소</td>
                    <td className={`${CELL_CLASS} text-center`} style={{ width: '10%' }}>사업장 전체</td>
                    <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>점검일</td>
                    {DAYS.map((day, idx) => {
                      const dateRange = selectedPrintItem.inspectionDate.split(" ~ ")
                      const startDate = dateRange[0]?.split("-")[2] || ""
                      return (
                        <td key={day} className={`${CELL_CLASS} text-center`} style={{ width: `${76 / 7}%` }}>
                          <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                            <span className={TEXT_SIZE_XS}>{String(Number(startDate) + idx).padStart(2, "0")}</span>
                            <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>/{day}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  <tr>
                    <td rowSpan={3} colSpan={2} className={`${CELL_CLASS} ${TEXT_SIZE_XS} text-gray-600 align-middle text-center leading-relaxed`}>
                      ※건설기계 등<br/>중장비 작업 시<br/>별도 점검일지 사용
                    </td>
                    <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>점검자</td>
                    {DAYS.map(day => (
                      <td key={day} className={`${CELL_CLASS} text-center`}>
                        <span className={TEXT_SIZE_XS}>{selectedPrintItem.inspector}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>서명</td>
                    {DAYS.map(day => (
                      <td key={day} className={`${CELL_CLASS} text-center h-10`}></td>
                    ))}
                  </tr>
                  <tr>
                    <td className={HEADER_CELL_CLASS} style={{ width: '6%' }}>출력인원</td>
                    {DAYS.map(day => (
                      <td key={day} className={`${CELL_CLASS} text-center`}>
                        <span className={TEXT_SIZE_XS}>-</span>
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
                    <td className={HEADER_CELL_CLASS} style={{ width: '8%' }}>구분</td>
                    <td colSpan={2} className={HEADER_CELL_CLASS} style={{ width: '16%' }}>점검내용</td>
                    {DAYS.map(day => (
                      <td key={day} className={HEADER_CELL_CLASS} style={{ width: `${76 / 7}%` }}>{day}</td>
                    ))}
                  </tr>

                  {(() => {
                    let viewItemIndex = 0
                    return routineChecklistItemsMockData.map((section) => (
                      section.items.map((item, idx) => {
                        const currentItemIndex = viewItemIndex++
                        const itemId = `item-${currentItemIndex}`
                        return (
                          <tr key={itemId}>
                            {idx === 0 && (
                              <td rowSpan={section.items.length} className={`${HEADER_CELL_CLASS} align-middle`} style={{ width: '8%' }}>
                                {section.category.length === 4 ? (
                                  <>{section.category.slice(0, 2)}<br/>{section.category.slice(2)}</>
                                ) : section.category}
                              </td>
                            )}
                            <td colSpan={2} className={`${CELL_CLASS} ${TEXT_SIZE_XS} text-left whitespace-nowrap`}>{item}</td>
                            {DAYS.map(day => (
                              <td key={day} className={`${CELL_CLASS} text-center`}>
                                <div className="flex items-center justify-center">
                                  <Circle size={14} className="text-[var(--primary)]" strokeWidth={2.5} />
                                </div>
                              </td>
                            ))}
                          </tr>
                        )
                      })
                    ))
                  })()}

                  <tr className="notes-row">
                    <td colSpan={2} className={`${HEADER_CELL_CLASS} text-center align-middle`}>
                      특이사항 및 위험요인<br/>(일자, 장소 표시 후 기록)
                    </td>
                    <td colSpan={8} className={`${CELL_CLASS} align-top`}>
                      <span className={`${TEXT_SIZE_XS} whitespace-pre-wrap`}>-</span>
                    </td>
                  </tr>

                  <tr className="notes-row">
                    <td colSpan={2} className={`${HEADER_CELL_CLASS} text-center align-middle`}>
                      관리책임자<br/>안전점검 지시사항
                    </td>
                    <td colSpan={8} className={`${CELL_CLASS} align-top`}>
                      <span className={`${TEXT_SIZE_XS} whitespace-pre-wrap`}>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <style>{`
              @media print {
                @page { size: A4 landscape; margin: 5mm; }
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                .print-content-list {
                  padding: 0 !important;
                  transform: scale(0.78);
                  transform-origin: top left;
                  width: 128%;
                }
                .print-content-list table { font-size: 9px !important; table-layout: fixed; }
                .print-content-list td, .print-content-list th { padding: 2px 3px !important; white-space: nowrap !important; }
                .print-content-list h1 { font-size: 16px !important; }
                .print-content-list .mb-4 { margin-bottom: 6px !important; }
                .print-content-list .h-14 { height: 30px !important; }
                .print-content-list .h-10 { height: 22px !important; }
                .print-content-list .notes-row td { white-space: normal !important; }
                .print-content-list .notes-row th { white-space: normal !important; }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  )
}