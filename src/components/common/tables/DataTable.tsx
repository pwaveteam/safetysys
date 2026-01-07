import React from "react";
import Checkbox from "../base/Checkbox";
import { Download, Image, Eye, Upload, FileText } from "lucide-react";
import Badge, { BadgeColor, Tag } from "../base/Badge";
import EditableCell from "@/components/common/inputs/EditableCell";
import EditableTextArea from "@/components/common/inputs/EditableTextArea";
import SitePhotoViewer from "@/components/snippet/SitePhotoViewer";
import ToggleSwitch from "@/components/common/base/ToggleSwitch";
import { useDownload } from "@/hooks/useHandlers";

export type ColumnType =
| "text"
| "download"
| "certificate"
| "manage"
| "photo"
| "image"
| "badge"
| "tag"
| "input"
| "textarea"
| "stateToggleNearMiss"
| "stateToggleSafetyVoice"
| "resultView"
| "toggle"
| "detail"
| "sign"
| "date"
| "percent"
| "upload"
| "checkbox"
| "index"
| "riskRadio"
| "reduction"
| "riskSelect"
| "riskResult"
| "docView";

export type Column<T = DataRow> = {
key: string;
label: string;
type?: ColumnType;
minWidth?: number | string;
maxWidth?: number | string;
align?: "left" | "center" | "right";
renderCell?: (row: T, index: number) => React.ReactNode;
stateOptions?: {
left: { text: string; color: BadgeColor };
right: { text: string; color: BadgeColor };
};
disabledWhenKey?: string;
disabledWhenValue?: string;
buttonLabel?: string;
placeholder?: string;
};

export type DataRow = { id: number | string; [key: string]: any };

export interface DataTableProps<T = DataRow> {
columns: Column<T>[];
data: T[];
selectable?: boolean;
onCheckedChange?: (checkedIds: (number | string)[]) => void;
onManageClick?: (row: T) => void;
onDownloadClick?: (row: T) => void;
onCertificateClick?: (row: T) => void;
onPhotoClick?: (row: T) => void;
onInputChange?: (id: number | string, key: string, value: string) => void;
onStateToggleChange?: (id: number | string, newValue: string) => void;
onToggleChange?: (id: number | string, key: string, value: boolean) => void;
onDetailClick?: (row: T) => void;
onSignClick?: (row: T) => void;
onUploadChange?: (id: number | string, key: string, file: File) => void;
onRiskChange?: (id: number | string, key: string, value: number) => void;
onReductionClick?: (row: T) => void;
onDocViewClick?: (row: T) => void;
}

const commonHeaderClass = "font-semibold text-[var(--tertiary)] whitespace-nowrap overflow-hidden text-ellipsis";
const commonBodyClass = "font-normal text-[#666] whitespace-nowrap overflow-hidden text-ellipsis";
const inputBaseClass = "border border-[var(--border)] rounded-lg px-2 py-1 text-sm outline-none focus:border-[var(--primary)] transition-colors";

