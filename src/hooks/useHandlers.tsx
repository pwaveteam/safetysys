import { useState } from "react"
import { useNavigate } from "react-router-dom"
import QRCode from "qrcode"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { useLoadingStore } from "@/stores/loadingStore"
import { useCompanyStore } from "@/stores/companyStore"
import { PrintDocument, DocumentTemplate } from "@/components/snippetDocument/printDocument"
import { documentActions } from "@/hooks/useDocument"
import { pdf } from "@react-pdf/renderer"
import { PDFDocument } from "pdf-lib"
import { DataRow } from "@/components/common/tables/DataTable"
import { AttendeeGroup } from "@/data/mockBusinessData"

export interface ButtonHandlersParams<T = any> {
  data: T[]
  checkedIds: (number | string)[]
  onCreate?: () => void
  onDeleteSuccess?: (deletedIds: (number | string)[]) => void
  onSave?: () => void
  onSaveComplete?: () => void
  onAdd?: () => void
  onSubmit?: () => void
  onLoad?: () => void
  onNextStep?: () => void
  navigateOnComplete?: string
  saveMessage?: string
  submitMessage?: string
  saveAndNextMessage?: string
  completeMessage?: string
  notificationMessage?: string
  onOpenMoveModal?: () => void
  onMoveSuccess?: (targetGroup: string) => void
  groupKey?: string
  createTemplate?: (row: T, index: number) => DocumentTemplate
  excelFileNamePrefix?: string
}

export interface ButtonHandlers {
  handleCreate: () => void
  handleDelete: () => void
  handleGenerateQR: () => Promise<void>
  handleSave: () => void
  handleSaveAndNext: () => void
  handleSaveComplete: () => void
  handleAdd: () => void
  handleSubmit: () => void
  handleSubmitDocument: (onSuccess?: () => void) => Promise<void>
  handleLoad: () => void
  handleGoToRiskAssessment: () => void
  handleOpenMoveModal: () => void
  handleMoveGroup: (targetGroup: string) => void
  handleExcelDownload: () => Promise<void>
  handlePrint: () => Promise<void>
  handleSendNotification: (count: number, onSuccess?: () => void) => Promise<void>
  isDownloading: boolean
  isPrinting: boolean
}

