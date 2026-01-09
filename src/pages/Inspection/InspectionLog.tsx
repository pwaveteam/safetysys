import React, { useRef, useState } from "react"
import Button from "@/components/common/base/Button"
import { X, Printer, Circle, Camera, Image } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import SignaturePadDialog from "@/components/dialog/SignaturePadDialog"
import useHandlers from "@/hooks/useHandlers"

const BORDER_CLASS = "border-[var(--border)]"
const TEXT_PRIMARY = "text-gray-800"
const TEXT_SECONDARY = "text-gray-500"
const TEXT_SIZE_XS = "text-xs"
const TH_BASE = `bg-gray-50 ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center whitespace-nowrap`
const TD_BASE = `${BORDER_CLASS} px-2.5 py-2.5 ${TEXT_SIZE_XS} ${TEXT_PRIMARY} whitespace-nowrap`
const CELL_HOVER = "cursor-pointer hover:bg-gray-50"

interface ResultRow {
  id: number | string
  template: string
  workplace: string
  field: string
  kind: string
  inspector: string
  inspectedAt: string
  confirmed: boolean
  notes: string
  signature?: string
}

interface CheckItem {
  id: number
  category?: string
  content: string
  status: "양호" | "불량" | ""
  note: string
  photos: string[]
}

interface InspectionLogProps {
  open: boolean
  onClose: () => void
  data: ResultRow | null
  mode?: "view" | "edit"
  onSubmitSuccess?: (signature: string) => void
}

const INITIAL_ITEMS: CheckItem[] = [
  { id: 1, category: "전기설비", content: "분전반 외함 파손·열화·부식 여부 및 표면 이물질 부착 상태 확인", status: "", note: "", photos: [] },
  { id: 2, category: "전기설비", content: "누전차단기 시험버튼 동작 확인 및 동작 후 원위치 복귀 상태 점검", status: "", note: "", photos: [] },
  { id: 3, category: "전기설비", content: "접지선 체결상태(풀림/탈락/손상) 및 접지저항 측정기록 최신성 확인", status: "", note: "", photos: [] },
  { id: 4, category: "전기설비", content: "전선 피복 손상·가닥 노출·비규격 접속(테이프 임시처리 등) 사용 금지 여부", status: "", note: "", photos: [] },
  { id: 5, category: "화재예방", content: "분전반 내부 과열 흔적(변색/그을음) 및 냄새 유무, 발열 부위 비접촉 온도계 점검", status: "", note: "", photos: [] },
]

const VIEW_ITEMS: CheckItem[] = [
  { id: 1, category: "전기설비", content: "분전반 외함 파손·열화·부식 여부 및 표면 이물질 부착 상태 확인", status: "양호", note: "", photos: [] },
  { id: 2, category: "전기설비", content: "누전차단기 시험버튼 동작 확인 및 동작 후 원위치 복귀 상태 점검", status: "양호", note: "", photos: [] },
  { id: 3, category: "전기설비", content: "접지선 체결상태(풀림/탈락/손상) 및 접지저항 측정기록 최신성 확인", status: "양호", note: "접지저항 측정 완료", photos: [] },
  { id: 4, category: "전기설비", content: "전선 피복 손상·가닥 노출·비규격 접속(테이프 임시처리 등) 사용 금지 여부", status: "불량", note: "일부 피복 손상 발견, 교체 필요", photos: ["sample.jpg"] },
  { id: 5, category: "화재예방", content: "분전반 내부 과열 흔적(변색/그을음) 및 냄새 유무, 발열 부위 비접촉 온도계 점검", status: "양호", note: "", photos: [] },
]