function DataTable<T extends DataRow = DataRow>({
columns,
data,
onCheckedChange,
onManageClick,
onDownloadClick,
onCertificateClick,
onPhotoClick,
onInputChange,
onStateToggleChange,
onToggleChange,
onDetailClick,
onSignClick,
onUploadChange,
onRiskChange,
onReductionClick,
onDocViewClick
}: DataTableProps<T>) {
const [checked, setChecked] = React.useState<(number | string)[]>([]);
const [viewerOpen, setViewerOpen] = React.useState(false);
const [viewerImages, setViewerImages] = React.useState<string[]>([]);
const [viewerIndex, setViewerIndex] = React.useState(0);
const { downloadFile, hasFileData } = useDownload();

React.useEffect(() => {
setChecked((prevChecked) => {
const currentIds = new Set(data.map((d) => d.id));
const validChecked = prevChecked.filter((id) => currentIds.has(id));

if (prevChecked.length !== validChecked.length) {
return validChecked;
}
return prevChecked;
});
}, [data]);

const checkAll = () => {
if (data.length === 0) return;
const allSelected = data.every(r => checked.includes(r.id));
const newChecked = allSelected ? [] : data.map((r) => r.id);
setChecked(newChecked);
};

const checkOne = (id: number | string) => {
setChecked((prev) =>
prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
);
};

React.useEffect(() => {
onCheckedChange?.(checked);
}, [checked, onCheckedChange]);

const safeBadgeColor = (c: any): BadgeColor => {
const ok: BadgeColor[] = [
"gray",
"red",
"yellow",
"blue",
"sky",
"green",
"orange",
"bgRed",
];
return ok.includes(c) ? c : "gray";
};

const openPhotoViewer = (row: T) => {
const imgs = row.sitePhotos || row.photos || row.images || [];
if (!Array.isArray(imgs) || imgs.length === 0) return;
setViewerImages(imgs);
setViewerIndex(0);
setViewerOpen(true);
onPhotoClick?.(row);
};

const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

const resolveAlign = (col: Column<T>) => {
if (col.align) return col.align;
const centerTypes: ColumnType[] = [
"index",
"date",
"upload",
"download",
"certificate",
"manage",
"photo",
"image",
"badge",
"tag",
"input",
"textarea",
"stateToggleNearMiss",
"stateToggleSafetyVoice",
"resultView",
"toggle",
"detail",
"sign",
"checkbox",
"riskRadio",
"reduction",
"riskSelect",
"riskResult",
"docView"
];

if (centerTypes.includes(col.type || "text")) return "center";
if (col.type === "percent") return "right";
if (col.key === "id") return "center";
return "left";
};

const getJustifyClass = (align: "left" | "center" | "right") => {
if (align === "center") return "justify-center";
if (align === "right") return "justify-end";
return "justify-start";
};

const getColumnWidth = (col: Column<T>) => {
const widths: Record<string, { width: number; min: number; max: number }> = {
index: { width: 50, min: 50, max: 50 },
manage: { width: 130, min: 130, max: 130 },
detail: { width: 100, min: 100, max: 100 },
riskSelect: { width: 80, min: 80, max: 80 },
riskResult: { width: 80, min: 80, max: 80 },
riskRadio: { width: 180, min: 180, max: 180 },
};

if (col.type && widths[col.type]) {
const w = widths[col.type];
return { width: w.width, minWidth: w.min, maxWidth: w.max };
}
return { minWidth: col.minWidth || 60, maxWidth: col.maxWidth || 300 };
};

const renderCell = (col: Column<T>, row: T, index: number) => {
if (col.renderCell) {
return col.renderCell(row, index);
}

const value = row[col.key];

switch (col.type) {
case "index":
return (
<div className="flex justify-center items-center w-full h-full">
{data.length - index}
</div>
);

case "image":
return (
<div className="flex justify-center items-center w-full h-full">
<img
src={value?.src}
alt={value?.alt || "image"}
className="w-[39px] h-[39px] object-contain block"
/>
</div>
);

case "download": {
const hasDownloadData = hasFileData(row);
const handleDownload = () => {
if (!hasDownloadData) return;
if (onDownloadClick) {
onDownloadClick(row);
} else {
downloadFile(row);
}
};
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={handleDownload}
className={`flex justify-center items-center p-1 rounded-md transition-colors ${
hasDownloadData
? "hover:text-[var(--primary)] cursor-pointer"
: "text-gray-300 cursor-default"
}`}
aria-label="다운로드"
disabled={!hasDownloadData}
>
<Download size={19} />
</button>
</div>
);
}

case "certificate": {
const hasCertificate = !!value;
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => hasCertificate && onCertificateClick?.(row)}
className={`flex justify-center items-center p-1 rounded-md transition-colors ${
hasCertificate
? "hover:text-[var(--primary)] cursor-pointer"
: "text-gray-300 cursor-default"
}`}
aria-label="이수증 보기"
disabled={!hasCertificate}
title={hasCertificate ? String(value) : undefined}
>
<FileText size={19} />
</button>
</div>
);
}

case "upload":
return (
<div className="flex items-center justify-center gap-2 w-full h-full">
<button
type="button"
onClick={() => {
const input = document.createElement("input");
input.type = "file";
input.style.display = "none";
input.onchange = (e) => {
const file = (e.target as HTMLInputElement).files?.[0];
if (file) onUploadChange?.(row.id, col.key, file);
document.body.removeChild(input);
};
document.body.appendChild(input);
input.click();
}}
className="flex justify-center items-center hover:text-[var(--primary)] transition-colors p-1 rounded-md shrink-0"
aria-label="업로드"
>
<Upload size={18} />
</button>
{value?.name && (
<span className="text-[11px] text-gray-500 max-w-[90px] truncate leading-none self-center" title={value.name}>
{value.name}
</span>
)}
</div>
);

