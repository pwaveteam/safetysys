import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ClipboardCheck, ChevronRight } from "lucide-react"
import { inspectionPlanMockData } from "@/data/mockData"

type PlanRow = { id: number | string; planName: string; site: string; area: string; kind: string; inspector: string; schedule: string; progress: "미점검" | "완료" }

export default function PublicInspectionList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<PlanRow[]>([])

  useEffect(() => {
    const ids = searchParams.get("ids")
    if (ids) {
      const idList = ids.split(",").map(id => parseInt(id))
      setData((inspectionPlanMockData as PlanRow[]).filter(item => idList.includes(Number(item.id))))
    } else {
      setData(inspectionPlanMockData as PlanRow[])
    }
  }, [searchParams])

  const pending = data.filter(d => d.progress === "미점검")
  const completed = data.filter(d => d.progress === "완료")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[var(--primary)] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={24} />
          <h1 className="text-base font-semibold">점검 목록</h1>
          <span className="ml-auto text-xs opacity-80">{pending.length}건 대기</span>
        </div>
      </header>

      <main className="p-4">
        {/* 미점검 */}
        {pending.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 mb-2">미점검</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {pending.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/public/inspection/${item.id}/execute`)}
                  className="w-full p-3 flex items-center gap-3 text-left hover:bg-gray-50 active:bg-gray-100"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.planName}</p>
                    <p className="text-xs text-gray-500">{item.site} · {item.schedule}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 완료 */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-500 mb-2">완료</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              {completed.map(item => (
                <div key={item.id} className="p-3 flex items-center gap-3 opacity-60">
                  <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">{item.planName}</p>
                    <p className="text-xs text-gray-400">{item.site} · {item.schedule}</p>
                  </div>
                  <span className="text-xs text-gray-400">완료</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">점검 항목이 없습니다.</div>
        )}
      </main>
    </div>
  )
}