export default function InspectionLog({ open, onClose, data, mode = "view", onSubmitSuccess }: InspectionLogProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})
  const isEditMode = mode === "edit"

  const [items, setItems] = useState<CheckItem[]>(isEditMode ? INITIAL_ITEMS : VIEW_ITEMS)
  const [specialNotes, setSpecialNotes] = useState("")
  const [managerInstructions, setManagerInstructions] = useState("")
  const [signature, setSignature] = useState<string | null>(null)
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `점검결과_${data?.template || "문서"}`,
  })

  const { handleSubmitDocument } = useHandlers({ data: items, checkedIds: [] })

  if (!open || !data) return null

  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || ""
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, CheckItem[]>)

  const handleStatusChange = (itemId: number, status: "양호" | "불량") => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: item.status === status ? "" : status } : item
    ))
  }

  const handleNoteChange = (itemId: number, note: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, note } : item
    ))
  }

  const handleSubmit = () => {
    const hasEmptyStatus = items.some(item => !item.status)
    if (hasEmptyStatus) {
      alert("모든 점검항목의 상태를 선택해주세요.")
      return
    }
    if (!signature) {
      alert("점검자 서명을 입력해주세요.")
      return
    }
    handleSubmitDocument(() => {
      onSubmitSuccess?.(signature)
      onClose()
    })
  }

  const handleSignatureSave = (dataUrl: string) => {
    setSignature(dataUrl)
    setIsSignaturePadOpen(false)
  }

  const handlePhotoUpload = (itemId: number, files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, photos: [...item.photos, dataUrl] } : item
      ))
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = (itemId: number, photoIndex: number) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, photos: item.photos.filter((_, i) => i !== photoIndex) } : item
    ))
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-none md:rounded-2xl w-full md:w-[900px] md:max-w-[95vw] p-4 md:p-6 shadow-2xl h-screen md:h-[90vh] flex flex-col relative">
        <div className="flex items-center justify-end mb-2 shrink-0 print:hidden">
          <button onClick={onClose} className="p-1 hover:bg-[var(--neutral-bg)] rounded transition text-[var(--neutral)]">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden" ref={printRef}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="flex-1 flex justify-center items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">점검일지</h1>
                <span className={`text-xs px-2 py-0.5 rounded ${isEditMode ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
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

            <div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden`}>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th className={`${TH_BASE} border-b border-r`} style={{ width: '11%' }}>점검표명</th>
                    <td className={`${TD_BASE} border-b`} style={{ width: '28%' }}>{data.template}</td>
                    <th className={`${TH_BASE} border-b border-l border-r`} style={{ width: '11%' }}>점검종류</th>
                    <td className={`${TD_BASE} border-b`} style={{ width: '12%' }}>{data.kind}</td>
                    <th className={`${TH_BASE} border-b border-l border-r`} style={{ width: '11%' }}>점검일</th>
                    <td className={`${TD_BASE} border-b`} style={{ width: '27%' }}>{data.inspectedAt}</td>
                  </tr>
                  <tr>
                    <th className={`${TH_BASE} border-r`}>점검장소</th>
                    <td className={`${TD_BASE}`}>{data.workplace}</td>
                    <th className={`${TH_BASE} border-l border-r`}>점검분야</th>
                    <td className={`${TD_BASE}`}>{data.field}</td>
                    <th className={`${TH_BASE} border-l border-r`}>점검자</th>
                    <td
                      className={`${TD_BASE} ${isEditMode ? CELL_HOVER : ""}`}
                      onClick={isEditMode ? () => setIsSignaturePadOpen(true) : undefined}
                    >
                      {isEditMode ? (
                        <div className="flex items-center justify-between">
                          <span className="truncate">{data.inspector}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {signature && <img src={signature} alt="서명" className="h-5 w-10 object-contain border border-gray-200 rounded" />}
                            <span className={`${TEXT_SIZE_XS} ${signature ? "text-[var(--primary)]" : "text-gray-400"}`}>(인)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="truncate">{data.inspector}</span>
                          <span className="relative inline-flex items-center justify-center shrink-0">
                            <span className={`${TEXT_SIZE_XS} text-gray-200 select-none px-1`}>(인)</span>
                            {data.signature ? (
                              <img
                                src={data.signature}
                                alt="서명"
                                className="absolute pointer-events-none max-w-none z-10"
                                style={{ height: '40px', width: 'auto', right: '0', top: '50%', transform: 'translateY(-50%) translateX(20%)' }}
                              />
                            ) : (
                              <img
                                src={`/images/signature-${Math.floor(Math.random() * 5) + 1}.png`}
                                alt="서명"
                                className="absolute pointer-events-none max-w-none z-10"
                                style={{ height: '40px', width: 'auto', right: '0', top: '50%', transform: 'translateY(-50%) translateX(20%)' }}
                              />
                            )}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden`}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className={`border-b ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '8%' }} rowSpan={2}>구분</th>
                    <th className={`border-b border-l ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '42%' }} rowSpan={2}>점검항목</th>
                    <th className={`border-b border-l ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '10%' }} colSpan={2}>상태</th>
                    <th className={`border-b border-l ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '34%' }} rowSpan={2}>비고/조치사항</th>
                    <th className={`border-b border-l ${BORDER_CLASS} px-1 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '6%' }} rowSpan={2}>사진</th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th className={`border-b border-l ${BORDER_CLASS} px-1 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '5%' }}>양호</th>
                    <th className={`border-b border-l ${BORDER_CLASS} px-1 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center`} style={{ width: '5%' }}>불량</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedItems).map(([category, categoryItems], catIdx, catArr) => (
                    <React.Fragment key={category}>
                      {categoryItems.map((item, idx) => {
                        const isLastCategory = catIdx === catArr.length - 1
                        const isLastItemInCategory = idx === categoryItems.length - 1
                        const isLastRow = isLastCategory && isLastItemInCategory
                        return (
                          <tr key={item.id} className={idx % 2 === 1 ? "bg-gray-50/30" : ""}>
                            {idx === 0 && category && (
                              <td rowSpan={categoryItems.length} className={`${isLastCategory ? "" : "border-b"} border-r ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_PRIMARY} text-center align-middle bg-gray-50`}>
                                {category.length === 4 ? (
                                  <>{category.slice(0, 2)}<br/>{category.slice(2)}</>
                                ) : category}
                              </td>
                            )}
                            <td className={`${isLastRow ? "" : "border-b"} border-l ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} ${TEXT_PRIMARY}`}>{item.content}</td>
                            <td
                              className={`${isLastRow ? "" : "border-b"} border-l ${BORDER_CLASS} px-1 py-2 ${isEditMode ? CELL_HOVER : ""}`}
                              onClick={isEditMode ? () => handleStatusChange(item.id, "양호") : undefined}
                            >
                              <div className="flex items-center justify-center">
                                {isEditMode ? (
                                  <Circle size={14} className={`transition-colors ${item.status === "양호" ? "text-[var(--primary)]" : "text-gray-300"}`} strokeWidth={2.5} />
                                ) : (
                                  item.status === "양호" && <Circle size={14} className="text-[var(--primary)]" strokeWidth={2.5} />
                                )}
                              </div>
                            </td>
                            <td
                              className={`${isLastRow ? "" : "border-b"} border-l ${BORDER_CLASS} px-1 py-2 ${isEditMode ? CELL_HOVER : ""}`}
                              onClick={isEditMode ? () => handleStatusChange(item.id, "불량") : undefined}
                            >
                              <div className="flex items-center justify-center">
                                {isEditMode ? (
                                  <X size={14} className={`transition-colors ${item.status === "불량" ? "text-red-700" : "text-gray-300"}`} strokeWidth={2.5} />
                                ) : (
                                  item.status === "불량" && <X size={14} className="text-red-700" strokeWidth={2.5} />
                                )}
                              </div>
                            </td>
                            <td className={`${isLastRow ? "" : "border-b"} border-l ${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} ${item.note ? TEXT_PRIMARY : TEXT_SECONDARY}`}>
                              {isEditMode ? (
                                <input
                                  type="text"
                                  value={item.note}
                                  onChange={(e) => handleNoteChange(item.id, e.target.value)}
                                  placeholder="비고 입력"
                                  className={`w-full px-1 py-1 ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none focus:border-[var(--primary)] placeholder:text-gray-300`}
                                />
                              ) : (
                                <span className="truncate block">{item.note || "-"}</span>
                              )}
                            </td>
                            <td className={`${isLastRow ? "" : "border-b"} border-l ${BORDER_CLASS} px-1 py-2`}>
                              <div className="flex items-center justify-center">
                                {isEditMode ? (
                                  <>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      capture="environment"
                                      ref={(el) => { fileInputRefs.current[item.id] = el }}
                                      onChange={(e) => handlePhotoUpload(item.id, e.target.files)}
                                      className="hidden"
                                    />
                                    <button
                                      onClick={() => fileInputRefs.current[item.id]?.click()}
                                      className={`transition-colors ${item.photos.length > 0 ? "text-[var(--primary)] hover:opacity-70" : "text-gray-300 hover:text-gray-500"}`}
                                    >
                                      <Camera size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className={`flex justify-center items-center transition-colors ${
                                      item.photos.length > 0
                                        ? "text-gray-800 hover:text-[var(--primary)] cursor-pointer"
                                        : "text-gray-300 cursor-default"
                                    }`}
                                    aria-label="사진 보기"
                                    disabled={item.photos.length === 0}
                                  >
                                    <Image size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )})}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`border ${BORDER_CLASS} rounded-lg overflow-hidden notes-section`}>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th className={`bg-gray-50 ${BORDER_CLASS} border-b border-r px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center align-middle`} style={{ width: '22%' }}>특이사항 및 위험요인<br/>(일자, 장소 표시 후 기록)</th>
                    <td className={`${BORDER_CLASS} border-b px-2 py-2 ${TEXT_SIZE_XS} ${TEXT_PRIMARY} align-top`}>
                      {isEditMode ? (
                        <textarea
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          className={`w-full h-14 px-2 py-1 ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none resize-none focus:border-[var(--primary)]`}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{data.notes || "-"}</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className={`bg-gray-50 ${BORDER_CLASS} border-r px-2 py-2 ${TEXT_SIZE_XS} font-medium ${TEXT_SECONDARY} text-center align-middle`} style={{ width: '22%' }}>관리책임자<br/>안전점검 지시사항</th>
                    <td className={`${BORDER_CLASS} px-2 py-2 ${TEXT_SIZE_XS} ${TEXT_PRIMARY} align-top`}>
                      {isEditMode ? (
                        <textarea
                          value={managerInstructions}
                          onChange={(e) => setManagerInstructions(e.target.value)}
                          className={`w-full h-14 px-2 py-1 ${TEXT_SIZE_XS} border ${BORDER_CLASS} rounded outline-none resize-none focus:border-[var(--primary)]`}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">-</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-4 border-t border-[var(--border)] flex items-center justify-end gap-1 print:hidden">
          {!isEditMode && (
            <Button variant="action" onClick={() => handlePrint()} className="flex items-center gap-1 text-xs">
              <Printer size={14} />인쇄
            </Button>
          )}
          {isEditMode && (
            <button
              onClick={handleSubmit}
              className="relative flex items-center justify-center gap-1 select-none whitespace-nowrap font-medium transition-opacity duration-200 hover:opacity-80 px-3 py-1.5 text-xs md:text-sm rounded-lg bg-[var(--primary)] text-white border border-[var(--primary)]"
            >
              제출하기
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          table { table-layout: fixed; }
          thead th, thead td { white-space: nowrap !important; }
          tbody td { white-space: nowrap !important; }
          tbody td:nth-child(2) { white-space: normal !important; }
          .notes-section th { white-space: normal !important; }
          .notes-section td { white-space: normal !important; }
        }
      `}</style>

      <SignaturePadDialog
        isOpen={isSignaturePadOpen}
        onClose={() => setIsSignaturePadOpen(false)}
        onSave={handleSignatureSave}
        title="점검자 서명"
      />

      {previewPhoto && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70" onClick={() => setPreviewPhoto(null)}>
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img src={previewPhoto} alt="사진 미리보기" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}