case "photo": {
const photos = row.sitePhotos || row.photos || row.images || [];
const hasPhotoData = Array.isArray(photos) && photos.length > 0;
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => hasPhotoData && openPhotoViewer(row)}
className={`flex justify-center items-center p-1 rounded-md transition-colors ${
hasPhotoData
? "hover:text-[var(--primary)] cursor-pointer"
: "text-gray-300 cursor-default"
}`}
aria-label="사진 보기"
disabled={!hasPhotoData}
>
<Image size={19} />
</button>
</div>
);
}

case "docView":
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => onDocViewClick?.(row)}
className="px-3 py-1 text-[13px] rounded-lg border border-[var(--secondary)] text-[var(--secondary)] bg-white hover:bg-[var(--secondary)] hover:text-white transition-colors flex items-center justify-center h-[30px]"
>
보기
</button>
</div>
);

case "manage":
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => onManageClick?.(row)}
className="px-3 py-1 text-[13px] rounded-lg bg-[var(--secondary)] text-white hover:opacity-90 whitespace-nowrap transition-opacity flex items-center justify-center h-[30px]"
>
자세히보기/편집
</button>
</div>
);

case "resultView":
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => onManageClick?.(row)}
className="inline-flex items-center justify-center gap-1 text-[var(--tertiary)] hover:underline"
>
<Eye size={14} />
<span className="leading-none">결과보기</span>
</button>
</div>
);

case "detail":
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => onDetailClick?.(row)}
className="px-3 py-1 text-[13px] rounded-lg bg-[var(--secondary)] text-white hover:opacity-90 whitespace-nowrap transition-opacity flex items-center justify-center h-[30px]"
>
{col.buttonLabel || "상세보기"}
</button>
</div>
);

case "riskSelect":
return (
<div className="flex justify-center items-center w-full h-full">
<select
value={value || 1}
onChange={(e) => onRiskChange?.(row.id, col.key, Number(e.target.value))}
className="text-xs sm:text-sm font-semibold text-center bg-transparent border border-[var(--border)] rounded-lg px-3 py-1 outline-none focus:border-[var(--primary)] cursor-pointer appearance-none w-16"
>
{[1, 2, 3].map(v => (
<option key={v} value={v}>{v}</option>
))}
</select>
</div>
);

case "riskResult":
const freq = row.frequency || 1;
const inten = row.intensity || 1;
const riskVal = freq * inten;
const riskColor = riskVal >= 7 ? "#FF3939" : riskVal >= 4 ? "#FFE13E" : "#1EED1E";
return (
<div className="flex justify-center items-center w-full h-full">
<span 
className="px-4 py-1 rounded-lg text-xs sm:text-sm font-bold"
style={{ backgroundColor: riskColor }}
>
{riskVal}
</span>
</div>
);

case "sign":
const signed = value === "done";
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={() => !signed && onSignClick?.(row)}
className={`px-3 py-1 text-[13px] rounded-lg border transition-colors flex items-center justify-center h-[30px] ${
signed
? "border-gray-300 text-gray-400 bg-gray-50 cursor-default"
: "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
}`}
disabled={signed}
>
{signed ? "서명완료" : "서명하기"}
</button>
</div>
);

case "badge":
return (
<div className="flex justify-center items-center w-full h-full">
<Badge color={safeBadgeColor(value?.color)}>{value?.text || value || ""}</Badge>
</div>
);

case "tag":
return (
<div className="flex justify-center items-center w-full h-full">
<Tag>{value?.text || value || ""}</Tag>
</div>
);

