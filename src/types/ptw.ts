// types/ptw.ts

export interface BadgeStatus {
    text: string
    color: "gray" | "red" | "green" | "blue"
  }
  
  export interface PTWFile {
    id: string
    name: string
    size: string
    uploadedAt: string
    url?: string
    type?: string
  }
  
  export interface PTWGroupItem {
    id: number
    ptwName: string
    createdAt: string
    registrant: string
    updatedAt: string
  }
  
  export interface WorkPermitItem {
    id: number
    workName: string
    workDate: string
    workLocation: string
    workPersonnel: string
    workType: string
    applicant: string
    applicationDate: string
    signatureStatus: BadgeStatus
    sitePhotos: string[]
    fileAttach: boolean
  }
  
  export interface JSAItem {
    id: number
    jsaNo: string
    workName: string
    workDate: string
    team: string
    applicationDate: string
    sitePhotos: string[]
    fileAttach: boolean
  }
  
  export interface SiteEvaluationItem {
    id: number
    workTeam: string
    workerName: string
    workDate: string
    author: string
    signatureStatus: BadgeStatus
    sitePhotos: string[]
    fileAttach: boolean
  }
  
  export interface TBMItem {
    id: number
    processName: string
    meetingDate: string
    meetingTime: string
    manager: string
    participants: string
    sitePhotos: string[]
    fileAttach: boolean
  }
  
  export type PTWDocumentType = "ptw-group" | "work-permit" | "jsa" | "site-evaluation" | "tbm"
  export type PTWListItem = PTWGroupItem | WorkPermitItem | JSAItem | SiteEvaluationItem | TBMItem