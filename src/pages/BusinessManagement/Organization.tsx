import React, { useState, useRef, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import html2canvas from "html2canvas"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import Pagination from "@/components/common/base/Pagination"
import OrganizationTree, { OrgNode } from "@/components/snippetBusiness/OrganizationTree"
import StaffRegisterModal from "./StaffRegister"
import useHandlers from "@/hooks/useHandlers"
import usePagination from "@/hooks/usePagination"
import { CirclePlus, Image, Upload, Trash2, ShieldAlert } from "lucide-react"
import { organizationMockData } from "@/data/mockBusinessData"

const TAB_LABELS = ["전체인력 목록"]
const ORG_CHART_TABS = ["시스템 조직도", "조직도 이미지"]

const columns: Column[] = [
  { key: "name", label: "이름" },
  { key: "safetyPosition", label: "안전직위" },
  { key: "department", label: "부서" },
  { key: "position", label: "직급" },
  { key: "phone", label: "연락처" },
  { key: "entryDate", label: "입사일" },
  { key: "assignDate", label: "안전직위 지정일" },
  { key: "appointmentCertificate", label: "선임(신고서)", type: "download" },
  { key: "manage", label: "관리", type: "manage" }
]

const buildOrgTreeFromStaffs = (staffs: DataRow[]): { treeData: OrgNode | null; supervisors: OrgNode[] } => {
  const ceo = staffs.find(s => s.safetyPosition === "경영책임자")
  const safetyOfficer = staffs.find(s => s.safetyPosition === "안전보건관리책임자")
  const safetyManagers = staffs.filter(s => s.safetyPosition === "안전관리자")
  const healthManagers = staffs.filter(s => s.safetyPosition === "보건관리자")
  const supervisorsList = staffs.filter(s => s.safetyPosition === "관리감독자")

  if (!ceo) return { treeData: null, supervisors: [] }

  const managersChildren: OrgNode[] = [
    ...safetyManagers.map(m => ({
      id: m.id,
      title: "안전관리자",
      name: String(m.name),
      position: String(m.position || "")
    })),
    ...healthManagers.map(m => ({
      id: m.id,
      title: "보건관리자",
      name: String(m.name),
      position: String(m.position || "")
    }))
  ]

  const treeData: OrgNode = {
    id: ceo.id,
    title: "경영책임자",
    name: String(ceo.name),
    position: String(ceo.position || ""),
    children: safetyOfficer ? [{
      id: safetyOfficer.id,
      title: "안전보건관리책임자",
      name: String(safetyOfficer.name),
      position: String(safetyOfficer.position || ""),
      children: managersChildren.length > 0 ? managersChildren : undefined
    }] : undefined
  }

  const supervisors: OrgNode[] = supervisorsList.map(s => ({
    id: s.id,
    title: "관리감독자",
    name: String(s.name),
    position: String(s.position || "")
  }))

  return { treeData, supervisors }
}

export default function Organization() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [staffs, setStaffs] = useState<DataRow[]>(organizationMockData)
  const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [orgChartTab, setOrgChartTab] = useState(0)
  const [uploadedOrgChart, setUploadedOrgChart] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const orgChartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchParams({ tab: ORG_CHART_TABS[orgChartTab] })
  }, [orgChartTab, setSearchParams])

  const { currentPage, totalPages, currentData, onPageChange } = usePagination<DataRow>(staffs, 30)

  const { handleCreate, handleDelete } = useHandlers({
    data: staffs,
    checkedIds,
    onCreate: () => setModalOpen(true),
    onDeleteSuccess: (ids) => setStaffs(prev => prev.filter(row => !ids.includes(row.id)))
  })

  const { handleDelete: handleDeleteOrgImage } = useHandlers({
    data: uploadedOrgChart ? [{ id: 1 }] : [],
    checkedIds: uploadedOrgChart ? [1] : [],
    onDeleteSuccess: () => setUploadedOrgChart("")
  })

  const { treeData, supervisors } = useMemo(() => buildOrgTreeFromStaffs(staffs), [staffs])

  const handleOrgChartFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setUploadedOrgChart(URL.createObjectURL(file))
    }
  }

  const handleSaveStaff = (staff: Partial<DataRow>) => {
    setStaffs(prev => [{ id: Date.now(), ...staff }, ...prev])
    setModalOpen(false)
  }

  const handleDownload = (row: DataRow) => {
    if (row.appointmentCertificate) {
      alert(`파일 다운로드: ${row.appointmentCertificate}`)
    } else {
      alert("등록된 파일이 없습니다.")
    }
  }

  const handleSaveAsImage = async () => {
    if (!orgChartRef.current) return
    try {
      const canvas = await html2canvas(orgChartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2
      })
      const link = document.createElement("a")
      link.download = `안전조직도_${new Date().toISOString().split("T")[0]}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      alert("이미지 저장에 실패했습니다.")
    }
  }

  return (
    <section className="mypage-content w-full">
      <PageTitle>전체인력관리</PageTitle>
      <TabMenu tabs={TAB_LABELS} activeIndex={0} onTabClick={() => {}} className="mb-6" />

      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-600 text-sm">총 {staffs.length}건</span>
        <div className="flex gap-1">
          <Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16} />인력추가</Button>
          <Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <DataTable columns={columns} data={currentData} onCheckedChange={setCheckedIds} onDownloadClick={handleDownload} />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <PageTitle>안전조직도</PageTitle>
      <TabMenu tabs={ORG_CHART_TABS} activeIndex={orgChartTab} onTabClick={setOrgChartTab} className="mb-3" />

      {orgChartTab === 0 ? (
        <div>
          <div className="flex justify-end gap-1 mb-3">
            <Button variant="action" onClick={handleSaveAsImage} className="flex items-center gap-1"><Image size={16} />이미지로 저장</Button>
          </div>
          <div ref={orgChartRef} className="w-full bg-white rounded-[8px] p-6 flex justify-center">
            <div className="w-full max-w-[1200px] text-center">
              {treeData ? (
                <OrganizationTree data={treeData} supervisors={supervisors} />
              ) : (
                <div className="flex flex-col items-center text-center text-gray-600 py-16">
                  <div className="mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShieldAlert size={24} className="sm:w-8 sm:h-8 w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold mb-1">경영책임자가 등록되지 않았습니다.</h3>
                  <p className="text-xs sm:text-sm text-gray-500">인력추가에서 경영책임자를 먼저 등록해주세요.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {uploadedOrgChart && (
            <div className="flex justify-end gap-1 mb-3">
              <Button variant="action" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1">
                <Upload size={16} />이미지 변경
              </Button>
              <Button variant="action" onClick={handleDeleteOrgImage} className="flex items-center gap-1">
                <Trash2 size={16} />삭제
              </Button>
            </div>
          )}
          <div className="w-full bg-white rounded-[8px] p-6 flex justify-center min-h-[200px]">
            {uploadedOrgChart ? (
              <div className="w-full flex justify-center">
                <img src={uploadedOrgChart} alt="조직도이미지" className="max-w-[800px] max-h-[600px] object-contain rounded" />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center text-gray-600 mt-16 mb-16">
                <div className="mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShieldAlert size={24} className="sm:w-8 sm:h-8 w-6 h-6 text-gray-500" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold mb-1">사업장 조직도가 등록되지 않았습니다.</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-5">조직도 이미지를 업로드한 후 조직관리를 시작해보세요</p>
                <Button variant="action" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-1 px-6">
                  <Upload size={16} className="text-gray-500" />
                  조직도 이미지 업로드
                </Button>
              </div>
            )}
          </div>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" ref={fileInputRef} className="hidden" onChange={handleOrgChartFileChange} />
        </div>
      )}
      <StaffRegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveStaff} existingStaffs={staffs} />
    </section>
  )
}