case "stateToggleNearMiss": {
const optNM = col.stateOptions;
if (!optNM) return null;
const isLeftNM = value === optNM.left.text;
const isRightNM = value === optNM.right.text;

const handleClickNM = (newValue: string) => {
if (value === newValue) return;
if (newValue === optNM.left.text) {
if (
!window.confirm(
"'채택'으로 변경 시 미처리 사유는 삭제되고 '채택 완료'로 처리됩니다.\n변경하시겠습니까?"
)
)
return;
}
onStateToggleChange?.(row.id, newValue);
};

return (
<div className="flex justify-center items-center w-full h-full">
<div className="inline-flex select-none gap-1 items-center" role="group">
<button
type="button"
onClick={() => handleClickNM(optNM.left.text)}
className={`px-1 py-1 rounded font-semibold cursor-pointer transition-opacity flex items-center justify-center ${
isLeftNM ? "" : "opacity-30 hover:opacity-70"
}`}
>
<Badge color={optNM.left.color}>{optNM.left.text}</Badge>
</button>
<button
type="button"
onClick={() => handleClickNM(optNM.right.text)}
className={`px-1 py-1 rounded font-semibold cursor-pointer transition-opacity flex items-center justify-center ${
isRightNM ? "" : "opacity-30 hover:opacity-70"
}`}
>
<Badge color={optNM.right.color}>{optNM.right.text}</Badge>
</button>
</div>
</div>
);
}

case "stateToggleSafetyVoice": {
const optSV = col.stateOptions;
if (!optSV) return null;
const isLeftSV = value === optSV.left.text;
const isRightSV = value === optSV.right.text;

const handleClickSV = (newValue: string) => {
if (value === newValue) return;
if (newValue === optSV.left.text) {
if (
!window.confirm(
"'조치'로 변경 시 미처리 사유는 삭제되고 '조치 완료'로 처리됩니다.\n변경하시겠습니까?"
)
)
return;
}
onStateToggleChange?.(row.id, newValue);
};

return (
<div className="flex justify-center items-center w-full h-full">
<div className="inline-flex select-none gap-1 items-center" role="group">
<button
type="button"
onClick={() => handleClickSV(optSV.left.text)}
className={`px-1 py-1 rounded font-semibold cursor-pointer transition-opacity flex items-center justify-center ${
isLeftSV ? "" : "opacity-30 hover:opacity-70"
}`}
>
<Badge color={optSV.left.color}>{optSV.left.text}</Badge>
</button>
<button
type="button"
onClick={() => handleClickSV(optSV.right.text)}
className={`px-1 py-1 rounded font-semibold cursor-pointer transition-opacity flex items-center justify-center ${
isRightSV ? "" : "opacity-30 hover:opacity-70"
}`}
>
<Badge color={optSV.right.color}>{optSV.right.text}</Badge>
</button>
</div>
</div>
);
}

case "input":
return (
<div className="flex items-center w-full h-full">
<EditableCell
value={value ?? ""}
onChange={(v) => onInputChange?.(row.id, col.key, v)}
disabled={false}
placeholder={col.placeholder}
/>
</div>
);

case "textarea": {
const isTextareaDisabled = col.disabledWhenKey && col.disabledWhenValue
  ? row[col.disabledWhenKey] === col.disabledWhenValue
  : false;
return (
<div className="flex items-center w-full h-full">
<EditableTextArea
value={value ?? ""}
onChange={(v) => onInputChange?.(row.id, col.key, v)}
disabled={isTextareaDisabled}
/>
</div>
);
}

case "toggle":
return (
<div className="flex justify-center items-center w-full h-full">
<ToggleSwitch
checked={!!value}
onChange={(v) => onToggleChange?.(row.id, col.key, v)}
/>
</div>
);

case "checkbox":
return (
<div className="flex justify-center items-center w-full h-full">
<Checkbox
checked={!!value}
onChange={() => onToggleChange?.(row.id, col.key, !value)}
/>
</div>
);

case "date":
return (
<div className="flex justify-center items-center w-full h-full">
<input
type="date"
value={value || ""}
onChange={(e) => onInputChange?.(row.id, col.key, e.target.value)}
className={`${inputBaseClass} w-32 cursor-pointer h-[30px]`}
/>
</div>
);

case "riskRadio":
return (
<div className="flex justify-center gap-3 w-full h-full items-center">
{[3, 2, 1].map((level) => {
const color = level === 3 ? "#FF3939" : level === 2 ? "#FFE13E" : "#1EED1E";
const text = level === 3 ? "상" : level === 2 ? "중" : "하";
const isSelected = value === level;

return (
<div
key={level}
className="flex items-center gap-1 cursor-pointer select-none"
onClick={() => onRiskChange?.(row.id, col.key, level)}
>
<div
className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all"
style={{ border: `1px solid ${color}` }}
>
{isSelected && (
<div
className="w-2 h-2 rounded-full"
style={{ backgroundColor: color }}
/>
)}
</div>
<span className="text-xs md:text-[13px] font-medium text-[#333639]">
{text}({level})
</span>
</div>
);
})}
</div>
);