export function useHandlers<T = any>({
  data,
  checkedIds,
  onCreate,
  onDeleteSuccess,
  onSave,
  onSaveComplete,
  onAdd,
  onSubmit,
  onLoad,
  onNextStep,
  navigateOnComplete,
  saveMessage = "저장되었습니다",
  submitMessage = "전송되었습니다",
  saveAndNextMessage = "내용이 저장되었습니다. 다음 단계로 이동합니다",
  completeMessage = "저장이 완료되었습니다",
  notificationMessage = "교육알림이 전송되었습니다",
  onOpenMoveModal,
  onMoveSuccess,
  groupKey = "group",
  createTemplate,
  excelFileNamePrefix
}: ButtonHandlersParams<T>): ButtonHandlers {
  const { setLoading } = useLoadingStore()
  const { factoryName } = useCompanyStore()
  const navigate = useNavigate()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  const getSelectedRows = () => data.filter((item: any) => checkedIds.includes(item.id)) as T[]

  const applyCompanyName = (template: DocumentTemplate): DocumentTemplate => ({
    ...template,
    companyName: template.companyName || factoryName
  })

  const getCategoryName = (template: DocumentTemplate): string => {
    return template.title.replace(/\s*(보고서|문서|목록|현황|결과|평가|점검|일지)$/g, "").trim()
  }

  const handleCreate = (): void => {
    onCreate?.()
  }

  const handleDelete = async (): Promise<void> => {
    if (checkedIds.length === 0) {
      alert("삭제할 항목을 선택하세요")
      return
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onDeleteSuccess?.(checkedIds)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQR = async (): Promise<void> => {
    if (checkedIds.length === 0) {
      alert("QR 생성할 항목을 선택하세요")
      return
    }
    setLoading(true)
    try {
      for (const id of checkedIds) {
        const row: any = data.find((item: any) => item.id === id)
        if (!row) continue
        const text = Object.entries(row)
          .filter(([key]) => key !== "id")
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
        const dataUrl = await QRCode.toDataURL(text, { width: 300 })
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = `QR_${id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch {
      alert("QR 생성 실패")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (): Promise<void> => {
    if (!window.confirm("저장하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onSave?.()
      alert(saveMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAndNext = async (): Promise<void> => {
    if (!window.confirm("저장 후 다음 단계로 이동하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onSave?.()
      alert(saveAndNextMessage)
      onNextStep?.()
    } finally {
      setLoading(false)
    }
  }

  const handleSaveComplete = async (): Promise<void> => {
    if (onSaveComplete) {
      setLoading(true)
      try {
        onSaveComplete()
      } finally {
        setLoading(false)
      }
      return
    }
    if (!window.confirm("작성한 평가내용을 저장하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onSave?.()
      alert(completeMessage)
      if (navigateOnComplete) {
        setTimeout(() => navigate(navigateOnComplete), 500)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (): void => {
    onAdd?.()
  }

  const handleSubmit = async (): Promise<void> => {
    if (!window.confirm("서류를 전송하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      onSubmit?.()
      alert(submitMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitDocument = async (onSuccess?: () => void): Promise<void> => {
    if (!window.confirm("제출하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      alert("제출되었습니다")
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  const handleLoad = async (): Promise<void> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      onLoad?.()
    } finally {
      setLoading(false)
    }
  }

  const handleGoToRiskAssessment = (): void => {
    if (window.confirm("위험성평가 페이지로 이동하시겠습니까?")) {
      navigate("/risk-assessment/pre")
    }
  }

  const handleOpenMoveModal = (): void => {
    if (checkedIds.length === 0) {
      alert("이동할 항목을 선택하세요")
      return
    }
    onOpenMoveModal?.()
  }

  const handleMoveGroup = (targetGroup: string): void => {
    const selectedItems = data.filter((item: any) => checkedIds.includes(item.id))
    const allInTargetGroup = selectedItems.every((item: any) => item[groupKey] === targetGroup)

    if (allInTargetGroup) {
      alert("변경할 사항이 존재하지 않습니다")
      return
    }

    if (!window.confirm(`${checkedIds.length}명을 ${targetGroup}(으)로 이동하시겠습니까?`)) return

    onMoveSuccess?.(targetGroup)
  }

  const handleExcelDownload = async (): Promise<void> => {
    if (checkedIds.length === 0) {
      alert("다운로드할 항목을 선택해주세요")
      return
    }
    if (!createTemplate) {
      alert("템플릿이 설정되지 않았습니다")
      return
    }
    if (isDownloading) return
    setIsDownloading(true)
    try {
      const rows = getSelectedRows()
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "")
      const firstTemplate = applyCompanyName(createTemplate(rows[0], 0))
      const categoryName = excelFileNamePrefix || getCategoryName(firstTemplate)

      if (rows.length === 1) {
        await documentActions.downloadExcel(firstTemplate, `${categoryName}_${today}`)
      } else {
        const zip = new JSZip()
        for (let i = 0; i < rows.length; i++) {
          const template = applyCompanyName(createTemplate(rows[i], i))
          const buffer = await documentActions.getExcelBuffer(template)
          const fileName = `${categoryName}_${today}_${i + 1}.xlsx`
          zip.file(fileName, buffer)
        }
        const zipBlob = await zip.generateAsync({ type: "blob" })
        saveAs(zipBlob, `${categoryName}_${today}.zip`)
      }
    } catch (e) {
      alert("다운로드 중 오류가 발생했습니다")
    }
    setIsDownloading(false)
  }

  const handlePrint = async (): Promise<void> => {
    if (checkedIds.length === 0) {
      alert("인쇄할 항목을 선택해주세요")
      return
    }
    if (!createTemplate) {
      alert("템플릿이 설정되지 않았습니다")
      return
    }
    if (isPrinting) return
    setIsPrinting(true)
    try {
      const rows = getSelectedRows()
      if (rows.length === 1) {
        const template = applyCompanyName(createTemplate(rows[0], 0))
        await documentActions.print(template)
      } else {
        const pdfBuffers: ArrayBuffer[] = []
        for (const row of rows) {
          const template = applyCompanyName(createTemplate(row, 0))
          const blob = await pdf(<PrintDocument template={template} />).toBlob()
          const buffer = await blob.arrayBuffer()
          pdfBuffers.push(buffer)
        }
        if (pdfBuffers.length > 0) {
          const mergedPdf = await PDFDocument.create()
          for (const buffer of pdfBuffers) {
            const pdfDoc = await PDFDocument.load(buffer)
            const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
            pages.forEach(page => mergedPdf.addPage(page))
          }
          const mergedBytes = await mergedPdf.save()
          const mergedBlob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" })
          const url = URL.createObjectURL(mergedBlob)
          const printWindow = window.open(url, "_blank")
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus()
              printWindow.print()
            }
          }
        }
      }
    } catch (e) {
      alert("인쇄 중 오류가 발생했습니다")
    }
    setIsPrinting(false)
  }

  const handleSendNotification = async (count: number, onSuccess?: () => void): Promise<void> => {
    if (count === 0) {
      alert("알림을 전송할 대상이 없습니다")
      return
    }
    if (!window.confirm(`${count}명에게 교육알림을 전송하시겠습니까?`)) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      alert(notificationMessage)
      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  return {
    handleCreate,
    handleDelete,
    handleGenerateQR,
    handleSave,
    handleSaveAndNext,
    handleSaveComplete,
    handleAdd,
    handleSubmit,
    handleSubmitDocument,
    handleLoad,
    handleGoToRiskAssessment,
    handleOpenMoveModal,
    handleMoveGroup,
    handleExcelDownload,
    handlePrint,
    handleSendNotification,
    isDownloading,
    isPrinting
  }
}

const DEFAULT_SAMPLE_FILE = "/downloads/MSDS_2200J_Kor.pdf"

type FileFieldKeys = "fileAttach" | "file" | "attachment" | "attachments" | "msds" | "planFile" | "etcFile" | "evaluationFile" | "attachmentFile" | "proof" | "certificate"

interface UseFileDownloadOptions {
  sampleFilePath?: string
}

export function useDownload(options?: UseFileDownloadOptions) {
  const { setLoading } = useLoadingStore()
  const sampleFile = options?.sampleFilePath || DEFAULT_SAMPLE_FILE

  const hasFileData = (row: Record<string, any>): boolean => {
    const fileKeys: FileFieldKeys[] = [
      "fileAttach",
      "file",
      "attachment",
      "attachments",
      "msds",
      "planFile",
      "etcFile",
      "evaluationFile",
      "attachmentFile",
      "proof",
      "certificate"
    ]

    for (const key of fileKeys) {
      const value = row[key]
      if (value && value !== false) {
        return true
      }
    }
    return false
  }

  const downloadFile = async (row: Record<string, any>): Promise<void> => {
    if (!hasFileData(row)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(sampleFile)
      if (!response.ok) {
        throw new Error("파일을 찾을 수 없습니다")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const originalFileName = sampleFile.split("/").pop() || "file.pdf"

      const link = document.createElement("a")
      link.href = url
      link.download = originalFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("다운로드 실패:", error)
      alert("파일 다운로드에 실패했습니다")
    } finally {
      setLoading(false)
    }
  }

  const downloadMultiple = async (rows: Record<string, any>[]): Promise<void> => {
    const rowsWithFiles = rows.filter(hasFileData)
    if (rowsWithFiles.length === 0) {
      alert("다운로드할 파일이 없습니다")
      return
    }

    setLoading(true)
    try {
      for (const row of rowsWithFiles) {
        await downloadFile(row)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    downloadFile,
    downloadMultiple,
    hasFileData
  }
}

export interface GroupHandlersParams {
  groups: AttendeeGroup[]
  attendees: DataRow[]
  groupKey?: string
  onGroupSave?: (groupName: string) => void
  onGroupDelete?: (groupId: number) => void
}

export interface GroupHandlers {
  getGroupMemberCount: (groupName: string) => number
  handleGroupSave: (groupName: string) => boolean
  handleGroupDelete: (group: AttendeeGroup) => void
  validateGroupName: (groupName: string) => boolean
}

export function useGroupHandlers({
  groups,
  attendees,
  groupKey = "group",
  onGroupSave,
  onGroupDelete
}: GroupHandlersParams): GroupHandlers {

  const getGroupMemberCount = (groupName: string): number => {
    return attendees.filter(a => a[groupKey] === groupName).length
  }

  const validateGroupName = (groupName: string): boolean => {
    if (!groupName.trim()) return false
    if (groups.some(g => g.name === groupName)) return false
    return true
  }

  const handleGroupSave = (groupName: string): boolean => {
    if (!validateGroupName(groupName)) return false
    onGroupSave?.(groupName)
    return true
  }

  const handleGroupDelete = (group: AttendeeGroup): void => {
    const memberCount = getGroupMemberCount(group.name)
    const message = memberCount > 0
      ? `삭제 시 소속된 ${memberCount}명의 정보도 함께 사라집니다. 삭제하시겠습니까?`
      : `"${group.name}"을(를) 삭제하시겠습니까?`

    if (window.confirm(message)) {
      onGroupDelete?.(group.id)
    }
  }

  return {
    getGroupMemberCount,
    handleGroupSave,
    handleGroupDelete,
    validateGroupName
  }
}

export interface BudgetHandlersParams<TInsp, TBudget> {
  inspItems: TInsp[]
  budgetItems: TBudget[]
  setInspItems: React.Dispatch<React.SetStateAction<TInsp[]>>
  setBudgetItems: React.Dispatch<React.SetStateAction<TBudget[]>>
  inspCheckedIds: (number | string)[]
  budgetCheckedIds: (number | string)[]
  selectedYear: string
  budgetYear: string
  activeQuarter: number
}

export interface BudgetHandlers<TInsp, TBudget> {
  handleInspAdd: () => void
  handleBudgetAdd: () => void
  handleInspChange: (id: number | string, field: keyof Omit<TInsp, "id">, value: string | boolean) => void
  handleBudgetChange: (id: number | string, field: keyof Omit<TBudget, "id" | "year">, value: string | boolean | File) => void
  handleInspDelete: () => Promise<void>
  handleBudgetDelete: () => Promise<void>
  isQuarterEnabled: (quarter: number) => boolean
  formatCurrency: (num: number) => string
}

export function useBudgetHandlers<
  TInsp extends { id: number; year?: string },
  TBudget extends { id: number; year: string; quarter: number; budget: string; spent: string; remaining: string; carryOver: boolean }
>({
  inspItems,
  budgetItems,
  setInspItems,
  setBudgetItems,
  inspCheckedIds,
  budgetCheckedIds,
  selectedYear,
  budgetYear,
  activeQuarter
}: BudgetHandlersParams<TInsp, TBudget>): BudgetHandlers<TInsp, TBudget> {
  const { setLoading } = useLoadingStore()
  const currentYear = new Date().getFullYear().toString()
  const currentMonth = new Date().getMonth() + 1
  const currentQuarter = Math.ceil(currentMonth / 3)

  const handleInspAdd = () => {
    const nextId = Math.max(...inspItems.map(i => i.id), 0) + 1
    setInspItems(prev => [...prev, {
      id: nextId,
      year: selectedYear,
      detailPlan: "",
      q1: false,
      q2: false,
      q3: false,
      q4: false,
      KPI: "",
      department: "",
      achievementRate: "",
      resultRemark: "",
      entryDate: new Date().toISOString().slice(0, 10)
    } as unknown as TInsp])
  }

  const handleBudgetAdd = () => {
    const nextId = Math.max(...budgetItems.map(i => i.id), 0) + 1
    setBudgetItems(prev => [...prev, {
      id: nextId,
      year: budgetYear,
      quarter: activeQuarter,
      itemName: "",
      category: "",
      budget: "0",
      spent: "0",
      remaining: "0",
      carryOver: false,
      attachment: null,
      author: "",
      entryDate: new Date().toISOString().slice(0, 10)
    } as unknown as TBudget])
  }

  const handleInspChange = (id: number | string, field: keyof Omit<TInsp, "id">, value: string | boolean) => {
    setInspItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleBudgetChange = (id: number | string, field: keyof Omit<TBudget, "id" | "year">, value: string | boolean | File) => {
    setBudgetItems(items => items.map(item => {
      if (item.id !== id) return item
      const next = { ...item, [field]: value }
      if (field === "budget" || field === "spent") {
        const b = parseInt(next.budget.replace(/[^0-9]/g, ""), 10) || 0
        const s = parseInt(next.spent.replace(/[^0-9]/g, ""), 10) || 0
        next.remaining = Math.max(0, b - s).toString()
        if (next.remaining === "0") next.carryOver = false
      }
      return next
    }))
  }

  const handleInspDelete = async (): Promise<void> => {
    if (inspCheckedIds.length === 0) {
      alert("삭제할 항목을 선택하세요")
      return
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setInspItems(prev => prev.filter(item => !inspCheckedIds.includes(item.id)))
    } finally {
      setLoading(false)
    }
  }

  const handleBudgetDelete = async (): Promise<void> => {
    if (budgetCheckedIds.length === 0) {
      alert("삭제할 항목을 선택하세요")
      return
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setBudgetItems(prev => prev.filter(item => !budgetCheckedIds.includes(item.id)))
    } finally {
      setLoading(false)
    }
  }

  const isQuarterEnabled = (quarter: number): boolean => {
    const selectedYearNum = parseInt(budgetYear, 10)
    const currentYearNum = parseInt(currentYear, 10)

    if (selectedYearNum > currentYearNum) return false
    if (selectedYearNum === currentYearNum) return quarter <= currentQuarter
    if (selectedYearNum === 2025) return true

    return budgetItems.some(item => item.year === budgetYear && item.quarter === quarter)
  }

  const formatCurrency = (num: number) => num.toLocaleString() + "원"

  return {
    handleInspAdd,
    handleBudgetAdd,
    handleInspChange,
    handleBudgetChange,
    handleInspDelete,
    handleBudgetDelete,
    isQuarterEnabled,
    formatCurrency
  }
}

export default useHandlers