case "reduction":
const hasAction = !!value;
return (
<div className="flex justify-center items-center w-full h-full">
<button
type="button"
onClick={(e) => {
e.stopPropagation();
onReductionClick?.(row);
}}
className={`h-[30px] px-3 rounded-lg text-[12px] font-medium border transition-colors ${
hasAction
? "bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB] hover:bg-gray-200"
: "bg-[#D0E3F8] text-[#1A4FA3] border-[#B7CCE3] hover:bg-[#C0D8F0]"
}`}
>
{hasAction ? "감소대책 보기" : "감소대책 수립"}
</button>
</div>
);

case "percent":
const rawPercent = value?.toString().replace("%", "") || "";
return (
<div className="flex justify-end items-center w-full h-full gap-1">
<input
type="number"
value={rawPercent}
onChange={(e) =>
onInputChange?.(row.id, col.key, e.target.value + "%")
}
className={`${inputBaseClass} w-16 text-right h-[30px]`}
/>
<span className="leading-none">%</span>
</div>
);

default:
return (
<div className={`flex items-center h-full w-full ${getJustifyClass(resolveAlign(col))}`}>
<span className="block truncate" title={value}>{value}</span>
</div>
);
}
};

return (
<>
<div
className="overflow-x-auto rounded-lg border border-[var(--border)]"
>
<table className="w-full border-collapse min-w-[450px]">
<thead>
<tr
className="h-[33px] md:h-[45px] bg-white border-b-[2.3px] border-b-[var(--tertiary)]"
>
<th
className={`align-middle w-[60px] pl-[19px] pr-[13px] py-[11px] ${commonHeaderClass}`}
>
<div className="flex items-center justify-center w-full h-full">
<Checkbox
checked={data.length > 0 && data.every(r => checked.includes(r.id))}
onChange={checkAll}
/>
</div>
</th>
{columns.map((col, i) => {
const isLast = i === columns.length - 1;
const align = resolveAlign(col);
const justifyClass = getJustifyClass(align);

return (
<th
key={col.key}
className={`text-xs md:text-base align-middle py-[11px] ${
isLast ? "pl-[13px] pr-[19px]" : "px-[13px]"
} ${commonHeaderClass}`}
style={{
...getColumnWidth(col),
textAlign: align 
}}
>
<div className={`flex items-center h-full w-full ${justifyClass}`}>
{col.label}
</div>
</th>
);
})}
</tr>
</thead>

<tbody>
{data.map((row, rowIdx) => (
<tr
key={row.id}
className={`${
rowIdx % 2 === 0 ? "bg-white" : "bg-[var(--neutral-bg)]"
}`}
>
<td
className={`align-middle w-[60px] pl-[19px] pr-[13px] py-[11px] ${commonBodyClass}`}
>
<div className="flex items-center justify-center w-full h-full">
<Checkbox
checked={checked.includes(row.id)}
onChange={() => checkOne(row.id)}
/>
</div>
</td>
{columns.map((col, i) => {
const isLast = i === columns.length - 1;
const align = resolveAlign(col);

return (
<td
key={col.key}
className={`text-xs md:text-base align-middle py-[11px] ${
isLast ? "pl-[13px] pr-[19px]" : "px-[13px]"
} ${commonBodyClass}`}
style={{
...getColumnWidth(col),
textAlign: align
}}
>
{renderCell(col, row, rowIdx)}
</td>
);
})}
</tr>
))}
</tbody>
</table>
</div>

<SitePhotoViewer
open={viewerOpen}
images={viewerImages}
index={viewerIndex}
onClose={() => setViewerOpen(false)}
onPrev={() =>
setViewerIndex((prev) => (prev > 0 ? prev - 1 : prev))
}
onNext={() =>
setViewerIndex((prev) =>
prev < viewerImages.length - 1 ? prev + 1 : prev
)
}
/>
</>
);
}

export default DataTable;